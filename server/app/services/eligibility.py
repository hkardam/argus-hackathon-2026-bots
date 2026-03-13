"""
Hard eligibility rule checks for each grant type.
Returns a list of check results: {rule_id, criterion, result, actual_value, note}
"""
from typing import List, Dict, Any
from datetime import date


def check_cdg_eligibility(section_data: dict) -> List[Dict[str, Any]]:
    """CDG hard rules E1-E7"""
    results = []
    current_year = date.today().year

    org = section_data.get("organisation", {})
    project = section_data.get("project", {})
    budget = section_data.get("budget", {})

    # E1: Organisation Type
    allowed_types = ["NGO", "Trust", "Section 8 Company"]
    org_type = org.get("org_type", "")
    e1_pass = any(t.lower() in org_type.lower() for t in allowed_types)
    results.append({
        "rule_id": "E1", "criterion": "Organisation Type",
        "result": "PASS" if e1_pass else "FAIL",
        "actual_value": org_type,
        "note": f"Must be NGO, Trust, or Section 8 Company. Got: {org_type}"
    })

    # E2: Minimum Age (>=2 years)
    year_est = org.get("year_established")
    if year_est:
        e2_pass = (current_year - int(year_est)) >= 2
        results.append({
            "rule_id": "E2", "criterion": "Minimum Organisation Age",
            "result": "PASS" if e2_pass else "FAIL",
            "actual_value": f"{current_year - int(year_est)} years",
            "note": f"Must be at least 2 years old. Established: {year_est}"
        })
    else:
        results.append({"rule_id": "E2", "criterion": "Minimum Organisation Age",
                        "result": "FAIL", "actual_value": "Not provided", "note": "Year of establishment required"})

    # E4: Funding Range (2L - 20L)
    total_requested = budget.get("total_amount_requested", 0)
    try:
        total_requested = float(total_requested)
    except (TypeError, ValueError):
        total_requested = 0
    e4_pass = 200000 <= total_requested <= 2000000
    results.append({
        "rule_id": "E4", "criterion": "Funding Range",
        "result": "PASS" if e4_pass else "FAIL",
        "actual_value": f"INR {total_requested:,.0f}",
        "note": "Amount must be between INR 2,00,000 and INR 20,00,000"
    })

    # E5: Project Duration (6-18 months)
    start_date = project.get("project_start_date")
    end_date = project.get("project_end_date")
    if start_date and end_date:
        try:
            from datetime import datetime
            s = datetime.fromisoformat(str(start_date))
            e = datetime.fromisoformat(str(end_date))
            months = (e.year - s.year) * 12 + (e.month - s.month)
            e5_pass = 6 <= months <= 18
            results.append({
                "rule_id": "E5", "criterion": "Project Duration",
                "result": "PASS" if e5_pass else "FAIL",
                "actual_value": f"{months} months",
                "note": "Duration must be 6 to 18 months"
            })
        except Exception:
            results.append({"rule_id": "E5", "criterion": "Project Duration",
                            "result": "FAIL", "actual_value": "Invalid dates", "note": "Valid start and end dates required"})
    else:
        results.append({"rule_id": "E5", "criterion": "Project Duration",
                        "result": "FAIL", "actual_value": "Not provided", "note": "Project start and end dates required"})

    # E6: Budget Overhead <= 15%
    overheads = budget.get("overheads", 0)
    try:
        overheads = float(overheads)
        overhead_pct = (overheads / total_requested * 100) if total_requested > 0 else 0
        e6_pass = overhead_pct <= 15
        results.append({
            "rule_id": "E6", "criterion": "Budget Overhead Cap",
            "result": "PASS" if e6_pass else "FAIL",
            "actual_value": f"{overhead_pct:.1f}%",
            "note": "Overhead must be <= 15% of total requested amount"
        })
    except (TypeError, ValueError):
        results.append({"rule_id": "E6", "criterion": "Budget Overhead Cap",
                        "result": "FAIL", "actual_value": "Invalid", "note": "Overhead amount required"})

    # E7: Budget Total Match
    personnel = float(budget.get("personnel_costs", 0) or 0)
    equipment = float(budget.get("equipment_materials", 0) or 0)
    travel = float(budget.get("travel_logistics", 0) or 0)
    other = float(budget.get("other", 0) or 0)
    budget_sum = personnel + equipment + travel + overheads + other
    variance = abs(budget_sum - total_requested)
    e7_pass = variance <= 500
    results.append({
        "rule_id": "E7", "criterion": "Budget Total Match",
        "result": "PASS" if e7_pass else "FAIL",
        "actual_value": f"Sum: INR {budget_sum:,.0f}, Requested: INR {total_requested:,.0f}",
        "note": "Budget lines must sum to total requested amount (+/- INR 500)"
    })

    return results


