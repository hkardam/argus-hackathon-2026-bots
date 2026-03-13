ALTER TABLE grant_programmes ADD COLUMN IF NOT EXISTS eligibility_criteria TEXT;

-- Seed data for Grant Programmes
INSERT INTO grant_programmes (id, name, description, grant_type, total_budget, max_award_amount, application_open_date, application_close_date, current_stage, eligibility_criteria, is_active)
SELECT gen_random_uuid(), 
 'Community Development Grant (CDG)', 
 'Fund community-level infrastructure and social service projects. Eligible for Registered NGOs, Trusts, Section 8 Companies with minimum 2 years of operation. Geographic Focus: Rural and semi-urban areas in India.', 
 'COMMUNITY', 
 20000000.00, 
 2000000.00, 
 '2026-04-01', 
 '2026-06-30', 
 'SUBMISSION',
 'Organisation Type: Must be NGO, Trust, or Section 8 CompanyMinimum Age: Year of establishment <= current year - 2Geographic Focus: Project location must be in a rural/semi-urban district (lookup table)Funding Range: Amount requested between INR 2L and INR 20LProject Duration: End date - start date between 6 and 18 monthsBudget Overhead: Overhead line <= 15% of total requested amountBudget Total: Sum of all budget lines must equal total amount requested (+/- INR 500)Thematic Alignment (AI): Project description must align to community development themes — AI score >= 60% Flag to Suitable UserBeneficiary Count (AI): Must be > 0 and reasonable for budget — AI check: cost per beneficiary < INR 50,000 Flag to Suitable User',
 TRUE
WHERE NOT EXISTS (SELECT 1 FROM grant_programmes WHERE name = 'Community Development Grant (CDG)');

INSERT INTO grant_programmes (id, name, description, grant_type, total_budget, max_award_amount, application_open_date, application_close_date, current_stage, eligibility_criteria, is_active)
SELECT gen_random_uuid(), 
 'Education Innovation Grant (EIG)', 
 'Fund technology-enabled or pedagogy-innovation projects improving learning outcomes in government schools. Eligible for NGOs, EdTech non-profits, Research institutions, Universities. Geographic Focus: Any state in India; preference for aspirational districts.', 
 'INNOVATION', 
 50000000.00, 
 5000000.00, 
 '2026-01-01', 
 '2026-12-31', 
 'SUBMISSION',
 'Organisation Type: NGO / EdTech Non-profit / Research Institution / University onlyMinimum Operation Period: Established $\ge$ 1 year agoFunding Range: Amount between INR 5L and INR 50LProject Duration: 12-24 monthsSchools Targeted: Minimum 5 schoolsGrade Coverage: Must target at least one grade level selectedBudget Overhead Cap: Overheads $\le$ 15% of totalBudget Total Match: Budget lines must sum to requested total (+/- INR 500)Education Theme Alignment (AI): AI NLP score for education innovation alignment $\ge$ 65% // Flag to Suitable UserImpact Measurement Plan (AI): AI checks whether a measurable plan with indicators exists — flags if vague // Flag to Suitable User',
 TRUE
WHERE NOT EXISTS (SELECT 1 FROM grant_programmes WHERE name = 'Education Innovation Grant (EIG)');

INSERT INTO grant_programmes (id, name, description, grant_type, total_budget, max_award_amount, application_open_date, application_close_date, current_stage, eligibility_criteria, is_active)
SELECT gen_random_uuid(), 
 'Environment & Climate Action Grant (ECAG)', 
 'Fund grassroots environmental conservation, climate resilience, and clean energy access projects. Eligible for NGOs, Farmer Producer Organisations (FPOs), Panchayat bodies, Research institutions. Priority given to climate-vulnerable districts.', 
 'RESEARCH', 
 30000000.00, 
 3000000.00, 
 '2026-07-01', 
 '2026-08-31', 
 'SUBMISSION',
 'Organisation Type: NGO / FPO / Panchayat / Research Institution onlyFunding Range: INR 3L - INR 30LDuration: 6-24 monthsBudget Overhead Cap: Overheads $\le$ 15% of totalBudget Total Match: Budget lines sum to requested total (+/- INR 500)Geographic Priority Check (AI): Project location checked against climate-vulnerable district list — non-priority flagged but not rejectedEnvironmental Theme Alignment (AI): AI score for environmental / climate themes $\ge$ 60% Flag to Suitable UserCommunity Involvement (AI): AI checks community involvement plan exists and is substantive Flag to Suitable User',
 TRUE
WHERE NOT EXISTS (SELECT 1 FROM grant_programmes WHERE name = 'Environment & Climate Action Grant (ECAG)');
