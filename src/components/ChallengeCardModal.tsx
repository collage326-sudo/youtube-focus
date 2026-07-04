import { motion } from "motion/react";
import { X, Tv, CheckSquare, Target, Sparkles, AlertTriangle, ListChecks } from "lucide-react";

interface ChallengeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChallengeCardModal({ isOpen, onClose }: ChallengeCardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1324] text-white shadow-2xl"
      >
        {/* Banner/Header style resembling the image */}
        <div className="p-6 pb-4 border-b border-slate-900 bg-slate-950/60 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-950/50 rounded-full border border-teal-900/60 mb-2">
              Challenge Card 03
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-white flex items-center gap-3">
              YouTube
              <Tv className="w-8 h-8 text-teal-400" />
            </h2>
            <div className="mt-2 text-sm text-slate-400">
              <span className="font-semibold text-slate-200">TARGET USER:</span> School Students
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body matching the image section layouts */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Scenario Context */}
          <div className="p-4 rounded-xl border border-slate-900 bg-[#0f172a] space-y-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> SCENARIO CONTEXT
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Students frequently get distracted by entertainment content while using YouTube for educational purposes.
            </p>
          </div>

          {/* Redesign Challenge */}
          <div className="p-4 rounded-xl border border-teal-950 bg-teal-950/20 space-y-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-teal-400 flex items-center gap-2">
              <Target className="w-4 h-4" /> REDESIGN CHALLENGE
            </h3>
            <p className="text-sm text-slate-200 font-medium leading-relaxed font-sans">
              Redesign YouTube to support focused learning.
            </p>
          </div>

          {/* Aspects to Consider */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
              <ListChecks className="w-4 h-4" /> ASPECTS TO CONSIDER & HOW WE SOLVED THEM
            </h3>

            <div className="grid gap-2 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-900">
                <CheckSquare className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Learning Mode</span>
                  <span className="text-slate-400 text-xs">
                    Activated layout: completely replaces distracting video grids with a cinematic player, side-by-side study logs, and a Pomodoro timer.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-900">
                <CheckSquare className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Educational Recommendations</span>
                  <span className="text-slate-400 text-xs">
                    No clickbait. Clean catalog of curated math, physics, coding, and history topics, filtered to maintain a strict academic focus.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-900">
                <CheckSquare className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Progress Tracking</span>
                  <span className="text-slate-400 text-xs">
                    Comprehensive metrics tracker reporting daily streaks, total study minutes, notes captured, and historical charts representing progress.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-900">
                <CheckSquare className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Reduced Distractions</span>
                  <span className="text-slate-400 text-xs">
                    No comments, no live chats, no recommended clickbait loop. Replaced with note pads, active revisions, and a helpful AI study buddy.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-900">
                <CheckSquare className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Study Playlists</span>
                  <span className="text-slate-400 text-xs">
                    Students can save topic tracks, assemble playlists, and complete them sequence-by-sequence.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => {
              // Copy challenge text to clipboard helper
              const text = `YouTube Redesign Challenge\nTarget User: School Students\nScenario: Students get distracted by entertainment while studying on YouTube.\nRedesign to support focused learning via Learning Mode, Curated educational recommendations, metrics progress tracking, distraction suppression, and customized study playlists.`;
              navigator.clipboard.writeText(text);
              alert("Challenge details copied to clipboard!");
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Copy Details
          </button>
          <span className="text-emerald-500 font-medium font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Challenge Implemented
          </span>
        </div>
      </motion.div>
    </div>
  );
}
