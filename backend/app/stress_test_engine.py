"""
Business Stress Test Engine for GRAMBIZ AI ("Can Your Business Survive?").
Simulates 5 market shock scenarios and calculates Business Resilience Score (0–100).
"""

from typing import List
from app.schemas import FinancialInputs, StressTestResult, StressTestScenarioResult
from app.financial_engine import calculate_financials

def run_business_stress_test(business_id: str, business_name: str, base_inputs: FinancialInputs) -> StressTestResult:
    scenarios = [
        {
            "id": "scenario-1",
            "name": "Scenario 1: Normal Market Baseline",
            "desc": "Expected operational conditions with baseline sales and expenses.",
            "demand_chg": 0.0,
            "cost_chg": 0.0
        },
        {
            "id": "scenario-2",
            "name": "Scenario 2: Moderate Demand Drop (-20%)",
            "desc": "Local market slowdown or seasonal reduction in sales volume.",
            "demand_chg": -20.0,
            "cost_chg": 0.0
        },
        {
            "id": "scenario-3",
            "name": "Scenario 3: Severe Demand Shock (-40%)",
            "desc": "Drought, economic distress, or entry of heavy local competitors.",
            "demand_chg": -40.0,
            "cost_chg": 0.0
        },
        {
            "id": "scenario-4",
            "name": "Scenario 4: Raw Material & Feed Inflation (+20%)",
            "desc": "Surge in fuel, raw material, or fodder prices.",
            "demand_chg": 0.0,
            "cost_chg": 20.0
        },
        {
            "id": "scenario-5",
            "name": "Scenario 5: Combined Market Shock (-30% Rev, +15% Cost)",
            "desc": "Simultaneous decline in customer demand and increase in input costs.",
            "demand_chg": -30.0,
            "cost_chg": 15.0
        }
    ]

    results: List[StressTestScenarioResult] = []
    survived_count = 0
    total_scenarios = len(scenarios)

    for sc in scenarios:
        mod_inputs = FinancialInputs(
            initial_investment=base_inputs.initial_investment,
            equipment_cost=base_inputs.equipment_cost,
            working_capital=base_inputs.working_capital,
            monthly_sales=base_inputs.monthly_sales,
            monthly_expenses=base_inputs.monthly_expenses,
            variable_cost_percent=base_inputs.variable_cost_percent,
            fixed_costs=base_inputs.fixed_costs,
            growth_rate_annual=base_inputs.growth_rate_annual,
            demand_change_percent=sc["demand_chg"],
            cost_inflation_percent=sc["cost_chg"],
            loan_amount=base_inputs.loan_amount,
            interest_rate_annual=base_inputs.interest_rate_annual,
            loan_tenure_years=base_inputs.loan_tenure_years,
            workers_count=base_inputs.workers_count
        )

        fin = calculate_financials(mod_inputs)
        is_survived = fin.cash_flow_after_emi > 0

        if is_survived:
            survived_count += 1
            if fin.monthly_net_profit > 10000:
                label = "Safe & Profitable"
            else:
                label = "Vulnerable (Low Margin)"
        else:
            label = "Critical (Cash Negative)"

        results.append(StressTestScenarioResult(
            scenario_id=sc["id"],
            scenario_name=sc["name"],
            description=sc["desc"],
            monthly_revenue=fin.monthly_revenue,
            monthly_profit=fin.monthly_net_profit,
            break_even_months=fin.break_even_months,
            survived=is_survived,
            status_label=label
        ))

    # Resilience Score Calculation (0 - 100)
    resilience_score = round((survived_count / total_scenarios) * 100.0 * 0.7 + (results[4].monthly_profit > 0) * 30.0, 1)

    if resilience_score >= 80:
        grade = "High Resilience"
    elif resilience_score >= 50:
        grade = "Moderate Resilience"
    else:
        grade = "Low Resilience (Fragile)"

    verdict = f"Your business '{business_name}' achieves a Business Resilience Score of {resilience_score}/100 ({grade}). It survived {survived_count} out of 5 stress scenarios. Under severe combined shock, profit margin compresses to ₹{results[4].monthly_profit:,.0f}/month. Consider starting with lean fixed costs to improve buffer."

    return StressTestResult(
        business_id=business_id,
        business_name=business_name,
        resilience_score=resilience_score,
        resilience_grade=grade,
        survival_matrix=results,
        cash_flow_risk="Low Risk" if survived_count >= 4 else "Moderate to High Risk",
        break_even_risk="Achievable within 8 months" if results[0].break_even_months <= 8 else "Extended Payback",
        ai_verdict=verdict
    )
