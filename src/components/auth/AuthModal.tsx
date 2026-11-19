import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, Shield, CheckCircle2, User, Key, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, switchRole, users, addNotification } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [useCollegeEmail, setUseCollegeEmail] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'reset') {
      addNotification('Password Reset Link Sent', `A reset token has been dispatched to ${email || 'your email'}. Check your student inbox.`, 'info');
      setAuthMode('signin');
      return;
    }

    if (authMode === 'signup') {
      const newUser = {
        id: `user-${Date.now()}`,
        name: fullName || 'New Student',
        email: email || 'student@college.edu.sample',
        role: selectedRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        college: college || 'State Engineering College [Demo]',
        xp: 100,
        streakDays: 1,
        badges: ['Welcome to Skill Circle']
      };
      setCurrentUser(newUser);
      addNotification('Account Created!', `Welcome to Skill Circle, ${newUser.name}!`, 'success');
      onClose();
      return;
    }

    // Sign in
    addNotification('Signed In', `Signed in successfully as ${email || currentUser.name}.`, 'success');
    onClose();
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">
              {authMode === 'signin' && 'Sign In to Skill Circle'}
              {authMode === 'signup' && 'Create Student Account'}
              {authMode === 'reset' && 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-400">
              College email preferred (.edu / college domain) • Gmail supported
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Fast Pass */}
        <div className="p-4 bg-brand-500/5 border-b border-slate-800">
          <div className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Prototype Test Drive:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('learner')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors text-center"
            >
              🎓 Learner
            </button>
            <button
              onClick={() => handleQuickDemoLogin('mentor')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors text-center"
            >
              ⭐ Mentor
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          
          {authMode === 'signup' && (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Your Primary Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('learner')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      selectedRole === 'learner' 
                        ? 'bg-brand-500/15 border-brand-500 text-brand-300' 
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    🎓 College Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('mentor')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      selectedRole === 'mentor' 
                        ? 'bg-brand-500/15 border-brand-500 text-brand-300' 
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    ⭐ Student Mentor
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">College / Institute Name</label>
                <input
                  type="text"
                  placeholder="e.g. State Institute of Technology"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400">
                {useCollegeEmail ? 'College Email Address (.edu / college domain)' : 'Personal Gmail Address'}
              </label>
              <button
                type="button"
                onClick={() => setUseCollegeEmail(!useCollegeEmail)}
                className="text-[10px] text-brand-400 hover:underline"
              >
                Switch to {useCollegeEmail ? 'Gmail' : 'College Email'}
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder={useCollegeEmail ? 'your.name@campus.edu.sample' : 'your.email@gmail.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {authMode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400">Password</label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('reset')}
                    className="text-[10px] text-slate-500 hover:text-brand-400"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-brand-600/30 flex items-center justify-center gap-1.5"
          >
            <span>
              {authMode === 'signin' && 'Sign In with Password'}
              {authMode === 'signup' && 'Complete Student Registration'}
              {authMode === 'reset' && 'Send Password Reset Email'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Google SSO placeholder */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                addNotification('Google SSO Mock', 'Google OAuth client initialized (env: VITE_GOOGLE_CLIENT_ID placeholder).', 'info');
                onClose();
              }}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>
          </div>

          {/* Toggle modes */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {authMode === 'signin' ? (
              <p>
                New student on Skill Circle?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-brand-400 font-semibold hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-brand-400 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
