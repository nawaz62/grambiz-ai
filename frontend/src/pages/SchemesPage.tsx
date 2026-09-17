import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GovernmentScheme } from '../types';
import { Award, ExternalLink, CheckCircle2, FileText, AlertCircle } from 'lucide-react';

export const SchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getSchemes();
        setSchemes(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Curated Government Scheme Finder</span>
          </div>
          <h1 className="text-3xl font-black text-white">Government Support & Scheme Guidance</h1>
          <p className="text-xs text-slate-400 mt-1">
            Curated subsidies, loan schemes, and financial support options mapped to rural micro-enterprises.
          </p>
        </div>

        {/* Mandatory SIH Disclaimer Alert */}
        <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-400 uppercase font-bold block mb-0.5">Important Government Scheme Disclaimer:</strong>
            "Verify current eligibility rules, subsidy percentages, and terms with the official government portal or bank branch before submitting applications."
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">Loading Curated Scheme Dataset...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((s) => (
              <div
                key={s.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {s.department}
                    </span>
                    <a
                      href={s.official_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-emerald-400 flex items-center space-x-1"
                    >
                      <span>Official Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{s.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{s.purpose}</p>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 block font-semibold">Max Subsidy / Loan Structure</span>
                      <strong className="text-emerald-400">{s.max_subsidy_or_loan}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold mb-1">Key Eligibility Criteria</span>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {s.eligibility_criteria.slice(0, 3).map((crit, i) => (
                          <li key={i}>{crit}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold mb-1">Required Documents</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {s.required_documents.slice(0, 4).map((doc, i) => (
                          <span key={i} className="bg-slate-900 px-2 py-0.5 rounded text-[11px] text-slate-300 border border-slate-800">
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
                  💡 <strong>Why Relevant:</strong> {s.why_relevant}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
