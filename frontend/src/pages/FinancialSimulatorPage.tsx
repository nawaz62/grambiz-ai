import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FinancialInputs, FinancialResults } from '../types';
import { FinancialCharts } from '../components/FinancialCharts';
import { Sliders, TrendingUp, DollarSign, BarChart3, ArrowRight, RefreshCw, Zap } from 'lucide-react';

export const FinancialSimulatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBusiness } = useAuth();

  const [inputs, setInputs] = useState<FinancialInputs>({
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

  const [results, setResults] = useState<FinancialResults | null>(null);

  useEffect(() => {
    async function calculate() {
      try {
        const res = await api.calculateFinancials(inputs);
        setResults(res);
      } catch (err) {
        console.error(err);
      }
    }
    calculate();
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Financial Co-Pilot Engine</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              Financial Simulator — {activeBusiness ? activeBusiness.name : 'Dairy Farming'}
            </h1>
            <p className="text-xs text-slate-400">
              Adjust sliders below. Python financial backend recalculates revenue, break-even, and cash flow instantly.
            </p>
          </div>

          <button
            onClick={() => navigate('/what-if')}
            className="px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 transition-all text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>OPEN WHAT-IF SANDBOX</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        {results && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Monthly Revenue</span>
              <span className="text-xl font-black text-emerald-400">₹{results.monthly_revenue.toLocaleString()}</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Monthly Expenses</span>
              <span className="text-xl font-black text-rose-400">₹{results.monthly_expenses.toLocaleString()}</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Monthly Net Profit</span>
              <span className="text-xl font-black text-white">₹{results.monthly_net_profit.toLocaleString()}</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Break-even</span>
              <span className="text-xl font-black text-amber-400">{results.break_even_months} Mos</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Estimated ROI</span>
              <span className="text-xl font-black text-teal-400">{results.roi_percent}% / Year</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Monthly Loan EMI</span>
              <span className="text-xl font-black text-sky-400">₹{results.monthly_loan_emi.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Main Grid: Sliders Left, Charts Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sliders Panel */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-2xl">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 mr-1.5" /> Simulation Control Parameters
            </h3>

            {/* Slider 1: Capital */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Initial Investment Capital</span>
                <span className="text-emerald-400 font-bold">₹{inputs.initial_investment.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="30000"
                max="300000"
                step="5000"
                value={inputs.initial_investment}
                onChange={(e) => setInputs({ ...inputs, initial_investment: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 2: Monthly Sales */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Expected Monthly Sales (Revenue)</span>
                <span className="text-emerald-400 font-bold">₹{inputs.monthly_sales.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="2000"
                value={inputs.monthly_sales}
                onChange={(e) => setInputs({ ...inputs, monthly_sales: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 3: Demand Adjustment */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Demand Fluctuation</span>
                <span className={inputs.demand_change_percent >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {inputs.demand_change_percent > 0 ? `+${inputs.demand_change_percent}%` : `${inputs.demand_change_percent}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={inputs.demand_change_percent}
                onChange={(e) => setInputs({ ...inputs, demand_change_percent: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 4: Base Expenses */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Base Monthly Operating Cost</span>
                <span className="text-rose-400 font-bold">₹{inputs.monthly_expenses.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="60000"
                step="1000"
                value={inputs.monthly_expenses}
                onChange={(e) => setInputs({ ...inputs, monthly_expenses: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 5: Workers */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Number of Hired Workers</span>
                <span className="text-slate-200 font-bold">{inputs.workers_count} Worker(s)</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={inputs.workers_count}
                onChange={(e) => setInputs({ ...inputs, workers_count: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 6: Loan Amount */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Bank / MUDRA Loan Amount</span>
                <span className="text-sky-400 font-bold">₹{inputs.loan_amount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="150000"
                step="5000"
                value={inputs.loan_amount}
                onChange={(e) => setInputs({ ...inputs, loan_amount: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Charts Panel */}
          <div className="lg:col-span-7">
            {results && <FinancialCharts projections={results.projection_12_months} />}
          </div>
        </div>
      </div>
    </div>
  );
};
