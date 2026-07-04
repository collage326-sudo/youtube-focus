import React, { useState, useRef, useEffect } from "react";
import { Video } from "../types";
import { Send, GraduationCap, Loader2, RefreshCw, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

interface ChatMessage {
  role: "user" | "spark";
  text: string;
}

interface StudyBuddyTabProps {
  video: Video;
  chatHistory: ChatMessage[];
  isSending: boolean;
  onSendMessage: (message: string) => void;
}

export default function StudyBuddyTab({
  video,
  chatHistory,
  isSending,
  onSendMessage
}: StudyBuddyTabProps) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const studyPrompts = [
    "Summarize this video.",
    "Give me 3 practice formulas or equations.",
    "Explain this to me like I am 12.",
    "Show me a real-world application."
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Welcome message when history is empty */}
        {chatHistory.length === 0 && (
          <div className="p-4 rounded-xl border border-teal-950 bg-teal-950/10 text-slate-300 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500 text-slate-950">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Meet Spark • AI Tutor</h4>
            </div>
            <p className="text-xs leading-relaxed font-sans">
              Hey! I'm Spark, your AI Study Buddy. Ask me anything about <span className="font-semibold text-slate-200">"{video.title}"</span>. I can break down equations, explain terms, or quiz you. Let's learn together!
            </p>
            <div className="pt-1.5 flex flex-wrap gap-1.5">
              {studyPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSendMessage(prompt)}
                  disabled={isSending}
                  className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 text-[10px] text-slate-400 hover:text-teal-400 hover:border-teal-900/40 transition-all font-sans cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation history bubbles */}
        {chatHistory.map((msg, idx) => {
          const isSpark = msg.role === "spark";
          return (
            <div
              key={idx}
              className={`flex ${isSpark ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                  isSpark
                    ? "bg-[#0d1425] border border-slate-900 text-slate-300 rounded-tl-none left-glow-border"
                    : "bg-teal-500 text-slate-950 font-medium rounded-tr-none"
                }`}
              >
                {/* Message author badge for Spark */}
                {isSpark && (
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-teal-400 mb-1">
                    <GraduationCap className="w-3.5 h-3.5" /> Spark
                  </div>
                )}
                
                {/* Parse markdown ticks or newlines safely for reading */}
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isSending && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3.5 rounded-2xl bg-[#0d1425] border border-slate-900 text-slate-500 rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
              <span className="text-[11px] font-medium font-sans">Spark is formulating explanation...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask Spark a study question...`}
          disabled={isSending}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2.5 rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 disabled:bg-slate-900 disabled:text-slate-600 transition-all cursor-pointer shadow-md shadow-teal-950/20 active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
