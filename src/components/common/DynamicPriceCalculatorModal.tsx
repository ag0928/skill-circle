import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calculator, Sparkles, Check, ArrowRight, Shield, TrendingDown } from 'lucide-react';

export const DynamicPriceCalculatorModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onApplyPrice?: (suggestedPrice: number) => void;
}> = ({ isOpen, onClose, onApplyPrice }) => {
  const { adminConfig } = useApp();

  // Dynamic parameters
  const [totalHours, setTotalHours] = useState(10);
  const [numberOfSessions, setNumberOfSessions] = useState(5);
  const [sessionMinutes, setSessionMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [hasPracticalProject, setHasPracticalProject] = useState(true);
  const [hasOneOnOneMock, setHasOneOnOneMock] = useState(true);
  const [mentorHourlyExpectation, setMentorHourlyExpectation] = useState(350); // ₹350/hr benchmark for student mentor

  // Calculation formula
  // Base cost per live hour: mentor expectation scaled by difficulty multiplier
  const difficultyMultiplier = difficulty === 'Beginner' ? 1.0 : difficulty === 'Intermediate' ? 1.15 : 1.3;
  const projectBonus = hasPracticalProject ? 100 : 0;
  const mockBonus = hasOneOnOneMock ? 120 : 0;
  
  // Total computed raw price
  const estimatedLiveHours = (numberOfSessions * sessionMinutes) / 60;
  const basePrice = Math.round(estimatedLiveHours * mentorHourlyExpectation * 0.35); // Divided across small student cohorts or subsidized peer rate
  const rawSuggested = basePrice + projectBonus + mockBonus;
  
  // Clamp between admin limits
  const finalSuggestedPrice = Math.min(
    adminConfig.maximumCoursePrice, 
    Math.max(adminConfig.minimumCoursePrice, Math.round(rawSuggested / 50) * 50 - 1)
  );

  const platformFee = Math.round((finalSuggestedPrice * adminConfig.platformCommissionPercentage) / 100);
  const mentorNet = finalSuggestedPrice - platformFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Dynamic Pricing Recommendation Engine</h3>
              <p className="text-xs text-slate-400">Configurable, student-accessible peer fee modeling</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-300 flex items-start gap-2.5">
            <TrendingDown className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <p>
              Skill Circle discourages bloated corporate course prices. Our algorithm estimates an accessible student price that rewards the mentor fairly while remaining well below expensive generic alternatives.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Number of Live Sessions</label>
              <input 
                type="number" 
                min={1} 
                max={20}
                value={numberOfSessions}
                onChange={e => setNumberOfSessions(Number(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Session Length (Minutes)</label>
              <select 
                value={sessionMinutes}
                onChange={e => setSessionMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value={45}>45 Minutes (Sprint)</option>
                <option value={60}>60 Minutes (Standard)</option>
                <option value={90}>90 Minutes (Deep Dive)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Curriculum Difficulty</label>
              <select 
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Beginner">Beginner (1.0x)</option>
                <option value="Intermediate">Intermediate (1.15x)</option>
                <option value="Advanced">Advanced (1.3x)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Mentor Hourly Benchmark (₹)</label>
              <input 
                type="number" 
                step={50}
                min={150}
                max={1500}
                value={mentorHourlyExpectation}
                onChange={e => setMentorHourlyExpectation(Number(e.target.value) || 150)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Addons */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-medium text-slate-300 block">Value Additions</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-lg cursor-pointer flex-1">
                <input 
                  type="checkbox" 
                  checked={hasPracticalProject} 
                  onChange={e => setHasPracticalProject(e.target.checked)}
                  className="rounded text-brand-500"
                />
                <span>Includes Capstone Project (+₹100)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-lg cursor-pointer flex-1">
                <input 
                  type="checkbox" 
                  checked={hasOneOnOneMock} 
                  onChange={e => setHasOneOnOneMock(e.target.checked)}
                  className="rounded text-brand-500"
                />
                <span>1-on-1 Mock Interview (+₹120)</span>
              </label>
            </div>
          </div>

          {/* Result card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Recommended Student Price</span>
                <div className="text-2xl font-bold text-emerald-400">
                  ₹{finalSuggestedPrice}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Admin Price Bounds</span>
                <span className="text-xs text-slate-300 font-mono">
                  ₹{adminConfig.minimumCoursePrice} - ₹{adminConfig.maximumCoursePrice}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Platform Commission ({adminConfig.platformCommissionPercentage}%):</span>
                <span className="text-slate-300 font-medium ml-1">₹{platformFee}</span>
              </div>
              <div>
                <span className="text-slate-400">Mentor Net Payout:</span>
                <span className="text-emerald-400 font-medium ml-1">₹{mentorNet}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          {onApplyPrice && (
            <button
              onClick={() => {
                onApplyPrice(finalSuggestedPrice);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply Price (₹{finalSuggestedPrice})</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