def check_eig_eligibility(section_data: dict) -> List[Dict[str, Any]]:
    """EIG hard rules E1-E8"""
    results = []
    current_year = date.today().year

    org = section_data.get("organisation", {})
    innovation = section_data.get("innovation", {})
    budget = section_data.get("budget", {})
    timeline = section_data.get("timeline", {})

    # E1: Organisation Type
    allowed_types = ["NGO", "EdTech", "Research Institution", "University"]
    org_type = org.get("org_type", "")
    e1_pass = any(t.lower() in org_type.lower() for t in allowed_types)
    results.append({
        "rule_id": "E1", "criterion": "Organisation Type",
        "result": "PASS" if e1_pass else "FAIL",
        "actual_value": org_type,
        "note": "Must be NGO, EdTech Non-profit, Research Institution, or University"
    })

    # E2: Minimum 1 year old
    year_est = org.get("year_established")
    if year_est:
        e2_pass = (current_year - int(year_est)) >= 1
        results.append({
            "rule_id": "E2", "criterion": "Minimum Operation Period",
            "result": "PASS" if e2_pass else "FAIL",
            "actual_value": f"{current_year - int(year_est)} years",
            "note": "Must be established at least 1 year ago"
        })

    # E3: Funding Range (5L - 50L)
    total_requested = float(budget.get("total_requested", 0) or 0)
    e3_pass = 500000 <= total_requested <= 5000000
    results.append({
        "rule_id": "E3", "criterion": "Funding Range",
        "result": "PASS" if e3_pass else "FAIL",
        "actual_value": f"INR {total_requested:,.0f}",
        "note": "Amount must be between INR 5,00,000 and INR 50,00,000"
    })

    # E4: Duration 12-24 months
    start_date = timeline.get("project_start_date")
    end_date = timeline.get("project_end_date")
    if start_date and end_date:
        try:
            from datetime import datetime
            s = datetime.fromisoformat(str(start_date))
            e = datetime.fromisoformat(str(end_date))
            months = (e.year - s.year) * 12 + (e.month - s.month)
            e4_pass = 12 <= months <= 24
            results.append({
                "rule_id": "E4", "criterion": "Project Duration",
                "result": "PASS" if e4_pass else "FAIL",
                "actual_value": f"{months} months",
                "note": "Duration must be 12 to 24 months"
            })
        except Exception:
            results.append({"rule_id": "E4", "criterion": "Project Duration",
                            "result": "FAIL", "actual_value": "Invalid", "note": "Valid dates required"})

    # E5: Minimum 5 schools targeted
    schools = innovation.get("number_of_schools_targeted", 0)
    try:
        e5_pass = int(schools) >= 5
        results.append({
            "rule_id": "E5", "criterion": "Schools Targeted",
            "result": "PASS" if e5_pass else "FAIL",
            "actual_value": str(schools),
            "note": "Must target at least 5 schools"
        })
    except (TypeError, ValueError):
        results.append({"rule_id": "E5", "criterion": "Schools Targeted",
                        "result": "FAIL", "actual_value": "Not provided", "note": "Number of schools required"})

    # E7: Overhead cap <= 15%
    overheads = float(budget.get("overheads", 0) or 0)
    overhead_pct = (overheads / total_requested * 100) if total_requested > 0 else 0
    e7_pass = overhead_pct <= 15
    results.append({
        "rule_id": "E7", "criterion": "Budget Overhead Cap",
        "result": "PASS" if e7_pass else "FAIL",
        "actual_value": f"{overhead_pct:.1f}%",
        "note": "Overheads <= 15% of total"
    })

    return results


