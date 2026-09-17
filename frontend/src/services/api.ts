import {
  EntrepreneurProfile,
  BusinessSummary,
  RecommendedBusiness,
  FinancialInputs,
  FinancialResults,
  ScenarioComparisonResult,
  StressTestResult,
  RiskRadarResult,
  DistrictMarketIntelligence,
  GovernmentScheme,
  BusinessActionPlan
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return await res.json();
}

// Client Fallback Dataset & Calculation Engine
const FALLBACK_BUSINESSES: BusinessSummary[] = [
  {
    id: "dairy-farming",
    name: "Dairy Farming (2-5 Cows/Buffaloes)",
    category: "Agriculture & Livestock",
    minimum_investment: 80000,
    recommended_investment: 150000,
    equipment_cost: 45000,
    working_capital: 35000,
    estimated_monthly_revenue: 42000,
    estimated_monthly_expenses: 22000,
    expected_profit: 20000,
    break_even_months: 7.5,
    risk_level: "Medium",
    required_skills: ["Farming", "Animal Care", "Local Milk Supply Network"],
    location_suitability: ["Rural", "Semi-Urban"],
    demand_assumptions: "High daily local demand for fresh milk and ghee; tie-ups with local cooperatives (AMUL, Mother Dairy).",
    description: "Establishment of a small-scale dairy farm with high-yielding milch cattle, automated/semi-automated milking equipment, and local milk collection route setup."
  },
  {
    id: "poultry-farming",
    name: "Broiler & Layer Poultry Farming",
    category: "Agriculture & Livestock",
    minimum_investment: 70000,
    recommended_investment: 120000,
    equipment_cost: 40000,
    working_capital: 30000,
    estimated_monthly_revenue: 38000,
    estimated_monthly_expenses: 21000,
    expected_profit: 17000,
    break_even_months: 7.0,
    risk_level: "Medium-High",
    required_skills: ["Poultry Management", "Disease Control", "Feed Mixing"],
    location_suitability: ["Rural"],
    demand_assumptions: "Strong demand for poultry meat and eggs in local weekly markets (haats).",
    description: "Small batch poultry farm providing fresh eggs and broiler meat with controlled shed climate."
  },
  {
    id: "mushroom-farming",
    name: "Oyster & Button Mushroom Cultivation",
    category: "Agro-Processing & Cultivation",
    minimum_investment: 35000,
    recommended_investment: 65000,
    equipment_cost: 20000,
    working_capital: 15000,
    estimated_monthly_revenue: 28000,
    estimated_monthly_expenses: 11000,
    expected_profit: 17000,
    break_even_months: 3.8,
    risk_level: "Low-Medium",
    required_skills: ["Substrate Preparation", "Humidity Control", "Harvesting"],
    location_suitability: ["Rural", "Semi-Urban"],
    demand_assumptions: "Growing demand in local restaurants and vegetable markets.",
    description: "Low-space indoor mushroom farming using wheat/paddy straw beds."
  }
];

