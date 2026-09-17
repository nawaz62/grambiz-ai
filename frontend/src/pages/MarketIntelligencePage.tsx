import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DistrictMarketIntelligence } from '../types';
import { MarketMap } from '../components/MarketMap';
import { MapPin, TrendingUp, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';

export const MarketIntelligencePage: React.FC = () => {
  const { profile, activeBusiness } = useAuth();
  const [intel, setIntel] = useState<DistrictMarketIntelligence | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getMarketIntelligence(
          profile.state || 'Uttar Pradesh',
          profile.district || 'Lucknow',
          activeBusiness ? activeBusiness.id : 'dairy-farming'
        );
        setIntel(res);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [profile, activeBusiness]);

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>District Micro-Market Intelligence Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white">Local Market Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing demand, supply routes, and local market hubs for {profile.district}, {profile.state}.
          </p>
        </div>

        {intel && (
          <div className="space-y-8 animate-fade-in">
            {/* Map & Key Highlights */}
            <MarketMap intel={intel} />

            {/* Local Advantages & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Local District Advantages
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {intel.local_advantages.map((adv, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-400 mr-2">✓</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" /> Primary Local Market Hubs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {intel.key_hubs.map((hub, i) => (
                    <span key={i} className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-200 font-semibold">
                      📍 {hub} Sub-Market
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              * Prototype dataset based on aggregated public agricultural & micro-enterprise market indicators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
