import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  Users, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  Bell, 
  Calculator, 
  GitFork, 
  ChevronDown, 
  UserCheck, 
  Award,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { RoleBadge } from './RoleBadge';

export const Navbar: React.FC<{
  onOpenNotifications: () => void;
  onOpenAICopilot: () => void;
  onOpenPriceCalculator: () => void;
  onOpenAuth: () => void;
  onOpenMentorOnboarding: () => void;
}> = ({
  onOpenNotifications,
  onOpenAICopilot,
  onOpenPriceCalculator,
  onOpenAuth,
  onOpenMentorOnboarding
}) => {
  const { 
    currentUser, 
    switchRole, 
    notifications, 
    activeView, 
    setActiveView 
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
                <circle cx="19" cy="5" r="2" fill="white" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                Skill<span className="text-brand-400">Circle</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wider">
                PEER LEARNING
              </span>
            </div>
          </button>

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
            <button
              onClick={() => setActiveView('explore-courses')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'explore-courses' ? 'text-brand-400 bg-brand-500/10' : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Explore Skills
            </button>

            <button
              onClick={() => setActiveView('explore-courses')}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Find Mentors
            </button>

            <button
              onClick={() => setActiveView('notes-vault')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'notes-vault' ? 'text-brand-400 bg-brand-500/10' : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Campus Vault
            </button>

            <button
              onClick={() => setActiveView('community')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'community' ? 'text-brand-400 bg-brand-500/10' : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Community
            </button>

            {currentUser.role !== 'mentor' && (
              <button
                onClick={onOpenMentorOnboarding}
                className="px-3 py-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Become a Mentor
              </button>
            )}
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5">
          
          {/* AI Copilot shortcut */}
          <button
            onClick={onOpenAICopilot}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600/20 to-accent-600/20 hover:from-brand-600/30 hover:to-accent-600/30 text-brand-300 border border-brand-500/30 transition-all shadow-sm"
            title="Ask AI Doubt-Solver & Roadmap Advisor"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Copilot</span>
          </button>

          {/* Pricing Recommendation Tool */}
          <button
            onClick={onOpenPriceCalculator}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Open Dynamic Pricing Suggester"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            title="View Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher & Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-left"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-lg object-cover border border-slate-700"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <RoleBadge role={currentUser.role} />
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsRoleDropdownOpen(false)}
              >
                <div className="p-2.5 border-b border-slate-800 mb-1">
                  <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.college}</div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-brand-400 font-mono">
                    <span>{currentUser.xp || 0} XP</span>
                    <span>•</span>
                    <span>🔥 {currentUser.streakDays || 1}-day streak</span>
                  </div>
                </div>

                <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Switch Active Role (Demo)
                </div>

                <button
                  onClick={() => switchRole('learner')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    currentUser.role === 'learner' ? 'bg-brand-500/15 text-brand-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Rohan (Learner)</span>
                  </div>
                  {currentUser.role === 'learner' && <UserCheck className="w-3.5 h-3.5 text-brand-400" />}
                </button>

                <button
                  onClick={() => switchRole('mentor')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    currentUser.role === 'mentor' ? 'bg-brand-500/15 text-brand-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-400" />
                    <span>Ananya (Verified Mentor)</span>
                  </div>
                  {currentUser.role === 'mentor' && <UserCheck className="w-3.5 h-3.5 text-brand-400" />}
                </button>

                <button
                  onClick={() => switchRole('admin')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    currentUser.role === 'admin' ? 'bg-brand-500/15 text-brand-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Priya (Platform Admin)</span>
                  </div>
                  {currentUser.role === 'admin' && <UserCheck className="w-3.5 h-3.5 text-brand-400" />}
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    if (currentUser.role === 'learner') setActiveView('learner-dashboard');
                    else if (currentUser.role === 'mentor') setActiveView('mentor-dashboard');
                    else setActiveView('admin-dashboard');
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs text-white hover:bg-slate-800 font-medium"
                >
                  Go to {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard
                </button>

                <button
                  onClick={onOpenAuth}
                  className="w-full text-left p-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Account / Sign In Options
                </button>
              </div>
            )}
          </div>

          {/* Quick Dashboard Action */}
          <button
            onClick={() => {
              if (currentUser.role === 'learner') setActiveView('learner-dashboard');
              else if (currentUser.role === 'mentor') setActiveView('mentor-dashboard');
              else setActiveView('admin-dashboard');
            }}
            className="hidden sm:inline-flex bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-brand-600/20"
          >
            Dashboard
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 bg-slate-950 border-b border-slate-800 space-y-2 text-xs">
          <button
            onClick={() => { setActiveView('explore-courses'); setIsMobileMenuOpen(false); }}
            className="w-full text-left p-2 rounded-lg text-slate-300 hover:bg-slate-800 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-brand-400" /> Explore Skills & Mentors
          </button>
          <button
            onClick={() => { setActiveView('notes-vault'); setIsMobileMenuOpen(false); }}
            className="w-full text-left p-2 rounded-lg text-slate-300 hover:bg-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-brand-400" /> Campus Syllabus & Notes Vault
          </button>
          <button
            onClick={() => { setActiveView('community'); setIsMobileMenuOpen(false); }}
            className="w-full text-left p-2 rounded-lg text-slate-300 hover:bg-slate-800 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-brand-400" /> Student Community
          </button>
          <button
            onClick={() => { onOpenAICopilot(); setIsMobileMenuOpen(false); }}
            className="w-full text-left p-2 rounded-lg text-brand-300 hover:bg-slate-800 flex items-center gap-2 font-medium"
          >
            <Sparkles className="w-4 h-4 text-brand-400" /> AI Academic Copilot
          </button>
          <button
            onClick={() => { onOpenMentorOnboarding(); setIsMobileMenuOpen(false); }}
            className="w-full text-left p-2 rounded-lg text-emerald-400 hover:bg-slate-800 flex items-center gap-2 font-medium"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Become a Mentor
          </button>
        </div>
      )}
    </header>
  );
};
