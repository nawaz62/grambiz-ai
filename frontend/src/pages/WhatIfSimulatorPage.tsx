import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FinancialInputs, ScenarioComparisonResult } from '../types';
import { Zap, TrendingDown, TrendingUp, AlertTriangle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [activeScenario, setActiveScenario] = useState<string>('sales_down_20');
  const [comparison, setComparison] = useState<ScenarioComparisonResult | null>(null);

  const baseInputs: FinancialInputs = {
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

  useEffect(() => {
    async function run() {
      try {
        const res = await api.runWhatIf(baseInputs, activeScenario);
        setComparison(res);
      } catch (err) {
        console.error(err);
      }
    }
    run();
  }, [activeScenario]);

  const scenarioButtons = [
    { id: 'sales_down_20', label: 'Sales -20%', icon: TrendingDown, color: 'hover:border-rose-500' },
    { id: 'sales_up_20', label: 'Sales +20%', icon: TrendingUp, color: 'hover:border-emerald-500' },
    { id: 'raw_material_up_15', label: 'Raw Material +15%', icon: AlertTriangle, color: 'hover:border-amber-500' },
    { id: 'demand_down_30', label: 'Demand -30%', icon: TrendingDown, color: 'hover:border-rose-500' },
    { id: 'investment_up_50k', label: 'Investment +₹50,000', icon: Sparkles, color: 'hover:border-sky-500' },
    { id: 'loan_added', label: 'MUDRA Loan Added', icon: ShieldCheck, color: 'hover:border-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>SIH Killer Feature #1 — What-If Sensitivity Simulator</span>
          </div>
          <h1 className="text-3xl font-black text-white">"WHAT IF?" Market Scenario Sandbox</h1>
          <p className="text-xs text-slate-400 mt-1">
            Test how unexpected market shocks or capital changes impact your bottom line before investing real money.
          </p>
        </div>

        {/* Quick Scenario Triggers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {scenarioButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = activeScenario === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveScenario(btn.id)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/25 scale-105'
                    : `bg-slate-900 border-slate-800 text-slate-300 ${btn.color}`
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'stroke-slate-950' : 'stroke-amber-400'}`} />
                <span className="text-xs font-semibold">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Side-by-Side Comparison Card */}
        {comparison && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 text-amber-400 mr-2" />
                Active Scenario: <span className="text-amber-400 ml-2">{comparison.scenario_name}</span>
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                Real-Time Python Calculations
              </span>
            </div>

            {/* BEFORE vs AFTER Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* BEFORE Column */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block pb-2 border-b border-slate-800">
                  BEFORE (Normal Baseline)
                </span>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Revenue:</span>
                    <strong className="text-white">₹{comparison.before.monthly_revenue.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Net Profit:</span>
                    <strong className="text-emerald-400">₹{comparison.before.monthly_net_profit.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Break-even Period:</span>
                    <strong className="text-amber-400">{comparison.before.break_even_months} Months</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annualized ROI:</span>
                    <strong className="text-teal-400">{comparison.before.roi_percent}%</strong>
                  </div>
                </div>
              </div>

              {/* AFTER Column */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/40 space-y-4 shadow-lg shadow-amber-500/5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block pb-2 border-b border-amber-500/20">
                  AFTER (Under Selected Shock)
                </span>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Revenue:</span>
                    <strong className="text-white">₹{comparison.after.monthly_revenue.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Net Profit:</span>
                    <strong className={comparison.after.monthly_net_profit >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      ₹{comparison.after.monthly_net_profit.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Break-even Period:</span>
                    <strong className="text-amber-400">{comparison.after.break_even_months} Months</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annualized ROI:</span>
                    <strong className="text-teal-400">{comparison.after.roi_percent}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Diffs & AI Commentary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center text-xs">
              <div>
                <span className="text-slate-400 uppercase font-semibold block">Revenue Change</span>
                <span className={`text-lg font-black ${comparison.revenue_change_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {comparison.revenue_change_percent}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold block">Net Profit Change</span>
                <span className={`text-lg font-black ${comparison.profit_change_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {comparison.profit_change_percent}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold block">Break-even Impact</span>
                <span className="text-lg font-black text-amber-400">
                  {comparison.break_even_change_months > 0 ? `+${comparison.break_even_change_months} Mos` : `${comparison.break_even_change_months} Mos`}
                </span>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-800/40 p-5 rounded-2xl text-xs text-emerald-200 leading-relaxed">
              <strong className="text-emerald-400 uppercase font-bold block mb-1">AI Co-Pilot Explanation & Risk Guidance:</strong>
              "{comparison.ai_explanation}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
