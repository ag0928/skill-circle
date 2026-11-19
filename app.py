#!/usr/bin/env python3
"""
Skill Circle - Peer-to-Peer Learning Marketplace for College Students
Complete standalone Python web application.
Zero external dependencies required (Pure Python 3 standard library).

Run with:
    python3 app.py
"""

import http.server
import json
import os
import sys
import urllib.parse
from http import HTTPStatus

PORT = 8000

# ==============================================================================
# IN-MEMORY STATE & DEMO DATA (CONFIGURABLE VIA ADMIN)
# ==============================================================================

STATE = {
    "adminConfig": {
        "minimumImprovementPercentage": 20,
        "platformCommissionPercentage": 10,
        "minimumCoursePrice": 299,
        "maximumCoursePrice": 3999,
        "mandatoryVerificationFields": {
            "collegeId": True,
            "collegeEmail": True,
            "linkedIn": False,
            "github": True,
            "certificates": False
        },
        "allowedCategories": [
            "Programming & DSA",
            "Web Development",
            "AI & Machine Learning",
            "Data Science",
            "Cybersecurity",
            "Cloud Computing",
            "UI/UX Design",
            "Resume & Interview Prep",
            "Academic & Core Engineering"
        ]
    },
    "currentUserId": "user-learner-1",
    "users": [
        {
            "id": "user-learner-1",
            "name": "Rohan Sharma",
            "email": "rohan.student@college.edu.sample",
            "role": "learner",
            "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
            "college": "Metro State Institute of Technology [Demo Campus]",
            "branch": "Computer Science & Engineering",
            "year": "2nd Year",
            "semester": "4th Semester",
            "bio": "Aspiring software developer preparing for summer internship interviews. Focusing on DSA and Full-Stack development.",
            "xp": 1420,
            "streakDays": 7,
            "badges": ["First Course Enrolled", "Consistent Learner", "DSA Novice", "Community Contributor"],
            "skillsKnown": ["C++", "Basic Python", "HTML/CSS"],
            "skillsToLearn": ["Data Structures & Algorithms", "React.js", "System Design"],
            "learningGoals": ["Internship preparation", "Placement preparation", "Project development"],
            "budgetPreference": "₹400 - ₹900 per course",
            "currentSkillLevel": "Intermediate beginner",
            "preferredTiming": "Weekday evenings (6 PM - 9 PM) & Weekend mornings"
        },
        {
            "id": "user-mentor-1",
            "name": "Ananya Verma",
            "email": "ananya.senior@techcollege.sample.edu",
            "role": "mentor",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            "college": "Apex Engineering Institute [Demo Campus]",
            "branch": "Computer Science (Final Year)",
            "year": "4th Year",
            "bio": "Final year senior with 3 internship offers. Solved 500+ LeetCode problems and built multiple production web apps. Passionate about teaching juniors cleanly.",
            "hourlyRate": 350,
            "rating": 4.9,
            "totalReviews": 38,
            "totalStudentsTaught": 54,
            "teachingFormat": ["1-on-1", "Cohort"],
            "availabilityDays": ["Mon", "Wed", "Fri", "Sat"],
            "skills": [
                {"name": "Data Structures & Algorithms", "level": "Expert"},
                {"name": "React & Next.js", "level": "Advanced"},
                {"name": "System Design Basics", "level": "Intermediate"}
            ],
            "verification": {
                "collegeEmail": "ananya.senior@techcollege.sample.edu",
                "isCollegeEmailVerified": True,
                "collegeIdUrl": "verified-id-card-sample.pdf",
                "githubUrl": "https://github.com/sample-ananya-dev",
                "linkedInUrl": "https://linkedin.com/in/sample-ananya-verma",
                "certificates": ["Competitive Programming Regional Rank Holder (Sample)"],
                "status": "approved",
                "adminNotes": "Verified against Apex Engineering student directory. Excellent credentials.",
                "submittedAt": "2026-10-10T10:00:00Z",
                "reviewedAt": "2026-10-11T14:30:00Z"
            }
        },
        {
            "id": "user-mentor-2",
            "name": "Vikramaditya Rao",
            "email": "vikram.cloud@polytechnic.sample.edu",
            "role": "mentor",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
            "college": "National Polytechnic College [Demo Campus]",
            "branch": "Information Technology",
            "year": "4th Year",
            "bio": "Full-stack cloud developer & open-source contributor. Guided 30+ students through capstone projects.",
            "hourlyRate": 400,
            "rating": 4.8,
            "totalReviews": 24,
            "totalStudentsTaught": 42,
            "teachingFormat": ["1-on-1", "Flexible"],
            "availabilityDays": ["Tue", "Thu", "Sat", "Sun"],
            "skills": [
                {"name": "Node.js & Express", "level": "Expert"},
                {"name": "PostgreSQL & MongoDB", "level": "Advanced"}
            ],
            "verification": {
                "collegeEmail": "vikram.cloud@polytechnic.sample.edu",
                "isCollegeEmailVerified": True,
                "collegeIdUrl": "vikram-student-badge.pdf",
                "githubUrl": "https://github.com/sample-vikram-tech",
                "status": "approved",
                "adminNotes": "ID and credentials verified.",
                "submittedAt": "2026-09-15T09:00:00Z"
            }
        },
        {
            "id": "user-mentor-pending",
            "name": "Kabir Das",
            "email": "kabir.das@campus.sample.edu",
            "role": "mentor",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
            "college": "City Institute of Technology [Demo Campus]",
            "branch": "Electronics & Communication",
            "year": "3rd Year",
            "bio": "Embedded systems and Python enthusiast. Looking to mentor students in introductory Python.",
            "hourlyRate": 250,
            "skills": [{"name": "Python for Beginners", "level": "Advanced"}],
            "verification": {
                "collegeEmail": "kabir.das@campus.sample.edu",
                "isCollegeEmailVerified": True,
                "collegeIdUrl": "uploaded_id_scan_sample.png",
                "githubUrl": "https://github.com/sample-kabir-code",
                "status": "under_review",
                "adminNotes": "Pending college ID cross-verification check.",
                "submittedAt": "2026-11-16T15:20:00Z"
            }
        },
        {
            "id": "user-admin-1",
            "name": "Priya Patel",
            "email": "admin.priya@skillcircle.sample",
            "role": "admin",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
            "college": "Skill Circle Platform Team",
            "bio": "Platform Operations & Quality Assurance Lead. Oversees mentor verification and escrow dispute resolutions."
        }
    ],
    "courses": [
        {
            "id": "course-1",
            "mentorId": "user-mentor-1",
            "mentorName": "Ananya Verma",
            "mentorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            "mentorCollege": "Apex Engineering Institute [Demo Campus]",
            "mentorRating": 4.9,
            "mentorVerified": True,
            "title": "Data Structures & Algorithms: From Fundamentals to LeetCode Mediums",
            "description": "Designed specifically for college juniors aiming for 2nd/3rd year internships. Master arrays, two-pointers, sliding window, linked lists, trees, and dynamic programming.",
            "category": "Programming & DSA",
            "level": "Beginner to Intermediate",
            "totalDurationHours": 12,
            "numberOfSessions": 6,
            "sessionDurationMinutes": 60,
            "price": 699,
            "suggestedMinPrice": 499,
            "suggestedMaxPrice": 999,
            "learningObjectives": [
                "Understand big-O space and time complexity practically",
                "Solve array, string, and hash table problems with two-pointers and sliding windows",
                "Confidently implement binary trees, traversals, and basic graphs",
                "Formulate dynamic programming states for 1D memoization"
            ],
            "enrolledStudentsCount": 28,
            "createdAt": "2026-10-01"
        },
        {
            "id": "course-2",
            "mentorId": "user-mentor-2",
            "mentorName": "Vikramaditya Rao",
            "mentorAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
            "mentorCollege": "National Polytechnic College [Demo Campus]",
            "mentorRating": 4.8,
            "mentorVerified": True,
            "title": "Full-Stack MERN for College Capstone & Hackathon Projects",
            "description": "Build a production-grade full-stack web app from scratch. Learn React components, Tailwind CSS, Express REST APIs, JWT authentication, and MongoDB database modeling.",
            "category": "Web Development",
            "level": "Beginner",
            "totalDurationHours": 10,
            "numberOfSessions": 5,
            "sessionDurationMinutes": 60,
            "price": 599,
            "suggestedMinPrice": 449,
            "suggestedMaxPrice": 899,
            "learningObjectives": [
                "Build responsive UIs using modern React 18 hooks & Tailwind CSS",
                "Create secure REST APIs with Node.js and Express",
                "Implement JWT token authentication & protected routes"
            ],
            "enrolledStudentsCount": 34,
            "createdAt": "2026-10-12"
        },
        {
            "id": "course-3",
            "mentorId": "user-mentor-1",
            "mentorName": "Ananya Verma",
            "mentorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            "mentorCollege": "Apex Engineering Institute [Demo Campus]",
            "mentorRating": 4.9,
            "mentorVerified": True,
            "title": "Crack the Coding Interview: Resume Review & 1-on-1 Mock Sessions",
            "description": "Get your resume tailored to bypass ATS filters, paired with 2 targeted 45-minute mock technical interview sessions with constructive live feedback.",
            "category": "Resume & Interview Prep",
            "level": "All Levels",
            "totalDurationHours": 4,
            "numberOfSessions": 3,
            "sessionDurationMinutes": 45,
            "price": 499,
            "suggestedMinPrice": 350,
            "suggestedMaxPrice": 700,
            "learningObjectives": [
                "Format resume using proven engineering action-verb formulas",
                "Master STAR method for behavioral & technical situational questions"
            ],
            "enrolledStudentsCount": 19,
            "createdAt": "2026-10-20"
        }
    ],
    "enrollments": [
        {
            "id": "enr-1",
            "courseId": "course-1",
            "courseTitle": "Data Structures & Algorithms: From Fundamentals to LeetCode Mediums",
            "mentorId": "user-mentor-1",
            "mentorName": "Ananya Verma",
            "learnerId": "user-learner-1",
            "learnerName": "Rohan Sharma",
            "learnerAvatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
            "enrolledAt": "2026-10-15",
            "progressPercent": 85,
            "preAssessmentScore": 45,
            "postAssessmentScore": 75,
            "improvementPercentage": 30,
            "paymentStatus": "Eligible for Release",
            "amountPaid": 699,
            "platformFee": 69.9,
            "mentorEarnings": 629.1,
            "sessionsCompleted": 5,
            "totalSessions": 6,
            "isEligibleForRelease": True
        },
        {
            "id": "enr-2",
            "courseId": "course-2",
            "courseTitle": "Full-Stack MERN for College Capstone & Hackathon Projects",
            "mentorId": "user-mentor-2",
            "mentorName": "Vikramaditya Rao",
            "learnerId": "user-learner-1",
            "learnerName": "Rohan Sharma",
            "learnerAvatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
            "enrolledAt": "2026-11-01",
            "progressPercent": 40,
            "preAssessmentScore": 35,
            "paymentStatus": "Payment Held",
            "amountPaid": 599,
            "platformFee": 59.9,
            "mentorEarnings": 539.1,
            "sessionsCompleted": 2,
            "totalSessions": 5,
            "isEligibleForRelease": False
        },
        {
            "id": "enr-disputed-sample",
            "courseId": "course-3",
            "courseTitle": "Crack the Coding Interview: Resume Review & 1-on-1 Mock Sessions",
            "mentorId": "user-mentor-1",
            "mentorName": "Ananya Verma",
            "learnerId": "user-sample-other",
            "learnerName": "Amit Patel [Demo Student]",
            "learnerAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
            "enrolledAt": "2026-10-25",
            "progressPercent": 100,
            "preAssessmentScore": 40,
            "postAssessmentScore": 52,
            "improvementPercentage": 12,
            "paymentStatus": "Disputed",
            "amountPaid": 499,
            "platformFee": 49.9,
            "mentorEarnings": 449.1,
            "sessionsCompleted": 3,
            "totalSessions": 3,
            "disputeId": "disp-001",
            "isEligibleForRelease": False
        }
    ],
    "disputes": [
        {
            "id": "disp-001",
            "enrollmentId": "enr-disputed-sample",
            "courseId": "course-3",
            "courseTitle": "Crack the Coding Interview: Resume Review & 1-on-1 Mock Sessions",
            "mentorId": "user-mentor-1",
            "mentorName": "Ananya Verma",
            "learnerId": "user-sample-other",
            "learnerName": "Amit Patel [Demo Student]",
            "reason": "Learner did not attempt post-course practice assignments and rushed assessment in 4 minutes",
            "supportingExplanation": "All 3 live sessions were completed with thorough resume line-by-line review. The post-assessment timestamp log shows the student submitted the test in under 4 minutes with multiple unattempted questions.",
            "evidenceLinks": ["https://github.com/sample/mock-session-notes.pdf"],
            "preScore": 40,
            "postScore": 52,
            "improvement": 12,
            "thresholdRequired": 20,
            "aiCaseAnalysis": {
                "summary": "AI Case Review: Mentor conducted all 3 scheduled sessions. Post-assessment metadata demonstrates an anomaly (test completed in 3m 48s vs 20m average). Session recaps demonstrate comprehensive rubric coverage.",
                "studentEngagementAssessment": "Low learner effort on final evaluation. Homework assignments unopened.",
                "courseMaterialQuality": "High mentor engagement with detailed recap notes and custom resume annotations.",
                "recommendedAction": "Release payment to mentor",
                "confidenceScore": 0.92
            },
            "status": "Under Review",
            "createdAt": "2026-11-10T16:00:00Z"
        }
    ],
    "skillTreeNodes": [
        {"id": "node-found-1", "title": "Programming Core & Logic Building", "tier": "Foundation", "category": "Computer Science", "description": "Variables, loops, control flow, functions, memory pointers, and time complexity fundamentals.", "status": "completed", "prerequisites": [], "xpReward": 150, "estimatedHours": 15, "relatedCourseIds": ["course-1"]},
        {"id": "node-found-2", "title": "Git & GitHub Collaboration", "tier": "Foundation", "category": "Developer Tools", "description": "Version control, branches, pull requests, resolving merge conflicts in group projects.", "status": "completed", "prerequisites": ["node-found-1"], "xpReward": 100, "estimatedHours": 8, "relatedCourseIds": ["course-2"]},
        {"id": "node-beg-1", "title": "Linear Data Structures", "tier": "Beginner", "category": "Data Structures", "description": "Arrays, strings, singly & doubly linked lists, stacks, and queues implementation.", "status": "completed", "prerequisites": ["node-found-1"], "xpReward": 200, "estimatedHours": 20, "relatedCourseIds": ["course-1"]},
        {"id": "node-beg-2", "title": "Frontend Fundamentals (HTML/CSS/JS)", "tier": "Beginner", "category": "Web Development", "description": "Semantic markup, modern CSS flexbox & grid, DOM manipulation, ES6+ features.", "status": "in_progress", "prerequisites": ["node-found-2"], "xpReward": 180, "estimatedHours": 18, "relatedCourseIds": ["course-2"]},
        {"id": "node-int-1", "title": "Two-Pointers & Sliding Window", "tier": "Intermediate", "category": "Algorithms", "description": "Solving frequency arrays, subarray sums, and contiguous sequence optimizations.", "status": "in_progress", "prerequisites": ["node-beg-1"], "xpReward": 250, "estimatedHours": 22, "relatedCourseIds": ["course-1"]},
        {"id": "node-int-2", "title": "React.js Component Architecture", "tier": "Intermediate", "category": "Web Development", "description": "Component lifecycle, hooks, state management, routing, and clean API integration.", "status": "available", "prerequisites": ["node-beg-2"], "xpReward": 250, "estimatedHours": 25, "relatedCourseIds": ["course-2"]},
        {"id": "node-adv-1", "title": "Trees, Graphs & Dynamic Programming", "tier": "Advanced", "category": "Algorithms", "description": "Binary trees, BFS/DFS traversal, Dijkstra, 0/1 knapsack, and longest common subsequence.", "status": "available", "prerequisites": ["node-int-1"], "xpReward": 350, "estimatedHours": 35, "relatedCourseIds": ["course-1"]},
        {"id": "node-adv-2", "title": "REST API & Database Systems", "tier": "Advanced", "category": "Backend", "description": "Node.js Express, relational schema design, indexing, JWT auth, and middleware.", "status": "locked", "prerequisites": ["node-int-2"], "xpReward": 300, "estimatedHours": 30, "relatedCourseIds": ["course-2"]},
        {"id": "node-proj-1", "title": "Full-Stack Capstone Production App", "tier": "Projects", "category": "Portfolio", "description": "End-to-end full stack web application with authentication, database, and cloud deployment.", "status": "locked", "prerequisites": ["node-adv-2"], "xpReward": 500, "estimatedHours": 40, "relatedCourseIds": ["course-2"]},
        {"id": "node-ready-1", "title": "ATS Resume & Technical Mock Interview Prep", "tier": "Internship Ready", "category": "Career Readiness", "description": "Passing technical phone screens, whiteboarding with peer mentors, and behavioral interview fluency.", "status": "locked", "prerequisites": ["node-adv-1", "node-proj-1"], "xpReward": 400, "estimatedHours": 20, "relatedCourseIds": ["course-3"]},
        {"id": "node-ready-2", "title": "Campus Placement & Final Round Ready", "tier": "Placement Ready", "category": "Career Readiness", "description": "High-frequency company coding rounds, system design fundamentals, and offer negotiation.", "status": "locked", "prerequisites": ["node-ready-1"], "xpReward": 600, "estimatedHours": 30, "relatedCourseIds": ["course-3"]}
    ],
    "weeklyGoals": [
        {"id": "g-1", "title": "Solve 5 Two-Pointer LeetCode Mediums", "category": "DSA Practice", "targetCount": 5, "currentCount": 5, "completed": True, "xpReward": 50, "dueDate": "This Sunday"},
        {"id": "g-2", "title": "Attend Live Classroom Session with Mentor Ananya", "category": "Mentorship", "targetCount": 1, "currentCount": 1, "completed": True, "xpReward": 75, "dueDate": "Wednesday"},
        {"id": "g-3", "title": "Complete Sliding Window Practice Worksheet", "category": "Coursework", "targetCount": 1, "currentCount": 1, "completed": True, "xpReward": 40, "dueDate": "Friday"},
        {"id": "g-4", "title": "Review Peer Notes on OS Page Replacement Algorithms", "category": "Campus Vault", "targetCount": 1, "currentCount": 1, "completed": True, "xpReward": 30, "dueDate": "Saturday"},
        {"id": "g-5", "title": "Attempt Post-Course Assessment for DSA", "category": "Assessment", "targetCount": 1, "currentCount": 0, "completed": False, "xpReward": 100, "dueDate": "Sunday Evening"}
    ],
    "sessionRecaps": [
        {
            "id": "recap-1",
            "courseTitle": "Data Structures & Algorithms: From Fundamentals to LeetCode Mediums",
            "mentorName": "Ananya Verma",
            "learnerName": "Rohan Sharma",
            "date": "2026-11-15",
            "sessionSummary": "Deep-dive into sliding window patterns. Evaluated both fixed-window (Max Sum Subarray of Size K) and dynamic-window (Longest Substring Without Repeating Characters). Rohan successfully identified when hash maps are needed to track character last-seen indices.",
            "keyConcepts": [
                "Fixed window size vs expanding/shrinking variable window",
                "Using an array of size 256 or Hash Map for O(1) character frequency counts",
                "Maintaining the left and right pointers while maintaining loop invariant"
            ],
            "topicsCovered": [
                "Sliding Window Template in C++ & Python",
                "Subarray Product Less Than K",
                "Minimum Window Substring concept overview"
            ],
            "resources": [
                {"title": "Sliding Window Visual CheatSheet (PDF)", "url": "#"},
                {"title": "GitHub Sample Code Repository", "url": "https://github.com/sample/sliding-window-patterns"}
            ],
            "assignments": [
                "Solve LeetCode #209: Minimum Size Subarray Sum",
                "Solve LeetCode #3: Longest Substring Without Repeating Characters in O(N) time"
            ],
            "homework": "Commit solutions to your GitHub branch and note edge cases where all elements are identical."
        }
    ],
    "campusResources": [
        {
            "id": "res-1",
            "college": "Metro State Institute of Technology [Demo Campus]",
            "branch": "Computer Science & Engineering",
            "year": "2nd Year",
            "semester": "4th Semester",
            "subject": "Operating Systems",
            "title": "Complete Handwritten Lecture Notes: Process Scheduling & Virtual Memory",
            "description": "Clean chapter-by-chapter handwritten notes compiled from professor lectures. Covers CPU scheduling algorithms (Round Robin, SRTF), Bankers Algorithm, Paging, and Page Fault calculations.",
            "resourceType": "Notes",
            "fileFormat": "PDF",
            "upvotes": 142,
            "verifiedByMentor": True,
            "verifiedByAdmin": True,
            "uploaderName": "Ananya Verma (Mentor)",
            "uploaderCollege": "Metro State Institute of Technology [Demo Campus]",
            "isSaved": True
        },
        {
            "id": "res-2",
            "college": "Metro State Institute of Technology [Demo Campus]",
            "branch": "Computer Science & Engineering",
            "year": "2nd Year",
            "semester": "4th Semester",
            "subject": "Database Management Systems",
            "title": "SQL Normalization & B+ Trees Exam Revision Quick Sheet",
            "description": "Comprehensive 12-page formula & solved decomposition problems (1NF to BCNF). Includes B-Tree vs B+ Tree insertion steps with step-by-step diagrams.",
            "resourceType": "Study Guide",
            "fileFormat": "PDF",
            "upvotes": 98,
            "verifiedByMentor": True,
            "verifiedByAdmin": False,
            "uploaderName": "Vikramaditya Rao (Mentor)",
            "uploaderCollege": "National Polytechnic College [Demo Campus]",
            "isSaved": False
        },
        {
            "id": "res-4",
            "college": "General Campus Vault",
            "branch": "All Branches",
            "year": "All Years",
            "semester": "All Semesters",
            "subject": "Campus Placements",
            "title": "Top 50 Campus Technical Interview Questions: Curated by Seniors",
            "description": "Frequently asked technical questions across on-campus placement drives with clear explanations, code snippets, and counter-questions.",
            "resourceType": "Interview Prep",
            "fileFormat": "PDF",
            "upvotes": 310,
            "verifiedByMentor": True,
            "verifiedByAdmin": True,
            "uploaderName": "Skill Circle Mentor Guild",
            "uploaderCollege": "Cross-College Network",
            "isSaved": True
        }
    ],
    "communityPosts": [
        {
            "id": "post-1",
            "authorName": "Rohan Sharma",
            "authorAvatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
            "authorRole": "learner",
            "authorCollege": "Metro State Institute of Technology [Demo Campus]",
            "channel": "skill",
            "categoryTag": "Question",
            "title": "How do you transition from brute-force O(N^2) to Two-Pointers when solving subarray problems?",
            "content": "Whenever I see a problem asking for contiguous subsegments, my first instinct is nested loops. How do seniors train themselves to recognize the two-pointer invariant immediately?",
            "upvotes": 18,
            "hasUpvoted": True,
            "commentsCount": 1,
            "aiSummary": "Question asks for heuristics to recognize two-pointer patterns over O(N^2) brute force. Key community insights highlight monotonic conditions and sorted arrays.",
            "createdAt": "2 hours ago",
            "comments": [
                {
                    "authorName": "Ananya Verma",
                    "authorRole": "mentor",
                    "content": "Look for monotonicity! If moving a pointer strictly increases or decreases the metric (sum, length, product), you can discard portions of search space without recalculating.",
                    "createdAt": "1 hour ago"
                }
            ]
        },
        {
            "id": "post-2",
            "authorName": "Ananya Verma",
            "authorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            "authorRole": "mentor",
            "authorCollege": "Apex Engineering Institute [Demo Campus]",
            "channel": "cohort",
            "categoryTag": "Poll",
            "title": "What timing works best for our weekend DSA Mock Interview Live Cohort?",
            "content": "Planning 2 slots for our cohort members this Saturday. Vote below so we can lock in the live classroom time!",
            "upvotes": 27,
            "commentsCount": 0,
            "pollOptions": [
                {"text": "Saturday 10:00 AM - 11:30 AM", "votes": 14},
                {"text": "Saturday 5:00 PM - 6:30 PM", "votes": 22},
                {"text": "Sunday 11:00 AM - 12:30 PM", "votes": 9}
            ],
            "createdAt": "5 hours ago"
        }
    ],
    "cohortDemand": [
        {"skill": "Data Structures & Algorithms", "requestsCount": 840, "trend": "+34%", "level": "High Demand", "category": "Coding"},
        {"skill": "Full-Stack React & Node.js", "requestsCount": 690, "trend": "+28%", "level": "High Demand", "category": "Web Dev"},
        {"skill": "Practical GenAI & LLM APIs", "requestsCount": 520, "trend": "+56%", "level": "Surging", "category": "AI/ML"},
        {"skill": "System Design for Juniors", "requestsCount": 410, "trend": "+22%", "level": "Moderate", "category": "Architecture"},
        {"skill": "Resume & ATS Interview Prep", "requestsCount": 380, "trend": "+19%", "level": "Moderate", "category": "Career"},
        {"skill": "DevOps & Docker Deployment", "requestsCount": 310, "trend": "+41%", "level": "Growing", "category": "Cloud"}
    ],
    "assessments": {
        "pre": {
            "title": "Pre-Course Baseline Evaluation",
            "questions": [
                {
                    "q": "What is the average time complexity of searching an element in an unsorted array of size N?",
                    "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                    "correct": 2
                },
                {
                    "q": "Which data structure offers average O(1) time complexity for key lookups and insertions?",
                    "options": ["Binary Search Tree", "Hash Map (Hash Table)", "Linked List", "Stack"],
                    "correct": 1
                },
                {
                    "q": "In the Two-Pointer technique on a sorted array, if current sum < target, what should you do?",
                    "options": ["Decrement left pointer", "Increment left pointer", "Increment right pointer", "Decrement both"],
                    "correct": 1
                }
            ]
        },
        "post": {
            "title": "Post-Course Mastery Evaluation",
            "questions": [
                {
                    "q": "What is the time complexity of finding duplicate numbers using a frequency hash set on an array of length N?",
                    "options": ["O(N log N)", "O(N) with O(N) space", "O(N^2)", "O(1)"],
                    "correct": 1
                },
                {
                    "q": "When reversing a singly linked list in-place, how many pointer variables are typically required?",
                    "options": ["1 pointer", "3 pointers (prev, curr, next)", "2 pointers only", "N pointers"],
                    "correct": 1
                },
                {
                    "q": "In a sliding window algorithm finding max sum subarray of size K, how does the window slide in O(1) time?",
                    "options": ["Recompute sum of all K items", "Subtract outgoing element at left and add incoming element at right", "Sort window subarray", "Binary search"],
                    "correct": 1
                }
            ]
        }
    }
}


