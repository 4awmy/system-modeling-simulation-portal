import React, { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageSquare, Send, Sparkles, Trash2, User, X } from 'lucide-react';

interface Message {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
}

const ts = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const WELCOME =
  "Hello! I'm your AI System Modeling & Simulation Tutor for Dr. Farouk Shaaban's course. Ask me to explain a topic, solve a curriculum problem step-by-step, or build a trace table.";

export const AITutorSim: React.FC = () => {
  const idRef = useRef(1);
  const nextId = (prefix: string) => {
    idRef.current += 1;
    return `${prefix}-${idRef.current}`;
  };
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('aast_sim_chat_messages');
    if (!saved) return [{ id: 'welcome', sender: 'ai', text: WELCOME, timestamp: ts() }];
    try {
      return JSON.parse(saved) as Message[];
    } catch {
      return [{ id: 'welcome', sender: 'ai', text: WELCOME, timestamp: ts() }];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('aast_sim_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [open, messages]);

  const clearChat = () => {
    setMessages([{ id: nextId('welcome'), sender: 'ai', text: WELCOME, timestamp: ts() }]);
    setError(null);
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: Message = { id: nextId('u'), sender: 'student', text: trimmed, timestamp: ts() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    setError(null);

    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || "AIzaSyCNcm6lijTv44uiIqDZ-jYXgyhSmBsJKog";
    if (!apiKey) {
      setLoading(false);
      setError('AI API key is missing. Set VITE_GEMINI_API_KEY in your environment to enable live tutoring.');
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: updated.map((m) => ({
              role: m.sender === 'student' ? 'user' : 'model',
              parts: [{ text: m.text }],
            })),
            systemInstruction: {
              parts: [
                {
                  text:
                    "You are Dr. Farouk Shaaban's AI assistant for System Modeling and Simulation at AAST. Focus on chronological curriculum teaching, random number methods, Monte Carlo, time-driven/event-driven simulation, queueing, inventory lead time, repairman models, assembly lines, and Chi-square/KS validation. Solve problems step-by-step with clean trace-table style explanations.",
                },
              ],
            },
            generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `Tutor API failed (${response.status})`);
      }

      const data = await response.json();
      const textOut = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOut) throw new Error('Tutor returned empty response.');

      setMessages((prev) => [...prev, { id: nextId('a'), sender: 'ai', text: textOut, timestamp: ts() }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-aast-navy text-aast-gold border-2 border-aast-gold shadow-xl flex items-center justify-center"
        title="AI Simulation Tutor"
      >
        {open ? <X className="h-6 w-6" /> : <div className="relative"><MessageSquare className="h-6 w-6" /><Sparkles className="h-4 w-4 absolute -top-2 -right-2" /></div>}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[560px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-aast-navy px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-aast-gold" />
              <div>
                <p className="text-xs font-black uppercase text-aast-gold">AI Simulation Tutor</p>
                <p className="text-[10px] text-slate-300">Assistant to Dr. Farouk Shaaban</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={clearChat} className="p-1.5 rounded hover:bg-slate-800"><Trash2 className="h-4 w-4" /></button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded hover:bg-slate-800"><X className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m) => {
              const ai = m.sender === 'ai';
              return (
                <div key={m.id} className={`flex gap-2 max-w-[90%] ${ai ? '' : 'ml-auto flex-row-reverse'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${ai ? 'bg-aast-navy text-aast-gold' : 'bg-slate-200 text-slate-700'}`}>
                    {ai ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`p-3 rounded-xl border text-xs whitespace-pre-line ${ai ? 'bg-white border-slate-200 rounded-tl-none' : 'bg-aast-navy text-white border-aast-navy rounded-tr-none'}`}>
                    {m.text}
                    <div className={`text-[8px] mt-1 text-right ${ai ? 'text-slate-400' : 'text-slate-300'}`}>{m.timestamp}</div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Tutor is generating response...
              </div>
            )}

            {error && <div className="text-xs p-2 rounded border border-red-200 bg-red-50 text-red-700">{error}</div>}
            <div ref={endRef} />
          </div>

          <div className="px-3 py-2 border-t border-slate-200 bg-slate-100 flex gap-1 overflow-x-auto">
            {[
              'Solve this queue problem step-by-step with a trace table.',
              'Explain Event Scan vs Time-Driven with an example.',
              'How do I map random numbers using cumulative probability?',
              'Show Chi-square validation for simulation outcomes.',
            ].map((q) => (
              <button key={q} onClick={() => send(q)} className="shrink-0 px-2 py-1 text-[10px] font-bold rounded border border-slate-200 bg-white">
                {q.length > 32 ? `${q.slice(0, 32)}...` : q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-slate-200 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about curriculum problems, methods, or trace tables..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded text-xs"
              disabled={loading}
            />
            <button className="px-3 rounded bg-aast-navy text-aast-gold disabled:bg-slate-200" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
