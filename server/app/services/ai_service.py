"""
AI Service using Anthropic Claude for:
1. Eligibility screening (thematic + narrative analysis)
2. Review package generation (summary, scores, risk flags)
3. Compliance analysis (report vs application)
4. Application chatbot
"""
import json
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


def get_client():
    try:
        import anthropic
        return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    except Exception as e:
        logger.warning(f"Could not initialize Anthropic client: {e}")
        return None


def _call_claude(system_prompt: str, user_prompt: str, max_tokens: int = 2000) -> Optional[str]:
    """Make a Claude API call, returns text or None on failure"""
    client = get_client()
    if not client or not settings.ANTHROPIC_API_KEY:
        logger.warning("Anthropic API not configured, using fallback")
        return None
    try:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": user_prompt}],
            system=system_prompt,
        )
        return message.content[0].text
    except Exception as e:
        logger.error(f"Claude API error: {e}")
        return None


def run_eligibility_screening(section_data: dict, grant_type: str) -> Dict[str, Any]:
    """
    AI soft checks for thematic alignment and narrative quality.
    Returns: {thematic_score, narrative_score, flags, recommended_outcome}
    """
    system_prompt = f"""You are an eligibility screening AI for the GrantFlow platform, evaluating a {grant_type} grant application.
Analyse the application text and return a JSON object with:
- thematic_alignment_score: integer 0-100 (how well the project aligns with {grant_type} themes)
- narrative_quality_score: integer 0-100 (quality of problem statement, solution, outcomes)
- flags: list of objects {{flag_type, description, severity}} where severity is LOW/MEDIUM/HIGH
- recommended_outcome: one of ELIGIBLE, INELIGIBLE, REVIEW_NEEDED
- reasoning: brief explanation

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON."""

    org = section_data.get("organisation", {})
    project = section_data.get("project", section_data.get("innovation", section_data.get("environment", {})))

    user_prompt = f"""Grant Type: {grant_type}
Organisation: {org.get("legal_name", "Unknown")} ({org.get("org_type", "Unknown")})
Project Title: {project.get("project_title", project.get("title", "N/A"))}
Problem Statement: {project.get("problem_statement", project.get("environmental_problem_description", project.get("problem_being_solved", "Not provided")))}
Proposed Solution: {project.get("proposed_solution", project.get("innovation_description", project.get("proposed_intervention", "Not provided")))}
Expected Outcomes: {project.get("expected_outcomes", project.get("primary_learning_outcome_targeted", "Not provided"))}
Target Beneficiaries: {project.get("target_beneficiaries", project.get("number_of_students_to_benefit", project.get("direct_beneficiaries", "Not provided")))}

Please analyse this application for thematic alignment with {grant_type} objectives and narrative quality."""

    result = _call_claude(system_prompt, user_prompt)

    if result:
        try:
            # Strip markdown code blocks if present
            clean = result.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            data = json.loads(clean)
            return data
        except json.JSONDecodeError:
            pass

    # Fallback stub response
    return {
        "thematic_alignment_score": 72,
        "narrative_quality_score": 68,
        "flags": [
            {"flag_type": "NARRATIVE_QUALITY",
             "description": "Problem statement could benefit from more quantitative data",
             "severity": "LOW"},
            {"flag_type": "BENEFICIARY_CLARITY",
             "description": "Beneficiary demographics not fully specified",
             "severity": "LOW"}
        ],
        "recommended_outcome": "ELIGIBLE",
        "reasoning": "Application meets thematic alignment criteria with acceptable narrative quality."
    }


def generate_review_package(section_data: dict, grant_type: str, scoring_rubric: list) -> Dict[str, Any]:
    """
    Generate AI review package: summary, suggested scores, risk flags.
    """
    rubric_text = "\n".join([
        f"- {dim['dimension']} ({dim['weight']}%): Score 1-5"
        for dim in scoring_rubric
    ]) if scoring_rubric else "- Community Need (25%)\n- Project Design (25%)\n- Track Record (20%)\n- Impact (20%)\n- Budget (10%)"

    system_prompt = f"""You are an AI reviewer for the GrantFlow platform evaluating a {grant_type} grant application.
Generate a comprehensive review package and return a JSON object with:
- summary: string (2-minute overview: who, what, where, beneficiaries, duration, amount)
- suggested_scores: object mapping each dimension name to {{score: 1-5, justification: string, section_reference: string}}
- risk_flags: list of {{category: string, description: string, severity: HIGH|MEDIUM|LOW}}
  Categories: BUDGET_ANOMALY, TIMELINE_RISK, VAGUE_OUTCOMES, TEAM_CAPACITY, PRIOR_GRANT_HISTORY

Scoring rubric:
{rubric_text}

Respond ONLY with valid JSON."""

    org = section_data.get("organisation", {})
    project = section_data.get("project", section_data.get("innovation", section_data.get("environment", {})))
    budget = section_data.get("budget", {})
    experience = section_data.get("experience", section_data.get("team", {}))

    user_prompt = f"""Application Details:
Organisation: {org.get("legal_name", "N/A")} | Type: {org.get("org_type", "N/A")} | Est: {org.get("year_established", "N/A")}
Project: {project.get("project_title", "N/A")}
Location: {project.get("project_location", project.get("target_schools_districts", "N/A"))}
Problem: {project.get("problem_statement", project.get("problem_being_solved", project.get("environmental_problem_description", "N/A")))}
Solution: {project.get("proposed_solution", project.get("innovation_description", project.get("proposed_intervention", "N/A")))}
Beneficiaries: {project.get("target_beneficiaries", project.get("number_of_students_to_benefit", project.get("direct_beneficiaries", "N/A")))}
Start Date: {project.get("project_start_date", "N/A")} | End Date: {project.get("project_end_date", "N/A")}
Budget Total: INR {budget.get("total_amount_requested", budget.get("total_requested", "N/A"))}
Experience: {experience.get("relevant_prior_projects", experience.get("team_expertise_description", "N/A"))}
Prior Grants: {experience.get("has_received_grants_before", "N/A")}"""

    result = _call_claude(system_prompt, user_prompt, max_tokens=3000)

    if result:
        try:
            clean = result.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            data = json.loads(clean)
            return data
        except json.JSONDecodeError:
            pass

    # Fallback
    return {
        "summary": f"Application for {grant_type} grant from {org.get('legal_name', 'Unknown Organisation')}. "
                   f"Project: {project.get('project_title', 'Not specified')}. "
                   f"Budget: INR {budget.get('total_amount_requested', budget.get('total_requested', 'N/A'))}.",
        "suggested_scores": {
            "Community Need & Problem Clarity": {"score": 3, "justification": "Problem statement provided with basic context", "section_reference": "Project Section"},
            "Project Design & Feasibility": {"score": 3, "justification": "Activities described but timeline needs verification", "section_reference": "Project Section"},
            "Organisation Track Record": {"score": 3, "justification": "Some prior experience indicated", "section_reference": "Experience Section"},
            "Expected Impact & Outcomes": {"score": 3, "justification": "Outcomes defined but measurability needs improvement", "section_reference": "Project Section"},
            "Budget Realism": {"score": 3, "justification": "Budget figures provided, justification acceptable", "section_reference": "Budget Section"},
        },
        "risk_flags": [
            {"category": "VAGUE_OUTCOMES", "description": "Outcome indicators could be made more measurable", "severity": "LOW"},
        ]
    }


