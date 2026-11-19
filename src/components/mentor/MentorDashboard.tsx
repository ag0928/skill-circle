import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  Calendar, 
  Star, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Video, 
  Clock, 
  Plus, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Share2,
  ChevronRight
} from 'lucide-react';
import { VerificationBadge } from '../common/RoleBadge';
import { CourseCreatorModal } from './CourseCreatorModal';
import { CohortDemandView } from './CohortDemandView';
import { AutomatedSessionRecapHub } from './AutomatedSessionRecapHub';
import { PeerMentorNetworkView } from './PeerMentorNetworkView';
import { DisputeModal } from './DisputeModal';
import { Enrollment } from '../../types';

export const MentorDashboard: React.FC<{
  onLaunchLiveClassroom: (courseTitle: string, learnerName: string) => void;
  onOpenPriceCalculator: () => void;
}> = ({ onLaunchLiveClassroom, onOpenPriceCalculator }) => {
  const { 
    currentUser, 
    courses, 
    enrollments, 
    disputes, 
    adminConfig,
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'demand' | 'recaps' | 'peer_network'>('overview');
  const [isCourseCreatorOpen, setIsCourseCreatorOpen] = useState(false);
  const [disputeEnrollment, setDisputeEnrollment] = useState<Enrollment | null>(null);

  // Filter courses owned by this mentor
  const myCourses = courses.filter(c => c.mentorId === currentUser.id);

  // Filter enrollments for this mentor
  const mentorEnrollments = enrollments.filter(e => e.mentorId === currentUser.id);

  // Financial calculations
  const totalEarnings = mentorEnrollments.reduce((acc, e) => acc + (e.mentorEarnings || 0), 0);
  const releasedEarnings = mentorEnrollments
    .filter(e => e.paymentStatus === 'Released')
    .reduce((acc, e) => acc + (e.mentorEarnings || 0), 0);
  const escrowHeldEarnings = mentorEnrollments
    .filter(e => e.paymentStatus === 'Payment Held' || e.paymentStatus === 'Eligible for Release')
    .reduce((acc, e) => acc + (e.mentorEarnings || 0), 0);
  const disputedEarnings = mentorEnrollments
    .filter(e => e.paymentStatus === 'Disputed')
    .reduce((acc, e) => acc + (e.mentorEarnings || 0), 0);

  const verificationStatus = currentUser.verification?.status || 'approved';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header & Verification Status Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <VerificationBadge status={verificationStatus} />
              <span className="text-xs text-slate-400">{currentUser.college}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {currentUser.name} • Mentor Studio
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Rating: {currentUser.rating || 4.9} ★ • {currentUser.totalStudentsTaught || 42} Students Mentored
            </p>
          </div>
        </div>

        {/* Quick Course Launch Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCourseCreatorOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/30 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* 2. Financial & Escrow Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Total Lifetime Earnings</span>
          <div className="text-2xl font-bold text-white font-mono">₹{Math.round(totalEarnings)}</div>
          <span className="text-[11px] text-slate-500">From {mentorEnrollments.length} student enrollments</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Released Payouts</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">₹{Math.round(releasedEarnings)}</div>
          <span className="text-[11px] text-emerald-500/80">Directly deposited to student bank account</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Held in Escrow</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">₹{Math.round(escrowHeldEarnings)}</div>
          <span className="text-[11px] text-slate-400">Awaiting final post-test threshold (+{adminConfig.minimumImprovementPercentage}%)</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Under Dispute / Review</span>
          <div className="text-2xl font-bold text-rose-400 font-mono">₹{Math.round(disputedEarnings)}</div>
          <span className="text-[11px] text-slate-400">Cases under Admin + AI resolution</span>
        </div>
      </div>

      {/* 3. Mentor Studio Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Sessions & Active Students</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'courses' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Catalog ({myCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('demand')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'demand' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Cohort Demand Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('recaps')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'recaps' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Session Recap Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('peer_network')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'peer_network' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Peer Co-Mentor Network</span>
        </button>
      </div>

      {/* Tab: Overview (Sessions & Active Learners) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Next Live Teaching Slot */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Upcoming Live Session
                </span>
                <span className="text-xs text-slate-400 font-mono">Today, 6:00 PM</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Data Structures & Algorithms: Linked Lists & Two Pointers
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Learner: Rohan Sharma (Metro State Institute of Technology)
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Interactive whiteboard, code screen share & recording consent ready
                </span>

                <button
                  onClick={() => onLaunchLiveClassroom('Data Structures & Algorithms', 'Rohan Sharma')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Live Classroom</span>
                </button>
              </div>
            </div>

            {/* Active Learners & Assessment Performance Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Active Enrolled Learners & Escrow Status</h3>
                <span className="text-xs text-slate-400">{mentorEnrollments.length} Active Records</span>
              </div>

              <div className="space-y-3">
                {mentorEnrollments.map(enr => {
                  const pre = enr.preAssessmentScore || 0;
                  const post = enr.postAssessmentScore || 0;
                  const delta = post - pre;
                  const isBelowThreshold = enr.postAssessmentScore !== undefined && delta < adminConfig.minimumImprovementPercentage;

                  return (
                    <div 
                      key={enr.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img src={enr.learnerAvatar} alt={enr.learnerName} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                          <div>
                            <h4 className="font-bold text-white text-xs">{enr.learnerName}</h4>
                            <p className="text-[11px] text-slate-400 truncate">{enr.courseTitle}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400 font-mono">₹{enr.mentorEarnings}</span>
                          <span className="text-[10px] text-slate-500 block">Status: {enr.paymentStatus}</span>
                        </div>
                      </div>

                      {/* Performance row */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                          <span>Pre: {enr.preAssessmentScore !== undefined ? `${enr.preAssessmentScore}%` : 'Pending'}</span>
                          <span>•</span>
                          <span>Post: {enr.postAssessmentScore !== undefined ? `${enr.postAssessmentScore}%` : 'Pending'}</span>
                          {enr.postAssessmentScore !== undefined && (
                            <span className={delta >= adminConfig.minimumImprovementPercentage ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                              (Delta: +{delta}%)
                            </span>
                          )}
                        </div>

                        {/* Dispute trigger if delta < threshold */}
                        {isBelowThreshold && enr.paymentStatus !== 'Disputed' && (
                          <button
                            onClick={() => setDisputeEnrollment(enr)}
                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>File Escrow Dispute</span>
                          </button>
                        )}

                        {enr.paymentStatus === 'Eligible for Release' && (
                          <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for release
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right column: Availability & Verification status */}
          <div className="space-y-6">
            
            {/* Verification checklist card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Verification Checklist
                </h4>
                <VerificationBadge status={verificationStatus} showText={false} />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">College Email (.edu)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">College ID Scan</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">GitHub Profile</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Admin Review</span>
                  <span className="text-emerald-400 font-bold text-[11px]">Approved</span>
                </div>
              </div>
            </div>

            {/* Availability Days */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Availability Calendar
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.availabilityDays?.map(day => (
                  <span key={day} className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    {day}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Matched automatically with student class timetables through our 2-step scheduler.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Your Active Courses ({myCourses.length})</h3>
            <button
              onClick={() => setIsCourseCreatorOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses.map(course => (
              <div key={course.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {course.category} • {course.level}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{course.title}</h4>
                  </div>
                  <span className="font-bold text-emerald-400 font-mono text-base">₹{course.price}</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>{course.numberOfSessions} Live Sessions (~{course.totalDurationHours} hrs)</span>
                  <span className="text-white font-semibold">{course.enrolledStudentsCount} Enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Cohort Demand */}
      {activeTab === 'demand' && (
        <CohortDemandView 
          onCreateCourseForSkill={(skill) => {
            setIsCourseCreatorOpen(true);
          }}
        />
      )}

      {/* Tab: Session Recaps */}
      {activeTab === 'recaps' && (
        <AutomatedSessionRecapHub />
      )}

      {/* Tab: Peer Co-Mentor Network */}
      {activeTab === 'peer_network' && (
        <PeerMentorNetworkView />
      )}

      {/* Course Creator Modal */}
      <CourseCreatorModal 
        isOpen={isCourseCreatorOpen}
        onClose={() => setIsCourseCreatorOpen(false)}
        onOpenPriceCalculator={onOpenPriceCalculator}
      />

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={!!disputeEnrollment}
        onClose={() => setDisputeEnrollment(null)}
        enrollment={disputeEnrollment}
      />

    </div>
  );
};
