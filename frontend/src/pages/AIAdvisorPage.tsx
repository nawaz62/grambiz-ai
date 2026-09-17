import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RecommendedBusiness } from '../types';
import { Cpu, Send, Sparkles, CheckCircle2, ArrowRight, Shield, TrendingUp } from 'lucide-react';

export const AIAdvisorPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setActiveBusiness } = useAuth();
  const [prompt, setPrompt] = useState(`I have ₹${profile.capital.toLocaleString()}, experience in ${profile.work_experience || 'farming'} and want to start a business in ${profile.district}, ${profile.state}.`);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.analyzePromptAI(prompt, profile);
      setResponse(res);
    } catch {
      // Fallback
      const recs = await api.recommendBusinesses(profile);
      setResponse({
        user_intent_summary: `Extracted capital limit ₹${profile.capital.toLocaleString()} for ${profile.district}, ${profile.state}.`,
        extracted_parameters: { budget: profile.capital, experience: profile.work_experience },
        recommended_businesses: recs.slice(0, 3),
        overall_advice: `Based on your profile, Dairy Farming and Mushroom Cultivation offer high fit scores.`,
        next_steps: ["Run live financial simulations", "Test What-If scenarios"]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBusiness = (b: RecommendedBusiness) => {
    setActiveBusiness(b.business);
    navigate(`/business/${b.business.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>GenAI Intent Extractor & Recommendation Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white">AI Business Advisor Co-Pilot</h1>
          <p className="text-xs text-slate-400 mt-1">
            Describe your situation in natural language. AI understands your intent while the backend engine performs financial calculations.
          </p>
        </div>

        {/* Conversational Prompt Form */}
        <form onSubmit={handleAnalyze} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Describe Your Business Goal & Situation</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I have ₹1 lakh, farming experience and want to start a business in my village."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-2 text-sm shadow-md"
            >
              {loading ? (
                <span>Analyzing Intent...</span>
              ) : (
                <>
                  <span>Analyze Intent</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* AI Response Output */}
        {response && (
          <div className="space-y-6 animate-fade-in">
            {/* Intent Summary Box */}
            <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5" /> AI Intent Extraction Summary
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">{response.user_intent_summary}</p>
              <div className="mt-3 text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-wrap gap-4">
                <span>Budget: <strong className="text-emerald-300">₹{profile.capital.toLocaleString()}</strong></span>
                <span>Experience: <strong className="text-emerald-300">{profile.work_experience || 'Farming'}</strong></span>
                <span>Location: <strong className="text-emerald-300">{profile.district}, {profile.state}</strong></span>
              </div>
            </div>

            {/* Top Recommended Cards */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Match Business Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {response.recommended_businesses.map((rec: RecommendedBusiness, idx: number) => (
                  <div
                    key={rec.business.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          #{idx + 1} Recommendation
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-black text-white">{rec.fit_score}</span>
                          <span className="text-[10px] text-slate-400 block">/100 FIT SCORE</span>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white mb-1">{rec.business.name}</h4>
                      <p className="text-xs text-slate-400 mb-4">{rec.business.category}</p>

                      <div className="space-y-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
                        <div className="flex justify-between text-slate-300">
                          <span>Min Capital:</span>
                          <span className="font-bold">₹{rec.business.minimum_investment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Monthly Profit:</span>
                          <span className="font-bold text-emerald-400">₹{rec.business.expected_profit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Break-even:</span>
                          <span className="font-bold text-amber-400">{rec.business.break_even_months} Mos</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectBusiness(rec)}
                      className="w-full py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 transition-all text-xs flex items-center justify-center space-x-1"
                    >
                      <span>Explore Business Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
