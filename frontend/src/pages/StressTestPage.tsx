import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StressTestResult } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Trophy, RefreshCw } from 'lucide-react';

export const StressTestPage: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [stressData, setStressData] = useState<StressTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  const businessId = activeBusiness ? activeBusiness.id : 'dairy-farming';
  const businessName = activeBusiness ? activeBusiness.name : 'Dairy Farming';

  useEffect(() => {
    async function load() {
      try {
        const res = await api.runStressTest(businessId, businessName, {
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
        });
        setStressData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [businessId]);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SIH Killer Feature #2 — Automated Market Stress Tester</span>
          </div>
          <h1 className="text-3xl font-black text-white">"Can Your Business Survive?"</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated execution of 5 harsh market shock scenarios to evaluate your Business Resilience Score (0–100).
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">Simulating 5 Market Shock Scenarios...</div>
        ) : stressData && (
          <div className="space-y-8 animate-fade-in">
            {/* Score Banner */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
                  {stressData.resilience_score}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Business Resilience Score: {stressData.resilience_score}/100</h3>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 mt-1 inline-block">
                    {stressData.resilience_grade}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs space-y-1 text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>Cash Flow Risk: <strong className="text-emerald-400">{stressData.cash_flow_risk}</strong></div>
                <div>Break-even Risk: <strong className="text-amber-400">{stressData.break_even_risk}</strong></div>
              </div>
            </div>

            {/* 5 Scenario Survival Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">5-Scenario Survival Matrix</h3>
              <div className="space-y-4">
                {stressData.survival_matrix.map((sc) => (
                  <div
                    key={sc.scenario_id}
                    className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3">
                      {sc.survived ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white">{sc.scenario_name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{sc.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                      <div>
                        <span className="text-slate-400 block">Monthly Profit</span>
                        <strong className={sc.monthly_profit >= 0 ? "text-emerald-400" : "text-rose-400"}>
                          ₹{sc.monthly_profit.toLocaleString()}
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Status Label</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          sc.survived ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        }`}>
                          {sc.status_label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Verdict */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-400 uppercase font-bold block mb-2">AI Stress Test Verdict:</strong>
              "{stressData.ai_verdict}"
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              * Clearly labeled prototype scenario-based stress assessment based on mathematical sensitivity modeling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
