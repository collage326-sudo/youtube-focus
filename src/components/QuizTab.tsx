import { useState } from "react";
import { QuizQuestion, Video } from "../types";
import { Sparkles, Check, X, Award, HelpCircle, Loader2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizTabProps {
  video: Video;
  quizQuestions: QuizQuestion[];
  isLoading: boolean;
  onGenerateQuiz: () => void;
}

export default function QuizTab({
  video,
  quizQuestions,
  isLoading,
  onGenerateQuiz
}: QuizTabProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return; // Prevent changing answer
    setSelectedIdx(idx);
    if (idx === quizQuestions[currentIdx].correctAnswerIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((c) => c + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 1. STATE: Not loaded / empty */}
      {quizQuestions.length === 0 && !isLoading && (
        <div className="text-center py-10 my-auto text-slate-400 space-y-4">
          <HelpCircle className="w-12 h-12 text-slate-700 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200">Test Your Knowledge</h4>
            <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              Let our AI Study Buddy generate a custom 4-question quiz based on this educational topic to lock in what you've learned.
            </p>
          </div>
          <button
            onClick={onGenerateQuiz}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5 mx-auto transition-all shadow-md shadow-teal-950/20 active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            Generate AI Quiz
          </button>
        </div>
      )}

      {/* 2. STATE: Loading */}
      {isLoading && (
        <div className="text-center py-12 my-auto text-slate-400 space-y-4">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
          <div className="space-y-1.5 animate-pulse">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Analyzing Concepts</h4>
            <p className="text-xs text-slate-500 max-w-[250px] mx-auto leading-relaxed">
              Gemini is reviewing this video's curriculum and drafting practice questions...
            </p>
          </div>
        </div>
      )}

      {/* 3. STATE: Loaded and active */}
      {quizQuestions.length > 0 && !isLoading && (
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={`question-${currentIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full justify-between space-y-4"
            >
              {/* Question progress and stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="uppercase font-semibold tracking-wider text-teal-400">
                    Question {currentIdx + 1} of {quizQuestions.length}
                  </span>
                  <span>Score: {score}</span>
                </div>
                {/* Visual Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40">
                <h4 className="text-sm font-semibold text-slate-100 leading-relaxed font-sans">
                  {quizQuestions[currentIdx].question}
                </h4>
              </div>

              {/* Options Grid */}
              <div className="space-y-2">
                {quizQuestions[currentIdx].options.map((option, idx) => {
                  const isCorrect = idx === quizQuestions[currentIdx].correctAnswerIndex;
                  const isSelected = idx === selectedIdx;
                  
                  // Style classes based on selection feedback state
                  let btnStyle = "border-slate-800 bg-[#0d1425] hover:border-slate-700 hover:bg-slate-900/30 text-slate-300";
                  if (selectedIdx !== null) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-900 bg-emerald-950/40 text-emerald-300 font-medium";
                    } else if (isSelected) {
                      btnStyle = "border-rose-950 bg-rose-950/40 text-rose-300";
                    } else {
                      btnStyle = "border-slate-900/60 bg-[#0c1324]/30 text-slate-600 pointer-events-none";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={selectedIdx !== null}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 select-none ${btnStyle}`}
                    >
                      {/* Badge / Letter indicator */}
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        selectedIdx !== null && isCorrect
                          ? "bg-emerald-500 text-slate-950"
                          : selectedIdx !== null && isSelected
                          ? "bg-rose-500 text-white"
                          : "bg-slate-900 text-slate-500 border border-slate-800"
                      }`}>
                        {selectedIdx !== null && isCorrect ? (
                          <Check className="w-3 h-3" />
                        ) : selectedIdx !== null && isSelected ? (
                          <X className="w-3 h-3" />
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </span>
                      <span className="font-sans">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Action Trigger */}
              <div className="min-h-[90px] flex flex-col justify-end">
                {selectedIdx !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 text-[11px] leading-relaxed text-slate-400 font-sans">
                      <span className="font-bold text-teal-400 block mb-1">
                        {selectedIdx === quizQuestions[currentIdx].correctAnswerIndex ? "✓ Correct!" : "✗ Needs Study"}
                      </span>
                      {quizQuestions[currentIdx].explanation}
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-800 flex items-center justify-center gap-1.5 transition-all"
                    >
                      {currentIdx === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question →"}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scoreboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 my-auto space-y-5"
            >
              <div className="p-4 rounded-full bg-teal-500/10 border border-teal-900/30 inline-block">
                <Award className="w-12 h-12 text-teal-400 mx-auto" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-display font-bold">Quiz Completed!</h3>
                <p className="text-3xl font-display font-extrabold text-teal-400">
                  {score} / {quizQuestions.length} Correct
                </p>
                <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                  {score === quizQuestions.length
                    ? "Absolute mastery! You understand this core curriculum topic perfectly."
                    : score >= 2
                    ? "Great attempt! Take notes and try again to achieve a flawless score."
                    : "Study is a journey. Review the video material, use the AI study helper, and retake the test!"}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
                <button
                  onClick={onGenerateQuiz}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> New Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
