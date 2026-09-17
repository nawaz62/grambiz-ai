import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EntrepreneurProfile } from '../types';
import { User, DollarSign, Briefcase, Target, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EntrepreneurProfile>(profile);

  const handleNext = () => setStep(prev => Math.min(4, prev + 1));
  const handlePrev = () => setStep(prev => Math.max(1, prev - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    navigate('/advisor');
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step {step} of 4</span>
          <h1 className="text-3xl font-black text-white mt-1">Entrepreneur Business Profile</h1>
          <p className="text-xs text-slate-400">Enter your details to generate custom financial modeling & risk analysis</p>
        </div>

        {/* Multi-step progress bar */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { num: 1, label: 'Personal & Location' },
            { num: 2, label: 'Capital & Finance' },
            { num: 3, label: 'Skills & Background' },
            { num: 4, label: 'Sectors & Goals' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                step === s.num
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                  : step > s.num
                  ? 'bg-slate-900 border-slate-700 text-slate-300'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <div className="text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center">
                <User className="w-4 h-4 mr-2" /> Step 1: Personal & Geographic Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age || 28}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Area Type</label>
                  <select
                    value={formData.area_type}
                    onChange={(e) => setFormData({ ...formData, area_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Rural">Rural Village</option>
                    <option value="Semi-Urban">Semi-Urban / Small Town</option>
                    <option value="Urban">Urban City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Preferred Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Regional">Other Regional</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" /> Step 2: Financial Capacity & Capital
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Available Initial Capital (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.capital}
                    onChange={(e) => setFormData({ ...formData, capital: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Current Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Existing Savings Reserve (₹)</label>
                  <input
                    type="number"
                    value={formData.existing_savings}
                    onChange={(e) => setFormData({ ...formData, existing_savings: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estimated Loan Requirement (₹)</label>
                  <input
                    type="number"
                    value={formData.loan_requirement}
                    onChange={(e) => setFormData({ ...formData, loan_requirement: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> Step 3: Skills & Work Experience
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Primary Work Experience</label>
                  <input
                    type="text"
                    value={formData.work_experience}
                    onChange={(e) => setFormData({ ...formData, work_experience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Farming, Animal Husbandry, Retail"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Key Practical Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Farming, Cattle Feed, Machinery repair"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center">
                <Target className="w-4 h-4 mr-2" /> Step 4: Preferences & Risk Tolerance
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={formData.target_monthly_income}
                    onChange={(e) => setFormData({ ...formData, target_monthly_income: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Risk Tolerance Level</label>
                  <select
                    value={formData.risk_tolerance}
                    onChange={(e) => setFormData({ ...formData, risk_tolerance: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Low">Low Risk (Stable conservative returns)</option>
                    <option value="Medium">Medium Risk (Balanced growth)</option>
                    <option value="High">High Risk (High growth potential)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-800 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center space-x-2 text-sm"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze My Business Profile</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
