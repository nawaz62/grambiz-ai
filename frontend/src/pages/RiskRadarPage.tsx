import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RiskRadarResult, RiskCategoryDetail } from '../types';
import { RiskRadarChart } from '../components/RiskRadarChart';
import { BarChart3, Shield, Info, CheckCircle2 } from 'lucide-react';

export const RiskRadarPage: React.FC = () => {
  const { activeBusiness, profile } = useAuth();
  const [riskData, setRiskData] = useState<RiskRadarResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RiskCategoryDetail | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const inputs = {
          initial_investment: activeBusiness ? activeBusiness.recommended_investment : 150000,
          equipment_cost: activeBusiness ? activeBusiness.equipment_cost : 45000,
          working_capital: activeBusiness ? activeBusiness.working_capital : 35000,
          monthly_sales: activeBusiness ? activeBusiness.estimated_monthly_revenue : 42000,
          monthly_expenses: activeBusiness ? activeBusiness.estimated_monthly_expenses : 22000,
          variable_cost_percent: 40,
          fixed_costs: 0,
          growth_rate_annual: 10,
          demand_change_percent: 0,
          cost_inflation_percent: 0,
          loan_amount: 0,
          interest_rate_annual: 9.5,
          loan_tenure_years: 5,
          workers_count: 1
        };
        const res = await api.getRiskRadar(inputs, profile.capital);
        setRiskData(res);
        setSelectedCategory(res.details[0]);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [activeBusiness, profile]);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>7-Axis Multi-Dimensional Risk Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-white">Interactive Business Risk Radar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Click any category below to reveal underlying assumptions, drivers, and AI mitigation strategies.
          </p>
        </div>

        {riskData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Radar Chart */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center justify-between">
              <div className="w-full text-left mb-4">
                <span className="text-xs text-slate-400 uppercase font-semibold">Overall Risk Level</span>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-3xl font-black text-white">{riskData.overall_risk_score}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    riskData.overall_risk_level === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {riskData.overall_risk_level} RISK
                  </span>
                </div>
              </div>

              <RiskRadarChart categories={riskData.categories} />

              <div className="w-full text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 mt-4 leading-relaxed">
                "{riskData.ai_summary}"
              </div>
            </div>

            {/* Right Category Drill-Down Panel */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Risk Category Breakdown</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {riskData.details.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedCategory?.category === cat.category
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{cat.category}</span>
                      <span className="font-mono">{cat.score}</span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl animate-fade-in">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-white flex items-center">
                      <Shield className="w-4 h-4 text-emerald-400 mr-2" />
                      {selectedCategory.category} Analysis
                    </h4>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{selectedCategory.score}/100 ({selectedCategory.level})</span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Primary Risk Drivers</h5>
                    <ul className="space-y-1 text-xs text-slate-200 list-disc list-inside">
                      {selectedCategory.key_drivers.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-emerald-400 uppercase mb-2">AI Recommended Mitigation Tips</h5>
                    <ul className="space-y-1 text-xs text-slate-200">
                      {selectedCategory.mitigation_tips.map((t, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
