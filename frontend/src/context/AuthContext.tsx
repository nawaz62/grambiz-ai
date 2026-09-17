import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, EntrepreneurProfile, BusinessSummary } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: EntrepreneurProfile;
  activeBusiness: BusinessSummary | null;
  demoMode: boolean;
  judgeDemoActive: boolean;
  judgeDemoStep: number;
  setProfile: (p: EntrepreneurProfile) => void;
  setActiveBusiness: (b: BusinessSummary) => void;
  toggleDemoMode: () => void;
  startJudgeDemo: () => void;
  nextJudgeStep: () => void;
  prevJudgeStep: () => void;
  endJudgeDemo: () => void;
  loginAsDemo: () => void;
  logout: () => void;
}

const DEFAULT_PROFILE: EntrepreneurProfile = {
  name: "Rahul Kumar",
  age: 28,
  gender: "Male",
  state: "Uttar Pradesh",
  district: "Lucknow",
  area_type: "Rural",
  language: "Hindi",
  capital: 100000,
  monthly_income: 12000,
  existing_savings: 25000,
  loan_requirement: 50000,
  existing_business: "None (Family farming background)",
  skills: ["Farming", "Animal Husbandry", "Tractor Driving"],
  work_experience: "Farming",
  education: "Secondary School (10th Pass)",
  business_interests: ["Dairy Farming", "Poultry Farming", "Mushroom Farming"],
  preferred_sectors: ["Agriculture & Livestock", "Agro-Processing"],
  target_monthly_income: 25000,
  risk_tolerance: "Medium",
  business_goal: "Start a profitable dairy or livestock enterprise in my village to double family income."
};

const DEFAULT_BUSINESS: BusinessSummary = {
  id: "dairy-farming",
  name: "Dairy Farming (2-5 Cows/Buffaloes)",
  category: "Agriculture & Livestock",
  minimum_investment: 80000,
  recommended_investment: 150000,
  equipment_cost: 45000,
  working_capital: 35000,
  estimated_monthly_revenue: 42000,
  estimated_monthly_expenses: 22000,
  expected_profit: 20000,
  break_even_months: 7.5,
  risk_level: "Medium",
  required_skills: ["Farming", "Animal Care", "Local Milk Supply Network"],
  location_suitability: ["Rural", "Semi-Urban"],
  demand_assumptions: "High daily local demand for fresh milk and ghee; tie-ups with local cooperatives (AMUL, Mother Dairy).",
  description: "Establishment of a small-scale dairy farm with high-yielding milch cattle, automated/semi-automated milking equipment, and local milk collection route setup."
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('grambiz_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 1,
      email: "rahul.demo@grambiz.ai",
      full_name: "Rahul Kumar (Demo Entrepreneur)",
      is_demo: true
    };
  });

  const [profile, setProfileState] = useState<EntrepreneurProfile>(() => {
    const saved = localStorage.getItem('grambiz_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PROFILE;
  });

  const [activeBusiness, setActiveBusinessState] = useState<BusinessSummary | null>(() => {
    const saved = localStorage.getItem('grambiz_active_business');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_BUSINESS;
  });

  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [judgeDemoActive, setJudgeDemoActive] = useState<boolean>(false);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(1);

  const setProfile = (p: EntrepreneurProfile) => {
    setProfileState(p);
    localStorage.setItem('grambiz_profile', JSON.stringify(p));
  };

  const setActiveBusiness = (b: BusinessSummary) => {
    setActiveBusinessState(b);
    localStorage.setItem('grambiz_active_business', JSON.stringify(b));
  };

  const toggleDemoMode = () => {
    if (!demoMode) {
      setProfileState(DEFAULT_PROFILE);
      setActiveBusinessState(DEFAULT_BUSINESS);
      localStorage.setItem('grambiz_profile', JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem('grambiz_active_business', JSON.stringify(DEFAULT_BUSINESS));
      setDemoMode(true);
    } else {
      setDemoMode(false);
    }
  };

  const startJudgeDemo = () => {
    setProfileState(DEFAULT_PROFILE);
    setActiveBusinessState(DEFAULT_BUSINESS);
    localStorage.setItem('grambiz_profile', JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem('grambiz_active_business', JSON.stringify(DEFAULT_BUSINESS));
    setDemoMode(true);
    setJudgeDemoStep(1);
    setJudgeDemoActive(true);
  };

  const nextJudgeStep = () => {
    setJudgeDemoStep(prev => Math.min(11, prev + 1));
  };

  const prevJudgeStep = () => {
    setJudgeDemoStep(prev => Math.max(1, prev - 1));
  };

  const endJudgeDemo = () => {
    setJudgeDemoActive(false);
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: 1,
      email: "rahul.demo@grambiz.ai",
      full_name: "Rahul Kumar (Demo Entrepreneur)",
      is_demo: true
    };
    setUser(demoUser);
    localStorage.setItem('grambiz_user', JSON.stringify(demoUser));
    setProfileState(DEFAULT_PROFILE);
    setActiveBusinessState(DEFAULT_BUSINESS);
    localStorage.setItem('grambiz_profile', JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem('grambiz_active_business', JSON.stringify(DEFAULT_BUSINESS));
    setDemoMode(true);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('grambiz_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        activeBusiness,
        demoMode,
        judgeDemoActive,
        judgeDemoStep,
        setProfile,
        setActiveBusiness,
        toggleDemoMode,
        startJudgeDemo,
        nextJudgeStep,
        prevJudgeStep,
        endJudgeDemo,
        loginAsDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
