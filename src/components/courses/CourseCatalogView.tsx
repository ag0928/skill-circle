import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Course } from '../../types';
import { VerificationBadge } from '../common/RoleBadge';

export const CourseCatalogView: React.FC<{
  onSelectCourse: (course: Course) => void;
  onEnroll: (course: Course) => void;
  onMatchmaker: (courseId?: string) => void;
}> = ({ onSelectCourse, onEnroll, onMatchmaker }) => {
  const { courses, adminConfig } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || c.level.includes(selectedLevel);
    return matchesSearch && matchesCat && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
              Peer Learning Marketplace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore Skills & Senior Mentors
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Learn directly from college students who have already mastered the concepts, cleared the placement drives, and built real projects.
          </p>
        </div>

        <button
          onClick={() => onMatchmaker()}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-brand-600/30"
        >
          <Calendar className="w-4 h-4" />
          <span>Match by Availability (2 Clicks)</span>
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by skill, topic, or mentor name (e.g. DSA, React, LeetCode)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Categories</option>
              {adminConfig.allowedCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div 
            key={course.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              {/* Category & Level Tag */}
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="bg-slate-800 text-brand-300 px-2 py-0.5 rounded font-semibold uppercase">
                  {course.category}
                </span>
                <span className="text-slate-400">{course.level}</span>
              </div>

              {/* Course Title */}
              <h3 
                onClick={() => onSelectCourse(course)}
                className="font-bold text-white text-base hover:text-brand-300 transition-colors cursor-pointer leading-snug mb-2 line-clamp-2"
              >
                {course.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                {course.description}
              </p>

              {/* Mentor Row */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
                <img 
                  src={course.mentorAvatar} 
                  alt={course.mentorName} 
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-xs truncate">{course.mentorName}</span>
                    {course.mentorVerified && <VerificationBadge status="approved" showText={false} />}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate block">{course.mentorCollege}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{course.mentorRating}</span>
                </div>
              </div>

              {/* Course specs */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {course.numberOfSessions} Live Sessions ({course.totalDurationHours} hrs)
                </span>
                <span className="text-emerald-400 font-medium">Escrow Protected</span>
              </div>
            </div>

            {/* Price & Action row */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Fee</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">₹{course.price}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelectCourse(course)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
                >
                  Syllabus
                </button>
                <button
                  onClick={() => onEnroll(course)}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                  Enroll
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
