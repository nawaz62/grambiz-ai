import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Play, ShieldAlert, Sliders, BarChart3, MapPin, Award, FileText, UserCheck, LayoutDashboard, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { demoMode, toggleDemoMode, startJudgeDemo, user, logout } = useAuth();

  const navLinks = [
    { path: '/profile', label: 'Profile', icon: UserCheck },
    { path: '/advisor', label: 'AI Advisor', icon: Cpu },
    { path: '/recommendations', label: 'Matches', icon: Sparkles },
    { path: '/simulator', label: 'Simulator', icon: Sliders },
    { path: '/what-if', label: 'What-If?', icon: BarChart3 },
    { path: '/stress-test', label: 'Stress Test', icon: ShieldAlert },
    { path: '/risk-radar', label: 'Risk Radar', icon: BarChart3 },
    { path: '/market-intelligence', label: 'Market', icon: MapPin },
    { path: '/schemes', label: 'Gov Schemes', icon: Award },
    { path: '/action-plan', label: 'Action Plan', icon: FileText },
    { path: '/report', label: 'Business Plan', icon: FileText },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Demo Bar */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-slate-900 px-4 py-1 text-xs flex justify-between items-center text-emerald-200 border-b border-emerald-800/40">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            SIH 2026 SIH26091
          </span>
          <span className="hidden sm:inline text-slate-300">"Test Your Business Before You Invest."</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDemoMode}
            className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all flex items-center space-x-1 ${
              demoMode
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping inline-block mr-1"></span>
            <span>DEMO MODE: {demoMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={startJudgeDemo}
            className="px-3 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 transition-all flex items-center space-x-1 shadow-md shadow-amber-500/20"
          >
            <Play className="w-3 h-3 fill-slate-950" />
            <span>JUDGE DEMO (3-MIN TOUR)</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                GRAMBIZ <span className="text-emerald-400 ml-1 font-bold text-sm bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">GenAI Financial Co-Pilot</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Auth Quick Action */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                >
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
