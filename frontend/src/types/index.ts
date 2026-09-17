export interface User {
  id: number;
  email: string;
  full_name: string;
  is_demo: boolean;
}

export interface EntrepreneurProfile {
  name: string;
  age?: number;
  gender?: string;
  state: string;
  district: string;
  area_type: string;
  language: string;

  capital: number;
  monthly_income: number;
  existing_savings: number;
  loan_requirement: number;
  existing_business?: string;

  skills: string[];
  work_experience?: string;
  education?: string;
  business_interests: string[];

  preferred_sectors: string[];
  target_monthly_income: number;
  risk_tolerance: string;
  business_goal?: string;
}

export interface BusinessSummary {
  id: string;
  name: string;
  category: string;
  minimum_investment: number;
  recommended_investment: number;
  equipment_cost: number;
  working_capital: number;
  estimated_monthly_revenue: number;
  estimated_monthly_expenses: number;
  expected_profit: number;
  break_even_months: number;
  risk_level: string;
  required_skills: string[];
  location_suitability: string[];
  demand_assumptions: string;
  description: string;
}

export interface BusinessFitBreakdown {
  budget_match: number;
  skill_match: number;
  location_match: number;
  demand_potential: number;
  risk_compatibility: number;
}

export interface RecommendedBusiness {
  business: BusinessSummary;
  fit_score: number;
  fit_breakdown: BusinessFitBreakdown;
  reasons_why: string[];
  reasons_why_not: string[];
  key_assumptions: string[];
}

export interface FinancialInputs {
  initial_investment: number;
  equipment_cost: number;
  working_capital: number;
  monthly_sales: number;
  monthly_expenses: number;
  variable_cost_percent: number;
  fixed_costs: number;
  growth_rate_annual: number;
  demand_change_percent: number;
  cost_inflation_percent: number;
  loan_amount: number;
  interest_rate_annual: number;
  loan_tenure_years: number;
  workers_count: number;
}

export interface MonthProjection {
  month: number;
  revenue: number;
  expenses: number;
  net_profit: number;
  cash_flow: number;
  cumulative_cash: number;
}

export interface FinancialResults {
  monthly_revenue: number;
  monthly_variable_costs: number;
  monthly_fixed_costs: number;
  monthly_expenses: number;
  gross_profit: number;
  monthly_net_profit: number;
  annual_net_profit: number;
  monthly_loan_emi: number;
  cash_flow_after_emi: number;
  break_even_revenue: number;
  break_even_months: number;
  roi_percent: number;
  payback_period_months: number;
  dscr: number;
  projection_12_months: MonthProjection[];
}

export interface ScenarioComparisonResult {
  scenario_name: string;
  before: FinancialResults;
  after: FinancialResults;
  revenue_change_percent: number;
  profit_change_percent: number;
  break_even_change_months: number;
  risk_change_score: number;
  ai_explanation: string;
}

export interface StressTestScenarioResult {
  scenario_id: string;
  scenario_name: string;
  description: string;
  monthly_revenue: number;
  monthly_profit: number;
  break_even_months: number;
  survived: boolean;
  status_label: string;
}

export interface StressTestResult {
  business_id: string;
  business_name: string;
  resilience_score: number;
  resilience_grade: string;
  survival_matrix: StressTestScenarioResult[];
  cash_flow_risk: string;
  break_even_risk: string;
  ai_verdict: string;
}

export interface RiskCategoryDetail {
  category: string;
  score: number;
  level: string;
  key_drivers: string[];
  mitigation_tips: string[];
}

export interface RiskRadarResult {
  overall_risk_score: number;
  overall_risk_level: string;
  categories: Record<string, number>;
  details: RiskCategoryDetail[];
  ai_summary: string;
}

export interface DistrictMarketIntelligence {
  state: string;
  district: string;
  business_category: string;
  opportunity_score: number;
  competition_level: string;
  input_availability: string;
  demand_indicator: string;
  local_advantages: string[];
  potential_risks: string[];
  key_hubs: string[];
}

export interface GovernmentScheme {
  id: string;
  name: string;
  department: string;
  purpose: string;
  max_subsidy_or_loan: string;
  eligibility_criteria: string[];
  required_documents: string[];
  official_source_url: string;
  why_relevant: string;
}

export interface ActionPlanStep {
  days: string;
  phase_name: string;
  tasks: string[];
  milestone: string;
}

export interface BusinessActionPlan {
  business_id: string;
  business_name: string;
  total_days: number;
  phases: ActionPlanStep[];
  critical_success_factors: string[];
}
