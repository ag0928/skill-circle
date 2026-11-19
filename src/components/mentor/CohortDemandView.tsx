import React, { useState } from 'react';
import { mockCohortDemand } from '../../data/mockData';
import { TrendingUp, Users, Sparkles, Filter, BarChart3, Plus, ArrowUpRight } from 'lucide-react';

export const CohortDemandView: React.FC<{
  onCreateCourseForSkill?: (skillName: string) => void;
}> = ({ onCreateCourseForSkill }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Coding' | 'Web Dev' | 'AI/ML' | 'Career'>('All');

  const filteredDemand = selectedFilter === 'All' 
    ? mockCohortDemand 
    : mockCohortDemand.filter(d => d.category === selectedFilter);

  const demandByYear = [
    { year: '1st Year Freshers', percentage: 18, focus: 'C++, Python basics, Git, College syllabus maths/physics' },
    { year: '2nd Year Sophomores', percentage: 38, focus: 'Data Structures & Algorithms, Web Dev, Hackathons' },
    { year: '3rd Year Juniors', percentage: 32, focus: 'Internship Prep, LeetCode Mediums, Full-Stack Capstones' },
    { year: '4th Year Seniors', percentage: 12, focus: 'ATS Resumes, On-campus placements, System design' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
              Live Platform Analytics • Prototype Demo Data
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Student Cohort Demand Analytics</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            See what skills college students are actively searching, upvoting, and requesting before publishing courses.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {['All', 'Coding', 'Web Dev', 'AI/ML', 'Career'].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(tag as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFilter === tag ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Demand Bar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemand.map((item, idx) => (
          <div 
            key={idx}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {item.trend} this week
                </span>
              </div>

              <h4 className="font-bold text-white text-base mt-2">{item.skill}</h4>
              <p className="text-xs text-slate-400 mt-1">
                {item.requestsCount} student requests & upvotes logged
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                {item.level}
              </span>

              {onCreateCourseForSkill && (
                <button
                  onClick={() => onCreateCourseForSkill(item.skill)}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Course</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Demand Breakdown by College Year */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-400" />
          <span>Learner Demand by College Year</span>
        </h3>

        <div className="space-y-4">
          {demandByYear.map((yr, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{yr.year}</span>
                <span className="font-mono text-brand-400 font-bold">{yr.percentage}% of Total Demand</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-brand-500 h-full rounded-full"
                  style={{ width: `${yr.percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">{yr.focus}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
