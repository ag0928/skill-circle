import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowDown, 
  Award, 
  BookOpen, 
  ChevronRight,
  Flame,
  Zap,
  Play
} from 'lucide-react';
import { SkillTreeNode, SkillTreeNodeStatus } from '../../types';

export const VisualSkillTree: React.FC<{
  onSelectCourse?: (courseId: string) => void;
}> = ({ onSelectCourse }) => {
  const { skillTreeNodes, updateNodeStatus, currentUser, courses, setActiveView, setSelectedCourse } = useApp();
  const [selectedNode, setSelectedNode] = useState<SkillTreeNode | null>(skillTreeNodes[2]); // Default select Linear Data Structures
  const [activeRoadmapFilter, setActiveRoadmapFilter] = useState<'All' | 'Full-Stack Software Engineering' | 'Data Structures & Algorithms'>('All');

  const tiers: SkillTreeNode['tier'][] = [
    'Foundation',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Projects',
    'Internship Ready',
    'Placement Ready'
  ];

  const getStatusBadge = (status: SkillTreeNodeStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/40 animate-pulse">
            <Clock className="w-3 h-3 text-brand-400" /> In Progress
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Unlock className="w-3 h-3 text-blue-400" /> Available to Unlock
          </span>
        );
      case 'locked':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
            <Lock className="w-3 h-3 text-slate-500" /> Locked
          </span>
        );
    }
  };

  const completedCount = skillTreeNodes.filter(n => n.status === 'completed').length;
  const progressPercent = Math.round((completedCount / skillTreeNodes.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* Skill tree top banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
              Interactive Game Tech-Tree
            </span>
            <span className="text-xs text-slate-400">• Placement Path</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Visual Skill Tree & Milestones</span>
            <Sparkles className="w-5 h-5 text-brand-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Master prerequisite nodes to unlock advanced topics and reach placement readiness.
          </p>
        </div>

        {/* Level stats */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Mastery</span>
            <span className="text-sm font-bold text-emerald-400">{completedCount} / {skillTreeNodes.length} Nodes</span>
          </div>
          <div className="w-24">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Path Progress</span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* The Visual Skill Tree Canvas */}
        <div className="lg:col-span-2 space-y-6 bg-slate-950/70 p-6 rounded-2xl border border-slate-800/80 relative">
          
          {tiers.map((tier, tierIdx) => {
            const nodesInTier = skillTreeNodes.filter(n => n.tier === tier);
            if (nodesInTier.length === 0) return null;

            return (
              <div key={tier} className="relative">
                
                {/* Tier header pill */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tier {tierIdx + 1}: {tier}
                  </span>
                  <div className="h-px bg-slate-800/80 flex-1 ml-2" />
                </div>

                {/* Nodes in this tier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  {nodesInTier.map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    const isCompleted = node.status === 'completed';
                    const isInProgress = node.status === 'in_progress';
                    const isAvailable = node.status === 'available';

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden group ${
                          isCompleted
                            ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10 hover:border-emerald-400'
                            : isInProgress
                            ? 'bg-slate-900/90 border-brand-500/60 shadow-lg shadow-brand-500/15 hover:border-brand-400'
                            : isAvailable
                            ? 'bg-slate-900/50 border-blue-500/30 hover:border-blue-400'
                            : 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-80'
                        } ${isSelected ? 'ring-2 ring-brand-400 scale-[1.01]' : ''}`}
                      >
                        {/* Glow accent for completed nodes */}
                        {isCompleted && (
                          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                        )}

                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                            {node.title}
                          </span>
                          {getStatusBadge(node.status)}
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          {node.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                          <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                            <Sparkles className="w-3 h-3" /> +{node.xpReward} XP
                          </span>
                          <span>~{node.estimatedHours} hrs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tier connector arrow */}
                {tierIdx < tiers.length - 1 && (
                  <div className="flex justify-center my-3 text-slate-700">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 sticky top-20 shadow-xl">
              
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                    {selectedNode.tier} • {selectedNode.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{selectedNode.title}</h3>
                </div>
                {getStatusBadge(selectedNode.status)}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>

              {/* Prerequisites check */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Prerequisites:</span>
                {selectedNode.prerequisites.length === 0 ? (
                  <span className="text-slate-500 text-[11px]">None (Foundational Entry Point)</span>
                ) : (
                  selectedNode.prerequisites.map(prereqId => {
                    const prereqNode = skillTreeNodes.find(n => n.id === prereqId);
                    const isPrereqDone = prereqNode?.status === 'completed';
                    return (
                      <div key={prereqId} className="flex items-center gap-1.5 text-[11px]">
                        {isPrereqDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span className={isPrereqDone ? 'text-slate-300' : 'text-slate-500'}>
                          {prereqNode?.title || prereqId}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Status control buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 block">Update Node Status:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateNodeStatus(selectedNode.id, 'in_progress')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedNode.status === 'in_progress'
                        ? 'bg-brand-600 text-white border-brand-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => updateNodeStatus(selectedNode.id, 'completed')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedNode.status === 'completed'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-emerald-400 hover:bg-slate-800'
                    }`}
                  >
                    Mark Completed
                  </button>
                </div>
              </div>

              {/* Related courses on Skill Circle */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Corresponding Skill Circle Courses:
                </span>
                {selectedNode.relatedCourseIds.map(cId => {
                  const course = courses.find(c => c.id === cId);
                  if (!course) return null;
                  return (
                    <div 
                      key={cId}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-brand-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-white truncate">{course.title}</span>
                        <span className="font-bold text-emerald-400 font-mono shrink-0 ml-2">₹{course.price}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Mentor: {course.mentorName}</span>
                        <button
                          onClick={() => {
                            setSelectedCourse(course);
                            setActiveView('explore-courses');
                          }}
                          className="text-brand-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>View Course</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
              Click any node in the skill tree to view prerequisites, syllabus topics, and related courses.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
