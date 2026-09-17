import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, ArrowRight, ArrowLeft, X, CheckCircle2, Sparkles, Trophy } from 'lucide-react';

export const JudgeDemoModal: React.FC = () => {
  const navigate = useNavigate();
  const { judgeDemoActive, judgeDemoStep, nextJudgeStep, prevJudgeStep, endJudgeDemo } = useAuth();

  if (!judgeDemoActive) return null;

  const steps = [
    {
      step: 1,
      title: "Step 1: Entrepreneur Profile",
      desc: "Loaded prefilled profile of Rahul Kumar from Lucknow, UP (₹1,00,000 capital, Farming experience).",
      route: "/profile",
      actionText: "View Profile Data & Analyze"
    },
    {
      step: 2,
      title: "Step 2: AI Business Recommendations",
      desc: "AI Advisor extracts profile intent and generates top matched rural enterprise models.",
      route: "/advisor",
      actionText: "See Top 3 Business Fits"
    },
    {
      step: 3,
      title: "Step 3: Business Fit Score (91/100)",
      desc: "Review Dairy Farming Fit Score breakdown across Budget, Skill, Location, Demand & Risk.",
      route: "/recommendations",
      actionText: "Inspect Fit Score Cards"
    },
    {
      step: 4,
      title: "Step 4: Dairy Farming Deep Dive",
      desc: "Open specific business model specs, machinery requirements, 'Why Recommended' & 'Why Not'.",
      route: "/business/dairy-farming",
      actionText: "Explore Dairy Farming Specs"
    },
    {
      step: 5,
      title: "Step 5: Live Financial Simulator",
      desc: "Adjust capital, sales volume, and workforce sliders with real-time Recharts financial updates.",
      route: "/simulator",
      actionText: "Open Financial Sliders"
    },
    {
      step: 6,
      title: "Step 6: Open What-If Sandbox",
      desc: "Test market shocks digitally before investing real money.",
      route: "/what-if",
      actionText: "Go to What-If Sandbox"
    },
    {
      step: 7,
      title: "Step 7: Click 'Sales -20%' Shock",
      desc: "Simulate immediate 20% drop in local daily milk sales volume.",
      route: "/what-if",
      actionText: "Trigger Sales -20% Scenario"
    },
    {
      step: 8,
      title: "Step 8: Review Before vs After Diffs",
      desc: "Compare BEFORE vs AFTER monthly profit, break-even period, and AI risk commentary.",
      route: "/what-if",
      actionText: "Examine Financial Diffs"
    },
    {
      step: 9,
      title: "Step 9: Run Automated Stress Test",
      desc: "Run 5 market shocks to evaluate Business Resilience Score (74/100).",
      route: "/stress-test",
      actionText: "Run 5-Scenario Matrix"
    },
    {
      step: 10,
      title: "Step 10: Generate 30-Day Action Plan",
      desc: "View step-by-step 30-Day launch timeline customized for Dairy Farming.",
      route: "/action-plan",
      actionText: "View 30-Day Action Plan"
    },
    {
      step: 11,
      title: "Step 11: Export Formal Business Plan PDF",
      desc: "Generate professional report ready for bank loan application or PMEGP submission.",
      route: "/report",
      actionText: "View Report & Download PDF"
    }
  ];

  const currentStepData = steps[judgeDemoStep - 1];

  const handleGoToStep = () => {
    navigate(currentStepData.route);
    if (judgeDemoStep < 11) {
      nextJudgeStep();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-2xl p-5 text-slate-100 backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">SIH Judge Demo Presentation</h4>
            <p className="text-[11px] text-slate-400 font-mono">Step {judgeDemoStep} of 11</p>
          </div>
        </div>

        <button
          onClick={endJudgeDemo}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full my-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
          style={{ width: `${(judgeDemoStep / 11) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="my-3">
        <h3 className="text-sm font-bold text-white flex items-center mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" />
          {currentStepData.title}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {currentStepData.desc}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={prevJudgeStep}
          disabled={judgeDemoStep === 1}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        <button
          onClick={handleGoToStep}
          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-md shadow-amber-500/30 flex items-center space-x-1.5"
        >
          <span>{currentStepData.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
