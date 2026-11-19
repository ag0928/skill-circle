import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MessageSquare, 
  CircleDot, 
  Palette, 
  Sparkles, 
  Send, 
  Paperclip, 
  CheckCircle2, 
  AlertCircle,
  PhoneOff,
  Eraser,
  PenTool,
  RotateCcw
} from 'lucide-react';

export const LiveClassroomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  partnerName: string;
  onSessionEnded?: (recapId: string) => void;
}> = ({ isOpen, onClose, courseTitle, partnerName, onSessionEnded }) => {
  const { currentUser, generateSessionRecap, addNotification } = useApp();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'whiteboard' | 'notes'>('chat');

  // Chat in session
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: partnerName, text: 'Hey! Ready to dive into the two-pointer and linked list concepts?', time: '6:02 PM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Interactive Whiteboard Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#436df7');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (activeSidePanel === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [activeSidePanel]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = isEraser ? '#0f172a' : brushColor;
    ctx.lineWidth = isEraser ? 16 : brushSize;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        sender: currentUser.name,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  const handleEndSession = () => {
    const recap = generateSessionRecap(
      `ses-${Date.now()}`,
      'course-1',
      ['Linked List Reversal', 'Two-Pointer Monotonic Invariant', 'Floyd Cycle Detection'],
      'Session completed with high engagement. Whiteboard diagrams and code branches recorded.'
    );

    addNotification(
      'Session Ended & AI Recap Created', 
      'Automated session recap with topics, assignments, and code links saved to your dashboard.', 
      'success'
    );

    if (onSessionEnded) onSessionEnded(recap.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-6xl bg-slate-950 border border-slate-800 rounded-3xl h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white text-sm truncate max-w-xs">{courseTitle}</span>
            </div>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">With {partnerName}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Recording consent toggle */}
            <button
              onClick={() => {
                const nextRec = !isRecording;
                setIsRecording(nextRec);
                addNotification(
                  nextRec ? 'Session Recording Started' : 'Recording Paused',
                  nextRec ? 'Both participants consented to cloud backup recording.' : 'Recording halted.',
                  'info'
                );
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                isRecording 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>{isRecording ? 'Recording (Consent Active)' : 'Record Session'}</span>
            </button>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Video & Interactive Workspace Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Video Streams */}
          <div className="flex-1 p-4 flex flex-col gap-4 relative bg-slate-950 overflow-hidden">
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Partner Feed */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
                {isScreenSharing ? (
                  <div className="w-full h-full bg-slate-900 p-4 font-mono text-xs text-brand-300 overflow-auto">
                    <div className="text-slate-500 mb-2">// Screen Share: leetcode_solution.cpp</div>
                    <pre className="text-slate-200">
{`ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
                      alt={partnerName} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-brand-500 mx-auto shadow-xl"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{partnerName}</h4>
                      <span className="text-[11px] text-emerald-400 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active Video Stream
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-white font-medium flex items-center gap-1.5">
                  <span>{partnerName} (Senior Mentor)</span>
                </div>
              </div>

              {/* My Feed */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                {isCamOn ? (
                  <div className="text-center space-y-2">
                    <img 
                      src={currentUser.avatar}
                      alt={currentUser.name} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-brand-500 mx-auto shadow-xl"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{currentUser.name} (You)</h4>
                      <span className="text-[11px] text-emerald-400 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Local Camera Stream
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 text-xs">
                    <VideoOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>Camera is turned off</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-white font-medium flex items-center gap-1.5">
                  <span>You ({currentUser.name})</span>
                  {!isMicOn && <MicOff className="w-3 h-3 text-rose-400 ml-1" />}
                </div>
              </div>

            </div>

            {/* Bottom In-Call Control Strip */}
            <div className="h-16 bg-slate-900/90 border border-slate-800 rounded-2xl px-6 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-xl transition-all ${
                    isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                  title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsCamOn(!isCamOn)}
                  className={`p-3 rounded-xl transition-all ${
                    isCamOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                  title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-xl transition-all ${
                    isScreenSharing ? 'bg-brand-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                  title="Toggle Screen Share"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>

              {/* Side panel toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSidePanel('chat')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSidePanel === 'chat' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </button>

                <button
                  onClick={() => setActiveSidePanel('whiteboard')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSidePanel === 'whiteboard' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Whiteboard</span>
                </button>
              </div>

              {/* End Call Button -> Triggers AI Recap */}
              <button
                onClick={handleEndSession}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-transform hover:scale-105"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End & Generate AI Recap</span>
              </button>
            </div>

          </div>

          {/* Right Side Panel: Chat or Interactive Whiteboard */}
          <div className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
            
            {activeSidePanel === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-800 font-semibold text-white text-xs flex items-center justify-between">
                  <span>In-Call Classroom Chat</span>
                  <span className="text-[10px] text-slate-500 font-mono">End-to-End Encrypted</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`text-xs space-y-1 ${msg.sender === currentUser.name ? 'text-right' : 'text-left'}`}
                    >
                      <div className="text-[10px] text-slate-500">
                        {msg.sender} • {msg.time}
                      </div>
                      <div className={`p-2.5 rounded-xl inline-block max-w-[85%] text-left leading-relaxed ${
                        msg.sender === currentUser.name 
                          ? 'bg-brand-600 text-white rounded-tr-none' 
                          : 'bg-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Send a question or link..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <button type="submit" className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-500">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {activeSidePanel === 'whiteboard' && (
              <div className="flex flex-col h-full">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">Collaborative Canvas</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsEraser(false)}
                      className={`p-1.5 rounded-lg ${!isEraser ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                      title="Pen Tool"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsEraser(true)}
                      className={`p-1.5 rounded-lg ${isEraser ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                      title="Eraser"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={clearCanvas}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                      title="Clear Board"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Color swatches */}
                <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
                  {['#436df7', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map(color => (
                    <button
                      key={color}
                      onClick={() => { setBrushColor(color); setIsEraser(false); }}
                      className={`w-5 h-5 rounded-full border border-white/20 ${brushColor === color && !isEraser ? 'ring-2 ring-white' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-slate-950 p-2 flex items-center justify-center overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={380}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="border border-slate-800 rounded-xl cursor-crosshair bg-slate-900 shadow-inner"
                  />
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
