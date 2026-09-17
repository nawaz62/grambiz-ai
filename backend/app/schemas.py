from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_demo: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Profile Schemas
class EntrepreneurProfileCreate(BaseModel):
    name: str
    age: Optional[int] = 30
    gender: Optional[str] = "Male"
    state: str
    district: str
    area_type: str = "Rural"
    language: str = "Hindi"

    capital: float
    monthly_income: float = 0
    existing_savings: float = 0
    loan_requirement: float = 0
    existing_business: Optional[str] = None

    skills: List[str] = []
    work_experience: Optional[str] = "Farming"
    education: Optional[str] = "Secondary School"
    business_interests: List[str] = []

    preferred_sectors: List[str] = []
    target_monthly_income: float = 25000
    risk_tolerance: str = "Medium"
    business_goal: Optional[str] = "Start a stable micro enterprise"

class EntrepreneurProfileResponse(EntrepreneurProfileCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Business & Recommendation Schemas
class BusinessSummary(BaseModel):
    id: str
    name: str
    category: str
    minimum_investment: float
    recommended_investment: float
    equipment_cost: float
    working_capital: float
    estimated_monthly_revenue: float
    estimated_monthly_expenses: float
    expected_profit: float
    break_even_months: float
    risk_level: str
    required_skills: List[str]
    location_suitability: List[str]
    demand_assumptions: str
    description: str

class BusinessFitBreakdown(BaseModel):
    budget_match: float
    skill_match: float
    location_match: float
    demand_potential: float
    risk_compatibility: float

class RecommendedBusiness(BaseModel):
    business: BusinessSummary
    fit_score: float
    fit_breakdown: BusinessFitBreakdown
    reasons_why: List[str]
    reasons_why_not: List[str]
    key_assumptions: List[str]

# Financial Calculation & Simulator Schemas
class FinancialInputs(BaseModel):
    initial_investment: float
    equipment_cost: float
    working_capital: float
    monthly_sales: float
    monthly_expenses: float
    variable_cost_percent: float = 40.0
    fixed_costs: float = 0.0
    growth_rate_annual: float = 10.0
    demand_change_percent: float = 0.0
    cost_inflation_percent: float = 0.0
    loan_amount: float = 0.0
    interest_rate_annual: float = 9.5
    loan_tenure_years: float = 5.0
    workers_count: int = 1

class FinancialResults(BaseModel):
    monthly_revenue: float
    monthly_variable_costs: float
    monthly_fixed_costs: float
    monthly_expenses: float
    gross_profit: float
    monthly_net_profit: float
    annual_net_profit: float
    monthly_loan_emi: float
    cash_flow_after_emi: float
    break_even_revenue: float
    break_even_months: float
    roi_percent: float
    payback_period_months: float
    dscr: float # Debt Service Coverage Ratio
    projection_12_months: List[Dict[str, float]]

# What-If Scenario Schemas
class ScenarioModifier(BaseModel):
    scenario_type: str # sales_down_20, sales_up_20, raw_material_up_15, demand_down_30, investment_up_50k, loan_added, custom
    sales_change_percent: float = 0.0
    cost_change_percent: float = 0.0
    investment_change: float = 0.0
    loan_added_amount: float = 0.0

class ScenarioComparisonResult(BaseModel):
    scenario_name: str
    before: FinancialResults
    after: FinancialResults
    revenue_change_percent: float
    profit_change_percent: float
    break_even_change_months: float
    risk_change_score: float
    ai_explanation: str

# Stress Test Schemas
class StressTestScenarioResult(BaseModel):
    scenario_id: str
    scenario_name: str
    description: str
    monthly_revenue: float
    monthly_profit: float
    break_even_months: float
    survived: bool
    status_label: str # Safe / Vulnerable / Critical

class StressTestResult(BaseModel):
    business_id: str
    business_name: str
    resilience_score: float # 0 to 100
    resilience_grade: str # High / Moderate / Low
    survival_matrix: List[StressTestScenarioResult]
    cash_flow_risk: str
    break_even_risk: str
    ai_verdict: str

# Risk Radar Schemas
class RiskCategoryDetail(BaseModel):
    category: str
    score: float # 0 to 100
    level: str # Low / Medium / High
    key_drivers: List[str]
    mitigation_tips: List[str]

class RiskRadarResult(BaseModel):
    overall_risk_score: float
    overall_risk_level: str # LOW / MEDIUM / HIGH
    categories: Dict[str, float]
    details: List[RiskCategoryDetail]
    ai_summary: str

# Local Market Intelligence Schemas
class DistrictMarketIntelligence(BaseModel):
    state: str
    district: str
    business_category: str
    opportunity_score: float
    competition_level: str # Low / Moderate / High
    input_availability: str # Abundant / Moderate / Scarce
    demand_indicator: str # Growing / Stable / Seasonal
    local_advantages: List[str]
    potential_risks: List[str]
    key_hubs: List[str]

# Government Scheme Schemas
class GovernmentScheme(BaseModel):
    id: str
    name: str
    department: str
    purpose: str
    max_subsidy_or_loan: str
    eligibility_criteria: List[str]
    required_documents: List[str]
    official_source_url: str
    why_relevant: str

# AI Prompt Request & Structured Response
class AIAdvisorQuery(BaseModel):
    user_prompt: str
    profile: Optional[EntrepreneurProfileCreate] = None

class AIAdvisorResponse(BaseModel):
    user_intent_summary: str
    extracted_parameters: Dict[str, Any]
    recommended_businesses: List[RecommendedBusiness]
    overall_advice: str
    next_steps: List[str]

# Action Plan Schema
class ActionPlanStep(BaseModel):
    days: str
    phase_name: str
    tasks: List[str]
    milestone: str

class BusinessActionPlan(BaseModel):
    business_id: str
    business_name: str
    total_days: int = 30
    phases: List[ActionPlanStep]
    critical_success_factors: List[str]

# Full Business Plan Report Schema
class FullBusinessPlanReport(BaseModel):
    generated_at: str
    profile: EntrepreneurProfileCreate
    selected_business: BusinessSummary
    financials: FinancialResults
    risk_radar: RiskRadarResult
    stress_test: StressTestResult
    market_intelligence: DistrictMarketIntelligence
    relevant_schemes: List[GovernmentScheme]
    action_plan: BusinessActionPlan
    disclaimer: str
