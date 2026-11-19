import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Compass, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Lock, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  GraduationCap, 
  FileText, 
  Cpu, 
  Star,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Zap,
  Target
} from 'lucide-react';
import { mockDemoTestimonials } from '../../data/mockData';
import { VerificationBadge } from '../common/RoleBadge';

export const LandingPage: React.FC<{
  onOpenAuth: () => void;
  onOpenMentorOnboarding: () => void;
  onOpenLearnerOnboarding: () => void;
  onOpenSmartMatchmaker: (courseId?: string) => void;
}> = ({
  onOpenAuth,
  onOpenMentorOnboarding,
  onOpenLearnerOnboarding,
  onOpenSmartMatchmaker
}) => {
  const { setActiveView, setSelectedCourse, courses, users, adminConfig } = useApp();
  const [howItWorksTab, setHowItWorksTab] = useState<'learners' | 'mentors'>('learners');

  // Filter mentors from demo users
  const featuredMentors = users.filter(u => u.role === 'mentor');

  const popularCategories = [
    { title: 'Programming & DSA', icon: Cpu, count: '14 Active Mentors', color: 'from-blue-500/20 to-indigo-500/10' },
    { title: 'Web Development', icon: Compass, count: '18 Active Mentors', color: 'from-emerald-500/20 to-teal-500/10' },
    { title: 'AI & Machine Learning', icon: Sparkles, count: '11 Active Mentors', color: 'from-purple-500/20 to-pink-500/10' },
    { title: 'Data Science', icon: TrendingUp, count: '9 Active Mentors', color: 'from-amber-500/20 to-orange-500/10' },
    { title: 'Cybersecurity', icon: Lock, count: '6 Active Mentors', color: 'from-rose-500/20 to-red-500/10' },
    { title: 'Cloud Computing', icon: Zap, count: '8 Active Mentors', color: 'from-cyan-500/20 to-blue-500/10' },
    { title: 'UI/UX Design', icon: Target, count: '7 Active Mentors', color: 'from-fuchsia-500/20 to-purple-500/10' },
    { title: 'Resume & Interview Prep', icon: Award, count: '15 Active Mentors', color: 'from-emerald-500/20 to-green-500/10' },
    { title: 'Academic & Core Engineering', icon: BookOpen, count: '12 Active Mentors', color: 'from-indigo-500/20 to-violet-500/10' }
  ];

  const faqs = [
    {
      q: 'How is Skill Circle different from traditional online course websites?',
      a: 'Unlike generic pre-recorded bootcamps charging high fees, Skill Circle connects you directly with skilled college seniors who recently cleared the exact placement drives and hackathons you are targeting. Sessions are interactive, personalized, and priced affordably for student budgets.'
    },
    {
      q: 'How does the Assessment & Escrow payment protection work?',
      a: 'When you enroll, your course payment is held securely in escrow. You take an initial Pre-Course Assessment to benchmark your current skills. After completing the course, you take an AI-generated comparable Post-Course Assessment. Once your measurable improvement reaches the configured threshold (e.g. 20%), payment is released to your mentor.'
    },
    {
      q: 'Who can become a mentor on Skill Circle?',
      a: 'Any college senior or skilled student can apply. Mentors submit their college email, Student ID card, and GitHub/LinkedIn credentials. Platform administrators manually review every application before issuing the Verified Student Mentor badge.'
    },
    {
      q: 'What if a learner does not practice and fails the post-course evaluation?',
      a: 'Our platform protects both learners and mentors. If the improvement threshold is not reached, funds are not lost; the mentor can submit a dispute with session attendance logs and assignment feedback. Platform Admins and AI analyze the case to issue a fair resolution.'
    },
    {
      q: 'How are courses priced?',
      a: 'Mentors propose their own pricing within admin bounds, supported by our dynamic pricing recommendation engine. Prices are scaled based on total live hours, difficulty, and hands-on capstone projects to guarantee student affordability.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Verified Peer Learning</span>
            <span className="text-slate-500">•</span>
            <span>Escrow-Protected Progress</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Learn from people who've <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-accent-400 bg-clip-text text-transparent">
              already been there.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Affordable, practical learning from experienced college seniors. Structured roadmaps, 1-on-1 guidance, and verified learning improvements.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveView('explore-courses')}
              className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              <span>Find a Mentor</span>
            </button>
            <button
              onClick={onOpenMentorOnboarding}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Become a Mentor</span>
            </button>
          </div>

          {/* Key Value Proof Bar */}
          <div className="mt-14 pt-8 border-t border-slate-900/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Pricing Model</span>
              <span className="text-sm font-bold text-white">Student-Accessible Peer Rates</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Mentors</span>
              <span className="text-sm font-bold text-white">Verified College Seniors</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Payment Safeguard</span>
              <span className="text-sm font-bold text-emerald-400">Escrow on Measurable Gains</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Community</span>
              <span className="text-sm font-bold text-white">Campus Notes & Cohorts</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. How Skill Circle Works (Interactive Tabbed Diagram) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How Skill Circle Works
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            A transparent, outcome-oriented learning journey for both sides of the campus.
          </p>

          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setHowItWorksTab('learners')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                howItWorksTab === 'learners' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 For College Learners
            </button>
            <button
              onClick={() => setHowItWorksTab('mentors')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                howItWorksTab === 'mentors' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⭐ For Student Mentors
            </button>
          </div>
        </div>

        {howItWorksTab === 'learners' ? (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'Discover', desc: 'Find verified seniors in your skill area matching your schedule and student budget.' },
              { step: '02', title: 'Assess', desc: 'Complete a brief AI-generated pre-assessment to establish your baseline.' },
              { step: '03', title: 'Learn', desc: 'Attend interactive live video sessions with whiteboard, screen share, and direct Q&A.' },
              { step: '04', title: 'Practice', desc: 'Tackle structured homework with automated AI session recaps & code links.' },
              { step: '05', title: 'Re-Assess', desc: 'Take a comparable post-course evaluation measuring tangible skill delta.' },
              { step: '06', title: 'Track', desc: 'Watch your visual skill tree light up and advance toward internship readiness.' }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-4 rounded-2xl relative flex flex-col justify-between group hover:border-brand-500/40 transition-all">
                <div>
                  <span className="text-2xl font-black text-brand-500/30 group-hover:text-brand-400/50 transition-colors font-mono block mb-2">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                {idx < 5 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'Verify', desc: 'Upload college ID & credentials to unlock your official student mentor badge.' },
              { step: '02', title: 'Create', desc: 'Build structured courses with modules, sessions, and dynamic pricing suggestions.' },
              { step: '03', title: 'Teach', desc: 'Host 1-on-1 or small group cohorts in our built-in video classroom.' },
              { step: '04', title: 'Evaluate', desc: 'Review pre & post learner evaluations to verify real student improvement.' },
              { step: '05', title: 'Earn', desc: 'Receive guaranteed escrow payment releases once improvement benchmarks are met.' },
              { step: '06', title: 'Grow', desc: 'Build campus credibility, teaching credentials, and expand your co-mentor network.' }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-4 rounded-2xl relative flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
                <div>
                  <span className="text-2xl font-black text-emerald-500/30 group-hover:text-emerald-400/50 transition-colors font-mono block mb-2">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                {idx < 5 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Learner & Mentor Benefits Side-by-Side */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Learner Card */}
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Benefits for Learners</h3>
            <p className="text-xs text-slate-400 mb-6">
              Skip generic video playlists. Get focused attention from someone who just cleared the hurdle.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Learn affordably:</strong> Transparent pricing tailored to student budgets, never corporate packages.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Direct senior guidance:</strong> Learn the exact patterns, exam shortcuts, and interview strategies that work.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Measurable improvement:</strong> Pre- and post-course evaluations ensure you actually gain actionable proficiency.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Campus Syllabus & Notes Vault:</strong> Access peer-verified lecture notes, lab guides, and exam cheat-sheets.</span>
              </li>
            </ul>

            <button
              onClick={onOpenLearnerOnboarding}
              className="mt-6 text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              Set Up Your Learner Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mentor Card */}
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Benefits for Mentors</h3>
            <p className="text-xs text-slate-400 mb-6">
              Turn your existing knowledge into steady income and impressive resume credentials while still in college.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Earn on your schedule:</strong> Set your own slots, course topics, and fees from your college dorm or library.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Build teaching credibility:</strong> Earn verified mentor badges, student reviews, and platform rankings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Demand Analytics:</strong> See real-time student demand trends before creating a course so sessions fill up.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Peer Co-Mentor Network:</strong> Collaborate with other seniors to co-teach full-stack or multi-disciplinary cohorts.</span>
              </li>
            </ul>

            <button
              onClick={onOpenMentorOnboarding}
              className="mt-6 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Apply as a Senior Mentor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. Popular Skill Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Popular Skill Categories</h2>
            <p className="mt-1 text-xs text-slate-400">
              Curricula designed around what college students actively need for hackathons, semesters, and placements.
            </p>
          </div>
          <button
            onClick={() => setActiveView('explore-courses')}
            className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1"
          >
            Browse all skills <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveView('explore-courses')}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-brand-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white border border-white/5`}>
                    <Icon className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs sm:text-sm group-hover:text-brand-300 transition-colors">
                      {cat.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">{cat.count}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Featured Mentors (Clearly marked demo data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                Demonstration Mentors
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Verified Mentors</h2>
            <p className="mt-1 text-xs text-slate-400">
              High-rated college seniors with proven track records in competitive coding and engineering.
            </p>
          </div>
          <button
            onClick={() => setActiveView('explore-courses')}
            className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1"
          >
            View all mentors <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMentors.map(mentor => (
            <div 
              key={mentor.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name} 
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-white text-sm truncate">{mentor.name}</h4>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{mentor.rating || 4.9}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{mentor.college}</p>
                    <div className="mt-1">
                      <VerificationBadge status={mentor.verification?.status || 'approved'} />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {mentor.bio}
                </p>

                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Teaches</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.skills?.slice(0, 3).map((sk, i) => (
                      <span key={i} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Starting rate</span>
                  <span className="text-sm font-bold text-white font-mono">₹{mentor.hourlyRate || 350}/hr</span>
                </div>
                <button
                  onClick={() => onOpenSmartMatchmaker()}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Match Schedule</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Skill Circle Differentiators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why Skill Circle is Fundamentally Different
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Traditional online platforms sell pre-recorded videos and take zero accountability for whether you actually get better. We aligned platform incentives with real learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-white text-xs sm:text-sm">Affordable Peer Learning</h4>
              <p className="text-xs text-slate-400">Courses priced for college budgets rather than commercial bootcamp margins.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <h4 className="font-bold text-white text-xs sm:text-sm">Verified Student Mentors</h4>
              <p className="text-xs text-slate-400">Every mentor passes manual college ID and technical profile review.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white text-xs sm:text-sm">Escrow on Measurable Gains</h4>
              <p className="text-xs text-slate-400">Funds are held until pre & post test improvement reaches the admin benchmark.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-white text-xs sm:text-sm">Campus Notes & Vault</h4>
              <p className="text-xs text-slate-400">Peer handwritten lecture notes, lab guides, and exam cheat-sheets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials (Sample content clearly marked) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 uppercase mb-2">
            Sample Content • Prototype Testing
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Student Stories & Experiences</h2>
          <p className="text-xs text-slate-400 mt-1">
            How juniors and seniors collaborate across campus boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockDemoTestimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic mb-6 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                <div>
                  <h4 className="font-bold text-white text-xs">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                  <p className="text-[10px] text-brand-400">{t.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-1">Everything you need to know about peer learning and escrow integrity.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group p-4 rounded-xl bg-slate-900/60 border border-slate-800 transition-all">
              <summary className="font-semibold text-white text-xs sm:text-sm cursor-pointer list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="text-slate-500 group-open:rotate-90 transition-transform">▸</span>
              </summary>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-900/40 to-slate-900 border border-brand-500/30 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to learn or mentor on campus?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Join college juniors mastering practical engineering, and seniors earning with reputation and verified impact.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveView('explore-courses')}
                className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-brand-600/30"
              >
                Explore Skills & Courses
              </button>
              <button
                onClick={onOpenMentorOnboarding}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-semibold text-xs transition-all"
              >
                Apply as a Senior Mentor
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