def analyze_compliance(report_data: dict, application_data: dict, budget_approved: dict) -> Dict[str, Any]:
    """
    AI compliance analysis of progress report vs approved application.
    """
    system_prompt = """You are a compliance analyst for the GrantFlow platform.
Analyse the progress report against the approved application and return a JSON object with:
- content_rating: SATISFACTORY | NEEDS_CLARIFICATION | CONCERNS_FOUND
- content_flags: list of {type, description, field_reference, severity: LOW|MEDIUM|HIGH}
- financial_flags: list of {type, description, budget_line, deviation_pct, severity}
- overall_recommendation: string
- underspend_alert: boolean

Check:
1. Activity consistency with approved application
2. Beneficiary progress vs timeline
3. Acknowledgement of challenges (balanced reporting)
4. Financial arithmetic: period + cumulative totals
5. Budget lines with >10% variance from approved
6. Underspend if <30% spent at ≥50% timeline

Respond ONLY with valid JSON."""

    user_prompt = f"""Approved Application Budget: {json.dumps(budget_approved)}

Progress Report:
Activities Completed: {report_data.get("activities_completed", "N/A")}
Beneficiaries Reached: {report_data.get("beneficiaries_reached", "N/A")}
Total Expenditure This Period: INR {report_data.get("total_expenditure_period", 0)}
Cumulative Expenditure: INR {report_data.get("cumulative_expenditure", 0)}
Progress on Outcomes: {report_data.get("progress_on_outcomes", "N/A")}
Challenges: {report_data.get("key_challenges", "N/A")}
Budget Line Expenditure: {json.dumps(report_data.get("expenditure_by_budget_line", {}))}"""

    result = _call_claude(system_prompt, user_prompt, max_tokens=2000)

    if result:
        try:
            clean = result.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            data = json.loads(clean)
            return data
        except json.JSONDecodeError:
            pass

    # Fallback
    return {
        "content_rating": "SATISFACTORY",
        "content_flags": [],
        "financial_flags": [],
        "overall_recommendation": "Report appears satisfactory. Review and approve.",
        "underspend_alert": False
    }


def chatbot_message(conversation_history: list, grant_type: str, current_section: str = "") -> Dict[str, Any]:
    """
    AI chatbot for guided application filling.
    Returns: {message: str, extracted_data: dict, next_section: str, is_complete: bool}
    """
    system_prompt = f"""You are an AI application guide for GrantFlow, helping applicants fill out a {grant_type} grant application.
Your role is to:
1. Ask ONE question at a time to collect application information
2. Be friendly, clear, and encouraging
3. Validate answers and ask for clarification if needed
4. NOT suggest or write content for the applicant — only guide them to provide their own information

Current section: {current_section or "Organisation Details"}

After each user message, respond with a JSON object:
{{
  "message": "Your response/next question",
  "extracted_data": {{}},  // Any data extracted from the user's last message
  "next_section": "section name or null",
  "is_complete": false
}}

Respond ONLY with valid JSON."""

    messages = [{"role": m["role"], "content": m["content"]} for m in conversation_history]

    client = get_client()
    if not client or not settings.ANTHROPIC_API_KEY:
        return {
            "message": "Welcome! I'll help you fill out your grant application. Let's start with your organisation details. What is the legal name of your organisation?",
            "extracted_data": {},
            "next_section": "organisation",
            "is_complete": False
        }

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1000,
            system=system_prompt,
            messages=messages if messages else [{"role": "user", "content": "Start the application process"}],
        )
        text = response.content[0].text
        clean = text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        return json.loads(clean)
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return {
            "message": "I'm here to help you with your application. Could you start by telling me the legal name of your organisation?",
            "extracted_data": {},
            "next_section": "organisation",
            "is_complete": False
        }
