import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ArrowUpRight, 
  FileText, 
  Award,
  Play
} from 'lucide-react';
import { Enrollment, PaymentEscrowStatus } from '../../types';

export const AssessmentEscrowTracker: React.FC<{
  onLaunchAssessment: (enrollmentId: string, isPreTest: boolean) => void;
}> = ({ onLaunchAssessment }) => {
  const { enrollments, adminConfig, currentUser, releaseMentorPayment } = useApp();

  // Filter enrollments for current learner
  const myEnrollments = enrollments.filter(e => e.learnerId === currentUser.id);

  const getStatusBadge = (status: PaymentEscrowStatus) => {
    switch (status) {
      case 'Eligible for Release':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for Release
          </span>
        );
      case 'Released':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/50">
            <CheckCircle2 className="w-3.5 h-3.5" /> Released to Mentor
          </span>
        );
      case 'Payment Held':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Lock className="w-3.5 h-3.5" /> Held in Escrow
          </span>
        );
      case 'Disputed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Under Dispute Arbitration
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-600">
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Escrow principle summary banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-white block mb-0.5">
            Transparent Escrow Release Policy ({adminConfig.minimumImprovementPercentage}% Benchmark)
          </span>
          <p className="text-slate-400 leading-relaxed">
            Your course fee is held in secure escrow. Once your Post-Course evaluation confirms at least{' '}
            <strong className="text-emerald-400 font-semibold">+{adminConfig.minimumImprovementPercentage} percentage points</strong>{' '}
            of improvement over your baseline, mentor compensation is unlocked.
          </p>
        </div>
      </div>

      {/* Enrollments table / cards */}
      <div className="space-y-3">
        {myEnrollments.map(enr => {
          const hasPreScore = enr.preAssessmentScore !== undefined;
          const hasPostScore = enr.postAssessmentScore !== undefined;
          const improvement = (enr.postAssessmentScore || 0) - (enr.preAssessmentScore || 0);
          const meetsThreshold = improvement >= adminConfig.minimumImprovementPercentage;

          return (
            <div 
              key={enr.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{enr.courseTitle}</h4>
                  <p className="text-xs text-slate-400">
                    Mentor: {enr.mentorName} • Enrolled on {enr.enrolledAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(enr.paymentStatus)}
                </div>
              </div>

              {/* Assessment comparison scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                
                {/* Pre test */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Pre-Course Baseline
                  </span>
                  {hasPreScore ? (
                    <div className="text-lg font-bold text-white font-mono">
                      {enr.preAssessmentScore}%
                    </div>
                  ) : (
                    <button
                      onClick={() => onLaunchAssessment(enr.id, true)}
                      className="text-xs bg-brand-600 hover:bg-brand-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <Play className="w-3 h-3" /> Take Pre-Test
                    </button>
                  )}
                </div>

                {/* Post test */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Post-Course Mastery
                  </span>
                  {hasPostScore ? (
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      {enr.postAssessmentScore}%
                    </div>
                  ) : (
                    <button
                      onClick={() => onLaunchAssessment(enr.id, false)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <Play className="w-3 h-3" /> Take Final Evaluation
                    </button>
                  )}
                </div>

                {/* Improvement */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Calculated Improvement
                  </span>
                  {hasPostScore ? (
                    <div className={`text-lg font-bold font-mono ${meetsThreshold ? 'text-emerald-400' : 'text-amber-400'}`}>
                      +{improvement} pts {meetsThreshold ? '✓' : ''}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Pending final exam</span>
                  )}
                </div>

                {/* Amount in escrow */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Escrow Amount
                  </span>
                  <div className="text-lg font-bold text-white font-mono">
                    ₹{enr.amountPaid}
                  </div>
                  <span className="text-[10px] text-slate-500">Razorpay Architecture</span>
                </div>

              </div>

              {/* Status explanation bar */}
              <div className="text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-400 pt-1">
                {enr.paymentStatus === 'Eligible for Release' && (
                  <span className="text-emerald-400 font-medium">
                    ✓ You achieved a +{improvement}% gain (exceeding the {adminConfig.minimumImprovementPercentage}% threshold). Payment is ready for release!
                  </span>
                )}
                {enr.paymentStatus === 'Payment Held' && (
                  <span>
                    Course sessions in progress ({enr.sessionsCompleted}/{enr.totalSessions} completed). Complete the post-assessment after your last lesson.
                  </span>
                )}
                {enr.paymentStatus === 'Disputed' && (
                  <span className="text-rose-400 font-medium">
                    Mentor submitted case report for Admin + AI review. You will receive updates here.
                  </span>
                )}

                {enr.paymentStatus === 'Eligible for Release' && (
                  <button
                    onClick={() => releaseMentorPayment(enr.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Release Payment to Mentor
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
