import React from 'react';
import { UserRole, VerificationStatus } from '../../types';
import { ShieldCheck, Clock, AlertCircle, XCircle, Award } from 'lucide-react';

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  switch (role) {
    case 'admin':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Award className="w-3 h-3" />
          Admin
        </span>
      );
    case 'mentor':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <Award className="w-3 h-3" />
          Mentor
        </span>
      );
    case 'learner':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Learner
        </span>
      );
  }
};

export const VerificationBadge: React.FC<{ status: VerificationStatus; showText?: boolean }> = ({ 
  status, 
  showText = true 
}) => {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {showText && <span>Verified Student Mentor</span>}
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          {showText && <span>Verification Under Review</span>}
        </span>
      );
    case 'more_info_required':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
          {showText && <span>More Info Required</span>}
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          {showText && <span>Application Rejected</span>}
        </span>
      );
    case 'pending':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-500/15 text-slate-400 border border-slate-500/30">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {showText && <span>Verification Pending</span>}
        </span>
      );
  }
};
