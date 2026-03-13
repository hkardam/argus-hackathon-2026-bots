package com.bots.hackathon.eligibility.service;

import com.bots.hackathon.ai.EligibilityAiService;
import com.bots.hackathon.ai.ScreeningReportGenerator;
import com.bots.hackathon.ai.dto.EligibilityAiRequest;
import com.bots.hackathon.ai.dto.EligibilityAiResponse;
import com.bots.hackathon.ai.dto.ScreeningAiRequest;
import com.bots.hackathon.ai.dto.ScreeningAiResponse;
import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.model.ApplicationSectionData;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.application.repo.ApplicationSectionDataRepository;
import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.common.enums.ApplicationStatus;
import com.bots.hackathon.common.enums.RiskLevel;
import com.bots.hackathon.common.exception.BusinessException;
import com.bots.hackathon.common.exception.InvalidStateTransitionException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.eligibility.dto.ClarificationRequest;
import com.bots.hackathon.eligibility.dto.HardRuleResult;
import com.bots.hackathon.eligibility.dto.OverrideIneligibleRequest;
import com.bots.hackathon.eligibility.dto.ScreeningReportResponse;
import com.bots.hackathon.eligibility.dto.SoftFlag;
import com.bots.hackathon.eligibility.model.EligibilityCheckResult;
import com.bots.hackathon.eligibility.model.ScreeningReport;
import com.bots.hackathon.eligibility.repo.EligibilityCheckResultRepository;
import com.bots.hackathon.eligibility.repo.ScreeningReportRepository;
import com.bots.hackathon.grant.model.GrantProgramme;
import com.bots.hackathon.grant.repo.GrantProgrammeRepository;
import com.bots.hackathon.messaging.dto.CreateThreadRequest;
import com.bots.hackathon.messaging.dto.SendMessageRequest;
import com.bots.hackathon.messaging.dto.ThreadResponse;
import com.bots.hackathon.messaging.service.MessagingService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EligibilityService {

    private static final BigDecimal CDG_MIN = new BigDecimal("200000");
    private static final BigDecimal CDG_MAX = new BigDecimal("2000000");
    private static final BigDecimal EIG_MIN = new BigDecimal("500000");
    private static final BigDecimal EIG_MAX = new BigDecimal("5000000");
    private static final BigDecimal ECAG_MIN = new BigDecimal("300000");
    private static final BigDecimal ECAG_MAX = new BigDecimal("3000000");
    private static final BigDecimal OVERHEAD_CAP = new BigDecimal("0.15");
    private static final BigDecimal BUDGET_TOLERANCE = new BigDecimal("500");

    private final ApplicationRepository applicationRepository;
    private final ApplicationSectionDataRepository sectionDataRepository;
    private final GrantProgrammeRepository grantProgrammeRepository;
    private final EligibilityCheckResultRepository eligibilityCheckResultRepository;
    private final ScreeningReportRepository screeningReportRepository;
    private final EligibilityAiService eligibilityAiService;
    private final ScreeningReportGenerator screeningReportGenerator;
    private final MessagingService messagingService;
    private final ObjectMapper objectMapper;

    @Transactional
    @LoggableAction(
            actionType = "RUN_SCREENING",
            objectType = "APPLICATION",
            objectIdExpression = "#applicationId.toString()")
    public ScreeningReportResponse runScreening(UUID applicationId, Long officerId) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Application", applicationId));

        if (app.getStatus() != ApplicationStatus.SUBMITTED
                && app.getStatus() != ApplicationStatus.UNDER_SCREENING) {
            throw new InvalidStateTransitionException(
                    app.getStatus().name(),
                    "Screening can only be run on SUBMITTED or UNDER_SCREENING applications");
        }

        app.setStatus(ApplicationStatus.UNDER_SCREENING);
        applicationRepository.save(app);

        List<ApplicationSectionData> sections =
                sectionDataRepository.findByApplicationId(applicationId);
        Map<String, String> sectionMap =
                sections.stream()
                        .collect(
                                Collectors.toMap(
                                        ApplicationSectionData::getSectionKey,
                                        s ->
                                                s.getSectionData() != null
                                                        ? s.getSectionData()
                                                        : "{}"));

        GrantProgramme programme =
                grantProgrammeRepository
                        .findById(app.getProgrammeId())
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "GrantProgramme", app.getProgrammeId()));

        List<HardRuleResult> hardRuleResults = runHardRules(app, programme, sectionMap);
        boolean hardRulesPassed = hardRuleResults.stream().allMatch(HardRuleResult::passed);

        Map<String, String> appData = new HashMap<>(sectionMap);
        appData.put("_title", nvl(app.getTitle()));
        appData.put("_summary", nvl(app.getSummary()));
        appData.put("_requestedAmount", app.getRequestedAmount().toPlainString());
        appData.put("_programme", programme.getName());

        EligibilityAiResponse aiResponse =
                callEligibilityAi(applicationId, app, programme, appData);
        ScreeningAiResponse screeningAiResponse =
                callScreeningAi(applicationId, sectionMap, appData);

        List<SoftFlag> softFlags = buildSoftFlags(aiResponse, screeningAiResponse);

        RiskLevel overallRisk = deriveRiskLevel(hardRulesPassed, softFlags, screeningAiResponse);
        String summary =
                buildSummary(hardRuleResults, softFlags, aiResponse.summary(), programme.getName());

        saveEligibilityCheckResult(
                applicationId, hardRulesPassed, hardRuleResults, aiResponse.summary(), officerId);
        ScreeningReport report =
                saveScreeningReport(applicationId, overallRisk, summary, softFlags);

        return toResponse(report, app, programme.getName(), hardRuleResults, softFlags);
    }

    @Transactional(readOnly = true)
    public ScreeningReportResponse getReport(UUID applicationId) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Application", applicationId));

        ScreeningReport report =
                screeningReportRepository
                        .findByApplicationId(applicationId)
                        .orElseThrow(
                                () ->
                                        new BusinessException(
                                                "No screening report found for application "
                                                        + applicationId));

        EligibilityCheckResult checkResult =
                eligibilityCheckResultRepository.findByApplicationId(applicationId).orElse(null);

        List<HardRuleResult> hardRuleResults = parseHardRuleResults(checkResult);
        List<SoftFlag> softFlags = parseSoftFlags(report.getFlagsJson());

        GrantProgramme programme =
                grantProgrammeRepository.findById(app.getProgrammeId()).orElse(null);

        String programmeName = programme != null ? programme.getName() : "Unknown Programme";
        return toResponse(report, app, programmeName, hardRuleResults, softFlags);
    }

    @Transactional
    @LoggableAction(
            actionType = "CONFIRM_ELIGIBLE",
            objectType = "APPLICATION",
            objectIdExpression = "#applicationId.toString()")
    public ScreeningReportResponse confirmEligible(UUID applicationId, Long officerId) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Application", applicationId));

        if (app.getStatus() != ApplicationStatus.UNDER_SCREENING) {
            throw new InvalidStateTransitionException(
                    app.getStatus().name(), "ELIGIBLE requires UNDER_SCREENING state");
        }

        app.setStatus(ApplicationStatus.ELIGIBLE);
        applicationRepository.save(app);

        ScreeningReport report =
                screeningReportRepository
                        .findByApplicationId(applicationId)
                        .orElseThrow(
                                () ->
                                        new BusinessException(
                                                "No screening report found for " + applicationId));

        report.setIsReviewed(true);
        report.setReviewedByUserId(officerId);
        screeningReportRepository.save(report);

        return getReport(applicationId);
    }

    @Transactional
    @LoggableAction(
            actionType = "OVERRIDE_INELIGIBLE",
            objectType = "APPLICATION",
            objectIdExpression = "#applicationId.toString()")
    public ScreeningReportResponse overrideIneligible(
            UUID applicationId, OverrideIneligibleRequest request, Long officerId) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Application", applicationId));

        if (app.getStatus() != ApplicationStatus.UNDER_SCREENING) {
            throw new InvalidStateTransitionException(
                    app.getStatus().name(), "INELIGIBLE override requires UNDER_SCREENING state");
        }

        app.setStatus(ApplicationStatus.INELIGIBLE);
        applicationRepository.save(app);

        EligibilityCheckResult checkResult =
                eligibilityCheckResultRepository
                        .findByApplicationId(applicationId)
                        .orElse(
                                EligibilityCheckResult.builder()
                                        .applicationId(applicationId)
                                        .build());

        checkResult.setIsEligible(false);
        checkResult.setNotes("Override reason: " + request.reason());
        checkResult.setCheckedByUserId(officerId);
        eligibilityCheckResultRepository.save(checkResult);

        ScreeningReport report =
                screeningReportRepository
                        .findByApplicationId(applicationId)
                        .orElseThrow(
                                () ->
                                        new BusinessException(
                                                "No screening report found for " + applicationId));

        report.setIsReviewed(true);
        report.setReviewedByUserId(officerId);
        screeningReportRepository.save(report);

        return getReport(applicationId);
    }

    @Transactional
    @LoggableAction(
            actionType = "SEND_CLARIFICATION",
            objectType = "APPLICATION",
            objectIdExpression = "#applicationId.toString()")
    public void sendClarification(
            UUID applicationId, ClarificationRequest request, Long officerId) {
        applicationRepository
                .findByIdAndDeletedFalse(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

        String subject =
                "Clarification Request"
                        + (request.flagReference() != null ? " — " + request.flagReference() : "");

        ThreadResponse thread =
                messagingService.createThread(
                        new CreateThreadRequest(subject, applicationId), officerId);

        messagingService.sendMessage(
                new SendMessageRequest(thread.id(), request.question()), officerId);
    }

    @Transactional(readOnly = true)
    public List<ScreeningReportResponse> listScreeningQueue() {
        List<Application> apps =
                applicationRepository.findByStatusAndDeletedFalse(ApplicationStatus.SUBMITTED);
        List<Application> underScreening =
                applicationRepository.findByStatusAndDeletedFalse(
                        ApplicationStatus.UNDER_SCREENING);

        List<Application> queue = new ArrayList<>(apps);
        queue.addAll(underScreening);

        return queue.stream().map(app -> buildQueueItem(app)).collect(Collectors.toList());
    }

    // ─── Hard Rule Engine ─────────────────────────────────────────────────────

    private List<HardRuleResult> runHardRules(
            Application app, GrantProgramme programme, Map<String, String> sectionMap) {

        String programmeName = programme.getName().toLowerCase();
        Map<String, Object> orgData = parseSection(sectionMap, "organisation");
        Map<String, Object> projectData = parseSection(sectionMap, "project");
        Map<String, Object> budgetData = parseSection(sectionMap, "budget");

        if (programmeName.contains("cdg") || programmeName.contains("community development")) {
            return runCdgRules(app, orgData, projectData, budgetData);
        } else if (programmeName.contains("eig")
                || programmeName.contains("education innovation")) {
            Map<String, Object> innovationData = parseSection(sectionMap, "innovation");
            return runEigRules(app, orgData, innovationData, budgetData);
        } else if (programmeName.contains("ecag")
                || programmeName.contains("environment")
                || programmeName.contains("climate")) {
            Map<String, Object> envData = parseSection(sectionMap, "environment");
            return runEcagRules(app, orgData, envData, budgetData);
        }

        return runGenericRules(app, budgetData);
    }

    private List<HardRuleResult> runCdgRules(
            Application app,
            Map<String, Object> orgData,
            Map<String, Object> projectData,
            Map<String, Object> budgetData) {
        List<HardRuleResult> results = new ArrayList<>();

        results.add(
                checkOrgType(
                        "E1",
                        "Organisation Type",
                        orgData,
                        List.of("NGO", "TRUST", "SECTION_8", "Trust", "Section 8")));
        results.add(checkMinAge("E2", "Minimum Organisation Age (2 years)", orgData, 2));
        results.add(
                checkFundingRange(
                        "E4",
                        "Funding Range (INR 2L–20L)",
                        app.getRequestedAmount(),
                        CDG_MIN,
                        CDG_MAX));
        results.add(
                checkProjectDuration("E5", "Project Duration (6–18 months)", projectData, 6, 18));
        results.add(checkOverheadCap("E6", "Overhead Cap (≤15%)", budgetData));
        results.add(
                checkBudgetTotal("E7", "Budget Total Match", app.getRequestedAmount(), budgetData));

        return results;
    }

    private List<HardRuleResult> runEigRules(
            Application app,
            Map<String, Object> orgData,
            Map<String, Object> innovationData,
            Map<String, Object> budgetData) {
        List<HardRuleResult> results = new ArrayList<>();

        results.add(
                checkOrgType(
                        "E1",
                        "Organisation Type",
                        orgData,
                        List.of(
                                "NGO",
                                "EDTECH",
                                "EdTech",
                                "RESEARCH_INSTITUTION",
                                "UNIVERSITY",
                                "University",
                                "Research")));
        results.add(checkMinAge("E2", "Minimum Organisation Age (1 year)", orgData, 1));
        results.add(
                checkFundingRange(
                        "E3",
                        "Funding Range (INR 5L–50L)",
                        app.getRequestedAmount(),
                        EIG_MIN,
                        EIG_MAX));
        results.add(
                checkProjectDuration(
                        "E4", "Project Duration (12–24 months)", innovationData, 12, 24));
        results.add(checkMinSchools("E5", "Minimum Schools Targeted (5)", innovationData));
        results.add(checkOverheadCap("E7", "Overhead Cap (≤15%)", budgetData));
        results.add(
                checkBudgetTotal("E8", "Budget Total Match", app.getRequestedAmount(), budgetData));

        return results;
    }

    private List<HardRuleResult> runEcagRules(
            Application app,
            Map<String, Object> orgData,
            Map<String, Object> envData,
            Map<String, Object> budgetData) {
        List<HardRuleResult> results = new ArrayList<>();

        results.add(
                checkOrgType(
                        "E1",
                        "Organisation Type",
                        orgData,
                        List.of(
                                "NGO",
                                "FPO",
                                "PANCHAYAT",
                                "Panchayat",
                                "RESEARCH_INSTITUTION",
                                "Research")));
        results.add(
                checkFundingRange(
                        "E2",
                        "Funding Range (INR 3L–30L)",
                        app.getRequestedAmount(),
                        ECAG_MIN,
                        ECAG_MAX));
        results.add(checkProjectDuration("E3", "Project Duration (6–24 months)", envData, 6, 24));
        results.add(checkOverheadCap("E4", "Overhead Cap (≤15%)", budgetData));
        results.add(
                checkBudgetTotal("E5", "Budget Total Match", app.getRequestedAmount(), budgetData));

        return results;
    }

    private List<HardRuleResult> runGenericRules(Application app, Map<String, Object> budgetData) {
        List<HardRuleResult> results = new ArrayList<>();
        results.add(checkOverheadCap("E1", "Overhead Cap (≤15%)", budgetData));
        results.add(
                checkBudgetTotal("E2", "Budget Total Match", app.getRequestedAmount(), budgetData));
        return results;
    }

    // ─── Individual Rule Checks ───────────────────────────────────────────────

    private HardRuleResult checkOrgType(
            String code, String name, Map<String, Object> orgData, List<String> allowed) {
        Object raw = orgData.get("typeOfOrganisation");
        if (raw == null) raw = orgData.get("organisationType");
        if (raw == null) raw = orgData.get("registrationType");
        if (raw == null) {
            return new HardRuleResult(
                    code, name, true, "Unable to evaluate — field not provided; assumed compliant");
        }
        String orgType = raw.toString();
        boolean passed =
                allowed.stream().anyMatch(a -> orgType.toLowerCase().contains(a.toLowerCase()));
        return new HardRuleResult(
                code,
                name,
                passed,
                passed
                        ? "Organisation type '" + orgType + "' is eligible"
                        : "Organisation type '"
                                + orgType
                                + "' is not eligible. Allowed: "
                                + String.join(", ", allowed));
    }

    private HardRuleResult checkMinAge(
            String code, String name, Map<String, Object> orgData, int minYears) {
        Object raw = orgData.get("yearOfEstablishment");
        if (raw == null) raw = orgData.get("yearEstablished");
        if (raw == null) {
            return new HardRuleResult(
                    code, name, true, "Unable to evaluate — year of establishment not provided");
        }
        try {
            int year = Integer.parseInt(raw.toString());
            int currentYear = Year.now().getValue();
            int age = currentYear - year;
            boolean passed = age >= minYears;
            return new HardRuleResult(
                    code,
                    name,
                    passed,
                    passed
                            ? "Organisation established in " + year + " (" + age + " years old)"
                            : "Organisation established in "
                                    + year
                                    + " — minimum age is "
                                    + minYears
                                    + " years");
        } catch (NumberFormatException e) {
            return new HardRuleResult(
                    code, name, true, "Unable to parse year of establishment — assumed compliant");
        }
    }

    private HardRuleResult checkFundingRange(
            String code, String name, BigDecimal requested, BigDecimal min, BigDecimal max) {
        if (requested == null) {
            return new HardRuleResult(code, name, false, "Requested amount is missing");
        }
        boolean passed = requested.compareTo(min) >= 0 && requested.compareTo(max) <= 0;
        return new HardRuleResult(
                code,
                name,
                passed,
                passed
                        ? "Requested amount ₹" + requested.toPlainString() + " is within range"
                        : "Requested amount ₹"
                                + requested.toPlainString()
                                + " is outside the allowed range ₹"
                                + min.toPlainString()
                                + " – ₹"
                                + max.toPlainString());
    }

    private HardRuleResult checkProjectDuration(
            String code, String name, Map<String, Object> data, int minMonths, int maxMonths) {
        Object startRaw = data.get("projectStartDate");
        Object endRaw = data.get("projectEndDate");
        if (startRaw == null) startRaw = data.get("startDate");
        if (endRaw == null) endRaw = data.get("endDate");

        if (startRaw == null || endRaw == null) {
            return new HardRuleResult(
                    code, name, true, "Unable to evaluate — dates not provided; assumed compliant");
        }
        try {
            LocalDate start = LocalDate.parse(startRaw.toString());
            LocalDate end = LocalDate.parse(endRaw.toString());
            long months = ChronoUnit.MONTHS.between(start, end);
            boolean passed = months >= minMonths && months <= maxMonths;
            return new HardRuleResult(
                    code,
                    name,
                    passed,
                    passed
                            ? "Project duration " + months + " months is within range"
                            : "Project duration "
                                    + months
                                    + " months is outside allowed range "
                                    + minMonths
                                    + "–"
                                    + maxMonths
                                    + " months");
        } catch (Exception e) {
            return new HardRuleResult(
                    code, name, true, "Unable to parse project dates — assumed compliant");
        }
    }

    private HardRuleResult checkMinSchools(String code, String name, Map<String, Object> data) {
        Object raw = data.get("numberOfSchoolsTargeted");
        if (raw == null) raw = data.get("schoolsTargeted");
        if (raw == null) {
            return new HardRuleResult(
                    code, name, true, "Unable to evaluate — schools count not provided");
        }
        try {
            int schools = Integer.parseInt(raw.toString());
            boolean passed = schools >= 5;
            return new HardRuleResult(
                    code,
                    name,
                    passed,
                    passed
                            ? schools + " schools targeted — meets minimum of 5"
                            : schools + " schools targeted — minimum requirement is 5");
        } catch (NumberFormatException e) {
            return new HardRuleResult(
                    code, name, true, "Unable to parse school count — assumed compliant");
        }
    }

    private HardRuleResult checkOverheadCap(
            String code, String name, Map<String, Object> budgetData) {
        Object totalRaw = budgetData.get("totalAmountRequested");
        if (totalRaw == null) totalRaw = budgetData.get("totalRequested");
        Object overheadRaw = budgetData.get("overheads");
        if (overheadRaw == null) overheadRaw = budgetData.get("overhead");

        if (totalRaw == null || overheadRaw == null) {
            return new HardRuleResult(
                    code, name, true, "Unable to evaluate — budget fields not provided");
        }
        try {
            BigDecimal total = new BigDecimal(totalRaw.toString());
            BigDecimal overhead = new BigDecimal(overheadRaw.toString());
            if (total.compareTo(BigDecimal.ZERO) == 0) {
                return new HardRuleResult(
                        code, name, true, "Total budget is zero — cannot evaluate overhead cap");
            }
            BigDecimal ratio = overhead.divide(total, 4, java.math.RoundingMode.HALF_UP);
            boolean passed = ratio.compareTo(OVERHEAD_CAP) <= 0;
            double pct = ratio.multiply(BigDecimal.valueOf(100)).doubleValue();
            return new HardRuleResult(
                    code,
                    name,
                    passed,
                    passed
                            ? String.format("Overhead is %.1f%% of total — within 15%% cap", pct)
                            : String.format("Overhead is %.1f%% of total — exceeds 15%% cap", pct));
        } catch (Exception e) {
            return new HardRuleResult(
                    code, name, true, "Unable to parse budget values — assumed compliant");
        }
    }

    private HardRuleResult checkBudgetTotal(
            String code, String name, BigDecimal requestedAmount, Map<String, Object> budgetData) {
        Object totalRaw = budgetData.get("totalAmountRequested");
        if (totalRaw == null) totalRaw = budgetData.get("totalRequested");

        if (totalRaw == null) {
            return new HardRuleResult(
                    code, name, true, "Unable to evaluate — budget total not provided");
        }
        try {
            BigDecimal budgetTotal = new BigDecimal(totalRaw.toString());
            BigDecimal diff = requestedAmount.subtract(budgetTotal).abs();
            boolean passed = diff.compareTo(BUDGET_TOLERANCE) <= 0;
            return new HardRuleResult(
                    code,
                    name,
                    passed,
                    passed
                            ? "Budget total ₹"
                                    + budgetTotal.toPlainString()
                                    + " matches requested amount"
                            : "Budget total ₹"
                                    + budgetTotal.toPlainString()
                                    + " differs from requested ₹"
                                    + requestedAmount.toPlainString()
                                    + " by ₹"
                                    + diff.toPlainString()
                                    + " (tolerance ±₹500)");
        } catch (Exception e) {
            return new HardRuleResult(
                    code, name, true, "Unable to parse budget total — assumed compliant");
        }
    }

    // ─── AI Calls ─────────────────────────────────────────────────────────────

    private EligibilityAiResponse callEligibilityAi(
            UUID applicationId,
            Application app,
            GrantProgramme programme,
            Map<String, String> appData) {
        try {
            EligibilityAiRequest req =
                    new EligibilityAiRequest(
                            applicationId,
                            app.getProgrammeId(),
                            appData,
                            app.getRequestedAmount(),
                            buildProgrammeCriteria(programme));
            return eligibilityAiService.checkEligibility(req);
        } catch (Exception e) {
            log.warn("AI eligibility check failed for {}: {}", applicationId, e.getMessage());
            return new EligibilityAiResponse(true, List.of(), "AI check unavailable", 0.0);
        }
    }

    private ScreeningAiResponse callScreeningAi(
            UUID applicationId, Map<String, String> sectionMap, Map<String, String> appData) {
        try {
            String orgName = extractOrgName(sectionMap);
            ScreeningAiRequest req = new ScreeningAiRequest(applicationId, orgName, appData);
            return screeningReportGenerator.generateScreeningReport(req);
        } catch (Exception e) {
            log.warn("AI screening report failed for {}: {}", applicationId, e.getMessage());
            return new ScreeningAiResponse(RiskLevel.LOW, List.of(), "AI screening unavailable");
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private Map<String, Object> parseSection(Map<String, String> sectionMap, String key) {
        String json = sectionMap.getOrDefault(key, "{}");
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            log.debug("Could not parse section '{}': {}", key, e.getMessage());
            return new HashMap<>();
        }
    }

    private Map<String, Object> buildProgrammeCriteria(GrantProgramme programme) {
        Map<String, Object> criteria = new HashMap<>();
        criteria.put("programmeName", programme.getName());
        criteria.put("grantType", programme.getGrantType().name());
        criteria.put("maxAwardAmount", programme.getMaxAwardAmount());
        return criteria;
    }

    private String extractOrgName(Map<String, String> sectionMap) {
        try {
            Map<String, Object> orgData = parseSection(sectionMap, "organisation");
            Object name = orgData.get("legalName");
            if (name == null) name = orgData.get("legalNameOfOrganisation");
            return name != null ? name.toString() : "Unknown Organisation";
        } catch (Exception e) {
            return "Unknown Organisation";
        }
    }

    private List<SoftFlag> buildSoftFlags(
            EligibilityAiResponse aiResponse, ScreeningAiResponse screeningAiResponse) {
        List<SoftFlag> flags = new ArrayList<>();
        for (EligibilityAiResponse.CriterionResult cr : aiResponse.criteriaResults()) {
            if (!cr.met()) {
                flags.add(new SoftFlag(cr.criterion(), cr.explanation(), RiskLevel.MEDIUM, true));
            }
        }
        for (ScreeningAiResponse.Flag flag : screeningAiResponse.flags()) {
            flags.add(new SoftFlag(flag.type(), flag.description(), flag.severity(), true));
        }
        return flags;
    }

    private RiskLevel deriveRiskLevel(
            boolean hardRulesPassed,
            List<SoftFlag> softFlags,
            ScreeningAiResponse screeningAiResponse) {
        if (!hardRulesPassed) return RiskLevel.HIGH;
        if (screeningAiResponse.overallRiskLevel() != null)
            return screeningAiResponse.overallRiskLevel();
        long highFlags = softFlags.stream().filter(f -> f.severity() == RiskLevel.HIGH).count();
        if (highFlags > 0) return RiskLevel.HIGH;
        long mediumFlags = softFlags.stream().filter(f -> f.severity() == RiskLevel.MEDIUM).count();
        if (mediumFlags > 1) return RiskLevel.MEDIUM;
        return RiskLevel.LOW;
    }

    private String buildSummary(
            List<HardRuleResult> hardRuleResults,
            List<SoftFlag> softFlags,
            String aiSummary,
            String programmeName) {
        long passed = hardRuleResults.stream().filter(HardRuleResult::passed).count();
        long total = hardRuleResults.size();
        StringBuilder sb = new StringBuilder();
        sb.append("[AI Suggested] Screening for ").append(programmeName).append(". ");
        sb.append(passed).append("/").append(total).append(" hard rules passed. ");
        if (!softFlags.isEmpty()) {
            sb.append(softFlags.size()).append(" soft flag(s) raised. ");
        }
        if (aiSummary != null && !aiSummary.isBlank() && !aiSummary.contains("unavailable")) {
            sb.append(aiSummary);
        }
        return sb.toString();
    }

    private void saveEligibilityCheckResult(
            UUID applicationId,
            boolean hardRulesPassed,
            List<HardRuleResult> results,
            String notes,
            Long officerId) {
        EligibilityCheckResult checkResult =
                eligibilityCheckResultRepository
                        .findByApplicationId(applicationId)
                        .orElse(
                                EligibilityCheckResult.builder()
                                        .applicationId(applicationId)
                                        .build());

        checkResult.setIsEligible(hardRulesPassed);
        checkResult.setAiSuggested(true);
        checkResult.setCriteriaResults(serializeToJson(results));
        checkResult.setNotes(notes);
        checkResult.setCheckedByUserId(officerId);
        eligibilityCheckResultRepository.save(checkResult);
    }

    private ScreeningReport saveScreeningReport(
            UUID applicationId, RiskLevel riskLevel, String summary, List<SoftFlag> softFlags) {
        ScreeningReport report =
                screeningReportRepository
                        .findByApplicationId(applicationId)
                        .orElse(ScreeningReport.builder().applicationId(applicationId).build());

        report.setRiskLevel(riskLevel);
        report.setAiSuggested(true);
        report.setSummary(summary);
        report.setFlagsJson(serializeToJson(softFlags));
        report.setIsReviewed(false);
        return screeningReportRepository.save(report);
    }

    private ScreeningReportResponse buildQueueItem(Application app) {
        ScreeningReport report =
                screeningReportRepository.findByApplicationId(app.getId()).orElse(null);
        GrantProgramme programme =
                grantProgrammeRepository.findById(app.getProgrammeId()).orElse(null);
        String programmeName = programme != null ? programme.getName() : "Unknown";

        if (report == null) {
            return new ScreeningReportResponse(
                    null,
                    app.getId(),
                    app.getTitle(),
                    programmeName,
                    false,
                    List.of(),
                    List.of(),
                    null,
                    null,
                    false,
                    false,
                    null);
        }
        EligibilityCheckResult check =
                eligibilityCheckResultRepository.findByApplicationId(app.getId()).orElse(null);
        List<HardRuleResult> hardRules = parseHardRuleResults(check);
        List<SoftFlag> softFlags = parseSoftFlags(report.getFlagsJson());
        return toResponse(report, app, programmeName, hardRules, softFlags);
    }

    private ScreeningReportResponse toResponse(
            ScreeningReport report,
            Application app,
            String programmeName,
            List<HardRuleResult> hardRuleResults,
            List<SoftFlag> softFlags) {
        boolean hardRulesPassed = hardRuleResults.stream().allMatch(HardRuleResult::passed);
        return new ScreeningReportResponse(
                report.getId(),
                app.getId(),
                app.getTitle(),
                programmeName,
                hardRulesPassed,
                hardRuleResults,
                softFlags,
                report.getRiskLevel(),
                report.getSummary(),
                Boolean.TRUE.equals(report.getAiSuggested()),
                Boolean.TRUE.equals(report.getIsReviewed()),
                report.getCreatedAt());
    }

    private List<HardRuleResult> parseHardRuleResults(EligibilityCheckResult checkResult) {
        if (checkResult == null || checkResult.getCriteriaResults() == null) return List.of();
        try {
            return objectMapper.readValue(
                    checkResult.getCriteriaResults(), new TypeReference<>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<SoftFlag> parseSoftFlags(String flagsJson) {
        if (flagsJson == null || flagsJson.isBlank()) return List.of();
        try {
            return objectMapper.readValue(flagsJson, new TypeReference<>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private String serializeToJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "[]";
        }
    }

    private String nvl(String s) {
        return s != null ? s : "";
    }
}
