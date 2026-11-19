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
  Assessment
} from '../types';

export const initialAdminConfig: AdminPlatformConfig = {
  minimumImprovementPercentage: 20, // Default 20% improvement threshold to release escrow payment
  platformCommissionPercentage: 10, // 10% platform share
  minimumCoursePrice: 299, // ₹299 minimum affordable pricing
  maximumCoursePrice: 3999, // ₹3999 maximum student ceiling
  mandatoryVerificationFields: {
    collegeId: true,
    collegeEmail: true,
    linkedIn: false,
    github: true,
    certificates: false,
  },
  allowedCategories: [
    'Programming & DSA',
    'Web Development',
    'AI & Machine Learning',
    'Data Science',
    'Cybersecurity',
    'Cloud Computing',
    'UI/UX Design',
    'Resume & Interview Prep',
    'Academic & Core Engineering'
  ],
  escrowAutoReleaseDays: 7
};

export const mockUsers: User[] = [
  {
    id: 'user-learner-1',
    name: 'Rohan Sharma',
    email: 'rohan.student@college.edu.sample',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    college: 'Metro State Institute of Technology [Demo Campus]',
    branch: 'Computer Science & Engineering',
    year: '2nd Year',
    semester: '4th Semester',
    bio: 'Aspiring software developer preparing for summer internship interviews. Focusing on DSA and Full-Stack development.',
    xp: 1420,
    streakDays: 7,
    badges: ['First Course Enrolled', 'Consistent Learner', 'DSA Novice', 'Community Contributor'],
    skillsKnown: ['C++', 'Basic Python', 'HTML/CSS'],
    skillsToLearn: ['Data Structures & Algorithms', 'React.js', 'System Design'],
    learningGoals: ['Internship preparation', 'Placement preparation', 'Project development'],
    budgetPreference: '₹400 - ₹900 per course',
    currentSkillLevel: 'Intermediate beginner',
    preferredTiming: 'Weekday evenings (6 PM - 9 PM) & Weekend mornings'
  },
  {
    id: 'user-mentor-1',
    name: 'Ananya Verma',
    email: 'ananya.senior@techcollege.sample.edu',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    college: 'Apex Engineering Institute [Demo Campus]',
    branch: 'Computer Science (Final Year)',
    year: '4th Year',
    bio: 'Final year senior with 3 internship offers. Solved 500+ LeetCode problems and built multiple production web apps. Passionate about teaching juniors cleanly.',
    hourlyRate: 350,
    rating: 4.9,
    totalReviews: 38,
    totalStudentsTaught: 54,
    teachingFormat: ['1-on-1', 'Cohort'],
    availabilityDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    skills: [
      { name: 'Data Structures & Algorithms', level: 'Expert' },
      { name: 'React & Next.js', level: 'Advanced' },
      { name: 'System Design Basics', level: 'Intermediate' }
    ],
    verification: {
      collegeEmail: 'ananya.senior@techcollege.sample.edu',
      isCollegeEmailVerified: true,
      collegeIdUrl: 'verified-id-card-sample.pdf',
      githubUrl: 'https://github.com/sample-ananya-dev',
      linkedInUrl: 'https://linkedin.com/in/sample-ananya-verma',
      certificates: ['Competitive Programming Regional Rank Holder (Sample)', 'AWS Cloud Practitioner (Sample)'],
      status: 'approved',
      adminNotes: 'Verified against Apex Engineering student directory. Excellent credentials and code samples.',
      submittedAt: '2026-10-10T10:00:00Z',
      reviewedAt: '2026-10-11T14:30:00Z'
    }
  },
  {
    id: 'user-mentor-2',
    name: 'Vikramaditya Rao',
    email: 'vikram.cloud@polytechnic.sample.edu',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    college: 'National Polytechnic College [Demo Campus]',
    branch: 'Information Technology',
    year: '4th Year',
    bio: 'Full-stack cloud developer & open-source contributor. Guided 30+ students through their final-year capstone projects.',
    hourlyRate: 400,
    rating: 4.8,
    totalReviews: 24,
    totalStudentsTaught: 42,
    teachingFormat: ['1-on-1', 'Flexible'],
    availabilityDays: ['Tue', 'Thu', 'Sat', 'Sun'],
    skills: [
      { name: 'Node.js & Express', level: 'Expert' },
      { name: 'PostgreSQL & MongoDB', level: 'Advanced' },
      { name: 'Docker & DevOps', level: 'Advanced' }
    ],
    verification: {
      collegeEmail: 'vikram.cloud@polytechnic.sample.edu',
      isCollegeEmailVerified: true,
      collegeIdUrl: 'vikram-student-badge.pdf',
      githubUrl: 'https://github.com/sample-vikram-tech',
      linkedInUrl: 'https://linkedin.com/in/sample-vikram-rao',
      status: 'approved',
      adminNotes: 'ID and college credentials verified.',
      submittedAt: '2026-09-15T09:00:00Z',
      reviewedAt: '2026-09-16T11:00:00Z'
    }
  },
  {
    id: 'user-mentor-pending',
    name: 'Kabir Das',
    email: 'kabir.das@campus.sample.edu',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    college: 'City Institute of Technology [Demo Campus]',
    branch: 'Electronics & Communication',
    year: '3rd Year',
    bio: 'Embedded systems and Python enthusiast. Looking to mentor students in introductory Python and IoT projects.',
    hourlyRate: 250,
    skills: [
      { name: 'Python for Beginners', level: 'Advanced' },
      { name: 'Arduino & Microcontrollers', level: 'Intermediate' }
    ],
    verification: {
      collegeEmail: 'kabir.das@campus.sample.edu',
      isCollegeEmailVerified: true,
      collegeIdUrl: 'uploaded_id_scan_sample.png',
      githubUrl: 'https://github.com/sample-kabir-code',
      status: 'under_review',
      adminNotes: 'Pending college ID cross-verification check by platform admin.',
      submittedAt: '2026-11-16T15:20:00Z'
    }
  },
  {
    id: 'user-admin-1',
    name: 'Priya Patel',
    email: 'admin.priya@skillcircle.sample',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    college: 'Skill Circle Core Team',
    bio: 'Platform Operations & Quality Assurance Lead. Oversees mentor verification and escrow dispute resolutions.'
  }
];

