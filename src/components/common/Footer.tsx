import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, Heart, GitBranch, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                SC
              </div>
              <span className="font-bold text-white text-base">Skill Circle</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Peer-to-peer learning marketplace designed for college students. Learn skills affordably from experienced seniors with measurable improvement benchmarks.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Escrow Protected Peer Learning</span>
            </div>
          </div>

          {/* Platform Pillars */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('explore-courses')} className="hover:text-white transition-colors">
                  Explore Courses & Mentors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('notes-vault')} className="hover:text-white transition-colors">
                  Campus Syllabus & Notes Vault
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('community')} className="hover:text-white transition-colors">
                  Student Discussions & Cohorts
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('learner-dashboard')} className="hover:text-white transition-colors">
                  Interactive Visual Skill Tree
                </button>
              </li>
            </ul>
          </div>

          {/* Student Mentors */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">For Mentors</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('mentor-dashboard')} className="hover:text-white transition-colors">
                  Mentor Portal & Studio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('mentor-dashboard')} className="hover:text-white transition-colors">
                  Verification Guidelines (.edu / College ID)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('mentor-dashboard')} className="hover:text-white transition-colors">
                  Cohort Demand Analytics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('mentor-dashboard')} className="hover:text-white transition-colors">
                  Peer Co-Mentor Network
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Integrity */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Integrity & Escrow</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                <span>Pre & Post Assessment Verification</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Razorpay Architecture Escrow Holding</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>AI-Assisted Dispute Arbitration</span>
              </li>
              <li>
                <button onClick={() => setActiveView('admin-dashboard')} className="text-purple-400 hover:text-purple-300 font-medium">
                  Admin Dashboard Controls →
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Prototype & Transparency Notice */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            Skill Circle Prototype. All campus names, mentor profiles, and test rubrics are demonstration placeholders. Pricing & verification thresholds are fully configurable via Admin.
          </p>
          <div className="flex items-center gap-1">
            <span>Built for students, by students</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