def check_ecag_eligibility(section_data: dict) -> List[Dict[str, Any]]:
    """ECAG hard rules E1-E5"""
    results = []
    current_year = date.today().year

    org = section_data.get("organisation", {})
    budget = section_data.get("budget", {})
    timeline = section_data.get("timeline", {})

    # E1: Organisation Type
    allowed_types = ["NGO", "FPO", "Farmer Producer", "Panchayat", "Research Institution"]
    org_type = org.get("org_type", "")
    e1_pass = any(t.lower() in org_type.lower() for t in allowed_types)
    results.append({
        "rule_id": "E1", "criterion": "Organisation Type",
        "result": "PASS" if e1_pass else "FAIL",
        "actual_value": org_type,
        "note": "Must be NGO, FPO, Panchayat, or Research Institution"
    })

    # E2: Funding Range (3L - 30L)
    total_requested = float(budget.get("total_requested", 0) or 0)
    e2_pass = 300000 <= total_requested <= 3000000
    results.append({
        "rule_id": "E2", "criterion": "Funding Range",
        "result": "PASS" if e2_pass else "FAIL",
        "actual_value": f"INR {total_requested:,.0f}",
        "note": "Amount must be between INR 3,00,000 and INR 30,00,000"
    })

    # E3: Duration 6-24 months
    start_date = timeline.get("start_date")
    end_date = timeline.get("end_date")
    if start_date and end_date:
        try:
            from datetime import datetime
            s = datetime.fromisoformat(str(start_date))
            e = datetime.fromisoformat(str(end_date))
            months = (e.year - s.year) * 12 + (e.month - s.month)
            e3_pass = 6 <= months <= 24
            results.append({
                "rule_id": "E3", "criterion": "Project Duration",
                "result": "PASS" if e3_pass else "FAIL",
                "actual_value": f"{months} months",
                "note": "Duration must be 6 to 24 months"
            })
        except Exception:
            results.append({"rule_id": "E3", "criterion": "Project Duration",
                            "result": "FAIL", "actual_value": "Invalid", "note": "Valid dates required"})

    # E4: Overhead cap <= 15%
    overheads = float(budget.get("overheads", 0) or 0)
    overhead_pct = (overheads / total_requested * 100) if total_requested > 0 else 0
    e4_pass = overhead_pct <= 15
    results.append({
        "rule_id": "E4", "criterion": "Budget Overhead Cap",
        "result": "PASS" if e4_pass else "FAIL",
        "actual_value": f"{overhead_pct:.1f}%",
        "note": "Overheads <= 15% of total"
    })

    # E5: Budget total match
    community_engagement = float(budget.get("community_engagement_wages", 0) or 0)
    equipment = float(budget.get("equipment_tools", 0) or 0)
    saplings = float(budget.get("saplings_seeds_materials", 0) or 0)
    technical = float(budget.get("technical_expertise_consultants", 0) or 0)
    other = float(budget.get("other", 0) or 0)
    budget_sum = community_engagement + equipment + saplings + technical + overheads + other
    variance = abs(budget_sum - total_requested)
    e5_pass = variance <= 500
    results.append({
        "rule_id": "E5", "criterion": "Budget Total Match",
        "result": "PASS" if e5_pass else "FAIL",
        "actual_value": f"Sum: INR {budget_sum:,.0f}",
        "note": "Budget lines must sum to total requested (+/- INR 500)"
    })

    return results


def run_hard_eligibility_checks(grant_code: str, section_data: dict) -> List[Dict[str, Any]]:
    """Route to the appropriate checker by grant type"""
    if grant_code == "CDG":
        return check_cdg_eligibility(section_data)
    elif grant_code == "EIG":
        return check_eig_eligibility(section_data)
    elif grant_code == "ECAG":
        return check_ecag_eligibility(section_data)
    return []


def quick_eligibility_check(org_type: str, district: str, amount: float,
                             grant_code: str, grant: Any) -> Dict[str, Any]:
    """Quick pre-check for public eligibility widget"""
    import json
    reasons = []
    eligible = True

    if grant_code == "CDG":
        if not any(t.lower() in org_type.lower() for t in ["ngo", "trust", "section 8"]):
            eligible = False
            reasons.append("Organisation type not eligible for CDG")
        if not (200000 <= amount <= 2000000):
            eligible = False
            reasons.append(f"Funding range for CDG is INR 2L - 20L")

    elif grant_code == "EIG":
        if not any(t.lower() in org_type.lower() for t in ["ngo", "edtech", "research", "university"]):
            eligible = False
            reasons.append("Organisation type not eligible for EIG")
        if not (500000 <= amount <= 5000000):
            eligible = False
            reasons.append("Funding range for EIG is INR 5L - 50L")

    elif grant_code == "ECAG":
        if not any(t.lower() in org_type.lower() for t in ["ngo", "fpo", "panchayat", "research"]):
            eligible = False
            reasons.append("Organisation type not eligible for ECAG")
        if not (300000 <= amount <= 3000000):
            eligible = False
            reasons.append("Funding range for ECAG is INR 3L - 30L")

    if eligible and not reasons:
        reasons.append("Meets basic eligibility criteria")

    return {
        "status": "LIKELY_ELIGIBLE" if eligible else "LIKELY_NOT_ELIGIBLE",
        "reasons": reasons
    }
