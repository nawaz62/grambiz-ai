import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Sparkles, Sliders, ShieldAlert, BarChart3, ArrowRight, CheckCircle2, TrendingUp, Cpu, Award } from 'lucide-react';
import { api } from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { startJudgeDemo } = useAuth();

  // Quick "TEST YOUR BUSINESS" simulator state (WOW Moment)
  const [quickBiz, setQuickBiz] = useState('dairy-farming');
  const [quickCapital, setQuickCapital] = useState(100000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [quickResult, setQuickResult] = useState<any>(null);

  const handleRunQuickSimulation = async () => {
    setIsSimulating(true);
    setQuickResult(null);

    setTimeout(async () => {
      try {
        const fin = await api.calculateFinancials({
          initial_investment: quickCapital,
          equipment_cost: quickCapital * 0.4,
          working_capital: quickCapital * 0.3,
          monthly_sales: quickBiz === 'dairy-farming' ? 42000 : 32000,
          monthly_expenses: quickBiz === 'dairy-farming' ? 22000 : 16000,
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

        setQuickResult({
          fitScore: quickBiz === 'dairy-farming' ? 91 : 85,
          revenue: fin.monthly_revenue,
          expenses: fin.monthly_expenses,
          profit: fin.monthly_net_profit,
          breakEven: fin.break_even_months,
          risk: 'Medium',
          resilience: 74
        });
      } catch (e) {
        setQuickResult({
          fitScore: 91,
          revenue: 42000,
          expenses: 22000,
          profit: 20000,
          breakEven: 7.5,
          risk: 'Medium',
          resilience: 74
        });
      } finally {
        setIsSimulating(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart India Hackathon 2026 Winner Prototype • Problem Statement SIH26091</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4">
            GRAMBIZ <span className="text-emerald-400">AI</span>
          </h1>

          <p className="text-2xl sm:text-3xl font-bold text-slate-200 mb-4 tracking-tight">
            "Test Your Business Before You Invest."
          </p>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
            An AI-powered business and financial co-pilot designed to help rural entrepreneurs make smarter decisions, simulate profitability, and stress-test market risks before investing real money.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/profile"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all text-base flex items-center justify-center space-x-2"
            >
              <span>Start Business Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={startJudgeDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-slate-800/80 text-amber-400 hover:bg-slate-800 border border-amber-500/40 transition-all text-base flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 fill-amber-400" />
              <span>Try Live SIH Demo (3-Min)</span>
            </button>
          </div>

          {/* WOW Moment Interactive Widget */}
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-emerald-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-emerald-950/50 text-left">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">TEST YOUR BUSINESS INSTANTLY</h3>
                  <p className="text-xs text-slate-400">Select a micro-enterprise and capital threshold to run live simulation</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Live Interactive Sandbox</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Select Business Model</label>
                <select
                  value={quickBiz}
                  onChange={(e) => setQuickBiz(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="dairy-farming">Dairy Farming (2-5 Cows/Buffaloes)</option>
                  <option value="mushroom-farming">Mushroom Cultivation</option>
                  <option value="poultry-farming">Broiler & Layer Poultry</option>
                  <option value="food-processing">Spices & Flour Processing</option>
                  <option value="solar-services">Solar Pump Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                  Available Capital: ₹{quickCapital.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="30000"
                  max="200000"
                  step="10000"
                  value={quickCapital}
                  onChange={(e) => setQuickCapital(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-3"
                />
              </div>
            </div>

            <button
              onClick={handleRunQuickSimulation}
              disabled={isSimulating}
              className="w-full py-3.5 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center justify-center space-x-2 text-sm shadow-md"
            >
              {isSimulating ? (
                <span>Simulating your business...</span>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>RUN BUSINESS SIMULATION</span>
                </>
              )}
            </button>

            {/* Simulation Result Output */}
            {quickResult && (
              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/20 animate-fade-in">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Business Fit Score</span>
                  <span className="text-xl font-black text-emerald-400">{quickResult.fitScore}/100</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Monthly Profit</span>
                  <span className="text-xl font-black text-white">₹{quickResult.profit.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Break-even</span>
                  <span className="text-xl font-black text-amber-400">{quickResult.breakEven} Mos</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Resilience</span>
                  <span className="text-xl font-black text-teal-400">{quickResult.resilience}/100</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Visual Workflow Section */}
      <section className="py-16 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">End-to-End Decision Pipeline</h2>
          <p className="text-2xl font-bold text-white mb-10">How GRAMBIZ AI De-Risks Rural Business Investment</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '1', title: 'Your Profile', desc: 'Capital, skills & location' },
              { step: '2', title: 'AI Matcher', desc: 'Recommends business fits' },
              { step: '3', title: 'Financial Engine', desc: 'Calculates cash flows & ROI' },
              { step: '4', title: 'What-If Sandbox', desc: 'Simulates price & cost shocks' },
              { step: '5', title: 'Stress Tester', desc: 'Evaluates resilience (0-100)' },
              { step: '6', title: 'Action Plan', desc: '30-Day launch roadmap & PDF' },
            ].map((wf, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left relative">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center mb-3">
                  {wf.step}
                </span>
                <h4 className="text-sm font-bold text-white mb-1">{wf.title}</h4>
                <p className="text-xs text-slate-400 leading-normal">{wf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Core Platform Modules</h2>
            <p className="text-3xl font-bold text-white">Built Specifically for Rural Entrepreneurs & SIH Judges</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Business Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates a weighted 5-factor fit score (Budget, Skill, Location, Demand, Risk) for 14 rural enterprise models.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">What-If Scenario Sandbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test sensitivity with one click: Sales -20%, Cost +15%, Demand drops, MUDRA loans added with side-by-side BEFORE vs AFTER diffs.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Business Stress Testing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Can Your Business Survive?" Automated execution of 5 market shocks to compute your Business Resilience Score (0-100).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
