import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';
import { AssessmentQuestion } from '../../types';

export const AssessmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  enrollmentId: string;
  isPreTest: boolean;
}> = ({ isOpen, onClose, enrollmentId, isPreTest }) => {
  const { assessments, submitAssessmentResult, adminConfig, enrollments, addNotification } = useApp();

  const assessmentKey = isPreTest ? 'assess-dsa-pre' : 'assess-dsa-post';
  const assessment = assessments[assessmentKey] || assessments['assess-dsa-pre'];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  const currentEnrollment = enrollments.find(e => e.id === enrollmentId);

  if (!isOpen) return null;

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIdx]: optionIdx });
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    assessment.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / assessment.questions.length) * 100);
    setCalculatedScore(scorePercent);
    setIsSubmitted(true);

    submitAssessmentResult(enrollmentId, isPreTest, scorePercent);

    addNotification(
      isPreTest ? 'Pre-Course Baseline Saved' : 'Final Evaluation Completed!',
      `You scored ${scorePercent}%. System evaluated your learning improvement benchmark.`,
      'success'
    );
  };

  const preScore = currentEnrollment?.preAssessmentScore || 0;
  const improvementDelta = isPreTest ? 0 : calculatedScore - preScore;
  const passedThreshold = improvementDelta >= adminConfig.minimumImprovementPercentage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                isPreTest ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isPreTest ? 'Pre-Course Baseline Evaluation' : 'Post-Course Mastery Evaluation'}
              </span>
              <span className="text-xs text-slate-400">• AI Generated Comparable Test</span>
            </div>
            <h3 className="font-bold text-white text-sm">{assessment.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSubmitted ? (
          <div className="p-6 space-y-5">
            
            {/* Progress counter */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
              <span className="flex items-center gap-1 font-mono text-brand-400">
                <Clock className="w-3.5 h-3.5" /> 20:00 Timer
              </span>
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <span className="text-[11px] font-mono text-brand-400 uppercase tracking-wider block">
                Topic: {assessment.questions[currentQuestionIndex].topic}
              </span>
              <h4 className="font-bold text-white text-sm leading-relaxed">
                {assessment.questions[currentQuestionIndex].question}
              </h4>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {assessment.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-brand-500/20 border-brand-500 text-white font-semibold' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white disabled:opacity-30"
              >
                Previous
              </button>

              {currentQuestionIndex < assessment.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Submit & Compute Score
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Submission Results & Scorecard */
          <div className="p-6 space-y-6 text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-extrabold text-white text-xl">
                {isPreTest ? 'Baseline Score Recorded!' : 'Mastery Assessment Completed!'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isPreTest 
                  ? 'Your baseline has been cataloged to track improvement across your mentorship sessions.' 
                  : 'AI has computed your net improvement delta against the pre-course baseline.'
                }
              </p>
            </div>

            {/* Scorecard Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {isPreTest ? 'Pre-Course Score' : 'Final Post-Test Score'}
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-0.5">
                    {calculatedScore}%
                  </div>
                </div>

                {!isPreTest && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Calculated Improvement
                    </span>
                    <div className={`text-3xl font-extrabold font-mono mt-0.5 ${
                      passedThreshold ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      +{improvementDelta} pts
                    </div>
                  </div>
                )}
              </div>

              {!isPreTest && (
                <div className={`p-3 rounded-xl border text-xs text-left ${
                  passedThreshold 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  {passedThreshold ? (
                    <p>
                      ✓ <strong>Threshold Achieved:</strong> Your +{improvementDelta}% gain satisfies the platform's minimum {adminConfig.minimumImprovementPercentage}% improvement policy. Mentor payment is now <strong>Eligible for Release</strong>!
                    </p>
                  ) : (
                    <p>
                      <strong>Threshold Benchmark:</strong> You gained +{improvementDelta}% (threshold is {adminConfig.minimumImprovementPercentage}%). Escrow funds remain protected. If you feel additional practice is needed, consult with your mentor or review recaps.
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30"
            >
              Return to Dashboard
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
