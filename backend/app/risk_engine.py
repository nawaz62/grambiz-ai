"""
7-Axis Risk Scoring Engine for GRAMBIZ AI.
Evaluates Market, Demand, Investment, Operating, Competition, Cost, and Financial risks based on financial and profile parameters.
"""

from typing import Dict, Any, List
from app.schemas import RiskRadarResult, RiskCategoryDetail, FinancialResults, FinancialInputs

def calculate_risk_radar(fin_inputs: FinancialInputs, fin_results: FinancialResults, capital_available: float = 100000.0) -> RiskRadarResult:
    # 1. Financial Risk Score
    # Higher debt-to-investment ratio, low DSCR, or negative cash flow increases score
    debt_ratio = (fin_inputs.loan_amount / max(1.0, fin_inputs.initial_investment)) * 100.0
    if fin_results.cash_flow_after_emi <= 0:
        fin_risk = 85.0
    elif fin_results.dscr < 1.25:
        fin_risk = 70.0
    elif debt_ratio > 50:
        fin_risk = 55.0
    else:
        fin_risk = 28.0

    # 2. Investment Risk Score
    # Capital required vs available capital
    cap_ratio = fin_inputs.initial_investment / max(1.0, capital_available)
    if cap_ratio > 1.5:
        inv_risk = 80.0
    elif cap_ratio > 1.0:
        inv_risk = 60.0
    elif cap_ratio > 0.7:
        inv_risk = 40.0
    else:
        inv_risk = 22.0

    # 3. Demand Risk Score
    # Based on break-even timeline & net margin
    margin = (fin_results.monthly_net_profit / max(1.0, fin_results.monthly_revenue)) * 100.0
    if fin_results.break_even_months > 18 or margin < 10:
        demand_risk = 75.0
    elif fin_results.break_even_months > 10:
        demand_risk = 52.0
    else:
        demand_risk = 30.0

    # 4. Operating Risk Score
    # Variable cost burden & worker count dependency
    if fin_inputs.variable_cost_percent > 65:
        op_risk = 68.0
    elif fin_inputs.workers_count > 3:
        op_risk = 55.0
    else:
        op_risk = 35.0

    # 5. Cost Risk Score
    # Sensitivity to raw material / inflation
    if fin_inputs.cost_inflation_percent > 10:
        cost_risk = 70.0
    else:
        cost_risk = 38.0

    # 6. Competition Risk Score
    comp_risk = 42.0 # Baseline moderate competition for general micro enterprises

    # 7. Market Risk Score
    # Weighted aggregate
    market_risk = round((demand_risk * 0.4 + comp_risk * 0.3 + cost_risk * 0.3), 1)

    categories = {
        "Market Risk": market_risk,
        "Demand Risk": demand_risk,
        "Investment Risk": inv_risk,
        "Operating Risk": op_risk,
        "Competition Risk": comp_risk,
        "Cost Risk": cost_risk,
        "Financial Risk": fin_risk
    }

    avg_score = round(sum(categories.values()) / len(categories), 1)

    if avg_score >= 65:
        overall_level = "HIGH"
    elif avg_score >= 40:
        overall_level = "MEDIUM"
    else:
        overall_level = "LOW"

    details: List[RiskCategoryDetail] = [
        RiskCategoryDetail(
            category="Market Risk",
            score=market_risk,
            level="High" if market_risk >= 60 else ("Medium" if market_risk >= 40 else "Low"),
            key_drivers=["Local consumer purchasing power", "Aggregator price control"],
            mitigation_tips=["Diversify buyer contacts", "Sell directly to consumers where possible"]
        ),
        RiskCategoryDetail(
            category="Demand Risk",
            score=demand_risk,
            level="High" if demand_risk >= 60 else ("Medium" if demand_risk >= 40 else "Low"),
            key_drivers=["Seasonal fluctuations in village demand", "Break-even target reliance"],
            mitigation_tips=["Pre-book orders before harvesting/manufacturing", "Offer value-added packaging"]
        ),
        RiskCategoryDetail(
            category="Investment Risk",
            score=inv_risk,
            level="High" if inv_risk >= 60 else ("Medium" if inv_risk >= 40 else "Low"),
            key_drivers=["Initial capital vs available savings ratio"],
            mitigation_tips=["Start with leased equipment", "Utilize government subsidy schemes like PMEGP/Mudra"]
        ),
        RiskCategoryDetail(
            category="Operating Risk",
            score=op_risk,
            level="High" if op_risk >= 60 else ("Medium" if op_risk >= 40 else "Low"),
            key_drivers=["Equipment maintenance cost", "Perishable stock spoilage risk"],
            mitigation_tips=["Maintain cold storage / proper sheds", "Take basic equipment insurance"]
        ),
        RiskCategoryDetail(
            category="Competition Risk",
            score=comp_risk,
            level="High" if comp_risk >= 60 else ("Medium" if comp_risk >= 40 else "Low"),
            key_drivers=["Unorganized local suppliers", "Price undercutting"],
            mitigation_tips=["Build strong personal relationship with local buyers", "Focus on quality and freshness"]
        ),
        RiskCategoryDetail(
            category="Cost Risk",
            score=cost_risk,
            level="High" if cost_risk >= 60 else ("Medium" if cost_risk >= 40 else "Low"),
            key_drivers=["Raw material & cattle feed price inflation", "Fuel/Electricity rate hikes"],
            mitigation_tips=["Bulk purchase fodder/raw material during peak harvest", "Use solar power backup"]
        ),
        RiskCategoryDetail(
            category="Financial Risk",
            score=fin_risk,
            level="High" if fin_risk >= 60 else ("Medium" if fin_risk >= 40 else "Low"),
            key_drivers=["Monthly EMI repayment pressure", "Debt service coverage ratio"],
            mitigation_tips=["Maintain a 2-month emergency working capital reserve"]
        )
    ]

    ai_summary = f"Overall business risk is classified as {overall_level} ({avg_score}/100). The primary risk drivers stem from {details[0].category} ({details[0].score}) and {details[1].category} ({details[1].score}). Maintaining adequate emergency reserves and verifying local buyer commitments can significantly de-risk operations."

    return RiskRadarResult(
        overall_risk_score=avg_score,
        overall_risk_level=overall_level,
        categories=categories,
        details=details,
        ai_summary=ai_summary
    )
