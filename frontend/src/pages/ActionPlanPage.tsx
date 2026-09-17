import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BusinessActionPlan } from '../types';
import { FileText, Calendar, CheckCircle2, Flag, ArrowRight } from 'lucide-react';

export const ActionPlanPage: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [plan, setPlan] = useState<BusinessActionPlan | null>(null);

  const businessId = activeBusiness ? activeBusiness.id : 'dairy-farming';

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getActionPlan(businessId);
        setPlan(res);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [businessId]);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>30-Day Launch Roadmap</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            "Your 30-Day Business Launch Plan"
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customized step-by-step implementation timeline for <strong>{plan?.business_name || 'Dairy Farming'}</strong>.
          </p>
        </div>

        {plan && (
          <div className="space-y-6 animate-fade-in">
            {/* Timeline List */}
            <div className="relative border-l-2 border-emerald-500/40 ml-4 pl-6 space-y-8">
              {plan.phases.map((phase, idx) => (
                <div key={idx} className="relative bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-3">
                  <div className="absolute -left-[35px] top-6 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-500/30">
                    {idx + 1}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {phase.days}
                    </span>
                    <span className="text-[11px] text-slate-400">Phase {idx + 1} of 7</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{phase.phase_name}</h3>

                  <div className="space-y-2 text-xs text-slate-300">
                    <strong className="text-slate-400 uppercase font-semibold block">Key Action Items:</strong>
                    <ul className="space-y-1.5">
                      {phase.tasks.map((task, tidx) => (
                        <li key={tidx} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs flex items-center space-x-2 text-amber-300">
                    <Flag className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Milestone:</strong> {phase.milestone}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Success Factors */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 text-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Critical Launch Success Factors</h4>
              <ul className="space-y-2 text-slate-300">
                {plan.critical_success_factors.map((f, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
