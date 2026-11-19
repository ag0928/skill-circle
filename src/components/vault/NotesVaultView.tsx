import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ThumbsUp, 
  Bookmark, 
  Download, 
  Upload, 
  ShieldCheck, 
  FileText, 
  Plus, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';
import { SyllabusResource } from '../../types';

export const NotesVaultView: React.FC = () => {
  const { 
    resources, 
    upvoteResource, 
    toggleSaveResource, 
    addResource, 
    currentUser, 
    addNotification 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  
  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCollege, setNewCollege] = useState(currentUser.college || 'Metro State Institute of Technology [Demo Campus]');
  const [newBranch, setNewBranch] = useState(currentUser.branch || 'Computer Science & Engineering');
  const [newSemester, setNewSemester] = useState('4th Semester');
  const [newType, setNewType] = useState<SyllabusResource['resourceType']>('Notes');
  const [newDescription, setNewDescription] = useState('');

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = selectedCollege === 'All' || res.college === selectedCollege;
    const matchesBranch = selectedBranch === 'All' || res.branch === selectedBranch;
    const matchesSem = selectedSemester === 'All' || res.semester === selectedSemester;
    const matchesType = selectedType === 'All' || res.resourceType === selectedType;

    return matchesSearch && matchesCollege && matchesBranch && matchesSem && matchesType;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim()) return;

    addResource({
      college: newCollege,
      branch: newBranch,
      year: '2nd Year',
      semester: newSemester,
      subject: newSubject,
      title: newTitle,
      description: newDescription || 'Compiled student study guide for campus exam preparation.',
      resourceType: newType,
      fileFormat: 'PDF',
      verifiedByMentor: currentUser.role === 'mentor',
      verifiedByAdmin: false,
      uploaderName: `${currentUser.name} (${currentUser.role === 'mentor' ? 'Mentor' : 'Student'})`,
      uploaderCollege: currentUser.college
    });

    setIsUploadOpen(false);
    setNewTitle('');
    setNewSubject('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Vault Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
              Campus Syllabus & Exam Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Campus Notes & Syllabus Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Access peer-reviewed handwritten lecture notes, lab manuals, and exam formulas verified by seniors and upvoted by batchmates.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-brand-600/30"
        >
          <Upload className="w-4 h-4" />
          <span>Contribute Notes</span>
        </button>
      </div>

      {/* Hierarchical Filters */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by subject, lecture topic, or exam (e.g. Operating Systems, B+ Trees, DBMS)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Hierarchy Dropdowns: College -> Branch -> Semester -> Type */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Campus</label>
            <select
              value={selectedCollege}
              onChange={e => setSelectedCollege(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Campuses / General</option>
              <option value="Metro State Institute of Technology [Demo Campus]">Metro State Institute [Demo]</option>
              <option value="Apex Engineering Institute [Demo Campus]">Apex Engineering [Demo]</option>
              <option value="General Campus Vault">General Vault</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Branch</label>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Branches</option>
              <option value="Computer Science & Engineering">Computer Science</option>
              <option value="Information Technology">Information Tech</option>
              <option value="All Branches">Cross-Disciplinary</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Semesters</option>
              <option value="4th Semester">4th Semester</option>
              <option value="5th Semester">5th Semester</option>
              <option value="All Semesters">All Semesters</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Types</option>
              <option value="Notes">Lecture Notes</option>
              <option value="Study Guide">Study Guide</option>
              <option value="Lab Resource">Lab Manual</option>
              <option value="Interview Prep">Interview Questions</option>
            </select>
          </div>
        </div>

      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map(res => (
          <div 
            key={res.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-brand-300 px-2 py-0.5 rounded font-semibold">
                  {res.subject} • {res.semester}
                </span>

                <div className="flex items-center gap-1.5">
                  {res.verifiedByMentor && (
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3 h-3" /> Mentor Verified
                    </span>
                  )}
                  {res.verifiedByAdmin && (
                    <span className="text-[10px] bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-medium">
                      Admin Verified
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-white text-sm leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {res.description}
              </p>

              <div className="text-[11px] text-slate-400">
                <span>By {res.uploaderName}</span>
                <span className="text-slate-500 mx-1.5">•</span>
                <span>{res.college}</span>
              </div>
            </div>

            {/* Interaction Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => upvoteResource(res.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-brand-500 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-brand-400" />
                  <span>{res.upvotes}</span>
                </button>

                <button
                  onClick={() => toggleSaveResource(res.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    res.isSaved ? 'bg-brand-500/20 text-brand-400 border-brand-500/30' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title={res.isSaved ? 'Saved to bookmarks' : 'Bookmark resource'}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => addNotification('Download Initialized', `Downloading ${res.title} (${res.fileFormat}) demo file...`, 'info')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{res.fileFormat} Download</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Upload Study Material to Campus Vault</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Subject / Course Name</label>
                <input 
                  type="text" 
                  required
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. Operating Systems, Theory of Computation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Resource Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Memory Management & Paging Solved Numericals"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Semester</label>
                  <select
                    value={newSemester}
                    onChange={e => setNewSemester(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Resource Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Notes">Handwritten Notes</option>
                    <option value="Study Guide">Study Guide / Formula Sheet</option>
                    <option value="Lab Resource">Lab Manual / Code</option>
                    <option value="Interview Prep">Interview Questions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Summary Description</label>
                <textarea 
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe chapters covered, professor notes, and exam tips..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
                >
                  Publish to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
