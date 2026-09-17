import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, BarChart3, TrendingUp, ShieldAlert, Cpu, Award } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAdminAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Platform Administrative & SIH Judge Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white">Admin & Platform Analytics Dashboard</h1>
          <p className="text-xs text-slate-400">Aggregated usage stats, sector demand distributions, and scenario simulation frequency.</p>
        </div>

        {analytics && (
          <div className="space-y-8 animate-fade-in">
            {/* Top 6 Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">Total Entrepreneurs</span>
                <span className="text-2xl font-black text-emerald-400">{analytics.total_entrepreneurs.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">Total Analyses</span>
                <span className="text-2xl font-black text-white">{analytics.total_analyses.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">Average Investment</span>
                <span className="text-xl font-black text-emerald-300">₹{analytics.average_investment_inr.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">Average Risk Score</span>
                <span className="text-xl font-black text-amber-400">{analytics.average_risk_score} / 100</span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">Scenario Tests Run</span>
                <span className="text-xl font-black text-teal-400">{analytics.scenario_tests_run.toLocaleString()}</span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">Top Sector</span>
                <span className="text-xs font-bold text-sky-400 block mt-1">{analytics.most_common_sector}</span>
              </div>
            </div>

            {/* Distribution Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Most Recommended Businesses List */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Most Recommended Rural Businesses</h3>
                <div className="space-y-3">
                  {analytics.most_recommended_businesses.map((b: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-white block">{b.name}</strong>
                        <span className="text-slate-400">{b.count.toLocaleString()} recommendations</span>
                      </div>
                      <span className="font-bold text-emerald-400 font-mono text-sm">{b.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* State-Wise Distribution */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">State-Wise Entrepreneur Distribution</h3>
                <div className="space-y-3">
                  {analytics.state_wise_distribution.map((st: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                      <strong className="text-white">{st.state}</strong>
                      <span className="font-bold text-teal-400">{st.entrepreneurs} Entrepreneurs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
