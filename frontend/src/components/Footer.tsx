import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white">GRAMBIZ AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              "Test Your Business Before You Invest."  
              An AI-powered business and financial co-pilot empowering rural entrepreneurs in India.
            </p>
            <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 SIH26091</span>
            </span>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Core Features</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/advisor" className="hover:text-emerald-400 transition-colors">AI Business Matcher</Link></li>
              <li><Link to="/simulator" className="hover:text-emerald-400 transition-colors">Financial Simulator</Link></li>
              <li><Link to="/what-if" className="hover:text-emerald-400 transition-colors">What-If Scenario Sandbox</Link></li>
              <li><Link to="/stress-test" className="hover:text-emerald-400 transition-colors">Business Stress Tester</Link></li>
              <li><Link to="/risk-radar" className="hover:text-emerald-400 transition-colors">7-Axis Risk Radar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Government & Market</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/market-intelligence" className="hover:text-emerald-400 transition-colors">District Market Intelligence</Link></li>
              <li><Link to="/schemes" className="hover:text-emerald-400 transition-colors">PMEGP & MUDRA Scheme Finder</Link></li>
              <li><Link to="/action-plan" className="hover:text-emerald-400 transition-colors">30-Day Business Launch Plan</Link></li>
              <li><Link to="/report" className="hover:text-emerald-400 transition-colors">PDF Business Plan Generator</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition-colors">Admin & Platform Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">SIH Presentation Note</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All financial calculations are processed deterministically via Python algorithms. Figures displayed represent scenario-based prototype projections and should be validated locally.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 text-center text-xs text-slate-400">
          <p>© 2026 GRAMBIZ AI — Smart India Hackathon Prototype. Built for SIH26091.</p>
        </div>
      </div>
    </footer>
  );
};
