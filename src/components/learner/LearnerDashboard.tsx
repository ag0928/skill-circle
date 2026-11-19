import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Video, 
  Sparkles, 
  Target, 
  Flame, 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Play, 
  Users, 
  FileText,
  ShieldCheck,
  Zap,
  MessageSquare
} from 'lucide-react';
import { VisualSkillTree } from './VisualSkillTree';
import { WeeklyGoalsWidget } from './WeeklyGoalsWidget';
import { AssessmentEscrowTracker } from './AssessmentEscrowTracker';

export const LearnerDashboard: React.FC<{
  onLaunchLiveClassroom: (courseTitle: string, mentorName: string) => void;
  onLaunchAssessment: (enrollmentId: string, isPreTest: boolean) => void;
  onOpenMatchmaker: (courseId?: string) => void;
}> = ({
  onLaunchLiveClassroom,
  onLaunchAssessment,
  onOpenMatchmaker
}) => {
  const { 
    currentUser, 
    courses, 
    enrollments, 
    resources, 
    posts, 
    setActiveView, 
    setSelectedCourse 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'skill_tree' | 'escrow_assessments' | 'vault_saved'>('overview');

  const myEnrollments = enrollments.filter(e => e.learnerId === currentUser.id);

  const recommendedMentors = [
    {
      name: 'Ananya Verma',
      college: 'Apex Engineering Institute [Demo Campus]',
      skill: 'Data Structures & Algorithms',
      rating: 4.9,
      hourlyRate: 350,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      reason: 'Recommended because you want to learn DSA for internship prep, matches your weekday evening timing, and specializes in beginner-to-intermediate transitions.'
    },
    {
      name: 'Vikramaditya Rao',
      college: 'National Polytechnic College [Demo Campus]',
      skill: 'React & Full-Stack MERN',
      rating: 4.8,
      hourlyRate: 400,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      reason: 'Recommended for your project development goal; teaches hackathon-ready frontend architecture within your ₹400-₹900 budget preference.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Welcome & XP Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🎓 Active Learner
              </span>
              <span className="text-xs text-slate-400">{currentUser.college}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Goal: {currentUser.learningGoals?.join(' • ') || 'Internship & Placement Readiness'}
            </p>
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          <div className="text-center px-3 py-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Level & XP</span>
            <span className="text-base font-extrabold text-brand-400 font-mono">
              {currentUser.xp || 1420} XP
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center px-3 py-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Daily Streak</span>
            <span className="text-base font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{currentUser.streakDays || 7} Days</span>
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center px-3 py-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Badges</span>
            <span className="text-base font-extrabold text-emerald-400">
              {currentUser.badges?.length || 4}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'bg-brand-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('skill_tree')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'skill_tree' 
              ? 'bg-brand-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Visual Skill Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow_assessments')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'escrow_assessments' 
              ? 'bg-brand-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Escrow & Assessments</span>
          {myEnrollments.length > 0 && (
            <span className="bg-brand-500/20 text-brand-300 text-[10px] px-1.5 py-0.2 rounded-full">
              {myEnrollments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('vault_saved')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'vault_saved' 
              ? 'bg-brand-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Campus Notes Vault Bookmarks</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main 2-column feed */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Live Mentorship Session */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-brand-950/30 border border-brand-500/30 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Next Live Video Class
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Today, 6:00 PM - 7:00 PM</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Session 4: Linked List Reversal & Fast/Slow Pointer Cycles
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Course: Data Structures & Algorithms with Mentor Ananya Verma
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Video className="w-4 h-4 text-brand-400" />
                  <span>Built-in WebRTC Video, Interactive Whiteboard & Session Recording</span>
                </div>

                <button
                  onClick={() => onLaunchLiveClassroom('Data Structures & Algorithms', 'Ananya Verma')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/30 hover:scale-105"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Live Classroom</span>
                </button>
              </div>
            </div>

            {/* Current Enrolled Courses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-400" />
                  <span>My Enrolled Courses ({myEnrollments.length})</span>
                </h3>
                <button
                  onClick={() => setActiveView('explore-courses')}
                  className="text-xs text-brand-400 hover:underline"
                >
                  Explore more
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {myEnrollments.map(enr => (
                  <div 
                    key={enr.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{enr.courseTitle}</h4>
                        <p className="text-xs text-slate-400">
                          Mentor: {enr.mentorName} • Sessions: {enr.sessionsCompleted} of {enr.totalSessions} completed
                        </p>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 w-fit">
                        {enr.paymentStatus}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Course Completion</span>
                        <span className="font-mono text-white">{enr.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-500 h-full rounded-full transition-all"
                          style={{ width: `${enr.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <div className="text-[11px] text-slate-400">
                        {enr.preAssessmentScore !== undefined ? (
                          <span className="text-emerald-400">Pre-test: {enr.preAssessmentScore}%</span>
                        ) : (
                          <span className="text-amber-400">Pre-test pending</span>
                        )}
                        {enr.postAssessmentScore !== undefined && (
                          <span className="text-emerald-400 ml-2">| Post-test: {enr.postAssessmentScore}%</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {enr.preAssessmentScore === undefined && (
                          <button
                            onClick={() => onLaunchAssessment(enr.id, true)}
                            className="text-xs text-brand-400 hover:underline font-semibold"
                          >
                            Take Pre-Assessment →
                          </button>
                        )}
                        {enr.preAssessmentScore !== undefined && enr.postAssessmentScore === undefined && (
                          <button
                            onClick={() => onLaunchAssessment(enr.id, false)}
                            className="text-xs text-emerald-400 hover:underline font-semibold"
                          >
                            Take Final Assessment →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommended Mentors with Explainability */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    <span>AI-Recommended Mentors for Your Profile</span>
                  </h3>
                  <p className="text-xs text-slate-400">Matched on skill goals, budget, and evening availability</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedMentors.map((rm, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <img src={rm.avatar} alt={rm.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                        <div>
                          <h4 className="font-bold text-white text-xs">{rm.name}</h4>
                          <p className="text-[10px] text-slate-400 truncate">{rm.college}</p>
                          <span className="text-[10px] text-brand-400 font-semibold">{rm.skill}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 italic leading-relaxed">
                        "{rm.reason}"
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="font-bold text-white font-mono">₹{rm.hourlyRate}/hr</span>
                      <button
                        onClick={() => onOpenMatchmaker()}
                        className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold"
                      >
                        Match Availability
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            
            {/* Weekly Micro Goals Widget */}
            <WeeklyGoalsWidget />

            {/* Quick Campus Vault Bookmarks preview */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                  <span>Campus Notes Bookmarks</span>
                </h4>
                <button onClick={() => setActiveView('notes-vault')} className="text-[11px] text-brand-400 hover:underline">
                  View all
                </button>
              </div>

              <div className="space-y-2">
                {resources.slice(0, 2).map(res => (
                  <div key={res.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      {res.subject}
                    </span>
                    <h5 className="font-semibold text-white text-xs line-clamp-1">{res.title}</h5>
                    <p className="text-[10px] text-slate-400 truncate">Uploaded by {res.uploaderName}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges preview */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Earned Badges</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.badges?.map((badge, idx) => (
                  <span 
                    key={idx}
                    className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-medium"
                  >
                    🏆 {badge}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Visual Skill Tree */}
      {activeTab === 'skill_tree' && (
        <VisualSkillTree />
      )}

      {/* Tab 3: Escrow & Assessments */}
      {activeTab === 'escrow_assessments' && (
        <AssessmentEscrowTracker onLaunchAssessment={onLaunchAssessment} />
      )}

      {/* Tab 4: Campus Notes Vault */}
      {activeTab === 'vault_saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Your Saved Campus Study Materials</h3>
            <button
              onClick={() => setActiveView('notes-vault')}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
            >
              Browse Full Campus Vault
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.filter(r => r.isSaved).map(res => (
              <div key={res.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{res.subject}</span>
                  <span className="text-[10px] text-brand-400">{res.resourceType}</span>
                </div>
                <h4 className="text-xs text-slate-200 font-semibold">{res.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{res.description}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>👍 {res.upvotes} upvotes</span>
                  <span className="text-emerald-400">Verified Peer Note</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
