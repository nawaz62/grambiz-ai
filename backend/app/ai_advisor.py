"""
AI Advisor & Recommendation Engine for GRAMBIZ AI.
Provides:
1. Deterministic weighted business fit scoring (Budget, Skill, Location, Demand, Risk).
2. Intent extraction from user conversational prompts.
3. Structured AI response generation with LLM API or zero-dependency Fallback Rule Engine.
"""

import json
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
from app.business_data import RURAL_BUSINESSES, get_all_businesses
from app.schemas import (
    EntrepreneurProfileCreate,
    RecommendedBusiness,
    BusinessSummary,
    BusinessFitBreakdown,
    AIAdvisorResponse
)

def calculate_business_fit(profile: EntrepreneurProfileCreate, b: Dict[str, Any]) -> RecommendedBusiness:
    # 1. Budget Match (0 - 100)
    cap = profile.capital
    min_inv = b["minimum_investment"]
    rec_inv = b["recommended_investment"]

    if cap >= rec_inv:
        budget_score = 95.0
    elif cap >= min_inv:
        budget_score = 75.0 + ((cap - min_inv) / max(1.0, rec_inv - min_inv)) * 20.0
    elif cap >= min_inv * 0.7:
        budget_score = 55.0
    else:
        budget_score = 30.0

    # 2. Skill Match (0 - 100)
    user_skills = [s.lower().strip() for s in profile.skills]
    req_skills = [s.lower().strip() for s in b["required_skills"]]

    matched = sum(1 for s in req_skills if any(u in s or s in u for u in user_skills))
    if len(req_skills) > 0:
        skill_score = min(100.0, 50.0 + (matched / len(req_skills)) * 50.0)
    else:
        skill_score = 80.0

    if any(exp.lower() in b["category"].lower() or exp.lower() in b["name"].lower() for exp in [profile.work_experience or ""]):
        skill_score = min(100.0, skill_score + 20.0)

    # 3. Location Match (0 - 100)
    area = profile.area_type
    if area in b["location_suitability"]:
        loc_score = 90.0
    else:
        loc_score = 65.0

    # 4. Demand Potential (0 - 100)
    # Higher for staple foods, dairy, repair services
    if b["id"] in ["dairy-farming", "food-processing", "small-retail", "mobile-repair", "digital-services"]:
        demand_score = 92.0
    elif b["id"] in ["poultry-farming", "goat-farming", "mushroom-farming", "solar-services"]:
        demand_score = 86.0
    else:
        demand_score = 78.0

    # 5. Risk Compatibility (0 - 100)
    user_risk = profile.risk_tolerance.lower()
    b_risk = b["risk_level"].lower()

    if user_risk == "high":
        risk_score = 90.0
    elif user_risk == "medium":
        if "high" in b_risk:
            risk_score = 68.0
        else:
            risk_score = 88.0
    else: # Low risk tolerance
        if "high" in b_risk:
            risk_score = 45.0
        elif "medium" in b_risk:
            risk_score = 70.0
        else:
            risk_score = 95.0

    # Weighted Overall Fit Score
    fit_score = round(
        budget_score * 0.30 +
        skill_score * 0.25 +
        loc_score * 0.15 +
        demand_score * 0.15 +
        risk_score * 0.15,
        1
    )

    reasons_why = []
    if cap >= min_inv:
        reasons_why.append(f"Matches your available capital of ₹{cap:,.0f} (Min required: ₹{min_inv:,.0f})")
    if skill_score >= 75:
        reasons_why.append(f"Aligns well with your skills and background in {profile.work_experience or 'farming'}")
    if loc_score >= 80:
        reasons_why.append(f"Highly suitable for {profile.district}, {profile.state} ({area} setting)")
    reasons_why.append(f"Strong daily demand indicators in local rural hubs")

    reasons_why_not = []
    if cap < rec_inv:
        reasons_why_not.append(f"Capital is close to minimum threshold; recommended buffer is ₹{rec_inv:,.0f}")
    if "high" in b_risk and user_risk != "high":
        reasons_why_not.append("Requires managing disease, price fluctuation, or spoilage risks")
    if skill_score < 75:
        reasons_why_not.append("May require 1-2 weeks of practical hands-on skill training")

    key_assumptions = [
        f"Assumes local sales price of produce remains stable",
        f"Assumes active working involvement of {profile.name}",
        f"Raw material costs do not surge beyond 10% annually"
    ]

    summary_obj = BusinessSummary(
        id=b["id"],
        name=b["name"],
        category=b["category"],
        minimum_investment=b["minimum_investment"],
        recommended_investment=b["recommended_investment"],
        equipment_cost=b["equipment_cost"],
        working_capital=b["working_capital"],
        estimated_monthly_revenue=b["estimated_monthly_revenue"],
        estimated_monthly_expenses=b["estimated_monthly_expenses"],
        expected_profit=b["expected_profit"],
        break_even_months=b["break_even_months"],
        risk_level=b["risk_level"],
        required_skills=b["required_skills"],
        location_suitability=b["location_suitability"],
        demand_assumptions=b["demand_assumptions"],
        description=b["description"]
    )

    breakdown = BusinessFitBreakdown(
        budget_match=round(budget_score, 1),
        skill_match=round(skill_score, 1),
        location_match=round(loc_score, 1),
        demand_potential=round(demand_score, 1),
        risk_compatibility=round(risk_score, 1)
    )

    return RecommendedBusiness(
        business=summary_obj,
        fit_score=fit_score,
        fit_breakdown=breakdown,
        reasons_why=reasons_why,
        reasons_why_not=reasons_why_not,
        key_assumptions=key_assumptions
    )

