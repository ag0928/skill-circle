import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Sparkles, 
  Plus, 
  Award, 
  Target, 
  Calendar,
  Check
} from 'lucide-react';

export const WeeklyGoalsWidget: React.FC = () => {
  const { weeklyGoals, toggleGoal, addGoal, currentUser } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('DSA Practice');
  const [newXp, setNewXp] = useState(50);

  const completedGoals = weeklyGoals.filter(g => g.completed).length;
  const totalGoals = weeklyGoals.length;
  const progressPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addGoal(newTitle.trim(), newCategory, 1, newXp);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Weekly Micro-Goals</h3>
            <p className="text-[11px] text-slate-400">Consistent daily habits beat cramming</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Progress metrics row */}
      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
        <div>
          <span className="text-[10px] text-slate-400 block">Weekly Progress</span>
          <span className="text-sm font-bold text-white font-mono">
            {completedGoals} / {totalGoals}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Current Streak</span>
          <span className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{currentUser.streakDays || 7} Days</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Total XP</span>
          <span className="text-sm font-bold text-brand-400 font-mono">
            {currentUser.xp || 1420} XP
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-medium">
          <span>Weekly Target Completion</span>
          <span className="text-white font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Inline Add Goal Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 animate-in fade-in duration-150">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Goal Description</label>
            <input 
              type="text" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Implement Binary Search Tree in C++"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Category</label>
              <select 
                value={newCategory} 
                onChange={e => setNewCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="DSA Practice">DSA Practice</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Coursework">Coursework</option>
                <option value="Campus Vault">Campus Vault</option>
                <option value="Assessment">Assessment</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">XP Reward</label>
              <input 
                type="number" 
                value={newXp} 
                onChange={e => setNewXp(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold"
            >
              Add Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals list */}
      <div className="space-y-2">
        {weeklyGoals.map(goal => (
          <div 
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
              goal.completed 
                ? 'bg-slate-950/60 border-slate-800/80 text-slate-400 line-through' 
                : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <button 
                type="button"
                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  goal.completed ? 'bg-emerald-500 text-white' : 'border border-slate-600 hover:border-brand-400'
                }`}
              >
                {goal.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <div>
                <span className="text-xs font-medium block">{goal.title}</span>
                <span className="text-[10px] text-slate-500">{goal.category} • Due {goal.dueDate}</span>
              </div>
            </div>

            <span className="text-[11px] font-mono font-semibold text-amber-400/90 shrink-0">
              +{goal.xpReward} XP
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
