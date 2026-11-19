import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Check, ArrowRight, ArrowLeft, BookOpen, Clock, Calculator, Sparkles } from 'lucide-react';
import { CourseModule } from '../../types';

export const CourseCreatorModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onOpenPriceCalculator: () => void;
}> = ({ isOpen, onClose, onOpenPriceCalculator }) => {
  const { currentUser, addCourse, adminConfig, addNotification } = useApp();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(adminConfig.allowedCategories[0]);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Beginner');
  const [numberOfSessions, setNumberOfSessions] = useState(5);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(60);
  const [price, setPrice] = useState(599);

  // Objectives
  const [objInput, setObjInput] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([
    'Master core problem solving patterns',
    'Build a working production project'
  ]);

  // Modules
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: 'mod-1',
      title: 'Module 1: Foundations & Architecture',
      description: 'Core concepts and environment setup',
      lessons: [
        {
          id: 'les-1',
          title: 'Lesson 1: Deep Dive & Live Code Walkthrough',
          durationMinutes: 60,
          sessions: [
            { id: 's-1', title: 'Live 1-on-1 Interactive Workshop', durationMinutes: 60, completed: false }
          ]
        }
      ]
    }
  ]);

  const [newModuleTitle, setNewModuleTitle] = useState('');

  if (!isOpen) return null;

  const handleAddObjective = () => {
    if (objInput.trim()) {
      setLearningObjectives([...learningObjectives, objInput.trim()]);
      setObjInput('');
    }
  };

  const handleAddModule = () => {
    if (newModuleTitle.trim()) {
      const newMod: CourseModule = {
        id: `mod-${Date.now()}`,
        title: newModuleTitle.trim(),
        description: 'Module topics and practice milestones',
        lessons: [
          {
            id: `les-${Date.now()}`,
            title: `${newModuleTitle.trim()} - Hands-on Session`,
            durationMinutes: 60,
            sessions: [
              { id: `ses-${Date.now()}`, title: 'Live Mentorship Session', durationMinutes: 60, completed: false }
            ]
          }
        ]
      };
      setModules([...modules, newMod]);
      setNewModuleTitle('');
    }
  };

  const handlePublish = () => {
    if (!title.trim()) {
      alert('Please provide a course title.');
      return;
    }

    addCourse({
      mentorId: currentUser.id,
      mentorName: currentUser.name,
      mentorAvatar: currentUser.avatar,
      mentorCollege: currentUser.college,
      mentorRating: currentUser.rating || 5.0,
      mentorVerified: currentUser.verification?.status === 'approved',
      title: title.trim(),
      description: description || 'Practical peer-led mentorship course designed for college students.',
      category,
      level,
      totalDurationHours: Math.round((numberOfSessions * sessionDurationMinutes) / 60),
      numberOfSessions,
      sessionDurationMinutes,
      price,
      suggestedMinPrice: Math.max(adminConfig.minimumCoursePrice, price - 150),
      suggestedMaxPrice: Math.min(adminConfig.maximumCoursePrice, price + 250),
      learningObjectives,
      modules,
      resourcesCount: 5,
      assignmentsCount: 3,
      tags: [category, level, 'Campus Mentorship'],
      prerequisites: ['Basic enthusiasm to learn'],
      preAssessmentId: 'assess-dsa-pre',
      postAssessmentId: 'assess-dsa-post'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                {step}
              </span>
              <h3 className="font-bold text-white text-sm">
                {step === 1 && 'Course Basics & Skill Category'}
                {step === 2 && 'Learning Objectives & Syllabus Modules'}
                {step === 3 && 'Schedule, Sessions & Dynamic Pricing'}
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-500 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Course Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. System Design Basics for Campus Placements"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description</label>
                <textarea 
                  rows={3}
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain what practical skills, interview questions, or projects students will master..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Skill Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {adminConfig.allowedCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Difficulty Level</label>
                  <select 
                    value={level} 
                    onChange={e => setLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium mb-1 block">
                  Measurable Learning Objectives
                </label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={objInput} 
                    onChange={e => setObjInput(e.target.value)}
                    placeholder="e.g. Implement Rate Limiter using Redis token bucket"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddObjective}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      <span>• {obj}</span>
                      <button onClick={() => setLearningObjectives(learningObjectives.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium mb-1 block">
                  Course Modules & Lessons
                </label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={newModuleTitle} 
                    onChange={e => setNewModuleTitle(e.target.value)}
                    placeholder="e.g. Module 2: High Availability & Load Balancing"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddModule}
                    className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-xl font-semibold"
                  >
                    Add Module
                  </button>
                </div>

                <div className="space-y-2">
                  {modules.map((mod, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span>{mod.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{mod.lessons.length} Lesson</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{mod.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Total Live Sessions</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={20}
                    value={numberOfSessions}
                    onChange={e => setNumberOfSessions(Number(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Session Length (Minutes)</label>
                  <select 
                    value={sessionDurationMinutes}
                    onChange={e => setSessionDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>
              </div>

              {/* Course Price Box */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-white block">Course Price (₹)</label>
                    <span className="text-[11px] text-slate-400">
                      Platform Range: ₹{adminConfig.minimumCoursePrice} - ₹{adminConfig.maximumCoursePrice}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPriceCalculator}
                    className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-500/20"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Dynamic Price Suggester</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min={adminConfig.minimumCoursePrice} 
                    max={adminConfig.maximumCoursePrice} 
                    step={50}
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="flex-1 accent-brand-500"
                  />
                  <span className="text-xl font-bold text-emerald-400 font-mono w-24 text-right">
                    ₹{price}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Platform Fee ({adminConfig.platformCommissionPercentage}%): ₹{Math.round((price * adminConfig.platformCommissionPercentage) / 100)}</span>
                  <span className="text-emerald-400 font-medium">Your Net Payout: ₹{price - Math.round((price * adminConfig.platformCommissionPercentage) / 100)}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/30"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
            >
              <Check className="w-4 h-4" />
              <span>Publish Course to Marketplace</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