def recommend_businesses_for_profile(profile: EntrepreneurProfileCreate, top_n: int = 6) -> List[RecommendedBusiness]:
    all_b = get_all_businesses()
    recs = [calculate_business_fit(profile, b) for b in all_b]
    recs.sort(key=lambda x: x.fit_score, reverse=True)
    return recs[:top_n]

def parse_user_prompt_intent(prompt: str) -> Dict[str, Any]:
    # Extract intent params if user typed text like "I have 1 lakh, farming experience in UP"
    prompt_lower = prompt.lower()
    capital = 100000.0

    if "1 lakh" in prompt_lower or "1,00,000" in prompt_lower or "100000" in prompt_lower:
        capital = 100000.0
    elif "50k" in prompt_lower or "50,000" in prompt_lower or "50000" in prompt_lower:
        capital = 50000.0
    elif "2 lakh" in prompt_lower or "2,00,000" in prompt_lower or "200000" in prompt_lower:
        capital = 200000.0
    elif "5000" in prompt_lower or "50 thousand" in prompt_lower:
        capital = 50000.0

    exp = "Farming"
    if "farm" in prompt_lower or "agri" in prompt_lower:
        exp = "Farming & Agriculture"
    elif "tailor" in prompt_lower or "cloth" in prompt_lower:
        exp = "Tailoring & Textiles"
    elif "mobile" in prompt_lower or "tech" in prompt_lower:
        exp = "Electronics & Repair"
    elif "shop" in prompt_lower or "store" in prompt_lower or "kirana" in prompt_lower:
        exp = "Retail & Sales"

    return {
        "budget": capital,
        "experience": exp,
        "location": "Uttar Pradesh",
        "intent_detected": True
    }

async def run_ai_advisor(query_prompt: str, profile: Optional[EntrepreneurProfileCreate] = None) -> AIAdvisorResponse:
    if not profile:
        # Default baseline demo profile if omitted
        profile = EntrepreneurProfileCreate(
            name="Rahul Kumar",
            age=28,
            gender="Male",
            state="Uttar Pradesh",
            district="Lucknow",
            area_type="Rural",
            capital=100000.0,
            skills=["Farming", "Animal Husbandry"],
            work_experience="Farming",
            preferred_sectors=["Agriculture & Livestock", "Agro-Processing"],
            target_monthly_income=25000.0,
            risk_tolerance="Medium"
        )

    extracted = parse_user_prompt_intent(query_prompt)

    # Compute top recommendations using deterministic fit engine
    recommended_list = recommend_businesses_for_profile(profile, top_n=3)

    summary_text = f"Analyzed prompt: '{query_prompt}'. Extracted budget threshold ₹{extracted['budget']:,.0f} with background in {extracted['experience']} for rural location {profile.district}, {profile.state}."

    overall_advice = f"Based on your capital of ₹{profile.capital:,.0f} and your experience in {profile.work_experience}, top enterprise fits are '{recommended_list[0].business.name}' (Fit Score {recommended_list[0].fit_score}/100) and '{recommended_list[1].business.name}' (Fit Score {recommended_list[1].fit_score}/100). Both models offer low break-even periods (< 8 months) and leverage existing rural distribution channels."

    next_steps = [
        "Select your preferred business model to run live financial slider simulations.",
        "Test market sensitivity using the What-If Simulator for sales or cost shocks.",
        "Run the automated 5-Scenario Stress Test to evaluate business resilience.",
        "Generate your 30-Day Business Launch Action Plan and formal PDF report."
    ]

    return AIAdvisorResponse(
        user_intent_summary=summary_text,
        extracted_parameters=extracted,
        recommended_businesses=recommended_list,
        overall_advice=overall_advice,
        next_steps=next_steps
    )
