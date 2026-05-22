import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, MessageSquare, X, Trash2, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
}

const getCurrentTimestamp = (): string => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const AITutorSim: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('aast_cg_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved) as Message[];
      } catch (e) {
        console.error("Failed to parse chat messages", e);
      }
    }
    return [
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: "Hello! I am your AI Computer Graphics Tutor. I'm trained on Dr. Gouda Ismail's lecture slides. Ask me anything about DDA, Bresenham's algorithm, midpoint circle/ellipse drawing, region filling, Bézier curves, or transformations!",
        timestamp: getCurrentTimestamp()
      }
    ];
  });
  
  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Sync messages to local storage
  useEffect(() => {
    localStorage.setItem('aast_cg_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when new messages arrive or drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [messages, isOpen]);

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your study chat history?")) {
      const defaultWelcome: Message[] = [
        {
          id: 'msg_welcome_' + Date.now(),
          sender: 'ai',
          text: "Hello! I am your AI Computer Graphics Tutor. I'm trained on Dr. Gouda Ismail's lecture slides. Ask me anything about DDA, Bresenham's algorithm, midpoint circle/ellipse drawing, region filling, Bézier curves, or transformations!",
          timestamp: getCurrentTimestamp()
        }
      ];
      setMessages(defaultWelcome);
      setErrorMsg(null);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const studentMsg: Message = {
      id: `msg_stud_${Date.now()}`,
      sender: 'student',
      text,
      timestamp: getCurrentTimestamp()
    };

    const updatedMessages = [...messages, studentMsg];
    setMessages(updatedMessages);
    setInputVal('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const API_KEY = 'AIzaSyAWwURCLh4Zt-JKiZoEK1vp-vnyZNikMmA';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

      // Convert messages to Gemini format (roles must be user or model)
      const contents = updatedMessages.map(msg => ({
        role: msg.sender === 'student' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const payload = {
        contents,
        systemInstruction: {
          parts: [
            {
              text: `You are Dr. Gouda Ismail's AI Teaching Assistant for the Computer Graphics course at the Arab Academy for Science, Technology and Maritime Transport (AAST).
You are a friendly, highly skilled computer graphics tutor.
Help the student understand graphics theory, formulas, and derivations.
Focus specifically on topics covered in lectures:
1. Raster displays, Cathode Ray Tubes (CRT), frame buffers, resolution, refresh rates.
2. Output primitives, lines (Direct Scan, DDA, Bresenham's integer-based derivation including decision parameters like P_k), circles (midpoint circle algorithm, 8-way symmetry), ellipses (midpoint ellipse, Region 1/2 transition, 4-way symmetry).
3. Area filling (Scan-Line fill, Boundary-Fill, Flood-Fill, 4-connected vs 8-connected recursion and leak vulnerabilities).
4. Spline curves (Interpolation vs Approximation, continuity types C0, C1, C2, geometric G0, G1, G2, Bézier curves properties, Bernstein polynomials, B-Splines local control).
5. 2D transformations (translation, scaling, rotation, homogeneous coordinates, composite matrices, arbitrary pivot rotation/scaling).
6. 3D transformations (3D rotation around coordinate and arbitrary axes, Euler angles).

Explain mathematically when useful. Use neat Markdown and formulas. Keep responses concise but academically rigorous. Maintain the context of AAST and Dr. Gouda's slides.`
            }
          ]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      const aiText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        throw new Error("No response text returned from the model.");
      }

      const aiMsg: Message = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: getCurrentTimestamp()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      console.error("Gemini API Error:", err);
      const errMsg = err instanceof Error ? err.message : "An unexpected connection error occurred.";
      setErrorMsg(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-aast-navy text-aast-gold shadow-2xl hover:bg-slate-900 border-2 border-aast-gold focus:outline-none transition-all duration-300 transform hover:scale-105"
        title="Ask AAST Graphics AI Tutor"
        id="ai-tutor-fab"
      >
        {isOpen ? <X className="h-6 w-6" /> : (
          <div className="relative">
            <MessageSquare className="h-6 w-6 stroke-[2]" />
            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-aast-gold animate-pulse fill-aast-gold" />
          </div>
        )}
      </button>

      {/* Floating Chat Drawer Container */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-fade"
          id="ai-tutor-drawer"
        >
          {/* Header */}
          <div className="bg-aast-navy px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="relative h-8 w-8 rounded-lg bg-slate-900 text-aast-gold flex items-center justify-center">
                <Bot className="h-5 w-5" />
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-aast-navy animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight text-aast-gold uppercase">AAST Graphics AI Tutor</h3>
                <p className="text-[9px] text-slate-300 font-medium">Assistant to Dr. Gouda Ismail</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                title="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 max-w-[90%] ${
                    isAi ? '' : 'ml-auto flex-row-reverse space-x-reverse'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm shrink-0 ${
                      isAi ? 'bg-aast-navy text-aast-gold border border-aast-gold/20' : 'bg-slate-200 text-slate-650'
                    }`}
                  >
                    {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                      isAi
                        ? 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
                        : 'bg-aast-navy border-aast-navy text-white rounded-tr-none'
                    }`}
                  >
                    <p className="prose max-w-none">{msg.text}</p>
                    <span className={`text-[8px] block text-right mt-1.5 ${isAi ? 'text-slate-400' : 'text-slate-300'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loading / Typing State */}
            {isLoading && (
              <div className="flex items-start space-x-2.5 max-w-[90%]">
                <div className="h-8 w-8 rounded-full bg-aast-navy text-aast-gold border border-aast-gold/20 flex items-center justify-center shadow-sm shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white text-slate-500 rounded-tl-none shadow-sm flex items-center space-x-2">
                  <Loader2 className="h-3 w-3 animate-spin text-aast-navy" />
                  <span className="text-[10px] font-semibold italic">Tutor is compiling response...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex flex-col gap-1.5 shadow-sm">
                <p className="font-bold">Connection Error</p>
                <p className="opacity-90">{errorMsg}</p>
                <button
                  onClick={() => {
                    const lastStudentMsg = [...messages].reverse().find(m => m.sender === 'student');
                    if (lastStudentMsg) {
                      handleSendMessage(lastStudentMsg.text);
                    } else {
                      setErrorMsg(null);
                    }
                  }}
                  className="w-fit px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold self-end transition-colors"
                >
                  Retry Last Message
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Study Prompts (visible when chat is clean or space permits) */}
          <div className="bg-slate-100 border-t border-slate-200 px-3 py-2 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {[
              { label: "Bresenham vs DDA", query: "Explain the key differences between DDA and Bresenham's line drawing algorithms." },
              { label: "8-Way Symmetry", query: "Show how 8-way symmetry works and list its coordinate mapping." },
              { label: "C1 vs G1 Continuity", query: "Contrast C1 and G1 continuity in parametric curves." },
              { label: "Boundary-Fill vs Flood-Fill", query: "What is the recursion difference between boundary-fill and flood-fill?" }
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="text-[10px] bg-white border border-slate-200 hover:border-aast-navy hover:text-aast-navy px-2 py-1 rounded-md text-slate-650 font-bold transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="p-3 border-t border-slate-200 bg-white flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about formulas, derivations, or graphics slides..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="p-2 bg-aast-navy hover:bg-slate-900 text-aast-gold disabled:bg-slate-200 disabled:text-slate-400 rounded-lg shadow-md transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
