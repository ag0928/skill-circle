import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Course, 
  Enrollment, 
  SkillTreeNode, 
  WeeklyGoal, 
  SessionRecap, 
  SyllabusResource, 
  CommunityPost, 
  AdminPlatformConfig,
  MentorDispute,
  Assessment,
  UserRole,
  VerificationStatus,
  VerificationData,
  PaymentEscrowStatus
} from '../types';
import { 
  mockUsers, 
  mockCourses, 
  mockEnrollments, 
  mockDisputes, 
  mockSkillTreeNodes, 
  mockWeeklyGoals, 
  mockSessionRecaps, 
  mockCampusResources, 
  mockCommunityPosts, 
  initialAdminConfig,
  mockAssessments
} from '../data/mockData';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

interface AppContextType {
  // Current user and role
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  
  // Admin platform configuration
  adminConfig: AdminPlatformConfig;
  updateAdminConfig: (newConfig: Partial<AdminPlatformConfig>) => void;
  
  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'enrolledStudentsCount'>) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  
  // Enrollments & Escrow
  enrollments: Enrollment[];
  enrollInCourse: (courseId: string, amount: number) => Enrollment;
  updateEnrollmentStatus: (enrollmentId: string, status: PaymentEscrowStatus) => void;
  submitAssessmentResult: (enrollmentId: string, isPreTest: boolean, score: number) => void;
  releaseMentorPayment: (enrollmentId: string) => void;
  refundLearnerPayment: (enrollmentId: string) => void;
  
  // Mentor Verification
  submitMentorVerification: (data: Partial<User['verification']>) => void;
  reviewMentorVerification: (mentorId: string, status: VerificationStatus, notes?: string) => void;
  
  // Disputes
  disputes: MentorDispute[];
  submitDispute: (enrollmentId: string, reason: string, explanation: string, evidenceLinks: string[]) => void;
  resolveDispute: (disputeId: string, verdict: MentorDispute['adminVerdict'], notes?: string) => void;
  
  // Visual Skill Tree
  skillTreeNodes: SkillTreeNode[];
  updateNodeStatus: (nodeId: string, status: SkillTreeNode['status']) => void;
  
  // Weekly Goals
  weeklyGoals: WeeklyGoal[];
  toggleGoal: (goalId: string) => void;
  addGoal: (title: string, category: string, targetCount: number, xpReward: number) => void;
  
  // Campus Notes Vault
  resources: SyllabusResource[];
  upvoteResource: (resourceId: string) => void;
  toggleSaveResource: (resourceId: string) => void;
  addResource: (resource: Omit<SyllabusResource, 'id' | 'upvotes' | 'downloadCount' | 'createdAt'>) => void;
  
  // Community
  posts: CommunityPost[];
  addPost: (title: string, content: string, channel: CommunityPost['channel'], categoryTag: string, pollOptions?: string[]) => void;
  upvotePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  
  // Session Recaps
  sessionRecaps: SessionRecap[];
  generateSessionRecap: (sessionId: string, courseId: string, topics: string[], customNotes?: string) => SessionRecap;
  
  // Assessments
  assessments: Record<string, Assessment>;
  
  // Active UI Modals / Screens
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  modalData: any;
  setModalData: (data: any) => void;
  
  // Active view navigation
  activeView: 'landing' | 'learner-dashboard' | 'mentor-dashboard' | 'admin-dashboard' | 'explore-courses' | 'notes-vault' | 'community';
  setActiveView: (view: any) => void;
  
  // Notifications
  notifications: { id: string; title: string; message: string; timestamp: string; read: boolean; type: 'info' | 'success' | 'alert' }[];
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'alert') => void;
  markNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Default to Rohan (Learner)
  const [adminConfig, setAdminConfig] = useState<AdminPlatformConfig>(initialAdminConfig);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [disputes, setDisputes] = useState<MentorDispute[]>(mockDisputes);
  const [skillTreeNodes, setSkillTreeNodes] = useState<SkillTreeNode[]>(mockSkillTreeNodes);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(mockWeeklyGoals);
  const [resources, setResources] = useState<SyllabusResource[]>(mockCampusResources);
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [sessionRecaps, setSessionRecaps] = useState<SessionRecap[]>(mockSessionRecaps);
  const [assessments] = useState<Record<string, Assessment>>(mockAssessments);
  
  const [activeView, setActiveView] = useState<'landing' | 'learner-dashboard' | 'mentor-dashboard' | 'admin-dashboard' | 'explore-courses' | 'notes-vault' | 'community'>('landing');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Welcome to Skill Circle!',
      message: 'Explore courses, connect with verified college mentors, or apply to mentor juniors.',
      timestamp: 'Just now',
      read: false,
      type: 'info'
    },
    {
      id: 'notif-2',
      title: 'Payment Protection Active',
      message: 'Course funds are securely held in escrow until your learning improvement threshold is confirmed.',
      timestamp: '1 hour ago',
      read: false,
      type: 'success'
    }
  ]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title,
        message,
        timestamp: 'Just now',
        read: false,
        type
      },
      ...prev
    ]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === 'learner') setActiveView('learner-dashboard');
      else if (role === 'mentor') setActiveView('mentor-dashboard');
      else if (role === 'admin') setActiveView('admin-dashboard');
      addNotification('Role Switched', `Now exploring as ${targetUser.name} (${role.toUpperCase()})`, 'info');
    }
  };

  const updateAdminConfig = (newConfig: Partial<AdminPlatformConfig>) => {
    setAdminConfig(prev => ({ ...prev, ...newConfig }));
    addNotification('Configuration Updated', 'Platform parameters successfully saved by Admin.', 'success');
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'enrolledStudentsCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      enrolledStudentsCount: 0
    };
    setCourses(prev => [newCourse, ...prev]);
    addNotification('Course Published', `"${newCourse.title}" is now available in the marketplace!`, 'success');
  };

  const enrollInCourse = (courseId: string, amount: number): Enrollment => {
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');

    const platformFee = Math.round((amount * adminConfig.platformCommissionPercentage) / 100);
    const mentorEarnings = amount - platformFee;

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      courseId,
      courseTitle: course.title,
      mentorId: course.mentorId,
      mentorName: course.mentorName,
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      learnerAvatar: currentUser.avatar,
      enrolledAt: new Date().toISOString().split('T')[0],
      progressPercent: 0,
      paymentStatus: 'Payment Held', // Payment held in escrow
      amountPaid: amount,
      platformFee,
      mentorEarnings,
      razorpayPaymentId: `pay_demo_${Math.random().toString(36).substring(7)}`,
      razorpayOrderId: `order_demo_${Math.random().toString(36).substring(7)}`,
      sessionsCompleted: 0,
      totalSessions: course.numberOfSessions,
      isEligibleForRelease: false
    };

    setEnrollments(prev => [newEnrollment, ...prev]);
    
    // Update course student count
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolledStudentsCount: c.enrolledStudentsCount + 1 } : c));
    
    addNotification(
      'Enrollment Confirmed & Escrow Activated', 
      `₹${amount} paid via Razorpay (Demo). Held securely in escrow until post-course improvement is achieved.`,
      'success'
    );

    return newEnrollment;
  };

  const updateEnrollmentStatus = (enrollmentId: string, status: PaymentEscrowStatus) => {
    setEnrollments(prev => prev.map(e => {
      if (e.id === enrollmentId) {
        return { 
          ...e, 
          paymentStatus: status,
          isEligibleForRelease: status === 'Eligible for Release'
        };
      }
      return e;
    }));
  };

  const submitAssessmentResult = (enrollmentId: string, isPreTest: boolean, score: number) => {
    setEnrollments(prev => prev.map(e => {
      if (e.id === enrollmentId) {
        if (isPreTest) {
          return {
            ...e,
            preAssessmentScore: score
          };
        } else {
          // Post test
          const preScore = e.preAssessmentScore || 0;
          const improvement = score - preScore;
          const meetsThreshold = improvement >= adminConfig.minimumImprovementPercentage;
          
          const newStatus: PaymentEscrowStatus = meetsThreshold ? 'Eligible for Release' : 'Payment Held';

          return {
            ...e,
            postAssessmentScore: score,
            improvementPercentage: improvement,
            paymentStatus: newStatus,
            isEligibleForRelease: meetsThreshold,
            progressPercent: 100
          };
        }
      }
      return e;
    }));

    // Reward XP for completing an assessment
    if (currentUser.role === 'learner') {
      setCurrentUser(prev => ({
        ...prev,
        xp: (prev.xp || 0) + (isPreTest ? 50 : 150)
      }));
    }
  };

  const releaseMentorPayment = (enrollmentId: string) => {
    updateEnrollmentStatus(enrollmentId, 'Released');
    addNotification('Escrow Released', 'Mentor payment of funds released successfully!', 'success');
  };

  const refundLearnerPayment = (enrollmentId: string) => {
    updateEnrollmentStatus(enrollmentId, 'Refunded');
    addNotification('Refund Processed', 'Held payment has been refunded to learner via original payment method.', 'info');
  };

  const submitMentorVerification = (data: Partial<User['verification']>) => {
    const updatedVerification: VerificationData = {
      isCollegeEmailVerified: false,
      status: 'under_review',
      submittedAt: new Date().toISOString(),
      ...currentUser.verification,
      ...data,
    };

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, verification: updatedVerification } : u));
    setCurrentUser(prev => ({ ...prev, verification: updatedVerification }));
    addNotification('Verification Submitted', 'Your student documents are now under review by platform admins.', 'info');
  };

  const reviewMentorVerification = (mentorId: string, status: VerificationStatus, notes?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === mentorId && u.verification) {
        return {
          ...u,
          verification: {
            ...u.verification,
            status,
            adminNotes: notes || u.verification.adminNotes,
            reviewedAt: new Date().toISOString()
          }
        };
      }
      return u;
    }));

    if (currentUser.id === mentorId && currentUser.verification) {
      setCurrentUser(prev => ({
        ...prev,
        verification: {
          ...prev.verification!,
          status,
          adminNotes: notes || prev.verification?.adminNotes,
          reviewedAt: new Date().toISOString()
        }
      }));
    }

    addNotification('Verification Status Updated', `Mentor verification status changed to "${status.replace('_', ' ').toUpperCase()}".`, 'info');
  };

  const submitDispute = (enrollmentId: string, reason: string, explanation: string, evidenceLinks: string[]) => {
    const enr = enrollments.find(e => e.id === enrollmentId);
    if (!enr) return;

    const pre = enr.preAssessmentScore || 0;
    const post = enr.postAssessmentScore || 0;
    const improvement = post - pre;

    const newDispute: MentorDispute = {
      id: `disp-${Date.now()}`,
      enrollmentId,
      courseId: enr.courseId,
      courseTitle: enr.courseTitle,
      mentorId: enr.mentorId,
      mentorName: enr.mentorName,
      learnerId: enr.learnerId,
      learnerName: enr.learnerName,
      reason,
      supportingExplanation: explanation,
      evidenceLinks,
      preScore: pre,
      postScore: post,
      improvement,
      thresholdRequired: adminConfig.minimumImprovementPercentage,
      status: 'Under Review',
      createdAt: new Date().toISOString(),
      aiCaseAnalysis: {
        summary: `AI Automated Case Analysis: Case submitted by mentor ${enr.mentorName}. Learner registered ${improvement}% improvement vs ${adminConfig.minimumImprovementPercentage}% required. Analyzing session recordings and submission logs.`,
        studentEngagementAssessment: 'Evaluated session attendance records and final quiz submission metadata.',
        courseMaterialQuality: 'Course syllabus and session recap notes meet platform quality benchmark.',
        recommendedAction: 'Release payment to mentor',
        confidenceScore: 0.88
      }
    };

    setDisputes(prev => [newDispute, ...prev]);
    updateEnrollmentStatus(enrollmentId, 'Disputed');
    addNotification('Dispute Lodged', 'Dispute submitted. Platform Admin and AI Copilot have been notified for review.', 'alert');
  };

  const resolveDispute = (disputeId: string, verdict: MentorDispute['adminVerdict'], notes?: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    setDisputes(prev => prev.map(d => d.id === disputeId ? {
      ...d,
      status: 'Resolved',
      adminVerdict: verdict,
      adminNotes: notes,
      resolvedAt: new Date().toISOString()
    } : d));

    if (verdict === 'Release payment to mentor') {
      updateEnrollmentStatus(dispute.enrollmentId, 'Released');
    } else if (verdict === 'Refund learner') {
      updateEnrollmentStatus(dispute.enrollmentId, 'Refunded');
    } else {
      updateEnrollmentStatus(dispute.enrollmentId, 'Resolved');
    }

    addNotification('Dispute Resolved', `Admin resolved dispute: "${verdict}".`, 'success');
  };

  const updateNodeStatus = (nodeId: string, status: SkillTreeNode['status']) => {
    setSkillTreeNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        // If completed, award XP
        if (status === 'completed' && node.status !== 'completed') {
          setCurrentUser(u => ({ ...u, xp: (u.xp || 0) + node.xpReward }));
          addNotification('Skill Unlocked!', `Earned +${node.xpReward} XP for mastering "${node.title}"!`, 'success');
        }
        return { ...node, status };
      }
      return node;
    }));
  };

  const toggleGoal = (goalId: string) => {
    setWeeklyGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const nextCompleted = !g.completed;
        const nextCount = nextCompleted ? g.targetCount : Math.max(0, g.currentCount - 1);
        if (nextCompleted) {
          setCurrentUser(u => ({ ...u, xp: (u.xp || 0) + g.xpReward }));
          addNotification('Goal Completed!', `+${g.xpReward} XP earned for: ${g.title}`, 'success');
        }
        return { ...g, completed: nextCompleted, currentCount: nextCount };
      }
      return g;
    }));
  };

  const addGoal = (title: string, category: string, targetCount: number, xpReward: number) => {
    const newGoal: WeeklyGoal = {
      id: `g-${Date.now()}`,
      userId: currentUser.id,
      title,
      category,
      targetCount,
      currentCount: 0,
      completed: false,
      xpReward,
      dueDate: 'This Week'
    };
    setWeeklyGoals(prev => [newGoal, ...prev]);
    addNotification('Goal Added', `Weekly micro-goal "${title}" scheduled.`, 'info');
  };

  const upvoteResource = (resourceId: string) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  const toggleSaveResource = (resourceId: string) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, isSaved: !r.isSaved } : r));
  };

  const addResource = (resData: Omit<SyllabusResource, 'id' | 'upvotes' | 'downloadCount' | 'createdAt'>) => {
    const newRes: SyllabusResource = {
      ...resData,
      id: `res-${Date.now()}`,
      upvotes: 1,
      downloadCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setResources(prev => [newRes, ...prev]);
    addNotification('Resource Contributed', `"${newRes.title}" is now added to the Campus Vault!`, 'success');
  };

  const addPost = (title: string, content: string, channel: CommunityPost['channel'], categoryTag: string, pollOptions?: string[]) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorCollege: currentUser.college,
      channel,
      categoryTag,
      title,
      content,
      upvotes: 1,
      commentsCount: 0,
      pollOptions: pollOptions?.map(opt => ({ text: opt, votes: 0 })),
      createdAt: 'Just now'
    };
    setPosts(prev => [newPost, ...prev]);
    addNotification('Discussion Created', 'Your post is live in the community channel.', 'success');
  };

  const upvotePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasUp = p.hasUpvoted;
        return {
          ...p,
          hasUpvoted: !hasUp,
          upvotes: hasUp ? p.upvotes - 1 : p.upvotes + 1
        };
      }
      return p;
    }));
  };

  const addComment = (postId: string, content: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const comment = {
          id: `c-${Date.now()}`,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorRole: currentUser.role,
          authorCollege: currentUser.college,
          content,
          createdAt: 'Just now'
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), comment]
        };
      }
      return p;
    }));
  };

  const generateSessionRecap = (sessionId: string, courseId: string, topics: string[], customNotes?: string): SessionRecap => {
    const course = courses.find(c => c.id === courseId);
    const newRecap: SessionRecap = {
      id: `recap-${Date.now()}`,
      sessionId,
      courseId,
      courseTitle: course?.title || 'Interactive Mentorship Session',
      mentorName: currentUser.role === 'mentor' ? currentUser.name : (course?.mentorName || 'Senior Mentor'),
      learnerName: currentUser.role === 'learner' ? currentUser.name : 'Rohan Sharma',
      date: new Date().toISOString().split('T')[0],
      sessionSummary: customNotes || `Comprehensive breakdown of ${topics.join(', ')}. Live interactive debugging, step-by-step whiteboard derivations, and hands-on coding.`,
      keyConcepts: topics.map(t => `Fundamental principles and real-world application of ${t}`),
      topicsCovered: topics,
      resources: [
        { title: `${topics[0] || 'Topic'} Reference CheatSheet (PDF)`, url: '#' },
        { title: 'Interactive Code Playground Branch', url: 'https://github.com/skill-circle-demo/session-code' }
      ],
      assignments: [
        `Complete practice set on ${topics[0] || 'core concepts'}`,
        'Document any doubts for the upcoming recap check-in'
      ],
      homework: 'Push homework solution to GitHub repo before Friday.',
      nextSteps: [
        'Review whiteboard notes',
        'Attempt checkpoint challenge'
      ],
      questionsDiscussed: [
        'How to optimize space complexity in production environments',
        'Common edge cases encountered in college placement coding tests'
      ]
    };

    setSessionRecaps(prev => [newRecap, ...prev]);
    addNotification('AI Session Recap Generated', 'Summary, code links, and next steps generated and saved to your dashboard.', 'success');
    return newRecap;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchRole,
      users,
      adminConfig,
      updateAdminConfig,
      courses,
      addCourse,
      selectedCourse,
      setSelectedCourse,
      enrollments,
      enrollInCourse,
      updateEnrollmentStatus,
      submitAssessmentResult,
      releaseMentorPayment,
      refundLearnerPayment,
      submitMentorVerification,
      reviewMentorVerification,
      disputes,
      submitDispute,
      resolveDispute,
      skillTreeNodes,
      updateNodeStatus,
      weeklyGoals,
      toggleGoal,
      addGoal,
      resources,
      upvoteResource,
      toggleSaveResource,
      addResource,
      posts,
      addPost,
      upvotePost,
      addComment,
      sessionRecaps,
      generateSessionRecap,
      assessments,
      activeModal,
      setActiveModal,
      modalData,
      setModalData,
      activeView,
      setActiveView,
      notifications,
      addNotification,
      markNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