export const mockAssessments: Record<string, Assessment> = {
  'assess-dsa-pre': {
    id: 'assess-dsa-pre',
    courseId: 'course-1',
    type: 'pre_course',
    title: 'Pre-Course Assessment: DSA Fundamentals Baseline',
    description: 'Measures your current baseline knowledge of arrays, hashing, two-pointers, and algorithmic complexity prior to mentorship.',
    durationMinutes: 20,
    passingScore: 60,
    questions: [
      {
        id: 'q1',
        question: 'What is the average time complexity of searching an element in an unsorted array of size N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctOptionIndex: 2,
        topic: 'Time Complexity',
        explanation: 'In an unsorted array, a linear search requires checking up to N elements in the worst/average case.'
      },
      {
        id: 'q2',
        question: 'Which data structure offers average O(1) time complexity for insertions and key lookups?',
        options: ['Binary Search Tree', 'Hash Map (Hash Table)', 'Linked List', 'Stack'],
        correctOptionIndex: 1,
        topic: 'Hash Maps',
        explanation: 'Hash maps use hash functions to index key-value pairs directly in O(1) average time.'
      },
      {
        id: 'q3',
        question: 'In the Two-Pointer technique on a sorted array to find a target sum, if the current sum is less than target, what should you do?',
        options: ['Decrement the left pointer', 'Increment the left pointer', 'Increment the right pointer', 'Decrement both pointers'],
        correctOptionIndex: 1,
        topic: 'Two-Pointer Technique',
        explanation: 'Because the array is sorted, incrementing the left pointer moves to a larger value, increasing the sum.'
      },
      {
        id: 'q4',
        question: 'What is the space complexity of a recursive Fibonacci solution without memoization for input N?',
        options: ['O(1)', 'O(N) call stack', 'O(2^N)', 'O(N^2)'],
        correctOptionIndex: 1,
        topic: 'Recursion Call Stack',
        explanation: 'The maximum depth of the recursive call stack is O(N) even though total operations are O(2^N).'
      }
    ]
  },
  'assess-dsa-post': {
    id: 'assess-dsa-post',
    courseId: 'course-1',
    type: 'post_course',
    title: 'Post-Course Assessment: DSA Mastery Evaluation',
    description: 'AI-generated comparable evaluation covering identical concepts with new practical problem variations to measure true improvement.',
    durationMinutes: 20,
    passingScore: 60,
    questions: [
      {
        id: 'pq1',
        question: 'What is the time complexity of finding a duplicate number using a frequency hash set on an array of length N?',
        options: ['O(N log N)', 'O(N) with O(N) space', 'O(N^2)', 'O(1)'],
        correctOptionIndex: 1,
        topic: 'Hash Maps & Complexity',
        explanation: 'Inserting and looking up elements in a hash set takes O(1) on average, yielding O(N) total runtime with O(N) auxiliary space.'
      },
      {
        id: 'pq2',
        question: 'When reversing a singly linked list in-place, how many pointer variables are typically required?',
        options: ['1 pointer', '3 pointers (prev, curr, next)', '2 pointers only', 'N pointers'],
        correctOptionIndex: 1,
        topic: 'Linked Lists',
        explanation: 'An iterative reversal utilizes prev, curr, and a temporary next reference to reverse links in O(1) space.'
      },
      {
        id: 'pq3',
        question: 'In a sliding window algorithm finding the maximum sum subarray of size K, how does the window slide from index i to i+1 in O(1) time?',
        options: ['Recompute sum of all K items', 'Subtract outgoing element at i-K and add incoming element at i', 'Sort the window subarray', 'Shift window with a binary search'],
        correctOptionIndex: 1,
        topic: 'Sliding Window',
        explanation: 'The rolling sum updates in O(1) by subtracting the element that exited the left window edge and adding the new element on the right.'
      },
      {
        id: 'pq4',
        question: 'Why does memoization reduce top-down dynamic programming Fibonacci runtime from O(2^N) to O(N)?',
        options: ['It changes the recursion to a binary search', 'It caches results of overlapping subproblems so each is evaluated only once', 'It removes all stack frames', 'It eliminates base conditions'],
        correctOptionIndex: 1,
        topic: 'Dynamic Programming / Memoization',
        explanation: 'By storing answers in an array or map, repeated subproblems are retrieved in O(1) instead of recalculating duplicate subtree trees.'
      }
    ]
  }
};

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    mentorId: 'user-mentor-1',
    mentorName: 'Ananya Verma',
    mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    mentorCollege: 'Apex Engineering Institute [Demo Campus]',
    mentorRating: 4.9,
    mentorVerified: true,
    title: 'Data Structures & Algorithms: From Fundamentals to LeetCode Mediums',
    description: 'Designed specifically for college juniors aiming for 2nd/3rd year internships. Master arrays, two-pointers, sliding window, linked lists, trees, and dynamic programming with student-to-student practical walk-throughs.',
    category: 'Programming & DSA',
    level: 'Beginner to Intermediate',
    totalDurationHours: 12,
    numberOfSessions: 6,
    sessionDurationMinutes: 60,
    price: 699, // Affordable peer price
    suggestedMinPrice: 499,
    suggestedMaxPrice: 999,
    learningObjectives: [
      'Understand big-O space and time complexity practically',
      'Solve array, string, and hash table problems with two-pointers and sliding windows',
      'Confidently implement binary trees, traversals, and basic graphs',
      'Formulate dynamic programming states for 1D memoization'
    ],
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Complexity Analysis & Two-Pointers Mastery',
        description: 'Demystifying big-O, space tradeoffs, and core pointer patterns.',
        lessons: [
          {
            id: 'l1',
            title: 'Lesson 1.1: Big-O in Coding Interviews',
            durationMinutes: 45,
            sessions: [
              { id: 's1', title: 'Interactive Big-O Breakdown & Code Walkthrough', durationMinutes: 60, completed: true }
            ]
          },
          {
            id: 'l2',
            title: 'Lesson 1.2: Two Pointers & Fast/Slow Pointers',
            durationMinutes: 60,
            sessions: [
              { id: 's2', title: 'Live Coding: 3Sum & Container With Most Water', durationMinutes: 60, completed: true }
            ]
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Sliding Window & Hash Maps for Substring Problems',
        description: 'Master fixed and dynamic sliding window algorithms.',
        lessons: [
          {
            id: 'l3',
            title: 'Lesson 2.1: Longest Substring Without Repeating Characters',
            durationMinutes: 50,
            sessions: [
              { id: 's3', title: 'Live Whiteboard & Window State Debugging', durationMinutes: 60, completed: true }
            ]
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Linked Lists & Binary Trees',
        description: 'Pointer manipulation, recursion, and level-order traversals.',
        lessons: [
          {
            id: 'l4',
            title: 'Lesson 3.1: Tree Inversion & BFS/DFS Patterns',
            durationMinutes: 60,
            sessions: [
              { id: 's4', title: 'Mock Interview Style Tree Problem Solving', durationMinutes: 60, completed: false }
            ]
          }
        ]
      }
    ],
    resourcesCount: 14,
    assignmentsCount: 6,
    tags: ['DSA', 'LeetCode', 'Internship Prep', 'C++', 'Java', 'Python'],
    prerequisites: ['Basic syntax in any language (C++, Python, or Java)'],
    preAssessmentId: 'assess-dsa-pre',
    postAssessmentId: 'assess-dsa-post',
    enrolledStudentsCount: 28,
    createdAt: '2026-10-01'
  },
  {
    id: 'course-2',
    mentorId: 'user-mentor-2',
    mentorName: 'Vikramaditya Rao',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    mentorCollege: 'National Polytechnic College [Demo Campus]',
    mentorRating: 4.8,
    mentorVerified: true,
    title: 'Full-Stack MERN for College Capstone & Hackathon Projects',
    description: 'Build a production-grade full-stack web app from scratch. Learn React components, Tailwind CSS, Express REST APIs, JWT authentication, and MongoDB database modeling.',
    category: 'Web Development',
    level: 'Beginner',
    totalDurationHours: 10,
    numberOfSessions: 5,
    sessionDurationMinutes: 60,
    price: 599,
    suggestedMinPrice: 449,
    suggestedMaxPrice: 899,
    learningObjectives: [
      'Build responsive UIs using modern React 18 hooks & Tailwind CSS',
      'Create secure REST APIs with Node.js and Express',
      'Implement JWT token authentication & protected routes',
      'Deploy full-stack projects on Render & Vercel for college submissions'
    ],
    modules: [
      {
        id: 'm2-1',
        title: 'Module 1: React 18 Architecture & State',
        description: 'Clean components, useState, useEffect, and custom hooks.',
        lessons: []
      }
    ],
    resourcesCount: 18,
    assignmentsCount: 4,
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'Hackathon Project'],
    prerequisites: ['Basic JavaScript understanding'],
    preAssessmentId: 'assess-dsa-pre',
    postAssessmentId: 'assess-dsa-post',
    enrolledStudentsCount: 34,
    createdAt: '2026-10-12'
  },
  {
    id: 'course-3',
    mentorId: 'user-mentor-1',
    mentorName: 'Ananya Verma',
    mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    mentorCollege: 'Apex Engineering Institute [Demo Campus]',
    mentorRating: 4.9,
    mentorVerified: true,
    title: 'Crack the Coding Interview: Resume Review & 1-on-1 Mock Sessions',
    description: 'Get your resume tailored to bypass ATS filters, paired with 2 targeted 45-minute mock technical interview sessions with constructive live feedback.',
    category: 'Resume & Interview Prep',
    level: 'All Levels',
    totalDurationHours: 4,
    numberOfSessions: 3,
    sessionDurationMinutes: 45,
    price: 499,
    suggestedMinPrice: 350,
    suggestedMaxPrice: 700,
    learningObjectives: [
      'Format resume using proven engineering action-verb formulas',
      'Master STAR method for behavioral & technical situational questions',
      'Overcome coding interview anxiety with live timed practice'
    ],
    modules: [],
    resourcesCount: 8,
    assignmentsCount: 2,
    tags: ['Resume Review', 'Mock Interview', 'Campus Placements', 'ATS Optimization'],
    prerequisites: ['Draft copy of your current resume'],
    preAssessmentId: 'assess-dsa-pre',
    postAssessmentId: 'assess-dsa-post',
    enrolledStudentsCount: 19,
    createdAt: '2026-10-20'
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: 'enr-1',
    courseId: 'course-1',
    courseTitle: 'Data Structures & Algorithms: From Fundamentals to LeetCode Mediums',
    mentorId: 'user-mentor-1',
    mentorName: 'Ananya Verma',
    learnerId: 'user-learner-1',
    learnerName: 'Rohan Sharma',
    learnerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    enrolledAt: '2026-10-15',
    progressPercent: 85,
    preAssessmentScore: 45, // 45% initial baseline
    postAssessmentScore: 75, // 75% final test score
    improvementPercentage: 30, // +30 percentage points improvement!
    paymentStatus: 'Eligible for Release',
    amountPaid: 699,
    platformFee: 69.9,
    mentorEarnings: 629.1,
    razorpayPaymentId: 'pay_demo_rzp9942a',
    razorpayOrderId: 'order_demo_10982',
    sessionsCompleted: 5,
    totalSessions: 6,
    isEligibleForRelease: true
  },
  {
    id: 'enr-2',
    courseId: 'course-2',
    courseTitle: 'Full-Stack MERN for College Capstone & Hackathon Projects',
    mentorId: 'user-mentor-2',
    mentorName: 'Vikramaditya Rao',
    learnerId: 'user-learner-1',
    learnerName: 'Rohan Sharma',
    learnerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    enrolledAt: '2026-11-01',
    progressPercent: 40,
    preAssessmentScore: 35,
    paymentStatus: 'Payment Held',
    amountPaid: 599,
    platformFee: 59.9,
    mentorEarnings: 539.1,
    razorpayPaymentId: 'pay_demo_rzp8812c',
    razorpayOrderId: 'order_demo_20411',
    sessionsCompleted: 2,
    totalSessions: 5,
    isEligibleForRelease: false
  },
  {
    id: 'enr-disputed-sample',
    courseId: 'course-3',
    courseTitle: 'Crack the Coding Interview: Resume Review & 1-on-1 Mock Sessions',
    mentorId: 'user-mentor-1',
    mentorName: 'Ananya Verma',
    learnerId: 'user-sample-other',
    learnerName: 'Amit Patel [Demo Student]',
    learnerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    enrolledAt: '2026-10-25',
    progressPercent: 100,
    preAssessmentScore: 40,
    postAssessmentScore: 52,
    improvementPercentage: 12, // +12 percentage points (below the 20% admin threshold)
    paymentStatus: 'Disputed',
    amountPaid: 499,
    platformFee: 49.9,
    mentorEarnings: 449.1,
    sessionsCompleted: 3,
    totalSessions: 3,
    disputeId: 'disp-001',
    isEligibleForRelease: false
  }
];

