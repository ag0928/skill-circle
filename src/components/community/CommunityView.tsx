import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  ThumbsUp, 
  Sparkles, 
  Send, 
  Plus, 
  HelpCircle, 
  PieChart, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  X,
  Share2
} from 'lucide-react';
import { CommunityPost } from '../../types';

export const CommunityView: React.FC = () => {
  const { posts, addPost, upvotePost, addComment, currentUser, addNotification } = useApp();

  const [activeChannel, setActiveChannel] = useState<CommunityPost['channel']>('global');
  const [selectedTag, setSelectedTag] = useState('All');
  
  // Create post modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Question');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const filteredPosts = posts.filter(p => {
    const matchesChannel = activeChannel === 'global' || p.channel === activeChannel;
    const matchesTag = selectedTag === 'All' || p.categoryTag === selectedTag;
    return matchesChannel && matchesTag;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addPost(
      newTitle,
      newContent,
      activeChannel,
      newTag,
      newTag === 'Poll' ? pollOptions : undefined
    );

    setIsCreateOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addComment(postId, text.trim());
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Community Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
              Student Collaboration Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Campus Community & Cohort Discussions
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Ask technical doubts, request custom courses from seniors, participate in cohort timing polls, and share project ideas.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-brand-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion / Poll</span>
        </button>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'global', label: '🌐 Global Campus Feed' },
          { id: 'college', label: `🏫 ${currentUser.college.split(' ')[0]} Hub` },
          { id: 'skill', label: '💻 #algorithms & coding' },
          { id: 'cohort', label: '👥 Live Cohort Discussions' },
          { id: 'mentor_lounge', label: '⭐ Mentor Lounge (Private)' }
        ].map(ch => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id as any)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeChannel === ch.id 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-400">
        <span className="font-semibold text-slate-500 mr-1 text-[11px] uppercase">Filter:</span>
        {['All', 'Question', 'Poll', 'Course Request', 'Learning Goal', 'Resource'].map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              selectedTag === tag ? 'bg-slate-800 text-white font-semibold' : 'hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div 
            key={post.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
          >
            {/* Author bar */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{post.authorName}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-brand-300">
                      {post.authorRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{post.authorCollege} • {post.createdAt}</p>
                </div>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
                {post.categoryTag}
              </span>
            </div>

            {/* Post Content */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-sm leading-snug">{post.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Poll options if any */}
            {post.pollOptions && (
              <div className="space-y-2 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Live Student Poll:</span>
                {post.pollOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => addNotification('Vote Recorded', `You voted for "${opt.text}".`, 'success')}
                    className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span>{opt.text}</span>
                    <span className="font-mono text-brand-400 font-semibold">{opt.votes} votes</span>
                  </button>
                ))}
              </div>
            )}

            {/* AI Discussion Summary Box */}
            {post.aiSummary && (
              <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block text-[11px] text-white">AI Key Takeaway:</span>
                  <p className="text-[11px] leading-relaxed">{post.aiSummary}</p>
                </div>
              </div>
            )}

            {/* Actions: Upvote & Comments toggle */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => upvotePost(post.id)}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    post.hasUpvoted 
                      ? 'bg-brand-500/20 border-brand-500 text-brand-300 font-semibold' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes}</span>
                </button>

                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} replies</span>
                </span>
              </div>
            </div>

            {/* Existing Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {post.comments.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-white">{c.authorName} ({c.authorRole})</span>
                      <span className="text-slate-500">{c.createdAt}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment input */}
            <div className="flex gap-2 pt-1">
              <input 
                type="text" 
                value={commentInputs[post.id] || ''}
                onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                placeholder="Write a constructive student reply or advice..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => handleAddComment(post.id)}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
              >
                Reply
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Post to Skill Circle Community</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Post Category Tag</label>
                <select
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Question">Question</option>
                  <option value="Poll">Interactive Poll</option>
                  <option value="Course Request">Course Request to Seniors</option>
                  <option value="Learning Goal">Learning Goal / Accountability</option>
                  <option value="Resource">Resource Share</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Best way to prep for 3rd year coding test?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Discussion Content</label>
                <textarea 
                  rows={4}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Share details, problem links, or curriculum requests..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
