import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Lock, CheckCircle2, ArrowRight, CreditCard, Sparkles } from 'lucide-react';
import { Course } from '../../types';

export const RazorpayCheckoutModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSuccess: (courseId: string) => void;
}> = ({ isOpen, onClose, course, onSuccess }) => {
  const { enrollInCourse, adminConfig, addNotification } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToBaselineTest, setAgreedToBaselineTest] = useState(true);

  if (!isOpen || !course) return null;

  const platformFee = Math.round((course.price * adminConfig.platformCommissionPercentage) / 100);
  const mentorNet = course.price - platformFee;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      enrollInCourse(course.id, course.price);
      onSuccess(course.id);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Razorpay simulation header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              R
            </div>
            <div>
              <span className="font-bold text-white text-xs block">Razorpay Checkout Architecture</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Key: VITE_RAZORPAY_KEY_ID (rzp_test_placeholder)
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Order Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white truncate max-w-[240px]">{course.title}</span>
              <span className="font-bold text-white font-mono">₹{course.price}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Mentor: {course.mentorName} • {course.numberOfSessions} Live Sessions
            </p>
          </div>

          {/* Escrow guarantee notice */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white mb-0.5">Escrow Protection Guarantee</strong>
              <p className="text-[11px] leading-relaxed">
                Your payment of ₹{course.price} remains held in platform escrow until your post-course evaluation shows at least a +{adminConfig.minimumImprovementPercentage}% measurable skill improvement!
              </p>
            </div>
          </div>

          {/* Payment Method selector */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-300 block">Select Demo Payment Method:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  paymentMethod === 'upi' ? 'bg-brand-500/15 border-brand-500 text-brand-300 font-semibold' : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  paymentMethod === 'card' ? 'bg-brand-500/15 border-brand-500 text-brand-300 font-semibold' : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  paymentMethod === 'netbanking' ? 'bg-brand-500/15 border-brand-500 text-brand-300 font-semibold' : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Netbanking
              </button>
            </div>
          </div>

          {/* Pre-assessment consent check */}
          <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer pt-1">
            <input 
              type="checkbox" 
              checked={agreedToBaselineTest}
              onChange={e => setAgreedToBaselineTest(e.target.checked)}
              className="rounded text-brand-500 mt-0.5"
            />
            <span>
              I understand I will complete an AI Pre-Course Assessment before Session 1 to set my baseline score.
            </span>
          </label>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing || !agreedToBaselineTest}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing Razorpay Escrow Hold...</span>
              </span>
            ) : (
              <span>Authorize & Hold ₹{course.price} in Escrow</span>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-500">
            Simulated Sandbox Gateway. No real card charge will be made.
          </p>

        </div>

      </div>
    </div>
  );
};