export const mockDisputes: MentorDispute[] = [
  {
    id: 'disp-001',
    enrollmentId: 'enr-disputed-sample',
    courseId: 'course-3',
    courseTitle: 'Crack the Coding Interview: Resume Review & 1-on-1 Mock Sessions',
    mentorId: 'user-mentor-1',
    mentorName: 'Ananya Verma',
    learnerId: 'user-sample-other',
    learnerName: 'Amit Patel [Demo Student]',
    reason: 'Learner did not attempt post-course practice assignments and rushed assessment in 4 minutes',
    supportingExplanation: 'All 3 live sessions were completed with thorough resume line-by-line review and recorded mock feedback. The post-assessment timestamp log shows the student submitted the test in under 4 minutes with multiple unattempted questions. Course logs confirm the learner never opened the assigned mock homework doc.',
    evidenceLinks: [
      'https://github.com/sample-notes/mock-session-notes-amit.pdf',
      'Session-1-recording-timestamp-log.txt'
    ],
    preScore: 40,
    postScore: 52,
    improvement: 12,
    thresholdRequired: 20,
    aiCaseAnalysis: {
      summary: 'AI Case Review: Mentor Ananya conducted all 3 scheduled sessions (135 total minutes logged). Post-assessment metadata demonstrates an anomaly (test completed in 3m 48s vs 20m average). Session recaps demonstrate comprehensive rubric coverage.',
      studentEngagementAssessment: 'Low learner effort on final evaluation. Homework assignments unopened.',
      courseMaterialQuality: 'High mentor engagement with detailed recap notes and custom resume annotations.',
      recommendedAction: 'Release payment to mentor',
      confidenceScore: 0.92
    },
    status: 'Under Review',
    createdAt: '2026-11-10T16:00:00Z'
  }
];

