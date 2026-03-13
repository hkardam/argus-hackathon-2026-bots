package com.bots.hackathon.organisation.service;

import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.common.exception.DuplicateRegistrationException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.organisation.dto.CreateOrganisationRequest;
import com.bots.hackathon.organisation.dto.OrganisationResponse;
import com.bots.hackathon.organisation.dto.UpdateOrganisationRequest;
import com.bots.hackathon.organisation.model.Organisation;
import com.bots.hackathon.organisation.repo.OrganisationRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrganisationService {

  private final OrganisationRepository organisationRepository;

  @Transactional
  @LoggableAction(actionType = "CREATE", objectType = "ORGANISATION")
  public OrganisationResponse create(CreateOrganisationRequest request, Long ownerUserId) {
    if (request.registrationNumber() != null
        && !request.registrationNumber().isBlank()
        && organisationRepository
            .findByRegistrationNumber(request.registrationNumber())
            .isPresent()) {
      throw new DuplicateRegistrationException("This registration number already exists.");
    }

    int currentYear = LocalDate.now().getYear();
    if (request.yearEstablished() != null && request.yearEstablished() > currentYear) {
      throw new IllegalArgumentException("Year of establishment cannot be in the future.");
    }

    Organisation org =
        Organisation.builder()
            .name(request.name())
            .registrationNumber(request.registrationNumber())
            .organisationType(request.organisationType())
            .yearEstablished(request.yearEstablished())
            .state(request.state())
            .contactPerson(request.contactPerson())
            .address(request.address())
            .contactEmail(request.contactEmail())
            .contactPhone(request.contactPhone())
            .annualBudget(request.annualBudget())
            .ownerUserId(ownerUserId)
            .build();
    return toResponse(organisationRepository.save(org));
  }

  @Transactional
  @LoggableAction(
      actionType = "UPDATE",
      objectType = "ORGANISATION",
      objectIdExpression = "#id.toString()")
  public OrganisationResponse update(UUID id, UpdateOrganisationRequest request) {
    Organisation org =
        organisationRepository
            .findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("Organisation", id));

    if (request.registrationNumber() != null
        && !request.registrationNumber().isBlank()
        && !request.registrationNumber().equals(org.getRegistrationNumber())) {
      organisationRepository
          .findByRegistrationNumber(request.registrationNumber())
          .ifPresent(
              existing -> {
                throw new DuplicateRegistrationException(
                    "This registration number already exists.");
              });
    }

    if (request.yearEstablished() != null) {
      int currentYear = LocalDate.now().getYear();
      if (request.yearEstablished() > currentYear) {
        throw new IllegalArgumentException("Year of establishment cannot be in the future.");
      }
      org.setYearEstablished(request.yearEstablished());
    }

    if (request.name() != null) org.setName(request.name());
    if (request.registrationNumber() != null)
      org.setRegistrationNumber(request.registrationNumber());
    if (request.organisationType() != null) org.setOrganisationType(request.organisationType());
    if (request.state() != null) org.setState(request.state());
    if (request.contactPerson() != null) org.setContactPerson(request.contactPerson());
    if (request.address() != null) org.setAddress(request.address());
    if (request.contactEmail() != null) org.setContactEmail(request.contactEmail());
    if (request.contactPhone() != null) org.setContactPhone(request.contactPhone());
    if (request.annualBudget() != null) org.setAnnualBudget(request.annualBudget());

    return toResponse(organisationRepository.save(org));
  }

  @Transactional(readOnly = true)
  public OrganisationResponse getById(UUID id) {
    Organisation org =
        organisationRepository
            .findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("Organisation", id));
    return toResponse(org);
  }

  @Transactional(readOnly = true)
  public List<OrganisationResponse> getByOwnerUserId(Long ownerUserId) {
    return organisationRepository.findByOwnerUserIdAndDeletedFalse(ownerUserId).stream()
        .map(this::toResponse)
        .toList();
  }

  private int calculateCompletion(Organisation org) {
    int filled = 0;
    if (org.getName() != null && !org.getName().isBlank()) filled++;
    if (org.getRegistrationNumber() != null && !org.getRegistrationNumber().isBlank()) filled++;
    if (org.getOrganisationType() != null) filled++;
    if (org.getYearEstablished() != null) filled++;
    if (org.getState() != null && !org.getState().isBlank()) filled++;
    if (org.getContactPerson() != null && !org.getContactPerson().isBlank()) filled++;
    if (org.getContactEmail() != null && !org.getContactEmail().isBlank()) filled++;
    if (org.getContactPhone() != null && !org.getContactPhone().isBlank()) filled++;
    if (org.getAnnualBudget() != null) filled++;
    return filled * 100 / 9;
  }

  private OrganisationResponse toResponse(Organisation org) {
    return new OrganisationResponse(
        org.getId(),
        org.getName(),
        org.getRegistrationNumber(),
        org.getOrganisationType(),
        org.getYearEstablished(),
        org.getState(),
        org.getContactPerson(),
        org.getContactEmail(),
        org.getContactPhone(),
        org.getAnnualBudget(),
        org.getAddress(),
        org.getOwnerUserId(),
        org.getIsVerified(),
        calculateCompletion(org),
        org.getCreatedAt(),
        org.getUpdatedAt());
  }
}
