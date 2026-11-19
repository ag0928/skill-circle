import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, FileText, Send, Sparkles, Upload } from 'lucide-react';
import { Enrollment } from '../../types';

export const DisputeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  enrollment: Enrollment | null;
}> = ({ isOpen, onClose, enrollment }) => {
  const { submitDispute, adminConfig } = useApp();

  const [reason, setReason] = useState('Learner rushed post-course evaluation without attempting homework practice');
  const [explanation, setExplanation] = useState('All scheduled sessions were conducted with full attendance. The student submitted the final post-assessment in 3 minutes without attempting the practice worksheets provided in the session recaps.');
  const [evidenceLink, setEvidenceLink] = useState('https://github.com/sample/session-recording-log.txt');

  if (!isOpen || !enrollment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDispute(
      enrollment.id,
      reason,
      explanation,
      [evidenceLink]
    );
    onClose();
  };

  const pre = enrollment.preAssessmentScore || 0;
  const post = enrollment.postAssessmentScore || 0;
  const delta = post - pre;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in duration-200">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Submit Escrow Release Dispute</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Context Card */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
          <div className="flex justify-between text-slate-300">
            <span className="font-semibold">{enrollment.courseTitle}</span>
            <span className="font-mono text-emerald-400">₹{enrollment.mentorEarnings}</span>
          </div>
          <div className="text-slate-400 text-[11px] flex items-center gap-3">
            <span>Student: {enrollment.learnerName}</span>
            <span>•</span>
            <span>Pre: {pre}% | Post: {post}%</span>
            <span>•</span>
            <span className="text-rose-400 font-bold">Delta: +{delta}% (Req: {adminConfig.minimumImprovementPercentage}%)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Dispute Reason</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Learner rushed post-course evaluation without attempting homework practice">
                Learner rushed evaluation / insufficient effort
              </option>
              <option value="Learner failed to apply material and skipped practical assignments">
                Learner skipped practice assignments & homework
              </option>
              <option value="Assessment question discrepancy or technical issue">
                Assessment question anomaly or technical issue
              </option>
              <option value="Other valid academic dispute reason">
                Other valid academic dispute reason
              </option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Supporting Explanation & Session Context
            </label>
            <textarea
              rows={4}
              required
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="Detail session attendance, curriculum completed, student responsiveness, and why payment should be released..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Supporting Evidence (Links, Session Recaps, Git Repos)
            </label>
            <input
              type="text"
              value={evidenceLink}
              onChange={e => setEvidenceLink(e.target.value)}
              placeholder="https://github.com/... or cloud document link"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-[11px] text-brand-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <p>
              Skill Circle AI will parse session timestamps, submission velocity, and assignment links to recommend a verdict, while Platform Admin makes the final binding decision.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Case for Review</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
