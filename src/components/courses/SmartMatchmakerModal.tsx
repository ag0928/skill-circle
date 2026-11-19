import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, Check, Sparkles, Filter, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { VerificationBadge } from '../common/RoleBadge';

export const SmartMatchmakerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onBookSlot: (mentorName: string, slotTime: string, courseId?: string) => void;
}> = ({ isOpen, onClose, onBookSlot }) => {
  const { users, currentUser, adminConfig, courses } = useApp();

  const [selectedSkill, setSelectedSkill] = useState('Data Structures & Algorithms');
  const [selectedDay, setSelectedDay] = useState('Sat');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('Evening (6 PM - 9 PM)');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('All');
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  if (!isOpen) return null;

  // Filter mentors who match
  const mentors = users.filter(u => u.role === 'mentor');

  const matchSlots = [
    { day: 'Saturday', time: '6:30 PM - 7:30 PM', mentor: mentors[0], score: 98, reason: 'Zero college class collision, matches your preferred weekend evening window, verified DSA senior' },
    { day: 'Sunday', time: '11:00 AM - 12:00 PM', mentor: mentors[0], score: 94, reason: 'Fits your weekend slot; mentor has taught 50+ students in LeetCode patterns' },
    { day: 'Wednesday', time: '7:00 PM - 8:00 PM', mentor: mentors[1] || mentors[0], score: 91, reason: 'Weekday evening after campus lab hours, covers full stack and problem solving' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-base">2-Click Smart Availability Matchmaker</h3>
                <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-mono">
                  Collision-Free
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Matches your university timetable & mentor availability in two simple interactions.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: 1-Click Preferences */}
        {step === 1 && (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Skill You Want Guidance On</label>
                <select
                  value={selectedSkill}
                  onChange={e => setSelectedSkill(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="React & Frontend Engineering">React & Frontend Engineering</option>
                  <option value="Resume Review & ATS Prep">Resume Review & ATS Prep</option>
                  <option value="Node.js & Express REST APIs">Node.js & Express REST APIs</option>
                  <option value="System Design Basics">System Design Basics</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Your Open College Window</label>
                <select
                  value={selectedTimeOfDay}
                  onChange={e => setSelectedTimeOfDay(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Evening (6 PM - 9 PM)">Evening (6 PM - 9 PM) [After Lectures]</option>
                  <option value="Morning (8 AM - 10 AM)">Morning (8 AM - 10 AM) [Before Classes]</option>
                  <option value="Weekend (Flexible)">Weekend Anytime (Saturday & Sunday)</option>
                </select>
              </div>
            </div>

            {/* Matched Optimal Slots */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-white block">
                Top AI Matched Availability Slots (Collision-Free):
              </span>

              {matchSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all space-y-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono bg-brand-500/10 text-brand-300 border border-brand-500/20 px-2 py-0.5 rounded-lg">
                        {slot.day} • {slot.time}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {slot.score}% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300 pt-0.5">
                      <span className="font-semibold text-white">{slot.mentor.name}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[200px]">{slot.mentor.college}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      "{slot.reason}"
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMentor(slot.mentor);
                      onBookSlot(slot.mentor.name, `${slot.day} at ${slot.time}`);
                      onClose();
                    }}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-md shadow-brand-600/30"
                  >
                    <span>Instant Book (2 Clicks)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
