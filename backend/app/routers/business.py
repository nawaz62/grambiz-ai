from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from app.business_data import get_all_businesses, get_business_by_id
from app.ai_advisor import recommend_businesses_for_profile
from app.schemas import (
    BusinessSummary,
    EntrepreneurProfileCreate,
    RecommendedBusiness,
    DistrictMarketIntelligence
)

router = APIRouter(prefix="/api/business", tags=["Business Catalog & Market"])

@router.get("/catalog", response_model=List[BusinessSummary])
def get_catalog():
    all_b = get_all_businesses()
    results = []
    for b in all_b:
        results.append(BusinessSummary(
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
        ))
    return results

@router.get("/catalog/{business_id}", response_model=BusinessSummary)
def get_business_detail(business_id: str):
    b = get_business_by_id(business_id)
    return BusinessSummary(
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

@router.post("/recommend", response_model=List[RecommendedBusiness])
def recommend_businesses(profile: EntrepreneurProfileCreate, limit: int = Query(6)):
    return recommend_businesses_for_profile(profile, top_n=limit)

@router.get("/market-intelligence", response_model=DistrictMarketIntelligence)
def get_market_intelligence(
    state: str = Query("Uttar Pradesh"),
    district: str = Query("Lucknow"),
    business_id: str = Query("dairy-farming")
):
    b = get_business_by_id(business_id)
    return DistrictMarketIntelligence(
        state=state,
        district=district,
        business_category=b["category"],
        opportunity_score=88.5,
        competition_level="Moderate",
        input_availability="Abundant (Local fodder markets & Veterinary clinics)",
        demand_indicator="Growing (+12% annual rural-urban consumption growth)",
        local_advantages=[
            "Strong road connectivity to nearby milk collection chilling centers",
            "High availability of skilled agricultural labor in sub-districts",
            "Active state livestock promotion programs"
        ],
        potential_risks=[
            "Summer milk yield drops due to high temperatures",
            "Fodder price inflation during non-harvest months"
        ],
        key_hubs=["Bakshi Ka Talab", "Mohanlalganj", "Chinhat", "Malihabad"]
    )
