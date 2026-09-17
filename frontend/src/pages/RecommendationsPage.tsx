import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RecommendedBusiness } from '../types';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setActiveBusiness } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('All');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.recommendBusinesses(profile);
        setRecommendations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profile]);

  const filtered = selectedSector === 'All'
    ? recommendations
    : recommendations.filter(r => r.business.category.includes(selectedSector));

  const handleSelect = (rec: RecommendedBusiness) => {
    setActiveBusiness(rec.business);
    navigate(`/business/${rec.business.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">AI Business Recommendations</h1>
            <p className="text-xs text-slate-400 mt-1">
              Personalized business fit scores computed for {profile.name} ({profile.district}, {profile.state})
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Filter Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Sectors</option>
              <option value="Agriculture">Agriculture & Livestock</option>
              <option value="Agro-Processing">Agro-Processing</option>
              <option value="Services">Services & Repairs</option>
              <option value="Textiles">Textiles & Crafts</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">Computing Business Fit Scores...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((rec) => (
              <div
                key={rec.business.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {rec.business.category}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">{rec.fit_score}</span>
                      <span className="text-[10px] text-slate-400 block font-bold">/100 FIT SCORE</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{rec.business.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{rec.business.description}</p>

                  {/* Fit Breakdown Bars */}
                  <div className="space-y-2 mb-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Budget Match:</span>
                      <span className="font-bold text-emerald-300">{rec.fit_breakdown.budget_match}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${rec.fit_breakdown.budget_match}%` }} />
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-400">Skill Match:</span>
                      <span className="font-bold text-emerald-300">{rec.fit_breakdown.skill_match}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: `${rec.fit_breakdown.skill_match}%` }} />
                    </div>
                  </div>

                  {/* Why Recommended & Why Not */}
                  <div className="space-y-2 text-xs mb-4">
                    <div className="text-emerald-400 font-semibold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> WHY RECOMMENDED?
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                      {rec.reasons_why.slice(0, 2).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleSelect(rec)}
                  className="w-full py-3 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors text-xs flex items-center justify-center space-x-1"
                >
                  <span>Select & Run Simulation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
