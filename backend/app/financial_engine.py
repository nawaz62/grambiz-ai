"""
Pure Python Financial Calculation Engine for GRAMBIZ AI.
Performs deterministic, accurate financial modeling, break-even analysis, debt servicing, cash flows, and ROI estimations.
DO NOT use LLM for these arithmetic operations.
"""

import math
from typing import Dict, Any, List
from app.schemas import FinancialInputs, FinancialResults

def calculate_financials(inputs: FinancialInputs) -> FinancialResults:
    # 1. Apply demand change & cost inflation adjustments
    demand_factor = 1.0 + (inputs.demand_change_percent / 100.0)
    inflation_factor = 1.0 + (inputs.cost_inflation_percent / 100.0)

    adjusted_monthly_sales = max(0.0, inputs.monthly_sales * demand_factor)
    adjusted_monthly_base_expenses = max(0.0, inputs.monthly_expenses * inflation_factor)

    # 2. Variable vs Fixed cost breakdown
    # If explicit fixed costs provided, use it; otherwise compute from variable percent
    var_percent = min(100.0, max(0.0, inputs.variable_cost_percent))
    monthly_variable_costs = adjusted_monthly_sales * (var_percent / 100.0)

    if inputs.fixed_costs > 0:
        monthly_fixed_costs = inputs.fixed_costs * inflation_factor
    else:
        monthly_fixed_costs = max(0.0, adjusted_monthly_base_expenses - monthly_variable_costs)

    # Workforce cost consideration
    workers_cost = max(0, inputs.workers_count - 1) * 8000.0 * inflation_factor # ₹8,000 per extra worker
    monthly_fixed_costs += workers_cost

    total_monthly_expenses = monthly_variable_costs + monthly_fixed_costs

    # 3. Profitability Metrics
    monthly_revenue = adjusted_monthly_sales
    gross_profit = max(0.0, monthly_revenue - monthly_variable_costs)
    monthly_net_profit = monthly_revenue - total_monthly_expenses
    annual_net_profit = monthly_net_profit * 12.0

    # 4. Loan EMI Calculation (Reducing Balance Formula)
    monthly_loan_emi = 0.0
    if inputs.loan_amount > 0 and inputs.interest_rate_annual > 0 and inputs.loan_tenure_years > 0:
        r = (inputs.interest_rate_annual / 100.0) / 12.0
        n = int(inputs.loan_tenure_years * 12)
        if r > 0:
            monthly_loan_emi = inputs.loan_amount * r * math.pow(1 + r, n) / (math.pow(1 + r, n) - 1)

    cash_flow_after_emi = monthly_net_profit - monthly_loan_emi

    # 5. Break-Even Analysis
    # Contribution Margin Ratio (CMR) = (Revenue - Variable Costs) / Revenue
    if monthly_revenue > 0:
        cm_ratio = (monthly_revenue - monthly_variable_costs) / monthly_revenue
    else:
        cm_ratio = 0.0

    if cm_ratio > 0:
        break_even_revenue = monthly_fixed_costs / cm_ratio
    else:
        break_even_revenue = 0.0

    total_initial_capital = max(1.0, inputs.initial_investment)

    if monthly_net_profit > 0:
        break_even_months = round(total_initial_capital / monthly_net_profit, 1)
        payback_period_months = break_even_months
    else:
        break_even_months = 999.0 # Signals infinite or unviable
        payback_period_months = 999.0

    # 6. ROI Percent (Annualized)
    roi_percent = round((annual_net_profit / total_initial_capital) * 100.0, 2)

    # 7. Debt Service Coverage Ratio (DSCR)
    # DSCR = Net Operating Profit / Total Debt Service (EMI)
    if monthly_loan_emi > 0:
        dscr = round(monthly_net_profit / monthly_loan_emi, 2)
    else:
        dscr = 99.0 # High coverage (no debt)

    # 8. 12-Month Projections Timeline
    projection_12_months: List[Dict[str, float]] = []
    monthly_growth_rate = (inputs.growth_rate_annual / 100.0) / 12.0
    cumulative_cash = -total_initial_capital

    for m in range(1, 13):
        rev = monthly_revenue * math.pow(1 + monthly_growth_rate, m - 1)
        var_cost = rev * (var_percent / 100.0)
        fix_cost = monthly_fixed_costs
        tot_exp = var_cost + fix_cost
        profit = rev - tot_exp
        cash_flow = profit - monthly_loan_emi
        cumulative_cash += cash_flow

        projection_12_months.append({
            "month": m,
            "revenue": round(rev, 2),
            "expenses": round(tot_exp, 2),
            "net_profit": round(profit, 2),
            "cash_flow": round(cash_flow, 2),
            "cumulative_cash": round(cumulative_cash, 2)
        })

    return FinancialResults(
        monthly_revenue=round(monthly_revenue, 2),
        monthly_variable_costs=round(monthly_variable_costs, 2),
        monthly_fixed_costs=round(monthly_fixed_costs, 2),
        monthly_expenses=round(total_monthly_expenses, 2),
        gross_profit=round(gross_profit, 2),
        monthly_net_profit=round(monthly_net_profit, 2),
        annual_net_profit=round(annual_net_profit, 2),
        monthly_loan_emi=round(monthly_loan_emi, 2),
        cash_flow_after_emi=round(cash_flow_after_emi, 2),
        break_even_revenue=round(break_even_revenue, 2),
        break_even_months=break_even_months,
        roi_percent=roi_percent,
        payback_period_months=payback_period_months,
        dscr=dscr,
        projection_12_months=projection_12_months
    )
