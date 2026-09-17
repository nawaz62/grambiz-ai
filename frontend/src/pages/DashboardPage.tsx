import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sliders, FileText, Sparkles, ShieldAlert, BarChart3, ArrowRight, UserCheck } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, activeBusiness } = useAuth();

  const biz = activeBusiness || {
    name: 'Dairy Farming (2-5 Cows)',
    minimum_investment: 80000,
    recommended_investment: 150000,
    estimated_monthly_revenue: 42000,
    expected_profit: 20000,
    break_even_months: 7.5
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Entrepreneur Co-Pilot Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">Welcome back, <strong>{profile.name}</strong> ({profile.district}, {profile.state})</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2.5 rounded-xl font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors text-xs flex items-center space-x-1"
            >
              <UserCheck className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => navigate('/simulator')}
              className="px-5 py-2.5 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors text-xs flex items-center space-x-1 shadow-md"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Simulator</span>
            </button>
          </div>
        </div>

        {/* 8 KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Profile Completion</span>
            <span className="text-2xl font-black text-emerald-400">100%</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Matched Business</span>
            <span className="text-sm font-bold text-white truncate block mt-1">{biz.name}</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Business Fit Score</span>
            <span className="text-2xl font-black text-emerald-400">91/100</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Investment Needed</span>
            <span className="text-xl font-black text-white">₹{biz.recommended_investment.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Estimated Monthly Profit</span>
            <span className="text-xl font-black text-emerald-300">₹{biz.expected_profit.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Risk Score</span>
            <span className="text-xl font-black text-amber-400">38/100 (Medium)</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Break-even Period</span>
            <span className="text-xl font-black text-teal-400">{biz.break_even_months} Mos</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Resilience Score</span>
            <span className="text-xl font-black text-sky-400">74/100</span>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Platform Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/advisor')}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition-all space-y-2 group"
            >
              <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Run New AI Analysis</h4>
              <p className="text-xs text-slate-400">Conversational intent matcher with structured recommendations</p>
            </button>

            <button
              onClick={() => navigate('/what-if')}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition-all space-y-2 group"
            >
              <BarChart3 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">What-If Scenario Sandbox</h4>
              <p className="text-xs text-slate-400">Test sales, cost inflation & loan addition shocks live</p>
            </button>

            <button
              onClick={() => navigate('/report')}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 text-left transition-all space-y-2 group"
            >
              <FileText className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Generate Business Plan PDF</h4>
              <p className="text-xs text-slate-400">Export formal report for bank loan or PMEGP submission</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