export const mockSkillTreeNodes: SkillTreeNode[] = [
  // Foundation
  {
    id: 'node-found-1',
    title: 'Programming Core & Logic Building',
    tier: 'Foundation',
    category: 'Computer Science',
    description: 'Variables, loops, control flow, functions, memory pointers, and time complexity fundamentals.',
    status: 'completed',
    prerequisites: [],
    xpReward: 150,
    estimatedHours: 15,
    relatedCourseIds: ['course-1']
  },
  {
    id: 'node-found-2',
    title: 'Git & GitHub Collaboration',
    tier: 'Foundation',
    category: 'Developer Tools',
    description: 'Version control, branches, pull requests, resolving merge conflicts in group projects.',
    status: 'completed',
    prerequisites: ['node-found-1'],
    xpReward: 100,
    estimatedHours: 8,
    relatedCourseIds: ['course-2']
  },
  // Beginner
  {
    id: 'node-beg-1',
    title: 'Linear Data Structures',
    tier: 'Beginner',
    category: 'Data Structures',
    description: 'Arrays, strings, singly & doubly linked lists, stacks, and queues implementation.',
    status: 'completed',
    prerequisites: ['node-found-1'],
    xpReward: 200,
    estimatedHours: 20,
    relatedCourseIds: ['course-1']
  },
  {
    id: 'node-beg-2',
    title: 'Frontend Fundamentals (HTML/CSS/JS)',
    tier: 'Beginner',
    category: 'Web Development',
    description: 'Semantic markup, modern CSS flexbox & grid, DOM manipulation, ES6+ features.',
    status: 'in_progress',
    prerequisites: ['node-found-2'],
    xpReward: 180,
    estimatedHours: 18,
    relatedCourseIds: ['course-2']
  },
  // Intermediate
  {
    id: 'node-int-1',
    title: 'Two-Pointers & Sliding Window',
    tier: 'Intermediate',
    category: 'Algorithms',
    description: 'Solving frequency arrays, subarray sums, and contiguous sequence optimizations.',
    status: 'in_progress',
    prerequisites: ['node-beg-1'],
    xpReward: 250,
    estimatedHours: 22,
    relatedCourseIds: ['course-1']
  },
  {
    id: 'node-int-2',
    title: 'React.js Component Architecture',
    tier: 'Intermediate',
    category: 'Web Development',
    description: 'Component lifecycle, hooks, state management, routing, and clean API integration.',
    status: 'available',
    prerequisites: ['node-beg-2'],
    xpReward: 250,
    estimatedHours: 25,
    relatedCourseIds: ['course-2']
  },
  // Advanced
  {
    id: 'node-adv-1',
    title: 'Trees, Graphs & Dynamic Programming',
    tier: 'Advanced',
    category: 'Algorithms',
    description: 'Binary trees, BFS/DFS traversal, Dijkstra, 0/1 knapsack, and longest common subsequence.',
    status: 'available',
    prerequisites: ['node-int-1'],
    xpReward: 350,
    estimatedHours: 35,
    relatedCourseIds: ['course-1']
  },
  {
    id: 'node-adv-2',
    title: 'REST API & Database Systems',
    tier: 'Advanced',
    category: 'Backend',
    description: 'Node.js Express, relational schema design, indexing, JWT auth, and middleware.',
    status: 'locked',
    prerequisites: ['node-int-2'],
    xpReward: 300,
    estimatedHours: 30,
    relatedCourseIds: ['course-2']
  },
  // Projects
  {
    id: 'node-proj-1',
    title: 'Full-Stack Capstone Production App',
    tier: 'Projects',
    category: 'Portfolio',
    description: 'End-to-end full stack web application with authentication, database, and cloud deployment.',
    status: 'locked',
    prerequisites: ['node-adv-2'],
    xpReward: 500,
    estimatedHours: 40,
    relatedCourseIds: ['course-2']
  },
  // Internship Ready
  {
    id: 'node-ready-1',
    title: 'ATS Resume & Technical Mock Interview Prep',
    tier: 'Internship Ready',
    category: 'Career Readiness',
    description: 'Passing technical phone screens, whiteboarding with peer mentors, and behavioral interview fluency.',
    status: 'locked',
    prerequisites: ['node-adv-1', 'node-proj-1'],
    xpReward: 400,
    estimatedHours: 20,
    relatedCourseIds: ['course-3']
  },
  // Placement Ready
  {
    id: 'node-ready-2',
    title: 'Campus Placement & Company Final Round Ready',
    tier: 'Placement Ready',
    category: 'Career Readiness',
    description: 'High-frequency company coding rounds, system design fundamentals, and offer negotiation.',
    status: 'locked',
    prerequisites: ['node-ready-1'],
    xpReward: 600,
    estimatedHours: 30,
    relatedCourseIds: ['course-3']
  }
];