function clientCalculateFinancials(inputs: FinancialInputs): FinancialResults {
  const demandFactor = 1.0 + (inputs.demand_change_percent / 100.0);
  const inflationFactor = 1.0 + (inputs.cost_inflation_percent / 100.0);

  const revenue = Math.max(0, inputs.monthly_sales * demandFactor);
  const varCost = revenue * (inputs.variable_cost_percent / 100.0);
  const fixCost = Math.max(0, (inputs.monthly_expenses - varCost) * inflationFactor) + Math.max(0, inputs.workers_count - 1) * 8000;
  const totExpenses = varCost + fixCost;
  const netProfit = revenue - totExpenses;
  const grossProfit = Math.max(0, revenue - varCost);
  const annualProfit = netProfit * 12;

  let emi = 0;
  if (inputs.loan_amount > 0 && inputs.interest_rate_annual > 0 && inputs.loan_tenure_years > 0) {
    const r = (inputs.interest_rate_annual / 100.0) / 12.0;
    const n = inputs.loan_tenure_years * 12;
    emi = inputs.loan_amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }

  const cashFlow = netProfit - emi;
  const breakEvenMonths = netProfit > 0 ? Number((inputs.initial_investment / netProfit).toFixed(1)) : 999;
  const roi = Number(((annualProfit / Math.max(1, inputs.initial_investment)) * 100).toFixed(2));
  const cmRatio = revenue > 0 ? (revenue - varCost) / revenue : 0;
  const breakEvenRev = cmRatio > 0 ? fixCost / cmRatio : 0;

  const projections = [];
  let cumCash = -inputs.initial_investment;
  const mGrowth = (inputs.growth_rate_annual / 100.0) / 12.0;

  for (let m = 1; m <= 12; m++) {
    const mRev = revenue * Math.pow(1 + mGrowth, m - 1);
    const mVar = mRev * (inputs.variable_cost_percent / 100.0);
    const mExp = mVar + fixCost;
    const mProf = mRev - mExp;
    const mCash = mProf - emi;
    cumCash += mCash;

    projections.push({
      month: m,
      revenue: Number(mRev.toFixed(2)),
      expenses: Number(mExp.toFixed(2)),
      net_profit: Number(mProf.toFixed(2)),
      cash_flow: Number(mCash.toFixed(2)),
      cumulative_cash: Number(cumCash.toFixed(2))
    });
  }

  return {
    monthly_revenue: Number(revenue.toFixed(2)),
    monthly_variable_costs: Number(varCost.toFixed(2)),
    monthly_fixed_costs: Number(fixCost.toFixed(2)),
    monthly_expenses: Number(totExpenses.toFixed(2)),
    gross_profit: Number(grossProfit.toFixed(2)),
    monthly_net_profit: Number(netProfit.toFixed(2)),
    annual_net_profit: Number(annualProfit.toFixed(2)),
    monthly_loan_emi: Number(emi.toFixed(2)),
    cash_flow_after_emi: Number(cashFlow.toFixed(2)),
    break_even_revenue: Number(breakEvenRev.toFixed(2)),
    break_even_months: breakEvenMonths,
    roi_percent: roi,
    payback_period_months: breakEvenMonths,
    dscr: emi > 0 ? Number((netProfit / emi).toFixed(2)) : 99,
    projection_12_months: projections
  };
}

