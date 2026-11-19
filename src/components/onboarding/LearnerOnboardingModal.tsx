import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, ArrowRight, ArrowLeft, Sparkles, BookOpen, Clock, Target, Wallet } from 'lucide-react';

export const LearnerOnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, addNotification, setActiveView } = useApp();

  const [step, setStep] = useState(1);
  const [college, setCollege] = useState(currentUser.college || '');
  const [branch, setBranch] = useState(currentUser.branch || '');
  const [year, setYear] = useState(currentUser.year || '2nd Year');
  const [semester, setSemester] = useState(currentUser.semester || '4th Semester');

  // Skills
  const [skillInputKnown, setSkillInputKnown] = useState('');
  const [skillsKnown, setSkillsKnown] = useState<string[]>(currentUser.skillsKnown || ['C++', 'Basic Python']);
  
  const [skillInputLearn, setSkillInputLearn] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>(currentUser.skillsToLearn || ['Data Structures & Algorithms', 'React.js']);

  // Goals
  const availableGoals = [
    'Academic improvement',
    'Internship preparation',
    'Placement preparation',
    'Project development',
    'Career exploration',
    'Skill development',
    'Interview preparation'
  ];
  const [selectedGoals, setSelectedGoals] = useState<string[]>(currentUser.learningGoals || ['Internship preparation', 'Placement preparation']);

  // Preferences
  const [preferredFormat, setPreferredFormat] = useState('1-on-1');
  const [preferredTiming, setPreferredTiming] = useState('Weekday evenings (6 PM - 9 PM) & Weekend mornings');
  const [budgetPreference, setBudgetPreference] = useState('₹400 - ₹900 per course');
  const [currentSkillLevel, setCurrentSkillLevel] = useState('Intermediate beginner');

  if (!isOpen) return null;

  const handleAddKnownSkill = () => {
    if (skillInputKnown.trim() && !skillsKnown.includes(skillInputKnown.trim())) {
      setSkillsKnown([...skillsKnown, skillInputKnown.trim()]);
      setSkillInputKnown('');
    }
  };

  const handleAddLearnSkill = () => {
    if (skillInputLearn.trim() && !skillsToLearn.includes(skillInputLearn.trim())) {
      setSkillsToLearn([...skillsToLearn, skillInputLearn.trim()]);
      setSkillInputLearn('');
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = () => {
    setCurrentUser({
      ...currentUser,
      college: college || currentUser.college,
      branch,
      year,
      semester,
      skillsKnown,
      skillsToLearn,
      learningGoals: selectedGoals,
      preferredTiming,
      budgetPreference,
      currentSkillLevel
    });

    addNotification('Profile Configured!', 'Your personalized learning dashboard and AI recommendations are active.', 'success');
    setActiveView('learner-dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Progress header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                {step}
              </span>
              <h3 className="font-bold text-white text-sm">
                {step === 1 && 'Academic Profile'}
                {step === 2 && 'Skills & Competencies'}
                {step === 3 && 'Learning Goals'}
                {step === 4 && 'Format, Schedule & Budget'}
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-500 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          {step === 1 && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-400">
                Help mentors understand your university background and semester load.
              </p>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">College / University</label>
                <input 
                  type="text" 
                  value={college} 
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. Metro State Institute of Technology"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Branch / Department</label>
                  <input 
                    type="text" 
                    value={branch} 
                    onChange={e => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science & Engg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Current Year</label>
                  <select 
                    value={year} 
                    onChange={e => setYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="1st Year">1st Year (Fresher)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Current Semester</label>
                <input 
                  type="text" 
                  value={semester} 
                  onChange={e => setSemester(e.target.value)}
                  placeholder="e.g. 4th Semester"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium mb-1 block">
                  Skills you already know (even basics)
                </label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={skillInputKnown} 
                    onChange={e => setSkillInputKnown(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddKnownSkill())}
                    placeholder="e.g. C++, Git, HTML"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddKnownSkill}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillsKnown.map((s, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      {s}
                      <button onClick={() => setSkillsKnown(skillsKnown.filter(x => x !== s))} className="hover:text-rose-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium mb-1 block">
                  Skills you want to learn from seniors
                </label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={skillInputLearn} 
                    onChange={e => setSkillInputLearn(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLearnSkill())}
                    placeholder="e.g. Dynamic Programming, Docker, React"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddLearnSkill}
                    className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillsToLearn.map((s, idx) => (
                    <span key={idx} className="bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      {s}
                      <button onClick={() => setSkillsToLearn(skillsToLearn.filter(x => x !== s))} className="hover:text-rose-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Current Overall Skill Level</label>
                <select 
                  value={currentSkillLevel} 
                  onChange={e => setCurrentSkillLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Complete beginner">Complete beginner (Starting from zero)</option>
                  <option value="Intermediate beginner">Intermediate beginner (Know basics, need structure)</option>
                  <option value="Intermediate">Intermediate (Building projects, prepping for interviews)</option>
                  <option value="Advanced">Advanced (Refining competitive performance)</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Select your top learning milestones. Mentors tailor sessions specifically for these outcomes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableGoals.map(goal => {
                  const isChecked = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        isChecked 
                          ? 'bg-brand-500/15 border-brand-500 text-brand-300' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{goal}</span>
                      {isChecked && <Check className="w-4 h-4 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Preferred Learning Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1-on-1', 'Cohort', 'Flexible'].map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setPreferredFormat(fmt)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        preferredFormat === fmt 
                          ? 'bg-brand-500/15 border-brand-500 text-brand-300' 
                          : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Preferred Timing</label>
                <input 
                  type="text" 
                  value={preferredTiming} 
                  onChange={e => setPreferredTiming(e.target.value)}
                  placeholder="e.g. Weekday evenings (6 PM - 9 PM) & Weekend mornings"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Course Budget Preference</label>
                <select 
                  value={budgetPreference} 
                  onChange={e => setBudgetPreference(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="₹299 - ₹599 per course">₹299 - ₹599 per course (Super Affordable)</option>
                  <option value="₹400 - ₹900 per course">₹400 - ₹900 per course (Standard Peer Rate)</option>
                  <option value="₹1000+ per course">₹1000+ per course (Extensive Capstones)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/30"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
            >
              <Check className="w-4 h-4" />
              <span>Enter Learner Hub</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
