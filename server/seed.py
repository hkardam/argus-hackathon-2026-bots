"""Seed the database with grant programmes, demo users, and sample data."""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, create_tables
from app.core.security import get_password_hash as hash_password
from app.models.user import User
from app.models.grant_programme import GrantProgramme
from app.models.application import Application
from app.models.screening import ScreeningReport
from app.models.review import ReviewPackage, ReviewAssignment
from app.models.award import GrantAward
from app.models.disbursement import DisbursementTranche


def seed():
    create_tables()
    db = SessionLocal()
    try:
        # --- Grant Programmes ---
        if not db.query(GrantProgramme).first():
            programmes = [
                GrantProgramme(
                    code="CDG",
                    name="Community Development Grant",
                    purpose="Support grassroots community organisations working on social development.",
                    funding_min=500000,
                    funding_max=2500000,
                    duration_min_months=12,
                    duration_max_months=24,
                    eligible_org_types=json.dumps(["NGO", "TRUST", "SOCIETY", "SECTION_8"]),
                    geographic_focus="Rural and semi-urban areas across India",
                    is_active=True,
                    eligibility_rules=json.dumps({
                        "min_years_operation": 3,
                        "min_annual_budget": 300000,
                        "required_registrations": ["12A", "80G"],
                        "max_fcra_required": False,
                    }),
                    scoring_rubric=json.dumps({
                        "community_impact": {"weight": 0.30, "max_score": 5},
                        "organisational_capacity": {"weight": 0.25, "max_score": 5},
                        "project_design": {"weight": 0.25, "max_score": 5},
                        "sustainability": {"weight": 0.20, "max_score": 5},
                    }),
                ),
                GrantProgramme(
                    code="EIG",
                    name="Enterprise Innovation Grant",
                    purpose="Fund innovative social enterprises driving economic inclusion.",
                    funding_min=1000000,
                    funding_max=5000000,
                    duration_min_months=18,
                    duration_max_months=36,
                    eligible_org_types=json.dumps(["NGO", "TRUST", "SOCIETY", "SECTION_8", "PRODUCER_COMPANY"]),
                    geographic_focus="Pan-India with focus on underserved markets",
                    is_active=True,
                    eligibility_rules=json.dumps({
                        "min_years_operation": 5,
                        "min_annual_budget": 1000000,
                        "required_registrations": ["12A", "80G"],
                        "max_fcra_required": True,
                    }),
                    scoring_rubric=json.dumps({
                        "innovation": {"weight": 0.30, "max_score": 5},
                        "market_viability": {"weight": 0.25, "max_score": 5},
                        "social_impact": {"weight": 0.25, "max_score": 5},
                        "team_capacity": {"weight": 0.20, "max_score": 5},
                    }),
                ),
                GrantProgramme(
                    code="ECAG",
                    name="Environmental Conservation Action Grant",
                    purpose="Accelerate community-led environmental conservation projects.",
                    funding_min=750000,
                    funding_max=3500000,
                    duration_min_months=12,
                    duration_max_months=30,
                    eligible_org_types=json.dumps(["NGO", "TRUST", "SOCIETY", "SECTION_8"]),
                    geographic_focus="Biodiversity hotspots and ecologically sensitive areas",
                    is_active=True,
                    eligibility_rules=json.dumps({
                        "min_years_operation": 3,
                        "min_annual_budget": 500000,
                        "required_registrations": ["12A"],
                        "environmental_focus_required": True,
                    }),
                    scoring_rubric=json.dumps({
                        "environmental_impact": {"weight": 0.35, "max_score": 5},
                        "community_participation": {"weight": 0.25, "max_score": 5},
                        "scientific_rigor": {"weight": 0.20, "max_score": 5},
                        "replicability": {"weight": 0.20, "max_score": 5},
                    }),
                ),
            ]
            for p in programmes:
                db.add(p)
            db.flush()
            print("✓ Grant programmes seeded")
        else:
            print("  Grant programmes already exist, skipping")

        # --- Demo Users ---
        demo_users = [
            {"email": "demo_applicant@grantflow.in", "full_name": "Demo Applicant", "role": "APPLICANT"},
            {"email": "demo_officer@grantflow.in", "full_name": "Demo Officer", "role": "OFFICER"},
            {"email": "demo_reviewer@grantflow.in", "full_name": "Demo Reviewer", "role": "REVIEWER"},
            {"email": "demo_reviewer2@grantflow.in", "full_name": "Demo Reviewer 2", "role": "REVIEWER"},
            {"email": "demo_finance@grantflow.in", "full_name": "Demo Finance", "role": "FINANCE"},
            {"email": "demo_admin@grantflow.in", "full_name": "Demo Admin", "role": "ADMIN"},
        ]
        created_users = {}
        for u in demo_users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                user = User(
                    email=u["email"],
                    password_hash=hash_password("demo1234"),
                    full_name=u["full_name"],
                    role=u["role"],
                    is_active=True,
                )
                db.add(user)
                db.flush()
                created_users[u["email"]] = user
                print(f"  ✓ Created {u['role']} user: {u['email']}")
            else:
                created_users[u["email"]] = existing

        # --- Organisation profile for applicant ---
        from app.models.organisation import OrganisationProfile
        applicant_user = created_users.get("demo_applicant@grantflow.in")
        if applicant_user:
            existing_org = db.query(OrganisationProfile).filter(OrganisationProfile.user_id == applicant_user.id).first()
            if not existing_org:
                org = OrganisationProfile(
                    user_id=applicant_user.id,
                    legal_name="Green Earth Foundation",
                    registration_number="MH/2018/0012345",
                    org_type="NGO",
                    year_established=2018,
                    state="Maharashtra",
                    district="Pune",
                    annual_budget_inr=1500000,
                    contact_person_name="Demo Applicant",
                    contact_email="demo_applicant@grantflow.in",
                    contact_phone="9876543210",
                    pan_number="ABCDE1234F",
                    reg_12a=True,
                    reg_80g=True,
                    profile_complete_pct=95,
                )
                db.add(org)
                db.flush()
                print("  ✓ Created demo organisation profile")

        # --- Sample Application (CDG, ELIGIBLE) ---
        cdg = db.query(GrantProgramme).filter(GrantProgramme.code == "CDG").first()
        if applicant_user and cdg:
            existing_app = db.query(Application).filter(Application.reference_id == "GF-CDG-2026-0001").first()
            if not existing_app:
                section_data = {
                    "organisation": {
                        "legal_name": "Green Earth Foundation",
                        "registration_number": "MH/2018/0012345",
                        "org_type": "NGO",
                        "year_established": 2018,
                        "state": "Maharashtra",
                        "district": "Pune",
                        "annual_budget_inr": 1500000,
                        "pan_number": "ABCDE1234F",
                        "reg_12a": True,
                        "reg_80g": True,
                    },
                    "project": {
                        "title": "Clean Water for Rural Maharashtra",
                        "duration_months": 18,
                        "requested_amount": 1800000,
                        "description": "Installing water purification systems in 20 villages with 15,000 beneficiaries.",
                        "objectives": ["Install 20 water purification units", "Train 100 community volunteers", "Monitor water quality monthly"],
                        "target_beneficiaries": 15000,
                        "geographic_area": "Pune district rural clusters",
                    },
                    "budget": {
                        "total_requested": 1800000,
                        "breakdown": [
                            {"category": "Equipment", "amount": 900000},
                            {"category": "Personnel", "amount": 450000},
                            {"category": "Training", "amount": 250000},
                            {"category": "Monitoring", "amount": 200000},
                        ]
                    }
                }
                app = Application(
                    reference_id="GF-CDG-2026-0001",
                    applicant_id=applicant_user.id,
                    grant_programme_id=cdg.id,
                    status="ELIGIBLE",
                    workflow_stage="Eligibility Screening",
                    section_data=json.dumps(section_data),
                )
                db.add(app)
                db.flush()

                # Screening report
                report = ScreeningReport(
                    application_id=app.id,
                    hard_check_results=json.dumps([
                        {"rule_id": "E1", "criterion": "Organisation type eligible", "result": "PASS", "actual_value": "NGO", "expected": "NGO/Trust/Society/Section-8"},
                        {"rule_id": "E2", "criterion": "Minimum 3 years operation", "result": "PASS", "actual_value": "8 years", "expected": "≥3 years"},
                        {"rule_id": "E3", "criterion": "Annual budget ≥ ₹3L", "result": "PASS", "actual_value": "₹15L", "expected": "≥₹3L"},
                        {"rule_id": "E4", "criterion": "12A registration", "result": "PASS", "actual_value": "Yes", "expected": "Yes"},
                        {"rule_id": "E5", "criterion": "80G registration", "result": "PASS", "actual_value": "Yes", "expected": "Yes"},
                        {"rule_id": "E6", "criterion": "Grant amount within range", "result": "PASS", "actual_value": "₹18L", "expected": "₹5L-₹25L"},
                        {"rule_id": "E7", "criterion": "Project duration within range", "result": "PASS", "actual_value": "18 months", "expected": "12-24 months"},
                    ]),
                    ai_flags=json.dumps([
                        {"flag": "Strong community engagement", "severity": "INFO", "description": "Application demonstrates deep grassroots connections."},
                        {"flag": "Budget allocation reasonable", "severity": "INFO", "description": "50% equipment, 25% personnel is appropriate for this project type."},
                    ]),
                    thematic_alignment_score=88,
                    narrative_quality_score=82,
                    recommended_outcome="ELIGIBLE",
                    officer_decision="ELIGIBLE",
                    officer_notes="All criteria met. Strong application. Proceed to review.",
                )
                db.add(report)
                db.flush()

                # Review package
                officer_user = created_users.get("demo_officer@grantflow.in")
                reviewer_user = created_users.get("demo_reviewer@grantflow.in")

                pkg = ReviewPackage(
                    application_id=app.id,
                    summary_text="Green Earth Foundation requests ₹18L over 18 months to install water purification in 20 villages (15,000 beneficiaries). The organisation has 8 years experience, strong 12A/80G registrations, and a clear monitoring plan. Risk factors include procurement complexity for 20 units and volunteer training sustainability.",
                    suggested_scores=json.dumps({
                        "community_impact": {"ai_score": 4, "justification": "15,000 direct beneficiaries across 20 villages is substantial impact at CDG scale."},
                        "organisational_capacity": {"ai_score": 4, "justification": "8-year track record, complete registrations, reasonable budget size relative to ask."},
                        "project_design": {"ai_score": 3, "justification": "Clear objectives and timeline but limited detail on procurement process and vendor selection."},
                        "sustainability": {"ai_score": 3, "justification": "Volunteer training mentioned but long-term maintenance funding not addressed."},
                    }),
                    risk_flags=json.dumps([
                        {"category": "Implementation", "severity": "MEDIUM", "description": "Installing 20 units in 18 months requires robust procurement planning."},
                        {"category": "Sustainability", "severity": "MEDIUM", "description": "Post-grant maintenance costs not budgeted."},
                        {"category": "Financial", "severity": "LOW", "description": "Equipment comprises 50% of budget — confirm market rates."},
                    ]),
                )
                db.add(pkg)
                db.flush()

                # Review assignment
                if reviewer_user and officer_user:
                    from datetime import datetime, timezone, timedelta
                    assignment = ReviewAssignment(
                        application_id=app.id,
                        reviewer_id=reviewer_user.id,
                        assigned_by_id=officer_user.id,
                        deadline=datetime.now(timezone.utc) + timedelta(days=7),
                        status="PENDING",
                    )
                    db.add(assignment)
                    db.flush()

                # Update status to UNDER_REVIEW
                app.status = "UNDER_REVIEW"
                app.workflow_stage = "Under Review"
                db.flush()

                print("  ✓ Created sample application GF-CDG-2026-0001 (UNDER_REVIEW)")

        # --- Sample Approved Grant with Disbursements ---
        if applicant_user and cdg:
            existing_approved = db.query(Application).filter(Application.reference_id == "GF-CDG-2025-0042").first()
            if not existing_approved:
                section_data2 = {
                    "organisation": {
                        "legal_name": "Bright Futures Society",
                        "registration_number": "KA/2015/0009876",
                        "org_type": "SOCIETY",
                        "annual_budget_inr": 2200000,
                        "state": "Karnataka",
                        "district": "Mysore",
                        "pan_number": "BFGHI5678J",
                        "reg_12a": True,
                        "reg_80g": True,
                    },
                    "project": {
                        "title": "Digital Literacy for Rural Youth",
                        "duration_months": 12,
                        "requested_amount": 1500000,
                        "description": "Training 2,000 rural youth in digital skills and job placement.",
                    },
                }
                app2 = Application(
                    reference_id="GF-CDG-2025-0042",
                    applicant_id=applicant_user.id,
                    grant_programme_id=cdg.id,
                    status="ACTIVE",
                    workflow_stage="Active Grant",
                    section_data=json.dumps(section_data2),
                )
                db.add(app2)
                db.flush()

                officer_user = created_users.get("demo_officer@grantflow.in")
                award = GrantAward(
                    application_id=app2.id,
                    decision="APPROVED",
                    reason="Strong programme alignment and organisational capacity.",
                    award_amount=1500000,
                    decided_by_id=officer_user.id if officer_user else None,
                )
                db.add(award)
                db.flush()

                from datetime import datetime, timezone, timedelta
                tranches = [
                    DisbursementTranche(
                        grant_award_id=award.id,
                        label="Inception Tranche (40%)",
                        amount_inr=600000,
                        tranche_type="INCEPTION",
                        trigger_condition="Upon agreement signing",
                        status="DISBURSED",
                        disbursed_at=datetime.now(timezone.utc) - timedelta(days=60),
                        transaction_reference="TXN20250901001",
                    ),
                    DisbursementTranche(
                        grant_award_id=award.id,
                        label="Mid-Project Tranche (40%)",
                        amount_inr=600000,
                        tranche_type="MID_PROJECT",
                        trigger_condition="Six-month report approved",
                        status="READY",
                    ),
                    DisbursementTranche(
                        grant_award_id=award.id,
                        label="Final Tranche (20%)",
                        amount_inr=300000,
                        tranche_type="FINAL",
                        trigger_condition="Final report approved",
                        status="PENDING",
                    ),
                ]
                for t in tranches:
                    db.add(t)

                print("  ✓ Created sample active grant GF-CDG-2025-0042 with tranches")

        db.commit()
        print("\n✓ Database seeded successfully!")
        print("\nDemo login credentials (password: demo1234):")
        print("  Applicant:  demo_applicant@grantflow.in")
        print("  Officer:    demo_officer@grantflow.in")
        print("  Reviewer:   demo_reviewer@grantflow.in")
        print("  Finance:    demo_finance@grantflow.in")
        print("  Admin:      demo_admin@grantflow.in")
        print("\nOr use POST /api/auth/demo-login with {\"role\": \"applicant\"}")

    except Exception as e:
        db.rollback()
        print(f"✗ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