export const mockWeeklyGoals: WeeklyGoal[] = [
  {
    id: 'g-1',
    userId: 'user-learner-1',
    title: 'Solve 5 Two-Pointer LeetCode Mediums',
    category: 'DSA Practice',
    targetCount: 5,
    currentCount: 5,
    completed: true,
    xpReward: 50,
    dueDate: 'This Sunday'
  },
  {
    id: 'g-2',
    userId: 'user-learner-1',
    title: 'Attend Live Classroom Session with Mentor Ananya',
    category: 'Mentorship',
    targetCount: 1,
    currentCount: 1,
    completed: true,
    xpReward: 75,
    dueDate: 'Wednesday'
  },
  {
    id: 'g-3',
    userId: 'user-learner-1',
    title: 'Complete Sliding Window Practice Worksheet',
    category: 'Coursework',
    targetCount: 1,
    currentCount: 1,
    completed: true,
    xpReward: 40,
    dueDate: 'Friday'
  },
  {
    id: 'g-4',
    userId: 'user-learner-1',
    title: 'Review Peer Notes on OS Page Replacement Algorithms',
    category: 'Campus Vault',
    targetCount: 1,
    currentCount: 1,
    completed: true,
    xpReward: 30,
    dueDate: 'Saturday'
  },
  {
    id: 'g-5',
    userId: 'user-learner-1',
    title: 'Attempt Post-Course Assessment for DSA',
    category: 'Assessment',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    xpReward: 100,
    dueDate: 'Sunday Evening'
  }
];

