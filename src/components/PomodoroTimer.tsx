import { useState, useEffect, useRef } from "react";
import { Clock, Play, Pause, RotateCcw, Coffee, ShieldAlert, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PomodoroTimerProps {
  onSessionComplete: (durationMinutes: number) => void;
}

export default function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      // Session finished!
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      const duration = isBreak ? 5 : 25;
      if (!isBreak) {
        onSessionComplete(25); // Log 25 study minutes!
      }
      
      // Toggle session type
      setIsBreak(!isBreak);
      setSecondsLeft(!isBreak ? 5 * 60 : 25 * 60);
      setShowNotification(true);
      
      // Auto-dismiss notification
      setTimeout(() => setShowNotification(false), 5000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsLeft, isBreak, onSessionComplete]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const percentage = (secondsLeft / (isBreak ? 5 * 60 : 25 * 60)) * 100;

  return (
    <div className={`p-4 bento-card ${
      isActive && !isBreak ? "border-teal-500/50 bg-slate-950/80 animate-breath-glow bento-highlight-cyan" : "bento-highlight-cyan"
    }`}>
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-900/60 mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          {isBreak ? (
            <>
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              Rest Break Mode
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Pomodoro Interval
            </>
          )}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {isBreak ? "5 mins" : "25 mins"}
        </span>
      </div>

      {/* Timer visualizer and play buttons */}
      <div className="flex items-center gap-5 justify-between">
        <div className="space-y-1">
          {/* Minutes / Seconds */}
          <h4 className="text-3xl font-display font-extrabold text-white tracking-tight leading-none">
            {formatTime(secondsLeft)}
          </h4>
          <p className="text-[10px] text-slate-500 font-medium">
            {isActive ? "Study focus cycle active" : "Timer paused"}
          </p>
        </div>

        {/* Action button controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToggle}
            className={`p-2.5 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer shadow-md ${
              isActive
                ? "bg-slate-900 border border-slate-800 text-teal-400 hover:text-teal-300"
                : "bg-teal-500 text-slate-950 hover:bg-teal-400"
            }`}
            title={isActive ? "Pause timer" : "Start timer"}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
          </button>
        </div>
      </div>

      {/* Progress horizontal line indicator */}
      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-4">
        <div
          className={`h-full transition-all duration-1000 ${isBreak ? "bg-amber-500" : "bg-teal-500"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Alerts Overlay on finished sessions */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-2.5 rounded-xl bg-teal-950/30 border border-teal-900/40 flex items-center gap-2 text-[10px] text-teal-300 font-sans"
          >
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              {isBreak
                ? "Study cycle finished! Take a 5-minute break to stretch."
                : "Break over! Get ready to focus again."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
