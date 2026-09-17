from fastapi import APIRouter, Query, HTTPException
from typing import List

from app.schemas import (
    FinancialInputs,
    FinancialResults,
    ScenarioModifier,
    ScenarioComparisonResult,
    StressTestResult,
    RiskRadarResult,
    GovernmentScheme,
    BusinessActionPlan,
    ActionPlanStep
)
from app.financial_engine import calculate_financials
from app.risk_engine import calculate_risk_radar
from app.stress_test_engine import run_business_stress_test
from app.schemes_data import get_all_schemes
from app.business_data import get_business_by_id

router = APIRouter(prefix="/api/finance", tags=["Financial Engine & Simulators"])

@router.post("/calculate", response_model=FinancialResults)
def calculate_financial_model(inputs: FinancialInputs):
    return calculate_financials(inputs)

@router.post("/what-if", response_model=ScenarioComparisonResult)
def run_what_if_scenario(
    base_inputs: FinancialInputs,
    modifier: ScenarioModifier
):
    # Baseline calculations
    before_res = calculate_financials(base_inputs)

    # Modify inputs based on scenario type
    mod_inputs = FinancialInputs(**base_inputs.dict())

    scenario_label = "Custom What-If Scenario"
    ai_comment = "The business demonstrates key sensitivity to sales and cost changes."

    if modifier.scenario_type == "sales_down_20":
        scenario_label = "Sales Decreased by 20%"
        mod_inputs.demand_change_percent = -20.0
        ai_comment = "Under a 20% sales drop, net monthly profit compresses. Consider keeping initial fixed costs low to maintain positive cash flow buffer."
    elif modifier.scenario_type == "sales_up_20":
        scenario_label = "Sales Increased by 20%"
        mod_inputs.demand_change_percent = 20.0
        ai_comment = "A 20% boost in sales shortens your payback period significantly and accelerates positive cash flow accumulation."
    elif modifier.scenario_type == "raw_material_up_15":
        scenario_label = "Raw Material / Cost Inflation (+15%)"
        mod_inputs.cost_inflation_percent = 15.0
        ai_comment = "Raw material price increases erode gross margin. Consider bulk purchasing during harvest season or negotiating group supplier contracts."
    elif modifier.scenario_type == "demand_down_30":
        scenario_label = "Severe Local Demand Slump (-30%)"
        mod_inputs.demand_change_percent = -30.0
        ai_comment = "A 30% demand slump puts pressure on break-even revenue. Scaling down worker count or offering secondary services helps stabilize profitability."
    elif modifier.scenario_type == "investment_up_50k":
        scenario_label = "Additional Capital Investment (+₹50,000)"
        mod_inputs.initial_investment += 50000.0
        mod_inputs.equipment_cost += 35000.0
        mod_inputs.working_capital += 15000.0
        mod_inputs.monthly_sales *= 1.25 # 25% capacity boost
        ai_comment = "Adding ₹50k capital increases production capacity by 25%, resulting in higher long-term annual net profit."
    elif modifier.scenario_type == "loan_added":
        scenario_label = "MUDRA Loan Added (₹50,000 @ 9.5%)"
        mod_inputs.loan_amount = 50000.0
        mod_inputs.interest_rate_annual = 9.5
        mod_inputs.loan_tenure_years = 3.0
        ai_comment = "Taking a ₹50k MUDRA loan adds ₹1,602/month EMI debt service, but preserves your personal emergency cash savings."

    after_res = calculate_financials(mod_inputs)

    rev_chg = round(((after_res.monthly_revenue - before_res.monthly_revenue) / max(1.0, before_res.monthly_revenue)) * 100.0, 1)
    prof_chg = round(((after_res.monthly_net_profit - before_res.monthly_net_profit) / max(1.0, abs(before_res.monthly_net_profit))) * 100.0, 1)
    be_chg = round(after_res.break_even_months - before_res.break_even_months, 1)

    return ScenarioComparisonResult(
        scenario_name=scenario_label,
        before=before_res,
        after=after_res,
        revenue_change_percent=rev_chg,
        profit_change_percent=prof_chg,
        break_even_change_months=be_chg,
        risk_change_score=5.0 if prof_chg < 0 else -5.0,
        ai_explanation=ai_comment
    )

