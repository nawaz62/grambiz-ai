import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BusinessSummary } from '../types';
import { Sliders, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

export const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setActiveBusiness } = useAuth();
  const [biz, setBiz] = useState<BusinessSummary | null>(null);

  useEffect(() => {
    async function load() {
      if (id) {
        try {
          const data = await api.getBusinessDetail(id);
          setBiz(data);
          setActiveBusiness(data);
        } catch (e) {
          console.error(e);
        }
      }
    }
    load();
  }, [id]);

  if (!biz) return <div className="min-h-screen bg-slate-950 p-10 text-white">Loading business details...</div>;

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {biz.category}
            </span>
            <h1 className="text-3xl font-black text-white mt-2">{biz.name}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">{biz.description}</p>
          </div>

          <button
            onClick={() => navigate('/simulator')}
            className="px-6 py-3.5 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all text-sm flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Financial Simulator</span>
          </button>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Min Capital</span>
            <span className="text-xl font-black text-white">₹{biz.minimum_investment.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Est. Monthly Revenue</span>
            <span className="text-xl font-black text-emerald-400">₹{biz.estimated_monthly_revenue.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Est. Monthly Profit</span>
            <span className="text-xl font-black text-emerald-300">₹{biz.expected_profit.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Break-even Period</span>
            <span className="text-xl font-black text-amber-400">{biz.break_even_months} Months</span>
          </div>
        </div>

        {/* Capital & Equipment Breakdown */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Capital Requirement & Cost Allocation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Equipment & Machinery Cost</span>
              <strong className="text-base text-white">₹{biz.equipment_cost.toLocaleString()}</strong>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Initial Working Capital Reserve</span>
              <strong className="text-base text-white">₹{biz.working_capital.toLocaleString()}</strong>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Recommended Total Investment</span>
              <strong className="text-base text-emerald-400">₹{biz.recommended_investment.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Explainability Section: WHY RECOMMENDED vs WHY NOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-emerald-500/30 p-6 rounded-3xl">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" /> WHY RECOMMENDED?
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start"><span className="text-emerald-400 mr-2">✓</span> Matches your available capital threshold</li>
              <li className="flex items-start"><span className="text-emerald-400 mr-2">✓</span> Aligns with your farming / agricultural experience</li>
              <li className="flex items-start"><span className="text-emerald-400 mr-2">✓</span> Strong local demand indicators in rural village hubs</li>
              <li className="flex items-start"><span className="text-emerald-400 mr-2">✓</span> Eligible for PMEGP & NABARD subsidy schemes</li>
            </ul>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 p-6 rounded-3xl">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" /> KEY CONSIDERATIONS & RISK FACTORS
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start"><span className="text-amber-400 mr-2">!</span> Raw material & fodder price inflation during off-seasons</li>
              <li className="flex items-start"><span className="text-amber-400 mr-2">!</span> Requires active daily personal supervision during initial 60 days</li>
              <li className="flex items-start"><span className="text-amber-400 mr-2">!</span> Perishable stock management and hygiene protocols mandatory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