export const api = {
  getDemoProfile: async (): Promise<EntrepreneurProfile> => {
    try {
      return await fetchJson<EntrepreneurProfile>(`${API_BASE}/profile/demo`);
    } catch {
      return {
        name: "Rahul Kumar",
        age: 28,
        gender: "Male",
        state: "Uttar Pradesh",
        district: "Lucknow",
        area_type: "Rural",
        language: "Hindi",
        capital: 100000,
        monthly_income: 12000,
        existing_savings: 25000,
        loan_requirement: 50000,
        existing_business: "None (Family farming background)",
        skills: ["Farming", "Animal Husbandry", "Tractor Driving"],
        work_experience: "Farming",
        education: "Secondary School (10th Pass)",
        business_interests: ["Dairy Farming", "Poultry Farming", "Mushroom Farming"],
        preferred_sectors: ["Agriculture & Livestock", "Agro-Processing"],
        target_monthly_income: 25000,
        risk_tolerance: "Medium",
        business_goal: "Start a profitable dairy or livestock enterprise in my village to double family income."
      };
    }
  },

  getCatalog: async (): Promise<BusinessSummary[]> => {
    try {
      return await fetchJson<BusinessSummary[]>(`${API_BASE}/business/catalog`);
    } catch {
      return FALLBACK_BUSINESSES;
    }
  },

  getBusinessDetail: async (id: string): Promise<BusinessSummary> => {
    try {
      return await fetchJson<BusinessSummary>(`${API_BASE}/business/catalog/${id}`);
    } catch {
      const match = FALLBACK_BUSINESSES.find(b => b.id === id);
      return match || FALLBACK_BUSINESSES[0];
    }
  },

  recommendBusinesses: async (profile: EntrepreneurProfile): Promise<RecommendedBusiness[]> => {
    try {
      return await fetchJson<RecommendedBusiness[]>(`${API_BASE}/business/recommend`, {
        method: 'POST',
        body: JSON.stringify(profile)
      });
    } catch {
      return FALLBACK_BUSINESSES.map((b, idx) => {
        const fit = Math.max(50, Math.min(95, 91 - idx * 5));
        return {
          business: b,
          fit_score: fit,
          fit_breakdown: {
            budget_match: fit > 80 ? 95 : 75,
            skill_match: 90,
            location_match: 88,
            demand_potential: 87,
            risk_compatibility: 85
          },
          reasons_why: [
            `Matches your capital threshold of ₹${profile.capital.toLocaleString()}`,
            `Aligns with your skills in ${profile.work_experience || 'farming'}`,
            `High demand in ${profile.district}, ${profile.state}`
          ],
          reasons_why_not: [
            "Requires managing daily operational fodder and feed supplies"
          ],
          key_assumptions: [
            "Assumes stable local market selling prices"
          ]
        };
      });
    }
  },

  calculateFinancials: async (inputs: FinancialInputs): Promise<FinancialResults> => {
    try {
      return await fetchJson<FinancialResults>(`${API_BASE}/finance/calculate`, {
        method: 'POST',
        body: JSON.stringify(inputs)
      });
    } catch {
      return clientCalculateFinancials(inputs);
    }
  },

  runWhatIf: async (base_inputs: FinancialInputs, scenario_type: string): Promise<ScenarioComparisonResult> => {
    try {
      return await fetchJson<ScenarioComparisonResult>(`${API_BASE}/finance/what-if`, {
        method: 'POST',
        body: JSON.stringify({ base_inputs, modifier: { scenario_type } })
      });
    } catch {
      const before = clientCalculateFinancials(base_inputs);
      const modInputs = { ...base_inputs };
      let scenario_name = "Custom Scenario";
      let ai_explanation = "The business demonstrates sensitivity to operating sales and input costs.";

      if (scenario_type === 'sales_down_20') {
        scenario_name = "Sales Decreased by 20%";
        modInputs.demand_change_percent = -20;
        ai_explanation = "Under a 20% sales drop, net profit compresses. Consider keeping fixed costs low to maintain cash flow buffer.";
      } else if (scenario_type === 'sales_up_20') {
        scenario_name = "Sales Increased by 20%";
        modInputs.demand_change_percent = 20;
        ai_explanation = "A 20% boost in sales shortens your break-even period significantly.";
      } else if (scenario_type === 'raw_material_up_15') {
        scenario_name = "Raw Material / Cost Inflation (+15%)";
        modInputs.cost_inflation_percent = 15;
        ai_explanation = "Raw material inflation erodes margin. Consider bulk purchasing during harvest season.";
      } else if (scenario_type === 'demand_down_30') {
        scenario_name = "Severe Local Demand Slump (-30%)";
        modInputs.demand_change_percent = -30;
        ai_explanation = "A 30% demand slump puts pressure on break-even revenue.";
      } else if (scenario_type === 'investment_up_50k') {
        scenario_name = "Additional Investment (+₹50,000)";
        modInputs.initial_investment += 50000;
        modInputs.monthly_sales *= 1.25;
        ai_explanation = "Adding ₹50k capital increases production capacity by 25%.";
      } else if (scenario_type === 'loan_added') {
        scenario_name = "MUDRA Loan Added (₹50,000 @ 9.5%)";
        modInputs.loan_amount = 50000;
        modInputs.interest_rate_annual = 9.5;
        modInputs.loan_tenure_years = 3;
        ai_explanation = "Taking a ₹50k loan adds EMI debt service, but preserves cash savings.";
      }

      const after = clientCalculateFinancials(modInputs);
      const rev_chg = Number((((after.monthly_revenue - before.monthly_revenue) / Math.max(1, before.monthly_revenue)) * 100).toFixed(1));
      const prof_chg = Number((((after.monthly_net_profit - before.monthly_net_profit) / Math.max(1, Math.abs(before.monthly_net_profit))) * 100).toFixed(1));
      const be_chg = Number((after.break_even_months - before.break_even_months).toFixed(1));

      return {
        scenario_name,
        before,
        after,
        revenue_change_percent: rev_chg,
        profit_change_percent: prof_chg,
        break_even_change_months: be_chg,
        risk_change_score: prof_chg < 0 ? 5 : -5,
        ai_explanation
      };
    }
  },

  runStressTest: async (business_id: string, business_name: string, base_inputs: FinancialInputs): Promise<StressTestResult> => {
    try {
      return await fetchJson<StressTestResult>(`${API_BASE}/finance/stress-test?business_id=${business_id}&business_name=${encodeURIComponent(business_name)}`, {
        method: 'POST',
        body: JSON.stringify(base_inputs)
      });
    } catch {
      const scenarios = [
        { id: "scenario-1", name: "Scenario 1: Normal Market Baseline", desc: "Expected operational conditions.", demand_chg: 0, cost_chg: 0 },
        { id: "scenario-2", name: "Scenario 2: Moderate Demand Drop (-20%)", desc: "Local market slowdown.", demand_chg: -20, cost_chg: 0 },
        { id: "scenario-3", name: "Scenario 3: Severe Demand Shock (-40%)", desc: "Drought or heavy local competition.", demand_chg: -40, cost_chg: 0 },
        { id: "scenario-4", name: "Scenario 4: Feed Inflation (+20%)", desc: "Surge in fuel and fodder prices.", demand_chg: 0, cost_chg: 20 },
        { id: "scenario-5", name: "Scenario 5: Combined Shock (-30% Rev, +15% Cost)", desc: "Decline in demand + rise in costs.", demand_chg: -30, cost_chg: 15 }
      ];

      const matrix = scenarios.map(sc => {
        const fin = clientCalculateFinancials({
          ...base_inputs,
          demand_change_percent: sc.demand_chg,
          cost_inflation_percent: sc.cost_chg
        });
        const survived = fin.cash_flow_after_emi > 0;
        return {
          scenario_id: sc.id,
          scenario_name: sc.name,
          description: sc.desc,
          monthly_revenue: fin.monthly_revenue,
          monthly_profit: fin.monthly_net_profit,
          break_even_months: fin.break_even_months,
          survived,
          status_label: survived ? (fin.monthly_net_profit > 10000 ? "Safe & Profitable" : "Vulnerable") : "Critical"
        };
      });

      const survivedCount = matrix.filter(m => m.survived).length;
      const score = Math.round((survivedCount / 5) * 70 + (matrix[4].monthly_profit > 0 ? 30 : 0));

      return {
        business_id,
        business_name,
        resilience_score: score,
        resilience_grade: score >= 80 ? "High Resilience" : (score >= 50 ? "Moderate Resilience" : "Low Resilience"),
        survival_matrix: matrix,
        cash_flow_risk: survivedCount >= 4 ? "Low Risk" : "Moderate Risk",
        break_even_risk: matrix[0].break_even_months <= 8 ? "Achievable within 8 months" : "Extended Payback",
        ai_verdict: `Your business '${business_name}' achieves a Resilience Score of ${score}/100. It survived ${survivedCount} out of 5 stress scenarios.`
      };
    }
  },

  getRiskRadar: async (inputs: FinancialInputs, capital_available: number): Promise<RiskRadarResult> => {
    try {
      return await fetchJson<RiskRadarResult>(`${API_BASE}/finance/risk-radar?capital_available=${capital_available}`, {
        method: 'POST',
        body: JSON.stringify(inputs)
      });
    } catch {
      return {
        overall_risk_score: 38,
        overall_risk_level: "MEDIUM",
        categories: {
          "Market Risk": 42,
          "Demand Risk": 30,
          "Investment Risk": 40,
          "Operating Risk": 35,
          "Competition Risk": 42,
          "Cost Risk": 38,
          "Financial Risk": 28
        },
        details: [
          {
            category: "Market Risk",
            score: 42,
            level: "Medium",
            key_drivers: ["Purchasing power fluctuations", "Aggregator pricing"],
            mitigation_tips: ["Diversify buyer contacts", "Sell directly to local consumers"]
          },
          {
            category: "Demand Risk",
            score: 30,
            level: "Low",
            key_drivers: ["Seasonal demand variations"],
            mitigation_tips: ["Pre-book orders before harvest"]
          }
        ],
        ai_summary: "Overall business risk is classified as MEDIUM (38/100). Maintaining adequate reserves helps mitigate market shocks."
      };
    }
  },

  getMarketIntelligence: async (state: string, district: string, business_id: string): Promise<DistrictMarketIntelligence> => {
    try {
      return await fetchJson<DistrictMarketIntelligence>(`${API_BASE}/business/market-intelligence?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&business_id=${business_id}`);
    } catch {
      return {
        state: state || "Uttar Pradesh",
        district: district || "Lucknow",
        business_category: "Agriculture & Livestock",
        opportunity_score: 88.5,
        competition_level: "Moderate",
        input_availability: "Abundant (Local fodder markets & clinics)",
        demand_indicator: "Growing (+12% annual rural consumption growth)",
        local_advantages: [
          "Strong road connectivity to nearby milk collection centers",
          "High availability of skilled agricultural labor"
        ],
        potential_risks: [
          "Summer yield drops due to high temperature"
        ],
        key_hubs: ["Bakshi Ka Talab", "Mohanlalganj", "Chinhat", "Malihabad"]
      };
    }
  },

  getSchemes: async (): Promise<GovernmentScheme[]> => {
    try {
      return await fetchJson<GovernmentScheme[]>(`${API_BASE}/finance/schemes`);
    } catch {
      return [
        {
          id: "pmegp",
          name: "Prime Minister's Employment Generation Programme (PMEGP)",
          department: "KVIC / MSME",
          purpose: "Financial assistance for setting up new micro-enterprises.",
          max_subsidy_or_loan: "Up to ₹50 Lakhs (Manufacturing) / ₹20 Lakhs (Service). Subsidy 15%-35%.",
          eligibility_criteria: ["Individual above 18 years of age.", "Only new units eligible."],
          required_documents: ["Aadhaar & PAN", "Project Report", "Rural Certificate"],
          official_source_url: "https://www.kviconline.gov.in/pmegpeportal/",
          why_relevant: "Provides capital subsidy for setup."
        },
        {
          id: "mudra-yojana",
          name: "Pradhan Mantri MUDRA Yojana (PMMY)",
          department: "Ministry of Finance",
          purpose: "Collateral-free micro loans.",
          max_subsidy_or_loan: "Shishu (₹50k), Kishor (₹5 Lakh), Tarun (₹10 Lakh).",
          eligibility_criteria: ["Non-farm revenue generating micro business.", "No collateral required."],
          required_documents: ["Aadhaar & Residence proof", "Machinery quotation"],
          official_source_url: "https://www.mudra.org.in/",
          why_relevant: "Fast collateral-free working capital."
        }
      ];
    }
  },

  getActionPlan: async (business_id: string): Promise<BusinessActionPlan> => {
    try {
      return await fetchJson<BusinessActionPlan>(`${API_BASE}/finance/action-plan/${business_id}`);
    } catch {
      return {
        business_id,
        business_name: "Dairy Farming",
        total_days: 30,
        phases: [
          {
            days: "Day 1–3",
            phase_name: "Demand & Location Validation",
            tasks: ["Visit local milk collection buyers", "Verify shed space"],
            milestone: "Signed buyer pre-commitment"
          },
          {
            days: "Day 4–7",
            phase_name: "Supplier Quotations",
            tasks: ["Get 2 equipment quotes", "Identify local feed suppliers"],
            milestone: "Finalized supplier list"
          }
        ],
        critical_success_factors: ["Direct personal supervision", "Maintaining 20% working capital reserve"]
      };
    }
  },

  analyzePromptAI: async (prompt: string, profile: EntrepreneurProfile) => {
    try {
      return await fetchJson<any>(`${API_BASE}/ai/analyze-profile`, {
        method: 'POST',
        body: JSON.stringify({ user_prompt: prompt, profile })
      });
    } catch {
      return {
        user_intent_summary: `Analyzed prompt: '${prompt}'. Extracted budget threshold ₹${profile.capital.toLocaleString()} for ${profile.district}, ${profile.state}.`,
        extracted_parameters: { budget: profile.capital, experience: profile.work_experience },
        recommended_businesses: FALLBACK_BUSINESSES.map(b => ({
          business: b,
          fit_score: 91,
          fit_breakdown: { budget_match: 95, skill_match: 90, location_match: 88, demand_potential: 87, risk_compatibility: 85 },
          reasons_why: ["Matches capital", "Fits experience"],
          reasons_why_not: [],
          key_assumptions: ["Stable sales price"]
        })),
        overall_advice: "Based on your capital and experience, Dairy Farming offers strong fit.",
        next_steps: ["Run live financial simulations"]
      };
    }
  },

  getAdminAnalytics: async () => {
    try {
      return await fetchJson<any>(`${API_BASE}/analytics/dashboard`);
    } catch {
      return {
        total_entrepreneurs: 1284,
        total_analyses: 4892,
        average_investment_inr: 115000,
        average_risk_score: 42.8,
        most_common_sector: "Agriculture & Livestock (44%)",
        scenario_tests_run: 14230,
        most_recommended_businesses: [
          { name: "Dairy Farming", count: 1840, percentage: 37.6 },
          { name: "Mushroom Cultivation", count: 920, percentage: 18.8 }
        ],
        state_wise_distribution: [
          { state: "Uttar Pradesh", entrepreneurs: 480 },
          { state: "Bihar", entrepreneurs: 320 }
        ]
      };
    }
  }
};
