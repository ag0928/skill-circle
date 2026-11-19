import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { AICopilotModal } from './components/common/AICopilotModal';
import { DynamicPriceCalculatorModal } from './components/common/DynamicPriceCalculatorModal';
import { AuthModal } from './components/auth/AuthModal';
import { LearnerOnboardingModal } from './components/onboarding/LearnerOnboardingModal';
import { MentorOnboardingModal } from './components/onboarding/MentorOnboardingModal';
import { LandingPage } from './components/landing/LandingPage';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { MentorDashboard } from './components/mentor/MentorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CourseCatalogView } from './components/courses/CourseCatalogView';
import { CourseDetailModal } from './components/courses/CourseDetailModal';
import { SmartMatchmakerModal } from './components/courses/SmartMatchmakerModal';
import { RazorpayCheckoutModal } from './components/courses/RazorpayCheckoutModal';
import { LiveClassroomModal } from './components/classroom/LiveClassroomModal';
import { AssessmentModal } from './components/assessment/AssessmentModal';
import { NotesVaultView } from './components/vault/NotesVaultView';
import { CommunityView } from './components/community/CommunityView';
import { Course } from './types';

const MainContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    currentUser, 
    selectedCourse, 
    setSelectedCourse,
    addNotification 
  } = useApp();

  // Modal controls
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [isPriceCalculatorOpen, setIsPriceCalculatorOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLearnerOnboardingOpen, setIsLearnerOnboardingOpen] = useState(false);
  const [isMentorOnboardingOpen, setIsMentorOnboardingOpen] = useState(false);
  const [isSmartMatchmakerOpen, setIsSmartMatchmakerOpen] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);

  // Live classroom state
  const [isClassroomOpen, setIsClassroomOpen] = useState(false);
  const [classroomParams, setClassroomParams] = useState({ title: '', partner: '' });

  // Assessment modal state
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [assessmentParams, setAssessmentParams] = useState({ enrollmentId: '', isPreTest: true });

  const handleOpenLiveClassroom = (courseTitle: string, partnerName: string) => {
    setClassroomParams({ title: courseTitle, partner: partnerName });
    setIsClassroomOpen(true);
  };

  const handleOpenAssessment = (enrollmentId: string, isPreTest: boolean) => {
    setAssessmentParams({ enrollmentId, isPreTest });
    setIsAssessmentOpen(true);
  };

  const handleStartCheckout = (course: Course) => {
    setCheckoutCourse(course);
    setIsRazorpayOpen(true);
  };

  const handleBookSlotSuccess = (mentorName: string, slotTime: string) => {
    addNotification('Slot Reserved!', `Mentorship slot booked with ${mentorName} for ${slotTime}.`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      
      {/* Navigation */}
      <Navbar 
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        onOpenPriceCalculator={() => setIsPriceCalculatorOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMentorOnboarding={() => setIsMentorOnboardingOpen(true)}
      />

      {/* Main Body Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenMentorOnboarding={() => setIsMentorOnboardingOpen(true)}
            onOpenLearnerOnboarding={() => setIsLearnerOnboardingOpen(true)}
            onOpenSmartMatchmaker={() => setIsSmartMatchmakerOpen(true)}
          />
        )}

        {activeView === 'learner-dashboard' && (
          <LearnerDashboard
            onLaunchLiveClassroom={handleOpenLiveClassroom}
            onLaunchAssessment={handleOpenAssessment}
            onOpenMatchmaker={() => setIsSmartMatchmakerOpen(true)}
          />
        )}

        {activeView === 'mentor-dashboard' && (
          <MentorDashboard
            onLaunchLiveClassroom={handleOpenLiveClassroom}
            onOpenPriceCalculator={() => setIsPriceCalculatorOpen(true)}
          />
        )}

        {activeView === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {activeView === 'explore-courses' && (
          <CourseCatalogView
            onSelectCourse={(course) => setSelectedCourse(course)}
            onEnroll={handleStartCheckout}
            onMatchmaker={() => setIsSmartMatchmakerOpen(true)}
          />
        )}

        {activeView === 'notes-vault' && (
          <NotesVaultView />
        )}

        {activeView === 'community' && (
          <CommunityView />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Copilot Trigger */}
      <button
        onClick={() => setIsAICopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-xl shadow-brand-500/30 hover:scale-105 transition-all flex items-center gap-2 group"
        title="Open Skill Circle AI Copilot"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">Ask AI Copilot</span>
      </button>

      {/* Global Modals */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <AICopilotModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
      />

      <DynamicPriceCalculatorModal
        isOpen={isPriceCalculatorOpen}
        onClose={() => setIsPriceCalculatorOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <LearnerOnboardingModal
        isOpen={isLearnerOnboardingOpen}
        onClose={() => setIsLearnerOnboardingOpen(false)}
      />

      <MentorOnboardingModal
        isOpen={isMentorOnboardingOpen}
        onClose={() => setIsMentorOnboardingOpen(false)}
      />

      <CourseDetailModal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        course={selectedCourse}
        onEnroll={handleStartCheckout}
        onMatchmaker={() => setIsSmartMatchmakerOpen(true)}
      />

      <SmartMatchmakerModal
        isOpen={isSmartMatchmakerOpen}
        onClose={() => setIsSmartMatchmakerOpen(false)}
        onBookSlot={handleBookSlotSuccess}
      />

      <RazorpayCheckoutModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        course={checkoutCourse}
        onSuccess={() => {
          setActiveView('learner-dashboard');
        }}
      />

      <LiveClassroomModal
        isOpen={isClassroomOpen}
        onClose={() => setIsClassroomOpen(false)}
        courseTitle={classroomParams.title}
        partnerName={classroomParams.partner}
        onSessionEnded={() => {
          if (currentUser.role === 'mentor') setActiveView('mentor-dashboard');
          else setActiveView('learner-dashboard');
        }}
      />

      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        enrollmentId={assessmentParams.enrollmentId}
        isPreTest={assessmentParams.isPreTest}
      />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
