import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Star,
  Send
} from 'lucide-react';
import { VerificationBadge } from '../common/RoleBadge';

export const PeerMentorNetworkView: React.FC = () => {
  const { users, currentUser, addNotification } = useApp();
  const [selectedPeer, setSelectedPeer] = useState<any>(null);
  const [handoffStudentName, setHandoffStudentName] = useState('Rohan Sharma');
  const [handoffSkillNeeded, setHandoffSkillNeeded] = useState('Advanced React Architecture & UI/UX');
  const [handoffNotes, setHandoffNotes] = useState('Student has completed Python & DSA fundamentals and is now building his capstone web app. Seeking UI/UX and React guidance.');

  // List peer mentors (excluding current user)
  const peerMentors = users.filter(u => u.role === 'mentor' && u.id !== currentUser.id);

  const handleSendHandoff = (peerName: string) => {
    addNotification(
      'Learner Hand-Off Dispatched', 
      `Referral for ${handoffStudentName} sent to co-mentor ${peerName}.`, 
      'success'
    );
    setSelectedPeer(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
              Private Mentor Syndicate
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Peer Co-Mentor Network</span>
            <Users className="w-5 h-5 text-brand-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Collaborate with other seniors, share curriculum materials, co-teach multi-disciplinary sessions, or refer learners when their needs expand.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Senior Circle</span>
        </div>
      </div>

      {/* Peer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {peerMentors.map(peer => (
          <div 
            key={peer.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3.5">
                <img 
                  src={peer.avatar} 
                  alt={peer.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-white text-sm truncate">{peer.name}</h4>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{peer.rating || 4.9}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{peer.college}</p>
                  <div className="mt-1">
                    <VerificationBadge status={peer.verification?.status || 'approved'} />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {peer.bio}
              </p>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Core Specialties
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {peer.skills?.map((sk, i) => (
                    <span key={i} className="text-[11px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                      {sk.name} ({sk.level})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => addNotification('Collaboration Ping Sent', `Ping sent to ${peer.name} for co-teaching.`, 'info')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
              >
                Plan Co-Session
              </button>
              <button
                onClick={() => setSelectedPeer(peer)}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Refer / Hand-Off Learner</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hand-Off Modal */}
      {selectedPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                Refer Learner to Co-Mentor {selectedPeer.name}
              </h3>
              <button onClick={() => setSelectedPeer(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Student Name</label>
                <input 
                  type="text" 
                  value={handoffStudentName} 
                  onChange={e => setHandoffStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Skill Area Needed</label>
                <input 
                  type="text" 
                  value={handoffSkillNeeded} 
                  onChange={e => setHandoffSkillNeeded(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Context & Academic Progress Notes</label>
                <textarea 
                  rows={3}
                  value={handoffNotes} 
                  onChange={e => setHandoffNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedPeer(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendHandoff(selectedPeer.name)}
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Referral</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
