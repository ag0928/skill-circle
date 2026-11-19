import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, ArrowRight, ArrowLeft, ShieldCheck, Upload, AlertCircle, Plus, Trash2 } from 'lucide-react';

export const MentorOnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    submitMentorVerification, 
    adminConfig, 
    addNotification,
    setActiveView 
  } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(currentUser.name || '');
  const [college, setCollege] = useState(currentUser.college || '');
  const [branch, setBranch] = useState(currentUser.branch || 'Computer Science');
  const [year, setYear] = useState(currentUser.year || '4th Year');
  const [collegeEmail, setCollegeEmail] = useState(currentUser.email || '');

  // Skills
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');
  const [skills, setSkills] = useState<{ name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[]>([
    { name: 'Data Structures & Algorithms', level: 'Expert' },
    { name: 'React & Frontend Engineering', level: 'Advanced' }
  ]);

  // Verification proofs
  const [githubUrl, setGithubUrl] = useState('https://github.com/sample-student-dev');
  const [linkedInUrl, setLinkedInUrl] = useState('https://linkedin.com/in/sample-student');
  const [collegeIdFile, setCollegeIdFile] = useState('student_id_card_scan.pdf');
  const [teachingExperience, setTeachingExperience] = useState('Guided 10+ batchmates in DSA and organized campus workshop on Git/GitHub.');
  const [hourlyRate, setHourlyRate] = useState(350);
  const [availabilityDays, setAvailabilityDays] = useState<string[]>(['Mon', 'Wed', 'Fri', 'Sat']);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillName.trim()) {
      setSkills([...skills, { name: skillName.trim(), level: skillLevel }]);
      setSkillName('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const toggleDay = (day: string) => {
    if (availabilityDays.includes(day)) {
      setAvailabilityDays(availabilityDays.filter(d => d !== day));
    } else {
      setAvailabilityDays([...availabilityDays, day]);
    }
  };

  const handleSubmitApplication = () => {
    // Validate against admin mandatory fields
    const reqs = adminConfig.mandatoryVerificationFields;
    if (reqs.collegeId && !collegeIdFile) {
      alert('College ID proof is marked mandatory by Admin.');
      return;
    }
    if (reqs.github && !githubUrl) {
      alert('GitHub profile is marked mandatory by Admin.');
      return;
    }

    submitMentorVerification({
      collegeEmail,
      isCollegeEmailVerified: true,
      collegeIdUrl: collegeIdFile,
      githubUrl,
      linkedInUrl,
      certificates: ['Demo College Merit Certificate', 'Hackathon Finalist Demo'],
      status: 'under_review'
    });

    // Update mentor profile
    setCurrentUser({
      ...currentUser,
      name,
      college,
      branch,
      year,
      role: 'mentor',
      hourlyRate,
      skills,
      availabilityDays,
      teachingFormat: ['1-on-1', 'Cohort']
    });

    addNotification(
      'Application Submitted for Verification', 
      'Your mentor application with college ID and credentials is under review by Platform Admin.', 
      'info'
    );

    setActiveView('mentor-dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                {step}
              </span>
              <h3 className="font-bold text-white text-sm">
                {step === 1 && 'Senior Academic Credentials'}
                {step === 2 && 'Skills & Teaching Proficiencies'}
                {step === 3 && 'Verification Proofs (.edu, ID, GitHub)'}
                {step === 4 && 'Availability & Suggested Hourly Rate'}
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

        {/* Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          
          {step === 1 && (
            <div className="space-y-3.5">
              <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <p>
                  Any college student can apply to become a mentor, but mentors must go through verification before a Verified Student Mentor badge is awarded.
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">College / Institute</label>
                <input 
                  type="text" 
                  value={college} 
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. Apex Engineering Institute"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Branch</label>
                  <input 
                    type="text" 
                    value={branch} 
                    onChange={e => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Year</label>
                  <select 
                    value={year} 
                    onChange={e => setYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Postgraduate">Postgraduate / Masters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">College Email (.edu or campus domain)</label>
                <input 
                  type="email" 
                  value={collegeEmail} 
                  onChange={e => setCollegeEmail(e.target.value)}
                  placeholder="student.name@campus.sample.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium mb-1 block">
                  Add Skills You Can Teach & Proficiency
                </label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={skillName} 
                    onChange={e => setSkillName(e.target.value)}
                    placeholder="e.g. System Design, Spring Boot, Figma"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <select 
                    value={skillLevel}
                    onChange={e => setSkillLevel(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-xl flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {skills.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div>
                        <span className="font-semibold text-white">{s.name}</span>
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          {s.level}
                        </span>
                      </div>
                      <button onClick={() => handleRemoveSkill(idx)} className="text-slate-500 hover:text-rose-400 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Teaching / Mentoring Experience</label>
                <textarea 
                  rows={3}
                  value={teachingExperience} 
                  onChange={e => setTeachingExperience(e.target.value)}
                  placeholder="Share details of workshops conducted, coding club sessions, or batchmates taught..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3.5">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                <span className="font-semibold text-slate-300 block">Admin Mandatory Requirements Check:</span>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className={adminConfig.mandatoryVerificationFields.collegeId ? 'text-amber-400 font-medium' : 'text-slate-500'}>
                    • College ID: {adminConfig.mandatoryVerificationFields.collegeId ? 'Mandatory' : 'Optional'}
                  </span>
                  <span className={adminConfig.mandatoryVerificationFields.collegeEmail ? 'text-amber-400 font-medium' : 'text-slate-500'}>
                    • College Email: {adminConfig.mandatoryVerificationFields.collegeEmail ? 'Mandatory' : 'Optional'}
                  </span>
                  <span className={adminConfig.mandatoryVerificationFields.github ? 'text-amber-400 font-medium' : 'text-slate-500'}>
                    • GitHub Profile: {adminConfig.mandatoryVerificationFields.github ? 'Mandatory' : 'Optional'}
                  </span>
                  <span className={adminConfig.mandatoryVerificationFields.linkedIn ? 'text-amber-400 font-medium' : 'text-slate-500'}>
                    • LinkedIn: {adminConfig.mandatoryVerificationFields.linkedIn ? 'Mandatory' : 'Optional'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  College ID Card Scan / Photo {adminConfig.mandatoryVerificationFields.collegeId && <span className="text-rose-400">*</span>}
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <Upload className="w-5 h-5 text-brand-400 shrink-0" />
                  <div className="flex-1 text-xs text-slate-300">
                    <span className="font-medium text-white">{collegeIdFile}</span>
                    <span className="block text-[10px] text-slate-500">Demo student ID attached for verification</span>
                  </div>
                  <button type="button" className="text-xs text-brand-400 hover:underline">
                    Change
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  GitHub Profile URL {adminConfig.mandatoryVerificationFields.github && <span className="text-rose-400">*</span>}
                </label>
                <input 
                  type="url" 
                  value={githubUrl} 
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-username"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  LinkedIn Profile URL {adminConfig.mandatoryVerificationFields.linkedIn && <span className="text-rose-400">*</span>}
                </label>
                <input 
                  type="url" 
                  value={linkedInUrl} 
                  onChange={e => setLinkedInUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Availability Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const active = availabilityDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          active 
                            ? 'bg-brand-600 text-white shadow-md' 
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Base Hourly Benchmark Rate (₹)
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min={200} 
                    max={1000} 
                    step={25}
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="flex-1 accent-brand-500"
                  />
                  <span className="font-bold text-white text-base font-mono w-20 text-right">
                    ₹{hourlyRate}/hr
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Courses can also be priced as complete bundled packages using our dynamic pricing suggester.
                </span>
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

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/30"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitApplication}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit for Verification</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
