import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Clock, Calendar, ShieldCheck, Star, Sparkles, BookOpen, UserCheck } from 'lucide-react';
import { Course } from '../../types';
import { VerificationBadge } from '../common/RoleBadge';

export const CourseDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onEnroll: (course: Course) => void;
  onMatchmaker: (courseId: string) => void;
}> = ({ isOpen, onClose, course, onEnroll, onMatchmaker }) => {
  const { adminConfig } = useApp();

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-brand-300 px-2 py-0.5 rounded">
                {course.category} • {course.level}
              </span>
              <span className="text-xs text-slate-400">• {course.numberOfSessions} Live Sessions</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">{course.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 text-xs">
          
          {/* Mentor Profile Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={course.mentorAvatar} alt={course.mentorName} className="w-11 h-11 rounded-xl object-cover border border-slate-700" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm">{course.mentorName}</span>
                  {course.mentorVerified && <VerificationBadge status="approved" />}
                </div>
                <span className="text-slate-400 text-[11px] block">{course.mentorCollege}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-bold flex items-center gap-1 justify-end">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.mentorRating}
              </span>
              <span className="text-slate-500 text-[10px]">Senior Mentor</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">
              About This Course
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
              {course.description}
            </p>
          </div>

          {/* Learning Objectives */}
          <div>
            <h3 className="font-semibold text-slate-300 uppercase tracking-wider mb-2 text-[11px]">
              What You Will Master (Learning Objectives)
            </h3>
            <ul className="space-y-2">
              {course.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Modules Breakdown */}
          {course.modules.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-300 uppercase tracking-wider mb-2 text-[11px]">
                Syllabus Modules ({course.modules.length})
              </h3>
              <div className="space-y-2">
                {course.modules.map(mod => (
                  <div key={mod.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block mb-0.5">{mod.title}</span>
                    <p className="text-[11px] text-slate-400">{mod.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Escrow Benchmark Disclosure */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Escrow Protection Active:</strong> Your fee of ₹{course.price} is held securely in platform escrow. Payment is released to your mentor only after you demonstrate at least a +{adminConfig.minimumImprovementPercentage}% improvement from Pre-Test to Post-Test!
            </p>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Course Fee</span>
            <div className="text-xl font-bold text-emerald-400 font-mono">₹{course.price}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onMatchmaker(course.id);
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" /> Match Schedule
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course);
              }}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-600/30 flex items-center gap-1.5"
            >
              <span>Enroll (Escrow Protected)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