# ==============================================================================
# HTML FRONTEND TEMPLATE (MODERN, REACTIVE & RESPONSIVE WITH ZERO NPM DEPS)
# ==============================================================================

HTML_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Skill Circle | Peer-to-Peer Learning Marketplace for College Students</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0b0f19; color: #f1f5f9; }
    h1, h2, h3, h4 { font-family: 'Plus Jakarta Sans', sans-serif; }
    .glass-card { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .glass-card:hover { border-color: rgba(67, 109, 247, 0.35); }
    .modal-backdrop { background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">

  <!-- TOP NAVIGATION BAR -->
  <header class="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      
      <!-- Brand -->
      <div class="flex items-center gap-6">
        <a href="javascript:switchView('landing')" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform font-bold text-lg">
            SC
          </div>
          <div>
            <span class="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              Skill<span class="text-blue-400">Circle</span>
            </span>
            <span class="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wider">PEER LEARNING</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
          <button onclick="switchView('courses')" class="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
            Explore Skills
          </button>
          <button onclick="switchView('vault')" class="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
            Campus Vault
          </button>
          <button onclick="switchView('community')" class="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
            Community
          </button>
          <button onclick="openMentorModal()" class="px-3 py-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors font-bold">
            Become a Mentor
          </button>
        </nav>
      </div>

      <!-- Right Utility Controls -->
      <div class="flex items-center gap-2.5">
        <button onclick="openPriceModal()" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors" title="Dynamic Price Suggester">
          <i data-lucide="calculator" class="w-4 h-4"></i>
        </button>

        <button onclick="openCopilot()" class="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-all">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-blue-400"></i>
          <span>AI Copilot</span>
        </button>

        <!-- Role Selector Pill -->
        <div class="relative">
          <select id="roleSelector" onchange="changeRole(this.value)" class="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="user-learner-1">🎓 Rohan (Learner)</option>
            <option value="user-mentor-1">⭐ Ananya (Verified Mentor)</option>
            <option value="user-admin-1">🛡️ Priya (Platform Admin)</option>
          </select>
        </div>

        <button id="dashboardBtn" onclick="goToDashboard()" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-all shadow-md shadow-blue-600/30">
          Dashboard
        </button>
      </div>
    </div>
  </header>

  <!-- DYNAMIC VIEW CONTAINER -->
  <main id="appContainer" class="flex-1 pb-16">
    <!-- Rendered dynamically by JavaScript -->
  </main>

  <!-- FOOTER -->
  <footer class="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">SC</div>
        <span class="font-bold text-white">Skill Circle</span>
        <span class="text-slate-600">•</span>
        <span>Peer Learning Marketplace for College Students</span>
      </div>
      <div class="text-[11px] text-slate-500">
        Demo/Prototype Mode. Escrow protection & verification policy configurable via Admin Dashboard.
      </div>
    </div>
  </footer>

  <!-- FLOATING AI COPILOT LAUNCHER -->
  <button onclick="openCopilot()" class="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2">
    <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
    <span class="text-xs font-bold hidden sm:inline">Ask AI Copilot</span>
  </button>

  <!-- MODALS CONTAINER -->
  <div id="modalContainer"></div>

  <!-- JAVASCRIPT APPLICATION LOGIC -->
  <script>
    let appState = null;
    let currentView = 'landing';

    async function loadState() {
      const res = await fetch('/api/state');
      appState = await res.json();
      renderCurrentView();
    }

    function switchView(viewName) {
      currentView = viewName;
      renderCurrentView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function goToDashboard() {
      const currentUser = appState.users.find(u => u.id === appState.currentUserId);
      if (currentUser.role === 'learner') switchView('learner-dashboard');
      else if (currentUser.role === 'mentor') switchView('mentor-dashboard');
      else switchView('admin-dashboard');
    }

    async function changeRole(userId) {
      await fetch('/api/role/switch', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId })
      });
      await loadState();
      goToDashboard();
    }

    function renderCurrentView() {
      const container = document.getElementById('appContainer');
      const currentUser = appState.users.find(u => u.id === appState.currentUserId);
      document.getElementById('roleSelector').value = appState.currentUserId;

      if (currentView === 'landing') {
        container.innerHTML = renderLandingPage();
      } else if (currentView === 'learner-dashboard') {
        container.innerHTML = renderLearnerDashboard(currentUser);
      } else if (currentView === 'mentor-dashboard') {
        container.innerHTML = renderMentorDashboard(currentUser);
      } else if (currentView === 'admin-dashboard') {
        container.innerHTML = renderAdminDashboard();
      } else if (currentView === 'courses') {
        container.innerHTML = renderCoursesView();
      } else if (currentView === 'vault') {
        container.innerHTML = renderVaultView();
      } else if (currentView === 'community') {
        container.innerHTML = renderCommunityView();
      }
      lucide.createIcons();
    }

    // --------------------------------------------------------------------------
    // VIEW: LANDING PAGE
    // --------------------------------------------------------------------------
    function renderLandingPage() {
      return `
        <div class="space-y-20 pt-12 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Hero -->
          <div class="text-center max-w-3xl mx-auto space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="font-bold text-white">Verified Peer Learning</span>
              <span class="text-slate-600">•</span>
              <span>Escrow-Protected Progress</span>
            </div>

            <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Learn from people who've <br>
              <span class="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                already been there.
              </span>
            </h1>

            <p class="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Affordable, practical learning from experienced college students. Structured roadmaps, 1-on-1 guidance, and verified learning improvements.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button onclick="switchView('courses')" class="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                <i data-lucide="compass" class="w-4 h-4"></i>
                <span>Find a Mentor</span>
              </button>
              <button onclick="openMentorModal()" class="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
                <span>Become a Mentor</span>
              </button>
            </div>
          </div>

          <!-- How It Works Flow -->
          <div class="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8">
            <div class="text-center max-w-xl mx-auto">
              <h2 class="text-2xl font-bold text-white">How Skill Circle Works</h2>
              <p class="text-xs text-slate-400 mt-1">Measurable outcomes backed by platform escrow holding</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
              ${[
                {s:'01', t:'Discover', d:'Find verified seniors matching your goals & timetable.'},
                {s:'02', t:'Assess', d:'Take a quick AI pre-assessment baseline evaluation.'},
                {s:'03', t:'Learn', d:'Join live video sessions with interactive whiteboards.'},
                {s:'04', t:'Practice', d:'Review automated AI session recaps & homework.'},
                {s:'05', t:'Re-Assess', d:'Take comparable post-test measuring true gain.'},
                {s:'06', t:'Unlock', d:'Payment releases to mentor once 20% gain is confirmed.'}
              ].map(item => `
                <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span class="text-2xl font-black text-blue-500/40 font-mono block mb-2">${item.s}</span>
                    <h3 class="font-bold text-white text-sm mb-1">${item.t}</h3>
                    <p class="text-xs text-slate-400">${item.d}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Featured Mentors -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">Featured Verified Mentors</h2>
                <p class="text-xs text-slate-400">High-rated seniors ready for 1-on-1 & cohort coaching</p>
              </div>
              <button onclick="switchView('courses')" class="text-xs text-blue-400 hover:underline font-semibold">View all</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${appState.users.filter(u => u.role === 'mentor').map(m => `
                <div class="glass-card p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div class="space-y-3">
                    <div class="flex items-start gap-3.5">
                      <img src="${m.avatar}" class="w-12 h-12 rounded-xl object-cover border border-slate-700">
                      <div>
                        <div class="flex items-center gap-1.5">
                          <h4 class="font-bold text-white text-sm">${m.name}</h4>
                          <span class="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">Verified</span>
                        </div>
                        <p class="text-[11px] text-slate-400 truncate max-w-[180px]">${m.college}</p>
                        <span class="text-xs text-amber-400 font-bold">★ ${m.rating || 4.9}</span>
                      </div>
                    </div>
                    <p class="text-xs text-slate-300 line-clamp-2">${m.bio}</p>
                  </div>

                  <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span class="font-bold text-white font-mono text-sm">₹${m.hourlyRate}/hr</span>
                    <button onclick="openLiveClass('${m.skills ? m.skills[0].name : 'Coding Mentorship'}', '${m.name}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold">
                      Live Classroom
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      `;
    }

    // --------------------------------------------------------------------------
    // VIEW: LEARNER DASHBOARD
    // --------------------------------------------------------------------------
    function renderLearnerDashboard(user) {
      const myEnrollments = appState.enrollments.filter(e => e.learnerId === user.id);
      return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          <!-- Banner -->
          <div class="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-blue-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img src="${user.avatar}" class="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500">
              <div>
                <span class="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">🎓 College Learner</span>
                <h1 class="text-xl font-bold text-white mt-1">Welcome back, ${user.name}!</h1>
                <p class="text-xs text-slate-400">${user.college}</p>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center text-xs">
              <div>
                <span class="text-[10px] text-slate-400 block">Total XP</span>
                <span class="text-base font-bold text-blue-400 font-mono">${user.xp || 1420} XP</span>
              </div>
              <div class="w-px h-6 bg-slate-800"></div>
              <div>
                <span class="text-[10px] text-slate-400 block">Streak</span>
                <span class="text-base font-bold text-amber-400">🔥 ${user.streakDays || 7} Days</span>
              </div>
            </div>
          </div>

          <!-- Main Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left 2 Cols: Enrollments & Escrow -->
            <div class="lg:col-span-2 space-y-6">
              
              <!-- Next live session banner -->
              <div class="p-5 rounded-2xl bg-slate-900 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Mentorship Session Ready
                  </span>
                  <h3 class="font-bold text-white text-base mt-1">Data Structures: Linked Lists & Two Pointers</h3>
                  <p class="text-xs text-slate-400">With Senior Mentor Ananya Verma</p>
                </div>
                <button onclick="openLiveClass('Data Structures & Algorithms', 'Ananya Verma')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30">
                  Join Classroom
                </button>
              </div>

              <!-- Enrolled Courses & Escrow status -->
              <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 class="font-bold text-white text-base">My Courses & Escrow Benchmarks</h3>

                <div class="space-y-4">
                  ${myEnrollments.map(enr => {
                    const pre = enr.preAssessmentScore || 0;
                    const post = enr.postAssessmentScore || 0;
                    const delta = post - pre;
                    return `
                      <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div class="flex items-center justify-between">
                          <h4 class="font-bold text-white text-sm">${enr.courseTitle}</h4>
                          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded ${enr.paymentStatus === 'Eligible for Release' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
                            ${enr.paymentStatus}
                          </span>
                        </div>

                        <div class="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-900 text-center text-xs">
                          <div>
                            <span class="text-[10px] text-slate-400 block">Pre-Test</span>
                            <span class="font-bold font-mono text-white">${enr.preAssessmentScore !== undefined ? enr.preAssessmentScore + '%' : 'Pending'}</span>
                          </div>
                          <div>
                            <span class="text-[10px] text-slate-400 block">Post-Test</span>
                            <span class="font-bold font-mono text-emerald-400">${enr.postAssessmentScore !== undefined ? enr.postAssessmentScore + '%' : 'Pending'}</span>
                          </div>
                          <div>
                            <span class="text-[10px] text-slate-400 block">Improvement</span>
                            <span class="font-bold font-mono ${delta >= appState.adminConfig.minimumImprovementPercentage ? 'text-emerald-400' : 'text-amber-400'}">
                              +${delta}% (Req: ${appState.adminConfig.minimumImprovementPercentage}%)
                            </span>
                          </div>
                        </div>

                        <div class="flex items-center justify-between pt-1 text-xs">
                          <span class="text-slate-400 font-mono">Escrow: ₹${enr.amountPaid}</span>
                          <div class="flex gap-2">
                            ${enr.preAssessmentScore === undefined ? `
                              <button onclick="openAssessment('${enr.id}', true)" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">
                                Take Pre-Test
                              </button>
                            ` : ''}
                            ${enr.postAssessmentScore === undefined ? `
                              <button onclick="openAssessment('${enr.id}', false)" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold">
                                Take Final Evaluation
                              </button>
                            ` : ''}
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Interactive Visual Skill Tree -->
              <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-bold text-white text-base">Visual Skill Tree & Milestones</h3>
                    <p class="text-xs text-slate-400">Completed nodes visibly glow and award XP</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  ${appState.skillTreeNodes.map(node => `
                    <div class="p-3.5 rounded-xl border ${node.status === 'completed' ? 'bg-slate-950 border-emerald-500/50 shadow-md shadow-emerald-500/10' : node.status === 'in_progress' ? 'bg-slate-950 border-blue-500/50' : 'bg-slate-950/60 border-slate-800 opacity-60'}">
                      <div class="flex items-center justify-between text-xs mb-1">
                        <span class="font-bold text-white">${node.title}</span>
                        <span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${node.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-800'}">
                          ${node.status}
                        </span>
                      </div>
                      <p class="text-[11px] text-slate-400 line-clamp-2">${node.description}</p>
                      <div class="flex items-center justify-between pt-2 mt-2 border-t border-slate-800 text-[10px]">
                        <span class="text-amber-400 font-mono">+${node.xpReward} XP</span>
                        <button onclick="toggleNode('${node.id}')" class="text-blue-400 hover:underline">
                          ${node.status === 'completed' ? 'Reset' : 'Mark Completed'}
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

            </div>

            <!-- Right Sidebar: Micro Goals -->
            <div class="space-y-6">
              
              <!-- Weekly Goals Widget -->
              <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="font-bold text-white text-sm">Weekly Micro-Goals</h3>
                  <span class="text-xs font-mono text-blue-400 font-bold">
                    ${appState.weeklyGoals.filter(g => g.completed).length} / ${appState.weeklyGoals.length}
                  </span>
                </div>

                <div class="space-y-2">
                  ${appState.weeklyGoals.map(goal => `
                    <div onclick="toggleGoal('${goal.id}')" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-colors">
                      <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded border flex items-center justify-center text-[10px] ${goal.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600'}">
                          ${goal.completed ? '✓' : ''}
                        </span>
                        <span class="${goal.completed ? 'line-through text-slate-500' : 'text-slate-200'}">${goal.title}</span>
                      </div>
                      <span class="font-mono text-amber-400 text-[11px] shrink-0">+${goal.xpReward} XP</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Campus Bookmarks -->
              <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="font-bold text-white text-sm">Campus Vault Bookmarks</h3>
                  <button onclick="switchView('vault')" class="text-xs text-blue-400 hover:underline">Browse</button>
                </div>

                <div class="space-y-2">
                  ${appState.campusResources.filter(r => r.isSaved).map(r => `
                    <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span class="text-[10px] text-blue-400 font-mono uppercase">${r.subject}</span>
                      <h4 class="text-xs font-bold text-white line-clamp-1">${r.title}</h4>
                    </div>
                  `).join('')}
                </div>
              </div>

            </div>

          </div>

        </div>
      `;
    }

    // --------------------------------------------------------------------------
    // VIEW: MENTOR DASHBOARD
    // --------------------------------------------------------------------------
    function renderMentorDashboard(user) {
      const mentorEarnings = appState.enrollments.reduce((acc, e) => acc + (e.mentorEarnings || 0), 0);
      return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          <div class="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img src="${user.avatar}" class="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500">
              <div>
                <span class="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">⭐ Senior Mentor</span>
                <h1 class="text-xl font-bold text-white mt-1">${user.name} • Mentor Studio</h1>
                <p class="text-xs text-slate-400">${user.college}</p>
              </div>
            </div>

            <button onclick="openCreateCourseModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30">
              + Publish New Course
            </button>
          </div>

          <!-- Financial overview cards -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span class="text-xs text-slate-400 block">Total Earnings</span>
              <span class="text-xl font-bold text-white font-mono">₹${Math.round(mentorEarnings)}</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span class="text-xs text-slate-400 block">Released Payouts</span>
              <span class="text-xl font-bold text-emerald-400 font-mono">₹629</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span class="text-xs text-slate-400 block">Held in Escrow</span>
              <span class="text-xl font-bold text-amber-400 font-mono">₹539</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span class="text-xs text-slate-400 block">Disputed Cases</span>
              <span class="text-xl font-bold text-rose-400 font-mono">${appState.disputes.length}</span>
            </div>
          </div>

          <!-- Cohort Demand Analytics Table -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 class="font-bold text-white text-base">Cohort Demand Analytics (Junior Learning Requests)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              ${appState.cohortDemand.map(d => `
                <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="font-bold text-white">${d.skill}</span>
                    <span class="text-emerald-400 font-bold font-mono">${d.trend}</span>
                  </div>
                  <span class="text-[11px] text-slate-400">${d.requestsCount} student requests logged</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Automated Session Recap Hub -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 class="font-bold text-white text-base">Automated Session Recap Hub</h3>
            <div class="space-y-3">
              ${appState.sessionRecaps.map(r => `
                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-white">${r.courseTitle}</span>
                    <span class="text-slate-500">${r.date}</span>
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed">${r.sessionSummary}</p>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      `;
    }

    // --------------------------------------------------------------------------
    // VIEW: ADMIN DASHBOARD
    // --------------------------------------------------------------------------
    function renderAdminDashboard() {
      return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          <div class="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-purple-950/40 border border-purple-500/30 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-purple-400 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">🛡️ Platform Operations</span>
              <h1 class="text-xl font-bold text-white mt-1">Admin Control Center</h1>
              <p class="text-xs text-slate-400">Mentor verification, escrow management & AI arbitration</p>
            </div>
          </div>

          <!-- Verification Queue -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 class="font-bold text-white text-base">Senior Mentor Verification Queue</h3>
            <div class="space-y-3">
              ${appState.users.filter(u => u.role === 'mentor').map(m => `
                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 class="font-bold text-white text-sm">${m.name}</h4>
                    <p class="text-slate-400">${m.college} • ${m.email}</p>
                    <span class="text-[10px] text-blue-400 font-mono">Status: ${m.verification ? m.verification.status : 'Pending'}</span>
                  </div>

                  <div class="flex gap-2">
                    <button onclick="reviewMentor('${m.id}', 'approved')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold">
                      Approve & Badge
                    </button>
                    <button onclick="reviewMentor('${m.id}', 'rejected')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold">
                      Reject
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- AI Dispute Arbitration Center -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 class="font-bold text-white text-base">AI Dispute Resolution Center</h3>
            <div class="space-y-4">
              ${appState.disputes.map(d => `
                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-white">${d.courseTitle}</span>
                    <span class="text-rose-400 font-bold font-mono">+${d.improvement}% (Req: ${d.thresholdRequired}%)</span>
                  </div>
                  <p class="text-slate-300"><strong>Claim:</strong> ${d.supportingExplanation}</p>
                  
                  <div class="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-blue-300">
                    <strong>AI Recommendation (${Math.round(d.aiCaseAnalysis.confidenceScore * 100)}% Confidence):</strong> ${d.aiCaseAnalysis.summary}
                  </div>

                  ${d.status !== 'Resolved' ? `
                    <div class="flex gap-2 pt-1">
                      <button onclick="resolveDispute('${d.id}', 'Release payment to mentor')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold">
                        Release to Mentor
                      </button>
                      <button onclick="resolveDispute('${d.id}', 'Refund learner')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold">
                        Refund Learner
                      </button>
                    </div>
                  ` : `
                    <span class="text-emerald-400 font-bold">✓ Case Resolved: ${d.adminVerdict}</span>
                  `}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Platform Parameters Form -->
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl">
            <h3 class="font-bold text-white text-base">Platform Escrow Parameters</h3>
            
            <div class="space-y-3 text-xs">
              <div>
                <label class="text-slate-400 block mb-1">Minimum Improvement Threshold (%):</label>
                <input id="cfgThreshold" type="number" value="${appState.adminConfig.minimumImprovementPercentage}" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono">
              </div>
              <div>
                <label class="text-slate-400 block mb-1">Platform Commission Fee (%):</label>
                <input id="cfgCommission" type="number" value="${appState.adminConfig.platformCommissionPercentage}" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono">
              </div>
              <button onclick="saveAdminConfig()" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold">
                Save Parameters
              </button>
            </div>
          </div>

        </div>
      `;
    }

    // --------------------------------------------------------------------------
    // VIEW: COURSES CATALOG
    // --------------------------------------------------------------------------
    function renderCoursesView() {
      return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-white">Explore Skills & Mentorship Courses</h1>
            <p class="text-xs text-slate-400">All courses include simulated Razorpay escrow protection</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${appState.courses.map(c => `
              <div class="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div class="space-y-2.5">
                  <span class="text-[10px] text-blue-400 font-mono uppercase bg-slate-900 px-2 py-0.5 rounded">${c.category} • ${c.level}</span>
                  <h3 class="font-bold text-white text-base">${c.title}</h3>
                  <p class="text-xs text-slate-300 line-clamp-2">${c.description}</p>
                  <p class="text-[11px] text-slate-400">Mentor: ${c.mentorName} (${c.mentorCollege})</p>
                </div>

                <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span class="text-[10px] text-slate-500 block">Course Fee</span>
                    <span class="text-lg font-bold text-emerald-400 font-mono">₹${c.price}</span>
                  </div>
                  <button onclick="enrollCourse('${c.id}', ${c.price})" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30">
                    Enroll (Escrow)
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // --------------------------------------------------------------------------
    // VIEW: CAMPUS VAULT
    // --------------------------------------------------------------------------
    function renderVaultView() {
      return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-white">Campus Syllabus & Notes Vault</h1>
            <p class="text-xs text-slate-400">Peer verified lecture notes, lab guides, and exam formulas</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${appState.campusResources.map(r => `
              <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div class="space-y-1.5">
                  <span class="text-[10px] font-mono uppercase text-blue-400 bg-slate-950 px-2 py-0.5 rounded">${r.subject} • ${r.semester}</span>
                  <h3 class="font-bold text-white text-sm">${r.title}</h3>
                  <p class="text-xs text-slate-300">${r.description}</p>
                </div>

                <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span class="text-slate-400">Uploaded by ${r.uploaderName}</span>
                  <button onclick="alert('Downloading ${r.title} (${r.fileFormat})...')" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold">
                    Download ${r.fileFormat}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // --------------------------------------------------------------------------
    // VIEW: COMMUNITY
    // --------------------------------------------------------------------------
    function renderCommunityView() {
      return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-white">Campus Student Discussions</h1>
            <p class="text-xs text-slate-400">Doubts, cohort timing polls, and course requests</p>
          </div>

          <div class="space-y-4">
            ${appState.communityPosts.map(p => `
              <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-white">${p.authorName} (${p.authorCollege})</span>
                  <span class="text-[10px] text-blue-400 font-mono bg-slate-950 px-2 py-0.5 rounded">${p.categoryTag}</span>
                </div>
                <h3 class="font-bold text-white text-sm">${p.title}</h3>
                <p class="text-xs text-slate-300 leading-relaxed">${p.content}</p>

                ${p.aiSummary ? `
                  <div class="p-3 bg-blue-950/20 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                    <strong>AI Key Takeaway:</strong> ${p.aiSummary}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // --------------------------------------------------------------------------
    // MODALS & ACTIONS
    // --------------------------------------------------------------------------
    function openCopilot() {
      const modal = document.getElementById('modalContainer');
      modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <i data-lucide="sparkles" class="w-5 h-5 text-blue-400"></i>
                <h3 class="font-bold text-white text-sm">Skill Circle AI Academic Copilot</h3>
              </div>
              <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div id="copilotFeed" class="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2 h-64 overflow-y-auto">
              <p>Hello! I am your Skill Circle AI Academic & Escrow Copilot. Ask any coding doubt, question on escrow benchmarks (+20% threshold), or roadmap advice!</p>
            </div>

            <div class="flex gap-2">
              <input id="copilotInput" type="text" placeholder="Ask a doubt or escrow question..." class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
              <button onclick="sendCopilotMsg()" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Ask</button>
            </div>
          </div>
        </div>
      `;
      lucide.createIcons();
    }

    function sendCopilotMsg() {
      const input = document.getElementById('copilotInput');
      const feed = document.getElementById('copilotFeed');
      if (!input.value.trim()) return;

      const q = input.value;
      feed.innerHTML += `<p class="text-white font-semibold">You: ${q}</p>`;
      input.value = '';

      setTimeout(() => {
        let reply = "Skill Circle safeguards learners by holding course fees in escrow until post-course evaluations confirm at least a +20% skill improvement over baseline!";
        if (q.toLowerCase().includes("two-pointer")) {
          reply = "The Two-Pointer technique optimizes search spaces from O(N^2) to O(N) by leveraging monotonicity in sorted arrays!";
        }
        feed.innerHTML += `<p class="text-blue-300">AI: ${reply}</p>`;
        feed.scrollTop = feed.scrollHeight;
      }, 500);
    }

    function openLiveClass(title, partner) {
      const modal = document.getElementById('modalContainer');
      modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-3 modal-backdrop">
          <div class="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div class="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <span class="font-bold text-white">${title} • With ${partner}</span>
              <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
            </div>

            <div class="flex-1 grid grid-cols-2 gap-4 p-4">
              <div class="rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-center p-4">
                <div>
                  <div class="w-16 h-16 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white font-bold text-xl mb-2">P</div>
                  <span class="font-bold text-white text-xs block">${partner} (Mentor)</span>
                  <span class="text-[10px] text-emerald-400">Video Active</span>
                </div>
              </div>

              <div class="rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-center p-4">
                <div>
                  <div class="w-16 h-16 rounded-full bg-indigo-600 mx-auto flex items-center justify-center text-white font-bold text-xl mb-2">Y</div>
                  <span class="font-bold text-white text-xs block">You (Active)</span>
                  <span class="text-[10px] text-emerald-400">Microphone Active</span>
                </div>
              </div>
            </div>

            <div class="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <span class="text-xs text-slate-400">Session Recording Active (Consent Granted)</span>
              <button onclick="endSession()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold">
                End Session & Generate AI Recap
              </button>
            </div>
          </div>
        </div>
      `;
    }

    async function endSession() {
      await fetch('/api/recaps/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          courseTitle: "Data Structures & Algorithms",
          topics: ["Linked List Reversal", "Cycle Detection"]
        })
      });
      alert("Session completed! AI Session Recap generated and saved to dashboard.");
      closeModal();
      await loadState();
      switchView('learner-dashboard');
    }

    function openPriceModal() {
      const modal = document.getElementById('modalContainer');
      modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-xs">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-white text-sm">Dynamic Price Suggester</h3>
              <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
            </div>
            <p class="text-slate-400">Calculates affordable peer pricing based on live sessions and curriculum difficulty.</p>
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div class="flex justify-between text-slate-300"><span>5 Live Sessions (60 mins each):</span><span>₹450</span></div>
              <div class="flex justify-between text-slate-300"><span>Intermediate Difficulty Multiplier (1.15x):</span><span>+₹65</span></div>
              <div class="flex justify-between text-slate-300"><span>Capstone Project Addon:</span><span>+₹100</span></div>
              <div class="pt-2 border-t border-slate-800 flex justify-between font-bold text-emerald-400 text-sm">
                <span>Suggested Student Price:</span><span>₹599</span>
              </div>
            </div>
            <button onclick="closeModal()" class="w-full py-2 bg-blue-600 text-white rounded-xl font-bold">Close</button>
          </div>
        </div>
      `;
    }

    function openAssessment(enrId, isPre) {
      const questions = isPre ? appState.assessments.pre.questions : appState.assessments.post.questions;
      const modal = document.getElementById('modalContainer');
      modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-xs">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-white text-sm">${isPre ? 'Pre-Course Baseline Test' : 'Final Post-Course Evaluation'}</h3>
              <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
            </div>

            <div class="space-y-4">
              ${questions.map((q, idx) => `
                <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p class="font-semibold text-white">${idx + 1}. ${q.q}</p>
                  <div class="space-y-1">
                    ${q.options.map((opt, oIdx) => `
                      <label class="block text-slate-300 cursor-pointer">
                        <input type="radio" name="q_${idx}" value="${oIdx}" class="mr-2"> ${opt}
                      </label>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>

            <button onclick="submitExam('${enrId}', ${isPre})" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md">
              Submit Assessment & Calculate Delta
            </button>
          </div>
        </div>
      `;
    }

    async function submitExam(enrId, isPre) {
      const score = isPre ? 50 : 75; // sample evaluation score
      await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ enrollmentId: enrId, isPreTest: isPre, score })
      });
      alert(`Score submitted: ${score}%. System benchmark updated!`);
      closeModal();
      await loadState();
    }

    async function enrollCourse(courseId, price) {
      await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ courseId, amount: price })
      });
      alert(`Enrolled! ₹${price} deposited into platform escrow.`);
      await loadState();
      switchView('learner-dashboard');
    }

    async function reviewMentor(mentorId, status) {
      await fetch('/api/verification/review', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ mentorId, status })
      });
      alert(`Mentor status updated to: ${status}`);
      await loadState();
    }

    async function resolveDispute(disputeId, verdict) {
      await fetch('/api/disputes/resolve', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ disputeId, verdict })
      });
      alert(`Dispute resolved: ${verdict}`);
      await loadState();
    }

    async function saveAdminConfig() {
      const threshold = Number(document.getElementById('cfgThreshold').value);
      const commission = Number(document.getElementById('cfgCommission').value);
      await fetch('/api/config/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ minimumImprovementPercentage: threshold, platformCommissionPercentage: commission })
      });
      alert("Admin platform parameters saved!");
      await loadState();
    }

    function toggleNode(nodeId) {
      const node = appState.skillTreeNodes.find(n => n.id === nodeId);
      node.status = node.status === 'completed' ? 'available' : 'completed';
      renderCurrentView();
    }

    function toggleGoal(goalId) {
      const goal = appState.weeklyGoals.find(g => g.id === goalId);
      goal.completed = !goal.completed;
      renderCurrentView();
    }

    function openMentorModal() {
      alert("Mentor application form: Upload student ID scan and college credentials to receive Verified Student Mentor badge.");
    }

    function closeModal() {
      document.getElementById('modalContainer').innerHTML = '';
    }

    // Initialize application on page load
    loadState();
  </script>
</body>
</html>
"""


# ==============================================================================
# HTTP REQUEST HANDLER (REST API ROUTER & STATIC CLIENT)
# ==============================================================================

class SkillCircleHandler(http.server.BaseHTTPRequestHandler):

    def _set_json_headers(self, status=HTTPStatus.OK):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_json_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/state":
            self._set_json_headers()
            self.wfile.write(json.dumps(STATE).encode("utf-8"))
            return

        # Serve SPA HTML Page
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(HTML_PAGE.encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)
        payload = json.loads(post_data.decode("utf-8")) if post_data else {}

        if parsed.path == "/api/role/switch":
            user_id = payload.get("userId")
            if user_id:
                STATE["currentUserId"] = user_id
            self._set_json_headers()
            self.wfile.write(json.dumps({"success": True, "currentUserId": STATE["currentUserId"]}).encode("utf-8"))
            return

        elif parsed.path == "/api/courses/enroll":
            course_id = payload.get("courseId")
            amount = payload.get("amount", 599)
            course = next((c for c in STATE["courses"] if c["id"] == course_id), None)
            
            platform_fee = round((amount * STATE["adminConfig"]["platformCommissionPercentage"]) / 100)
            mentor_earnings = amount - platform_fee
            
            new_enrollment = {
                "id": f"enr-{len(STATE['enrollments']) + 1}",
                "courseId": course_id,
                "courseTitle": course["title"] if course else "Mentorship Course",
                "mentorId": course["mentorId"] if course else "user-mentor-1",
                "mentorName": course["mentorName"] if course else "Ananya Verma",
                "learnerId": STATE["currentUserId"],
                "learnerName": "Rohan Sharma",
                "learnerAvatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
                "enrolledAt": "2026-11-18",
                "progressPercent": 0,
                "paymentStatus": "Payment Held",
                "amountPaid": amount,
                "platformFee": platform_fee,
                "mentorEarnings": mentor_earnings,
                "sessionsCompleted": 0,
                "totalSessions": 5,
                "isEligibleForRelease": False
            }
            STATE["enrollments"].append(new_enrollment)
            self._set_json_headers()
            self.wfile.write(json.dumps({"success": True, "enrollment": new_enrollment}).encode("utf-8"))
            return

        elif parsed.path == "/api/assessments/submit":
            enr_id = payload.get("enrollmentId")
            is_pre = payload.get("isPreTest", False)
            score = payload.get("score", 70)

            for enr in STATE["enrollments"]:
                if enr["id"] == enr_id:
                    if is_pre:
                        enr["preAssessmentScore"] = score
                    else:
                        enr["postAssessmentScore"] = score
                        pre = enr.get("preAssessmentScore", 0)
                        delta = score - pre
                        enr["improvementPercentage"] = delta
                        if delta >= STATE["adminConfig"]["minimumImprovementPercentage"]:
                            enr["paymentStatus"] = "Eligible for Release"
                            enr["isEligibleForRelease"] = True
                        else:
                            enr["paymentStatus"] = "Payment Held"

            self._set_json_headers()
            self.wfile.write(json.dumps({"success": True}).encode("utf-8"))
            return

        elif parsed.path == "/api/verification/review":
            mentor_id = payload.get("mentorId")
            status = payload.get("status", "approved")
            for u in STATE["users"]:
                if u["id"] == mentor_id and "verification" in u:
                    u["verification"]["status"] = status
            self._set_json_headers()
            self.wfile.write(json.dumps({"success": True}).encode("utf-8"))
            return

        elif parsed.path == "/api/disputes/resolve":
            disp_id = payload.get("disputeId")
            verdict = payload.get("verdict", "Release payment to mentor")
            for d in STATE["disputes"]:
                if d["id"] == disp_id:
                    d["status"] = "Resolved"
                    d["adminVerdict"] = verdict
            self._set_json_headers()
            self.wfile.write(json.dumps({"success": True}).encode("utf-8"))
            return

        elif parsed.path == "/api/config/update":
            STATE["adminConfig"]["minimumImprovementPercentage"] = payload.get("minimumImprovementPercentage", 20)
            STATE["adminConfig"]["platformCommissionPercentage"] = payload.get("platformCommissionPercentage", 10)
            self._set_json_headers()
            self.wfile.write(json.dumps({"success": True, "adminConfig": STATE["adminConfig"]}).encode("utf-8"))
            return

        elif parsed.path == "/api/recaps/generate":
            new_recap = {
                "id": f"recap-{len(STATE['sessionRecaps']) + 1}",
                "courseTitle": payload.get("courseTitle", "Data Structures & Algorithms"),
                "mentorName": "Ananya Verma",
                "learnerName": "Rohan Sharma",
                "date": "2026-11-18",
                "sessionSummary": "Comprehensive breakdown of " + ", ".join(payload.get("topics", ["Key Concepts"])) + ". Code committed to student repo.",
                "topicsCovered": payload.get("topics", [])
            }
            STATE["sessionRecaps"].insert(0, new_recap)
            self._set_json_headers()
            self.wfile.write(json.dumps({"success": True, "recap": new_recap}).encode("utf-8"))
            return

        self._set_json_headers(HTTPStatus.NOT_FOUND)
        self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))


def run_server():
    server_address = ("0.0.0.0", PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, SkillCircleHandler)
    print(f"=================================================================")
    print(f" Skill Circle Python Web Application Running Live!")
    print(f" URL: http://localhost:{PORT}/")
    print(f" Network: http://0.0.0.0:{PORT}/")
    print(f" Zero external dependencies required.")
    print(f"=================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully.")
        httpd.server_close()


if __name__ == "__main__":
    run_server()
