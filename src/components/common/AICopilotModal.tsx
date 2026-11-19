import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Send, Bot, User, CheckCircle2, HelpCircle, Compass, Shield } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedPrompts?: string[];
}

export const AICopilotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, adminConfig } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am your Skill Circle AI Academic & Mentorship Copilot. I can help solve coding doubts, plan your custom skill roadmap, explain our Escrow payment protection, or prepare you for peer sessions. How can I assist you today?`,
      suggestedPrompts: [
        'How does the Escrow release & 20% improvement work?',
        'Suggest a 4-week roadmap to crack internship DSA',
        'Help me solve a doubt in Two-Pointer technique',
        'How can college seniors become verified mentors?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let suggestions: string[] = [];

      const lower = query.toLowerCase();
      if (lower.includes('escrow') || lower.includes('payment') || lower.includes('improvement') || lower.includes('release')) {
        reply = `Skill Circle uses an escrow model tailored for academic integrity:
1. When you enroll, your course fee (e.g. ₹699) is securely held in escrow via Razorpay architecture.
2. Before the first session, you take a quick Pre-Course Assessment to benchmark baseline skills.
3. After completing the modules with your mentor, you take a comparable Post-Course Assessment.
4. If your score shows an improvement of at least ${adminConfig.minimumImprovementPercentage} percentage points (configured by Admin), mentor funds are automatically unlocked for release!
5. If improvement is below the threshold, funds stay protected. Mentors can submit dispute notes with attendance evidence for manual Admin + AI arbitration.`;
        suggestions = ['What if I fail the post-assessment?', 'How do mentors dispute?'];
      } else if (lower.includes('two-pointer') || lower.includes('dsa') || lower.includes('doubt')) {
        reply = `Here is a breakdown of the Two-Pointer technique:
- Monotonic Condition: The two-pointer pattern works best on sorted sequences or monotonic intervals.
- Opposite Ends vs Fast & Slow:
  • Opposite ends (Left = 0, Right = N-1): Ideal for Target Sum, Palindrome checking, Container With Most Water.
  • Fast & Slow: Ideal for detecting cycles in linked lists (Floyd's algorithm) or removing duplicates in-place.
- Key Invariant: In every loop iteration, at least one pointer must move closer to terminating the window in O(N) total time.`;
        suggestions = ['Show me sliding window template', 'Recommend a mentor for DSA'];
      } else if (lower.includes('roadmap') || lower.includes('internship') || lower.includes('plan')) {
        reply = `Here is a high-yield 4-Week Internship Sprint based on your college profile:
• Week 1: Arrays, Strings, Hash Maps, Frequency Counting & Two-Pointers (Focus: LeetCode #1, #15, #167).
• Week 2: Sliding Window & Linked List Reversal/Cycle Detection.
• Week 3: Binary Trees (Traversals, Max Depth, Invert Tree) & BFS/DFS queue patterns.
• Week 4: 1-on-1 Mock Interview with a verified senior mentor on Skill Circle for live whiteboard practice and resume tailoring!`;
        suggestions = ['Check upcoming live sessions', 'Open Visual Skill Tree'];
      } else if (lower.includes('mentor') || lower.includes('verify')) {
        reply = `Becoming a mentor on Skill Circle is student-driven:
1. You submit your college email (.edu / college domain), College Student ID card, and GitHub / LinkedIn links.
2. Admin config determines mandatory verification requirements.
3. Once approved by Admin, you receive a Verified Student Mentor badge!
4. You can create structured courses, set your own fair prices within the platform range (₹${adminConfig.minimumCoursePrice} - ₹${adminConfig.maximumCoursePrice}), and earn while building real teaching credentials.`;
        suggestions = ['Start Mentor Onboarding', 'View Cohort Demand Trends'];
      } else {
        reply = `I have logged your request: "${query}". Based on your learning goals in ${currentUser.college}, I recommend reviewing your active courses, checking out peer lecture notes in the Campus Vault, or scheduling an interactive session with an approved senior mentor!`;
        suggestions = ['Browse courses', 'Check campus notes vault'];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        suggestedPrompts: suggestions
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">Skill Circle AI Copilot</h3>
                <span className="text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-medium">
                  Academic & Escrow AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Context aware • Doubt solver • Escrow analysis</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-brand-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/60 shadow-inner'
              }`}>
                <div className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</div>

                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="text-[11px] bg-slate-900/80 hover:bg-brand-900/40 text-slate-300 hover:text-brand-300 border border-slate-700/80 hover:border-brand-500/40 px-2.5 py-1 rounded-full transition-all text-left"
                      >
                        ⚡ {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-slate-400 text-xs py-2">
              <Bot className="w-4 h-4 text-brand-400 animate-spin" />
              <span>Analyzing curriculum & synthesizing peer guidance...</span>
            </div>
          )}
        </div>

        {/* Quick action bar */}
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-brand-400 shrink-0 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Quick Topics:
          </span>
          <button 
            onClick={() => handleSend('Explain the 20% improvement calculation')} 
            className="hover:text-white px-2 py-0.5 rounded bg-slate-800 shrink-0"
          >
            Escrow Threshold
          </button>
          <button 
            onClick={() => handleSend('How to generate an automated session recap?')} 
            className="hover:text-white px-2 py-0.5 rounded bg-slate-800 shrink-0"
          >
            Session Recaps
          </button>
          <button 
            onClick={() => handleSend('What are the visual skill tree tiers?')} 
            className="hover:text-white px-2 py-0.5 rounded bg-slate-800 shrink-0"
          >
            Skill Tree
          </button>
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a technical doubt, roadmap question, or escrow inquiry..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-brand-600/30"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