@router.post("/stress-test", response_model=StressTestResult)
def calculate_stress_test(
    business_id: str = Query("dairy-farming"),
    business_name: str = Query("Dairy Farming"),
    base_inputs: FinancialInputs = None
):
    if not base_inputs:
        base_inputs = FinancialInputs(
            initial_investment=150000.0,
            equipment_cost=45000.0,
            working_capital=35000.0,
            monthly_sales=42000.0,
            monthly_expenses=22000.0,
            variable_cost_percent=40.0
        )
    return run_business_stress_test(business_id, business_name, base_inputs)

@router.post("/risk-radar", response_model=RiskRadarResult)
def get_risk_radar(
    inputs: FinancialInputs,
    capital_available: float = Query(100000.0)
):
    fin_results = calculate_financials(inputs)
    return calculate_risk_radar(inputs, fin_results, capital_available)

@router.get("/schemes", response_model=List[GovernmentScheme])
def get_government_schemes():
    raw_schemes = get_all_schemes()
    return [GovernmentScheme(**s) for s in raw_schemes]

@router.get("/action-plan/{business_id}", response_model=BusinessActionPlan)
def get_action_plan(business_id: str):
    b = get_business_by_id(business_id)

    phases = [
        ActionPlanStep(
            days="Day 1–3",
            phase_name="Local Demand & Location Validation",
            tasks=[
                f"Visit 5 local buyers / milk collection centers / traders in {b['name']} category",
                "Survey local selling prices and daily requirement volumes",
                "Verify shed/space availability and water/power connectivity"
            ],
            milestone="Signed pre-commitment / letter of intent from at least 1 local buyer"
        ),
        ActionPlanStep(
            days="Day 4–7",
            phase_name="Supplier Identification & Quotations",
            tasks=[
                "Obtain 2 competitive quotations for primary machinery and equipment",
                "Identify reliable local feed, seed, or raw material suppliers",
                "Estimate exact transportation and installation costs"
            ],
            milestone="Finalized equipment vendor list and working capital budget"
        ),
        ActionPlanStep(
            days="Day 8–12",
            phase_name="Operating Budget & Scheme Application",
            tasks=[
                "Finalize financial model using GRAMBIZ AI Financial Simulator",
                "Prepare Aadhaar, PAN, Bank Passbook, and Rural Certificate documents",
                "Submit online application for PMEGP or MUDRA loan scheme at local bank branch"
            ],
            milestone="Loan application submitted / Self-funding capital earmarked"
        ),
        ActionPlanStep(
            days="Day 13–15",
            phase_name="Resource & Equipment Setup",
            tasks=[
                "Procure baseline machinery/animals/tools",
                "Set up shed/workshop infrastructure and safety measures",
                "Conduct initial trial run of equipment"
            ],
            milestone="Ready-to-operate physical infrastructure"
        ),
        ActionPlanStep(
            days="Day 16–20",
            phase_name="Skill Refinement & Pilot Production",
            tasks=[
                "Complete 3-day practical training at local Krishi Vigyan Kendra (KVK)",
                "Initiate low-volume pilot batch production",
                "Collect first customer feedback on product quality"
            ],
            milestone="Successful batch trial with zero quality defects"
        ),
        ActionPlanStep(
            days="Day 21–25",
            phase_name="Commercial Launch & Route Distribution",
            tasks=[
                "Begin full daily commercial operations",
                "Establish daily delivery or collection schedule with buyers",
                "Set up physical ledger or mobile notebook app for sales tracking"
            ],
            milestone="First commercial revenue generated"
        ),
        ActionPlanStep(
            days="Day 26–30",
            phase_name="Monthly Profit Review & Scaling Decision",
            tasks=[
                "Calculate first month net operating profit and break-even status",
                "Review feed/cost inflation against initial budget",
                "Decide whether to reinvest profit into expanding production capacity"
            ],
            milestone="First monthly financial audit completed"
        )
    ]

    return BusinessActionPlan(
        business_id=b["id"],
        business_name=b["name"],
        total_days=30,
        phases=phases,
        critical_success_factors=[
            "Direct personal supervision during initial 30 days",
            "Maintaining 20% working capital buffer for unexpected cost spikes",
            "Strict adherence to hygiene and quality standards"
        ]
    )
