import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  Github, 
  BookOpen,
  Send,
  HelpCircle
} from 'lucide-react';
import { SessionRecap } from '../../types';

export const AutomatedSessionRecapHub: React.FC = () => {
  const { sessionRecaps, generateSessionRecap, courses, currentUser } = useApp();
  const [selectedRecap, setSelectedRecap] = useState<SessionRecap>(sessionRecaps[0]);
  const [showGeneratorForm, setShowGeneratorForm] = useState(false);

  // New recap form state
  const [topicsInput, setTopicsInput] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const topics = topicsInput.split(',').map(t => t.trim()).filter(Boolean);
    const newRecap = generateSessionRecap(
      `s-${Date.now()}`,
      selectedCourseId,
      topics.length > 0 ? topics : ['Binary Search Trees', 'Inorder Traversal'],
      customNotes
    );
    setSelectedRecap(newRecap);
    setShowGeneratorForm(false);
    setTopicsInput('');
    setCustomNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
              Automated AI Synthesis Hub
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Automated Session Recap Hub</span>
            <Sparkles className="w-5 h-5 text-brand-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            AI automatically transcribes key takeaways, GitHub links, homework, and practice roadmaps after each session.
          </p>
        </div>

        <button
          onClick={() => setShowGeneratorForm(!showGeneratorForm)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New AI Recap</span>
        </button>
      </div>

      {/* Generator Modal / Drawer */}
      {showGeneratorForm && (
        <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-slate-900 border border-brand-500/40 space-y-3.5 animate-in fade-in duration-200">
          <h3 className="font-bold text-white text-sm">Synthesize Live Session with AI</h3>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Course</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Topics Covered (comma separated)</label>
            <input 
              type="text" 
              value={topicsInput}
              onChange={e => setTopicsInput(e.target.value)}
              placeholder="e.g. Sliding Window Invariants, Minimum Window Substring, Hash Map frequency"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Session Summary / Key Highlights</label>
            <textarea 
              rows={3}
              value={customNotes}
              onChange={e => setCustomNotes(e.target.value)}
              placeholder="Add specific observations, student doubts solved, or recommended coding problem links..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowGeneratorForm(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Recap Document</span>
            </button>
          </div>
        </form>
      )}

      {/* Recap Browser (Split view) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recaps list */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
            Recent Session Summaries ({sessionRecaps.length})
          </h3>
          {sessionRecaps.map(recap => (
            <div
              key={recap.id}
              onClick={() => setSelectedRecap(recap)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRecap?.id === recap.id 
                  ? 'bg-slate-900 border-brand-500 shadow-md' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {recap.date}
                </span>
                <span className="text-brand-400 font-medium">Session Recap</span>
              </div>
              <h4 className="font-bold text-white text-xs line-clamp-1">{recap.courseTitle}</h4>
              <p className="text-[11px] text-slate-400 mt-1">Student: {recap.learnerName}</p>
            </div>
          ))}
        </div>

        {/* Selected Recap Detail View */}
        <div className="lg:col-span-2">
          {selectedRecap ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-brand-400 uppercase bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                    Session Date: {selectedRecap.date}
                  </span>
                  <h3 className="font-bold text-white text-base mt-1.5">{selectedRecap.courseTitle}</h3>
                  <p className="text-xs text-slate-400">
                    Mentor: {selectedRecap.mentorName} • Learner: {selectedRecap.learnerName}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Session Summary
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                  {selectedRecap.sessionSummary}
                </p>
              </div>

              {/* Key concepts & Topics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Core Concepts Covered
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedRecap.keyConcepts.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Curriculum Topics
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecap.topicsCovered.map((t, i) => (
                      <span key={i} className="text-xs bg-slate-950 text-brand-300 border border-brand-500/20 px-2.5 py-1 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Homework & Assignments */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Assignments & Homework Practice
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedRecap.assignments.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <strong>Instructions:</strong> {selectedRecap.homework}
                </p>
              </div>

              {/* Resources & GitHub links */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Attached Code & Resources
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRecap.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-brand-500 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5 text-slate-400" />
                      <span>{res.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 ml-1" />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs rounded-2xl bg-slate-900 border border-slate-800">
              Select a session recap from the list to view detailed AI synthesis.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
