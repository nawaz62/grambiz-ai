import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JudgeDemoModal } from './components/JudgeDemoModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { AIAdvisorPage } from './pages/AIAdvisorPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { FinancialSimulatorPage } from './pages/FinancialSimulatorPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { StressTestPage } from './pages/StressTestPage';
import { RiskRadarPage } from './pages/RiskRadarPage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { SchemesPage } from './pages/SchemesPage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { ReportGeneratorPage } from './pages/ReportGeneratorPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/advisor" element={<AIAdvisorPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/business/:id" element={<BusinessDetailPage />} />
              <Route path="/simulator" element={<FinancialSimulatorPage />} />
              <Route path="/what-if" element={<WhatIfSimulatorPage />} />
              <Route path="/stress-test" element={<StressTestPage />} />
              <Route path="/risk-radar" element={<RiskRadarPage />} />
              <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
              <Route path="/schemes" element={<SchemesPage />} />
              <Route path="/action-plan" element={<ActionPlanPage />} />
              <Route path="/report" element={<ReportGeneratorPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>
          </main>
          <Footer />
          <JudgeDemoModal />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
