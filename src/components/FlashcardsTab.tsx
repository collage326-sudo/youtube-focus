import { useState } from "react";
import { Flashcard, Video } from "../types";
import { Sparkles, HelpCircle, Loader2, RefreshCw, ThumbsUp, HelpCircle as HelpIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FlashcardsTabProps {
  video: Video;
  flashcards: Flashcard[];
  isLoading: boolean;
  onGenerateFlashcards: () => void;
}

export default function FlashcardsTab({
  video,
  flashcards,
  isLoading,
  onGenerateFlashcards
}: FlashcardsTabProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownStatuses, setKnownStatuses] = useState<{ [cardId: string]: "known" | "learning" }>({});

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIdx < flashcards.length - 1) {
      setCurrentIdx((c) => c + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIdx > 0) {
      setCurrentIdx((c) => c - 1);
    }
  };

  const handleStatus = (status: "known" | "learning") => {
    const card = flashcards[currentIdx];
    setKnownStatuses((prev) => ({ ...prev, [card.id]: status }));
    handleNext();
  };

  const currentCard = flashcards[currentIdx];
  const knownCount = Object.values(knownStatuses).filter((s) => s === "known").length;

  return (
    <div className="flex flex-col h-full justify-between space-y-4">
      {/* 1. STATE: Empty / Not Generated */}
      {flashcards.length === 0 && !isLoading && (
        <div className="text-center py-10 my-auto text-slate-400 space-y-4">
          <HelpIcon className="w-12 h-12 text-slate-700 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200">Revision Flashcards</h4>
            <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              Generate custom exam-prep revision cards to memorize core vocabulary, key historical dates, or complex scientific formulas.
            </p>
          </div>
          <button
            onClick={onGenerateFlashcards}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5 mx-auto transition-all shadow-md shadow-teal-950/20 active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            Generate Flashcards
          </button>
        </div>
      )}

      {/* 2. STATE: Loading */}
      {isLoading && (
        <div className="text-center py-12 my-auto text-slate-400 space-y-4">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
          <div className="space-y-1.5 animate-pulse">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Drafting Summaries</h4>
            <p className="text-xs text-slate-500 max-w-[250px] mx-auto leading-relaxed">
              Gemini is mining the curriculum for key terms and crafting interactive study aids...
            </p>
          </div>
        </div>
      )}

      {/* 3. STATE: Loaded and active */}
      {flashcards.length > 0 && !isLoading && currentCard && (
        <div className="flex flex-col h-full justify-between space-y-4">
          {/* Header Progress stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="uppercase font-semibold tracking-wider text-teal-400">
                Card {currentIdx + 1} of {flashcards.length}
              </span>
              <span>Mastered: {knownCount} / {flashcards.length}</span>
            </div>
            {/* Visual Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 3D Flippable Card Frame */}
          <div className="flex-1 flex items-center justify-center py-4">
            <div
              className="w-full max-w-sm h-64 cursor-pointer select-none relative group"
              onClick={handleFlip}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="w-full h-full relative duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* CARD FRONT */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-2xl border flex flex-col justify-between p-6 shadow-xl ${
                    knownStatuses[currentCard.id] === "known"
                      ? "border-emerald-950 bg-[#0e1c20]"
                      : knownStatuses[currentCard.id] === "learning"
                      ? "border-amber-950 bg-[#1c140d]"
                      : "border-slate-800 bg-[#0d1425]"
                  }`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase block">
                    Front • Revision Term
                  </span>
                  
                  <div className="text-center py-4">
                    <p className="text-sm font-semibold text-slate-100 font-sans tracking-tight">
                      {currentCard.front}
                    </p>
                  </div>

                  <div className="text-center text-[11px] text-teal-400 font-semibold flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                    Click to flip & reveal answer
                  </div>
                </div>

                {/* CARD BACK */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl border border-teal-900 bg-[#0f1d1c] flex flex-col justify-between p-6 shadow-xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase block">
                    Back • AI Explanation
                  </span>

                  <div className="text-center py-2 overflow-y-auto max-h-[120px] pr-1">
                    <p className="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-wrap">
                      {currentCard.back}
                    </p>
                  </div>

                  <div className="text-center text-[10px] text-slate-500">
                    Click card to return to term
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Footer controls */}
          <div className="space-y-3">
            {/* Tagging Controls (Only shown when flipped) */}
            {isFlipped ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatus("learning");
                  }}
                  className="py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Needs Study
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatus("known");
                  }}
                  className="py-2.5 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-teal-950/20"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Got It!
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/50 hover:bg-slate-900 hover:border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                
                <span className="text-xs text-slate-500 font-medium">
                  Status: {knownStatuses[currentCard.id] === "known" ? "🟢 Mastered" : knownStatuses[currentCard.id] === "learning" ? "🟡 Learning" : "⚪ Unstudied"}
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentIdx === flashcards.length - 1}
                  className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/50 hover:bg-slate-900 hover:border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