export const mockSessionRecaps: SessionRecap[] = [
  {
    id: 'recap-1',
    sessionId: 's3',
    courseId: 'course-1',
    courseTitle: 'Data Structures & Algorithms: From Fundamentals to LeetCode Mediums',
    mentorName: 'Ananya Verma',
    learnerName: 'Rohan Sharma',
    date: '2026-11-15',
    sessionSummary: 'Deep-dive into sliding window patterns. Evaluated both fixed-window (Max Sum Subarray of Size K) and dynamic-window (Longest Substring Without Repeating Characters). Rohan successfully identified when hash maps are needed to track character last-seen indices.',
    keyConcepts: [
      'Fixed window size vs expanding/shrinking variable window',
      'Using an array of size 256 or Hash Map for O(1) character frequency counts',
      'Maintaining the left and right pointers while maintaining loop invariant'
    ],
    topicsCovered: [
      'Sliding Window Template in C++ & Python',
      'Subarray Product Less Than K',
      'Minimum Window Substring concept overview'
    ],
    resources: [
      { title: 'Sliding Window Visual CheatSheet (PDF)', url: '#' },
      { title: 'GitHub Sample Code Repository', url: 'https://github.com/sample/sliding-window-patterns' }
    ],
    assignments: [
      'Solve LeetCode #209: Minimum Size Subarray Sum',
      'Solve LeetCode #3: Longest Substring Without Repeating Characters in O(N) time'
    ],
    homework: 'Commit solutions to your GitHub branch and note edge cases where all elements are identical.',
    nextSteps: [
      'Prepare for next session: Linked List reversal and fast/slow pointer cycle detection',
      'Revise memory layout of pointers vs references'
    ],
    questionsDiscussed: [
      'Why does an unordered_map sometimes cause TLE compared to a fixed vector of size 128?',
      'How to handle duplicate numbers when computing window sums.'
    ]
  }
];

