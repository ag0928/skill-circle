import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Users, 
  FileText, 
  Lock, 
  Clock, 
  Sparkles, 
  Sliders, 
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VerificationStatus, MentorDispute } from '../../types';
import { VerificationBadge } from '../common/RoleBadge';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    reviewMentorVerification, 
    enrollments, 
    releaseMentorPayment, 
    refundLearnerPayment, 
    disputes, 
    resolveDispute, 
    adminConfig, 
    updateAdminConfig,
    courses 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'escrow' | 'disputes' | 'config'>('verification');
  
  // Local config form state
  const [minImprovement, setMinImprovement] = useState(adminConfig.minimumImprovementPercentage);
  const [platformCommission, setPlatformCommission] = useState(adminConfig.platformCommissionPercentage);
  const [minPrice, setMinPrice] = useState(adminConfig.minimumCoursePrice);
  const [maxPrice, setMaxPrice] = useState(adminConfig.maximumCoursePrice);
  const [mandatoryFields, setMandatoryFields] = useState(adminConfig.mandatoryVerificationFields);

  const pendingMentors = users.filter(u => u.role === 'mentor' && u.verification?.status === 'under_review');
  const allMentors = users.filter(u => u.role === 'mentor');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig({
      minimumImprovementPercentage: Number(minImprovement),
      platformCommissionPercentage: Number(platformCommission),
      minimumCoursePrice: Number(minPrice),
      maximumCoursePrice: Number(maxPrice),
      mandatoryVerificationFields: mandatoryFields
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-semibold">
              Platform Operations & Escrow Authority
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Admin Control Center</span>
            <ShieldCheck className="w-5 h-5 text-purple-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Mentor credentials review • Escrow arbitrations • Dynamic platform parameters
          </p>
        </div>

        {/* Quick summary metrics */}
        <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Pending Verifications</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{pendingMentors.length}</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 block">Active Disputes</span>
            <span className="text-sm font-bold text-rose-400 font-mono">
              {disputes.filter(d => d.status !== 'Resolved').length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'verification' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Mentor Verification Queue ({pendingMentors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'escrow' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Escrow & Payment Release</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'disputes' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>AI Dispute Arbitration ({disputes.filter(d => d.status !== 'Resolved').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'config' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Platform Parameters</span>
        </button>
      </div>

      {/* 1. Mentor Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">
              Senior Verification Applications
            </h3>
            <span className="text-xs text-slate-400">
              Admin approval unlocks official Verified Student Mentor badge
            </span>
          </div>

          <div className="space-y-4">
            {allMentors.map(mentor => {
              const ver = mentor.verification;
              const isUnderReview = ver?.status === 'under_review';

              return (
                <div 
                  key={mentor.id}
                  className={`p-5 rounded-2xl border space-y-4 transition-all ${
                    isUnderReview 
                      ? 'bg-slate-900 border-amber-500/50 shadow-lg' 
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{mentor.name}</h4>
                          <VerificationBadge status={ver?.status || 'pending'} />
                        </div>
                        <p className="text-xs text-slate-400">{mentor.college} • {mentor.branch} ({mentor.year})</p>
                        <p className="text-xs text-brand-400 font-mono mt-0.5">{ver?.collegeEmail || mentor.email}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => reviewMentorVerification(mentor.id, 'approved', 'Verified credentials check completed by Admin.')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Application
                      </button>
                      <button
                        onClick={() => reviewMentorVerification(mentor.id, 'more_info_required', 'Please re-upload a clear scan of your college student ID card.')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        Request More Info
                      </button>
                      <button
                        onClick={() => reviewMentorVerification(mentor.id, 'rejected', 'Verification rejected: credentials could not be validated.')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>

                  {/* Verification evidence submitted */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">College ID Scan</span>
                      <span className="text-slate-300 font-mono text-[11px] truncate block">
                        📄 {ver?.collegeIdUrl || 'id_card_scan.pdf'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">GitHub Profile</span>
                      <a href={ver?.githubUrl || '#'} target="_blank" rel="noreferrer" className="text-brand-400 text-[11px] hover:underline truncate block">
                        {ver?.githubUrl || 'Not provided'}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">LinkedIn Profile</span>
                      <a href={ver?.linkedInUrl || '#'} target="_blank" rel="noreferrer" className="text-brand-400 text-[11px] hover:underline truncate block">
                        {ver?.linkedInUrl || 'Not provided'}
                      </a>
                    </div>
                  </div>

                  {ver?.adminNotes && (
                    <div className="text-[11px] text-slate-400 italic">
                      Admin Note: {ver.adminNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Escrow & Payment Release */}
      {activeTab === 'escrow' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Escrow Account Ledger</h3>
              <p className="text-xs text-slate-400">
                Payment held until post-course score confirms +{adminConfig.minimumImprovementPercentage}% gain.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {enrollments.map(enr => {
              const pre = enr.preAssessmentScore || 0;
              const post = enr.postAssessmentScore || 0;
              const delta = post - pre;
              const meetsBenchmark = delta >= adminConfig.minimumImprovementPercentage;

              return (
                <div key={enr.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white block">{enr.courseTitle}</span>
                      <span className="text-[11px] text-slate-400">
                        Learner: {enr.learnerName} • Mentor: {enr.mentorName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-emerald-400">₹{enr.amountPaid}</span>
                      <span className="text-[10px] text-slate-500 block">Status: {enr.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>Baseline: {enr.preAssessmentScore !== undefined ? `${enr.preAssessmentScore}%` : 'Pending'}</span>
                      <span>•</span>
                      <span>Final: {enr.postAssessmentScore !== undefined ? `${enr.postAssessmentScore}%` : 'Pending'}</span>
                      <span>•</span>
                      <span className={meetsBenchmark ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        Improvement: +{delta}% (Req: {adminConfig.minimumImprovementPercentage}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {enr.paymentStatus !== 'Released' && (
                        <button
                          onClick={() => releaseMentorPayment(enr.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Manual Release
                        </button>
                      )}
                      {enr.paymentStatus !== 'Refunded' && (
                        <button
                          onClick={() => refundLearnerPayment(enr.id)}
                          className="px-3 py-1 bg-slate-800 hover:bg-rose-950 text-rose-300 rounded-lg text-xs font-semibold"
                        >
                          Refund Learner
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. AI Dispute Arbitration */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Escrow Dispute Resolution Center</h3>
              <p className="text-xs text-slate-400">
                AI assists by synthesizing session logs and assessment velocity; Admin delivers the final verdict.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {disputes.map(disp => (
              <div 
                key={disp.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Case #{disp.id} • {disp.status}
                    </span>
                    <h4 className="font-bold text-white text-base mt-1">{disp.courseTitle}</h4>
                    <p className="text-xs text-slate-400">
                      Filed by Mentor: {disp.mentorName} against Learner: {disp.learnerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Recorded Improvement:</span>
                    <span className="text-sm font-bold text-rose-400 font-mono">
                      +{disp.improvement}% (Required: {disp.thresholdRequired}%)
                    </span>
                  </div>
                </div>

                {/* Mentor's Reason & Explanation */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 font-semibold block">Mentor's Dispute Claim:</span>
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-slate-200 leading-relaxed">
                    <p className="font-semibold text-white mb-1">Reason: {disp.reason}</p>
                    <p>{disp.supportingExplanation}</p>
                  </div>
                </div>

                {/* AI Automated Case Analysis Box */}
                {disp.aiCaseAnalysis && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/40 to-slate-950 border border-brand-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-400">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> AI Case Analysis & Recommendation
                      </span>
                      <span className="font-mono text-emerald-400">
                        {Math.round(disp.aiCaseAnalysis.confidenceScore * 100)}% Confidence
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {disp.aiCaseAnalysis.summary}
                    </p>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Recommended Action: <strong className="text-emerald-400">{disp.aiCaseAnalysis.recommendedAction}</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Admin Verdict Control */}
                {disp.status !== 'Resolved' ? (
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-300">Admin Binding Decision:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveDispute(disp.id, 'Release payment to mentor', 'Approved by Admin based on session attendance logs.')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                      >
                        Release Payment to Mentor
                      </button>
                      <button
                        onClick={() => resolveDispute(disp.id, 'Refund learner', 'Resolved: Full refund issued to student.')}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-rose-950 text-rose-300 rounded-xl text-xs font-semibold"
                      >
                        Refund Learner
                      </button>
                      <button
                        onClick={() => resolveDispute(disp.id, 'Reassess learner', 'Action: Free re-test granted to student.')}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl text-xs font-semibold"
                      >
                        Reassess Learner
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 text-xs text-emerald-400 font-semibold">
                    ✓ Resolved: {disp.adminVerdict} ({disp.adminNotes})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Platform Parameters Configuration */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 max-w-2xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Configure Platform Policy & Escrow Benchmarks</h3>
            <p className="text-xs text-slate-400">
              Customize dynamic pricing rules, commission, and learning improvement thresholds.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Minimum improvement threshold */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">
                  Minimum Post-Course Improvement Threshold (%)
                </label>
                <span className="font-bold text-emerald-400 font-mono text-sm">{minImprovement}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={minImprovement}
                onChange={e => setMinImprovement(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Learners must achieve at least this percentage-point delta between pre- and post-test for escrow auto-release.
              </span>
            </div>

            {/* Platform commission */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Platform Commission Fee (%)</label>
                <span className="font-bold text-brand-400 font-mono text-sm">{platformCommission}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={platformCommission}
                onChange={e => setPlatformCommission(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            {/* Price bounds */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Minimum Course Price (₹)</label>
                <input 
                  type="number"
                  value={minPrice}
                  onChange={e => setMinPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Maximum Course Price (₹)</label>
                <input 
                  type="number"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            {/* Mandatory verification requirements */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="font-semibold text-slate-300 block">
                Mandatory Senior Verification Requirements:
              </span>
              <div className="space-y-2">
                {[
                  { key: 'collegeId', label: 'College Student ID Card Scan' },
                  { key: 'collegeEmail', label: 'College Email (.edu or campus domain)' },
                  { key: 'github', label: 'GitHub Profile & Code Repositories' },
                  { key: 'linkedIn', label: 'LinkedIn Profile' },
                  { key: 'certificates', label: 'Relevant Skill Certificates' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={(mandatoryFields as any)[item.key]}
                      onChange={e => setMandatoryFields({ ...mandatoryFields, [item.key]: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Admin Settings</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
