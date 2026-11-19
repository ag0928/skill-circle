export type UserRole = 'learner' | 'mentor' | 'admin';

export type VerificationStatus = 
  | 'pending' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'more_info_required';

export interface VerificationData {
  collegeIdUrl?: string;
  collegeEmail?: string;
  isCollegeEmailVerified: boolean;
  linkedInUrl?: string;
  githubUrl?: string;
  certificates?: string[];
  proofDocuments?: string[];
  status: VerificationStatus;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  college: string;
  branch?: string;
  year?: string;
  semester?: string;
  bio?: string;
  xp?: number;
  streakDays?: number;
  badges?: string[];
  // Mentor specific fields
  skills?: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[];
  verification?: VerificationData;
  hourlyRate?: number;
  rating?: number;
  totalReviews?: number;
  totalStudentsTaught?: number;
  teachingFormat?: ('1-on-1' | 'Cohort' | 'Flexible')[];
  availabilityDays?: string[];
  // Learner specific fields
  skillsKnown?: string[];
  skillsToLearn?: string[];
  learningGoals?: string[];
  budgetPreference?: string;
  currentSkillLevel?: string;
  preferredTiming?: string;
}

export type SkillTreeNodeStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface SkillTreeNode {
  id: string;
  title: string;
  tier: 'Foundation' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Projects' | 'Internship Ready' | 'Placement Ready';
  category: string;
  description: string;
  status: SkillTreeNodeStatus;
  prerequisites: string[];
  xpReward: number;
  estimatedHours: number;
  relatedCourseIds: string[];
}

export interface CourseSession {
  id: string;
  title: string;
  durationMinutes: number;
  scheduledTime?: string;
  completed: boolean;
  meetingLink?: string;
  recapId?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  sessions: CourseSession[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorCollege: string;
  mentorRating: number;
  mentorVerified: boolean;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | 'Beginner to Intermediate';
  totalDurationHours: number;
  numberOfSessions: number;
  sessionDurationMinutes: number;
  price: number; // In INR (₹)
  suggestedMinPrice: number;
  suggestedMaxPrice: number;
  learningObjectives: string[];
  modules: CourseModule[];
  resourcesCount: number;
  assignmentsCount: number;
  tags: string[];
  prerequisites: string[];
  preAssessmentId: string;
  postAssessmentId: string;
  enrolledStudentsCount: number;
  createdAt: string;
}

export type PaymentEscrowStatus = 
  | 'Payment Pending' 
  | 'Payment Held' 
  | 'Awaiting Final Assessment' 
  | 'Eligible for Release' 
  | 'Under Review' 
  | 'Disputed' 
  | 'Resolved' 
  | 'Released' 
  | 'Refunded';

export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  mentorId: string;
  mentorName: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  enrolledAt: string;
  progressPercent: number;
  preAssessmentScore?: number; // e.g. 45 (%)
  postAssessmentScore?: number; // e.g. 75 (%)
  improvementPercentage?: number; // e.g. 30 percentage points
  paymentStatus: PaymentEscrowStatus;
  amountPaid: number;
  platformFee: number;
  mentorEarnings: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  sessionsCompleted: number;
  totalSessions: number;
  disputeId?: string;
  isEligibleForRelease: boolean;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  topic: string;
  explanation: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  type: 'pre_course' | 'post_course';
  title: string;
  description: string;
  durationMinutes: number;
  questions: AssessmentQuestion[];
  passingScore?: number;
}

export interface MentorDispute {
  id: string;
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  mentorId: string;
  mentorName: string;
  learnerId: string;
  learnerName: string;
  reason: string;
  supportingExplanation: string;
  evidenceLinks: string[];
  preScore: number;
  postScore: number;
  improvement: number;
  thresholdRequired: number;
  aiCaseAnalysis?: {
    summary: string;
    studentEngagementAssessment: string;
    courseMaterialQuality: string;
    recommendedAction: 'Release payment to mentor' | 'Refund learner' | 'Reassess learner' | 'Partial resolution';
    confidenceScore: number;
  };
  adminVerdict?: 'Release payment to mentor' | 'Refund learner' | 'Request additional information' | 'Reassess learner' | 'Partial resolution';
  adminNotes?: string;
  status: 'Pending' | 'Under Review' | 'Resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface WeeklyGoal {
  id: string;
  userId: string;
  title: string;
  category: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  xpReward: number;
  dueDate: string;
}

export interface SessionRecap {
  id: string;
  sessionId: string;
  courseId: string;
  courseTitle: string;
  mentorName: string;
  learnerName: string;
  date: string;
  sessionSummary: string;
  keyConcepts: string[];
  topicsCovered: string[];
  resources: { title: string; url: string }[];
  assignments: string[];
  homework: string;
  nextSteps: string[];
  questionsDiscussed: string[];
}

export interface SyllabusResource {
  id: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
  subject: string;
  title: string;
  description: string;
  resourceType: 'Notes' | 'Study Guide' | 'Lab Resource' | 'Interview Prep' | 'Practice Problems' | 'Mentor Resource';
  fileFormat: 'PDF' | 'DOCX' | 'ZIP' | 'CODE';
  upvotes: number;
  verifiedByMentor: boolean;
  verifiedByAdmin: boolean;
  uploaderName: string;
  uploaderCollege: string;
  downloadCount: number;
  createdAt: string;
  isSaved?: boolean;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorCollege: string;
  channel: 'global' | 'college' | 'skill' | 'mentor_lounge' | 'cohort';
  categoryTag: string; // e.g. "Question", "Learning Goal", "Poll", "Resource", "Course Request"
  title: string;
  content: string;
  upvotes: number;
  hasUpvoted?: boolean;
  commentsCount: number;
  comments?: {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorRole: UserRole;
    authorCollege: string;
    content: string;
    createdAt: string;
  }[];
  pollOptions?: { text: string; votes: number }[];
  aiSummary?: string;
  createdAt: string;
}

export interface AdminPlatformConfig {
  minimumImprovementPercentage: number; // e.g. 20 (%)
  platformCommissionPercentage: number; // e.g. 10 (%)
  minimumCoursePrice: number; // e.g. ₹299
  maximumCoursePrice: number; // e.g. ₹4999
  mandatoryVerificationFields: {
    collegeId: boolean;
    collegeEmail: boolean;
    linkedIn: boolean;
    github: boolean;
    certificates: boolean;
  };
  allowedCategories: string[];
  escrowAutoReleaseDays: number;
}