export const mockCampusResources: SyllabusResource[] = [
  {
    id: 'res-1',
    college: 'Metro State Institute of Technology [Demo Campus]',
    branch: 'Computer Science & Engineering',
    year: '2nd Year',
    semester: '4th Semester',
    subject: 'Operating Systems',
    title: 'Complete Handwritten Lecture Notes: Process Scheduling & Virtual Memory',
    description: 'Clean chapter-by-chapter handwritten notes compiled from professor lectures. Covers CPU scheduling algorithms (Round Robin, SRTF), Bankers Algorithm, Paging, and Page Fault calculations.',
    resourceType: 'Notes',
    fileFormat: 'PDF',
    upvotes: 142,
    verifiedByMentor: true,
    verifiedByAdmin: true,
    uploaderName: 'Ananya Verma (Mentor)',
    uploaderCollege: 'Metro State Institute of Technology [Demo Campus]',
    downloadCount: 388,
    createdAt: '2026-09-20',
    isSaved: true
  },
  {
    id: 'res-2',
    college: 'Metro State Institute of Technology [Demo Campus]',
    branch: 'Computer Science & Engineering',
    year: '2nd Year',
    semester: '4th Semester',
    subject: 'Database Management Systems',
    title: 'SQL Normalization & B+ Trees Exam Revision Quick Sheet',
    description: 'Comprehensive 12-page formula & solved decomposition problems (1NF to BCNF). Includes B-Tree vs B+ Tree insertion steps with step-by-step diagrams.',
    resourceType: 'Study Guide',
    fileFormat: 'PDF',
    upvotes: 98,
    verifiedByMentor: true,
    verifiedByAdmin: false,
    uploaderName: 'Vikramaditya Rao (Mentor)',
    uploaderCollege: 'National Polytechnic College [Demo Campus]',
    downloadCount: 240,
    createdAt: '2026-10-05',
    isSaved: false
  },
  {
    id: 'res-3',
    college: 'Apex Engineering Institute [Demo Campus]',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    semester: '5th Semester',
    subject: 'Computer Networks',
    title: 'Socket Programming Lab Guide & Wireshark Packet Analysis',
    description: 'Lab codes for TCP/UDP client-server architecture in C/Python with annotated screenshots of Wireshark 3-way handshakes.',
    resourceType: 'Lab Resource',
    fileFormat: 'ZIP',
    upvotes: 76,
    verifiedByMentor: true,
    verifiedByAdmin: true,
    uploaderName: 'Siddharth M. [Student]',
    uploaderCollege: 'Apex Engineering Institute [Demo Campus]',
    downloadCount: 185,
    createdAt: '2026-10-18',
    isSaved: false
  },
  {
    id: 'res-4',
    college: 'General Campus Vault',
    branch: 'All Branches',
    year: 'All Years',
    semester: 'All Semesters',
    subject: 'Campus Placements',
    title: 'Top 50 Campus Technical Interview Questions: Curated by Seniors',
    description: 'Frequently asked technical questions across on-campus placement drives with clear explanations, code snippets, and counter-questions.',
    resourceType: 'Interview Prep',
    fileFormat: 'PDF',
    upvotes: 310,
    verifiedByMentor: true,
    verifiedByAdmin: true,
    uploaderName: 'Skill Circle Mentor Guild',
    uploaderCollege: 'Cross-College Network',
    downloadCount: 890,
    createdAt: '2026-08-30',
    isSaved: true
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'user-learner-1',
    authorName: 'Rohan Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    authorRole: 'learner',
    authorCollege: 'Metro State Institute of Technology [Demo Campus]',
    channel: 'skill',
    categoryTag: 'Question',
    title: 'How do you transition from brute-force O(N^2) to Two-Pointers when solving subarray problems?',
    content: 'Whenever I see a problem asking for contiguous subsegments, my first instinct is nested loops. How do seniors train themselves to recognize the two-pointer invariant immediately?',
    upvotes: 18,
    hasUpvoted: true,
    commentsCount: 4,
    aiSummary: 'Question asks for heuristics to recognize two-pointer patterns over O(N^2) brute force. Key community insights highlight monotonic conditions and sorted arrays.',
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'c1',
        authorName: 'Ananya Verma',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        authorRole: 'mentor',
        authorCollege: 'Apex Engineering Institute [Demo Campus]',
        content: 'Look for monotonicity! If moving a pointer strictly increases or decreases the metric (sum, length, product), you can discard portions of search space without recalculating.',
        createdAt: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'user-mentor-1',
    authorName: 'Ananya Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    authorRole: 'mentor',
    authorCollege: 'Apex Engineering Institute [Demo Campus]',
    channel: 'cohort',
    categoryTag: 'Poll',
    title: 'What timing works best for our weekend DSA Mock Interview Live Cohort?',
    content: 'Planning 2 slots for our cohort members this Saturday. Vote below so we can lock in the live classroom time!',
    upvotes: 27,
    commentsCount: 6,
    pollOptions: [
      { text: 'Saturday 10:00 AM - 11:30 AM', votes: 14 },
      { text: 'Saturday 5:00 PM - 6:30 PM', votes: 22 },
      { text: 'Sunday 11:00 AM - 12:30 PM', votes: 9 }
    ],
    createdAt: '5 hours ago'
  },
  {
    id: 'post-3',
    authorId: 'user-learner-2',
    authorName: 'Neha Gupta [Demo]',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    authorRole: 'learner',
    authorCollege: 'National Polytechnic College [Demo Campus]',
    channel: 'global',
    categoryTag: 'Course Request',
    title: 'Course Request: Docker & Kubernetes for College Major Projects',
    content: 'Many of us in 3rd year are building microservice projects but struggling to containerize them cleanly. Any senior mentor willing to create a 4-session practical weekend workshop on Docker + cloud deployment?',
    upvotes: 43,
    hasUpvoted: false,
    commentsCount: 9,
    createdAt: '1 day ago'
  }
];

