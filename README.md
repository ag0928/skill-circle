# Skill Circle (Peer-to-Peer Learning Marketplace)

> **"Learn from people who've already been there."**  
> Affordable, practical learning from experienced college students, backed by escrow-protected measurable improvements.

---

## 🎯 Core Value Proposition

Skill Circle is a modern peer-to-peer learning marketplace designed specifically for college students. Instead of spending high sums on commercial bootcamps or generic pre-recorded course platforms, juniors connect with verified college seniors or skilled students who teach them at accessible peer prices.

### Key Differentiators:
- **Affordable Peer Learning**: Pricing designed for student allowances, not corporate budgets.
- **Verified Student Mentors**: Every mentor undergoes verification using College ID, College Email (.edu), and GitHub/LinkedIn code reviews.
- **Assessment & Escrow Protection**: Course fees are securely held in platform escrow via Razorpay architecture. Funds are released only after the learner takes an AI-generated Post-Course Assessment confirming measurable improvement (e.g. `+20 percentage points` over baseline).
- **Interactive Visual Skill Tree**: Tech-tree inspired progression (`Foundation → Beginner → Intermediate → Advanced → Projects → Placement Ready`) where completed nodes visibly glow.
- **Campus Syllabus & Notes Vault**: Peer-uploaded handwritten lecture notes, lab manuals, and exam formulas organized by Campus, Branch, and Semester.
- **Automated AI Session Recaps**: Live classroom recaps summarizing topics, code links, homework, and next steps immediately upon session termination.
- **Peer Co-Mentor Network**: Private senior network for sharing curriculum materials and referring learners when they outgrow a specific topic.

---

## 👥 User Roles & 1-Click Fast Pass (Prototype Mode)

The application supports three major roles, switchable at any time from the top navigation bar:

1. **Learner (`Rohan Sharma`)**:
   - 2nd Year Computer Science Sophomore.
   - Enrolled in DSA and Full-Stack courses.
   - Tracks weekly micro-goals (`4/5 completed`), XP points (`1,420 XP`), and 7-day streak.
   - Takes Pre-Course Baseline and Post-Course Mastery evaluations.

2. **Mentor (`Ananya Verma`)**:
   - 4th Year Senior with Verified Student Mentor badge.
   - Manages courses, views active students, and tracks lifetime, escrow-held, and released earnings.
   - Explores Cohort Demand Analytics (real-time trending skills requested by juniors).
   - Generates AI Session Recaps and refers students through the Peer Co-Mentor Network.
   - Submits dispute cases if student post-test scores fall below threshold due to insufficient effort.

3. **Admin (`Priya Patel`)**:
   - Platform Operations & Escrow Authority.
   - **Mentor Verification Queue**: Reviews student ID scans, GitHub profiles, and campus emails; approves or rejects applications.
   - **Escrow Ledger**: Reviews pre- and post-test scores, verifies threshold achievement, and executes releases or refunds.
   - **AI Dispute Resolution Center**: Evaluates AI case analysis recommendations and issues binding decisions.
   - **Platform Parameter Control**: Configures `minimumImprovementPercentage`, `platformCommissionPercentage`, and minimum/maximum course price limits.

---

## 🚀 Key Modules & Architecture

### 1. Landing Page
- Modern startup visual identity: subtle gradients, glassmorphism cards, and typography.
- Interactive **"How Skill Circle Works"** switcher comparing Learner (6 steps) vs. Mentor (6 steps) workflows.
- Popular skill categories, featured verified mentors, differentiators, prototype testimonials, and FAQ.

### 2. Course Creation & Dynamic Pricing Suggester
- Multi-step builder: Title, Description, Category, Level, Objectives, Syllabus Modules, Lessons, and Sessions.
- **Dynamic Pricing Recommendation Engine**: Computes fair pricing based on:
  $$\text{Price} = f(\text{Live Hours}, \text{Difficulty Multiplier}, \text{Capstone Addon}, \text{Mock Interview Addon})$$
  bounded between admin-configured minimum (`₹299`) and maximum (`₹3,999`) limits.

### 3. Payment & Escrow Workflow (Razorpay Architecture)
1. Learner selects a course and agrees to baseline pre-testing.
2. Learner checks out through simulated Razorpay gateway (`VITE_RAZORPAY_KEY_ID = 'rzp_test_placeholder_key'`).
3. Payment state enters **`Payment Held`** in escrow.
4. Learner completes live lessons in the built-in classroom.
5. Learner takes an AI-generated Post-Course Assessment with comparable questions.
6. The system calculates:
   $$\Delta_{\text{improvement}} = \text{Score}_{\text{post}} - \text{Score}_{\text{pre}}$$
7. If $\Delta_{\text{improvement}} \ge \text{minimumImprovementPercentage}$ (default 20%):
   - Status updates to **`Eligible for Release`**. Mentor or Admin triggers payout release.
8. If $\Delta_{\text{improvement}} < \text{minimumImprovementPercentage}$:
   - Funds remain held in escrow.
   - Mentor can submit an **Escrow Dispute** with session attendance evidence.
   - AI runs automated Case Analysis; Platform Admin delivers final resolution.

### 4. Built-in WebRTC Live Classroom
- Dual video stream layout for learner and mentor with camera/microphone controls.
- Screen sharing simulation with syntax-highlighted code.
- Interactive HTML5 Whiteboard with freehand pen, custom color swatches, eraser, and clear board.
- In-call chat with real-time student-mentor messaging.
- Mandatory recording consent banner.
- **"End Session & Generate AI Recap"** button automatically triggers recap synthesis.

### 5. Campus Syllabus & Notes Vault
- Hierarchical filtering: `College → Branch → Year → Semester → Subject → Resource Type`.
- Supports Handwritten Notes, Study Guides, Lab Resources, and Placement Interview questions.
- Peer upvoting, bookmarking, and simulated file download.
- "Contribute Notes" upload modal.

### 6. Student Community & Discussion Forums
- Channel feeds: Global, College-specific, Skill-specific (`#algorithms`), Cohorts, and Mentor Lounge.
- Post types: Questions, Polls, Course Requests to Seniors, Learning Goals.
- One-click **AI Discussion Summarizer** extracting actionable advice.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom brand palette and glassmorphism utilities
- **Icons**: Lucide React
- **Build Tool**: Vite 6
- **Architecture**: Context API state manager with simulated local persistence

---

## 💻 Local Development Setup

```bash
# 1. Navigate to the project directory
cd skill-circle

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Build production bundle
npm run build
```

The development server runs by default on `http://localhost:5173/`.
