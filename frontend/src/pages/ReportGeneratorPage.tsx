import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FinancialResults, RiskRadarResult, StressTestResult, DistrictMarketIntelligence } from '../types';
import { Printer, Download, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const ReportGeneratorPage: React.FC = () => {
  const { profile, activeBusiness } = useAuth();
  const [financials, setFinancials] = useState<FinancialResults | null>(null);
  const [risk, setRisk] = useState<RiskRadarResult | null>(null);
  const [stress, setStress] = useState<StressTestResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const business = activeBusiness || {
    id: 'dairy-farming',
    name: 'Dairy Farming (2-5 Cows)',
    category: 'Agriculture & Livestock',
    minimum_investment: 80000,
    recommended_investment: 150000,
    equipment_cost: 45000,
    working_capital: 35000,
    estimated_monthly_revenue: 42000,
    estimated_monthly_expenses: 22000,
    expected_profit: 20000,
    break_even_months: 7.5,
    risk_level: 'Medium',
    required_skills: ['Farming', 'Animal Care'],
    location_suitability: ['Rural'],
    demand_assumptions: 'High daily local milk demand',
    description: 'Dairy farm setup'
  };

  useEffect(() => {
    async function load() {
      try {
        const finInputs = {
          initial_investment: business.recommended_investment,
          equipment_cost: business.equipment_cost,
          working_capital: business.working_capital,
          monthly_sales: business.estimated_monthly_revenue,
          monthly_expenses: business.estimated_monthly_expenses,
          variable_cost_percent: 40,
          fixed_costs: 0,
          growth_rate_annual: 10,
          demand_change_percent: 0,
          cost_inflation_percent: 0,
          loan_amount: 0,
          interest_rate_annual: 9.5,
          loan_tenure_years: 5,
          workers_count: 1
        };
        const fin = await api.calculateFinancials(finInputs);
        setFinancials(fin);

        const rsk = await api.getRiskRadar(finInputs, profile.capital);
        setRisk(rsk);

        const str = await api.runStressTest(business.id, business.name, finInputs);
        setStress(str);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [profile, activeBusiness]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    const element = document.getElementById('report-document');
    const opt = {
      margin:       0.5,
      filename:     `GRAMBIZ_Business_Plan_${profile.name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsGenerating(false);
    }).catch(() => {
      setIsGenerating(false);
      window.print();
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div>
            <h1 className="text-2xl font-black text-white">Business Plan Executive Report</h1>
            <p className="text-xs text-slate-400">Formal PDF report generated for bank loan application & PMEGP submission</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors text-xs flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors text-xs flex items-center space-x-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>

        {/* Printable / Downloadable PDF Document */}
        <div id="report-document" className="bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl text-slate-100 space-y-8 shadow-2xl">
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 flex justify-between items-start">
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center mb-1">
                GRAMBIZ <span className="text-emerald-400 ml-1">AI</span>
              </div>
              <p className="text-xs text-slate-400">GenAI Financial & Risk Co-Pilot Report • SIH 2026</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Report ID: #GB-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          {/* Section 1: Entrepreneur & Project Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1">1. Entrepreneur Profile</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div><span className="text-slate-400 block">Name:</span> <strong>{profile.name}</strong></div>
              <div><span className="text-slate-400 block">Location:</span> <strong>{profile.district}, {profile.state}</strong></div>
              <div><span className="text-slate-400 block">Available Capital:</span> <strong className="text-emerald-400">₹{profile.capital.toLocaleString()}</strong></div>
              <div><span className="text-slate-400 block">Experience:</span> <strong>{profile.work_experience || 'Farming'}</strong></div>
            </div>
          </div>

          {/* Section 2: Selected Business Model */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1">2. Target Enterprise Selection</h3>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
              <h4 className="text-base font-bold text-white">{business.name}</h4>
              <p className="text-slate-300">{business.description}</p>
              <div className="grid grid-cols-3 gap-2 pt-2 text-slate-400">
                <div>Category: <strong className="text-slate-200">{business.category}</strong></div>
                <div>Min Capital: <strong className="text-slate-200">₹{business.minimum_investment.toLocaleString()}</strong></div>
                <div>Risk Level: <strong className="text-emerald-400">{business.risk_level}</strong></div>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Projections */}
          {financials && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1">3. Financial Projections & Cash Flow</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div><span className="text-slate-400 block">Monthly Revenue:</span> <strong className="text-emerald-400">₹{financials.monthly_revenue.toLocaleString()}</strong></div>
                <div><span className="text-slate-400 block">Monthly Expenses:</span> <strong className="text-rose-400">₹{financials.monthly_expenses.toLocaleString()}</strong></div>
                <div><span className="text-slate-400 block">Monthly Net Profit:</span> <strong className="text-white">₹{financials.monthly_net_profit.toLocaleString()}</strong></div>
                <div><span className="text-slate-400 block">Break-even Period:</span> <strong className="text-amber-400">{financials.break_even_months} Mos</strong></div>
              </div>
            </div>
          )}

          {/* Section 4: Risk Radar & Stress Test */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">Overall Risk Score</span>
              <strong className="text-xl text-emerald-400">{risk ? `${risk.overall_risk_score}/100 (${risk.overall_risk_level})` : 'Medium'}</strong>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">Business Resilience Score</span>
              <strong className="text-xl text-teal-400">{stress ? `${stress.resilience_score}/100 (${stress.resilience_grade})` : '74/100'}</strong>
            </div>
          </div>

          {/* Section 5: Mandatory Disclaimer */}
          <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 leading-normal">
            <strong>Legal & Analytical Disclaimer:</strong> Figures presented in this report are calculated using mathematical sensitivity algorithms based on standard prototype assumptions. Actual returns depend on local market conditions, labor, and personal execution. This report does not constitute a guaranteed financial return or government loan approval.
          </div>
        </div>
      </div>
    </div>
  );
};