export const mockCohortDemand = [
  { skill: 'Data Structures & Algorithms', requestsCount: 840, trend: '+34%', level: 'High Demand', category: 'Coding' },
  { skill: 'Full-Stack React & Node.js', requestsCount: 690, trend: '+28%', level: 'High Demand', category: 'Web Dev' },
  { skill: 'Practical GenAI & LLM APIs', requestsCount: 520, trend: '+56%', level: 'Surging', category: 'AI/ML' },
  { skill: 'System Design for Juniors', requestsCount: 410, trend: '+22%', level: 'Moderate', category: 'Architecture' },
  { skill: 'Resume & ATS Interview Prep', requestsCount: 380, trend: '+19%', level: 'Moderate', category: 'Career' },
  { skill: 'DevOps & Docker Deployment', requestsCount: 310, trend: '+41%', level: 'Growing', category: 'Cloud' }
];

export const mockDemoTestimonials = [
  {
    quote: "Commercial bootcamp platforms wanted ₹25,000 for a generic recorded DSA course. On Skill Circle, I connected with Ananya, a 4th-year senior who went through the exact same college placement drive. In 6 focused sessions for under ₹700, I cleared my technical round!",
    name: "Rohan S.",
    role: "2nd Year CS Student",
    college: "Metro State Institute of Technology [Demo Campus]",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    badge: "Verified Learner"
  },
  {
    quote: "As a final year student, teaching juniors not only earned me steady side income without leaving my hostel room, but it also reinforced my own core concepts for FAANG interviews. The escrow system based on learner improvement makes parents and students trust us instantly.",
    name: "Ananya V.",
    role: "4th Year Senior Mentor",
    college: "Apex Engineering Institute [Demo Campus]",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    badge: "Top Mentor Badge"
  },
  {
    quote: "The combination of the visual skill tree and peer notes vault makes preparing for semester exams and hackathons seamless. You always know what to learn next without getting overwhelmed.",
    name: "Tanmay K.",
    role: "3rd Year IT Student",
    college: "National Polytechnic College [Demo Campus]",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    badge: "Active Contributor"
  }
];
