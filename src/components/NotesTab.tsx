import React, { useState } from "react";
import { Note, Video } from "../types";
import { FileText, Plus, Trash2, Calendar, Clock, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotesTabProps {
  video: Video;
  notes: Note[];
  onSaveNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
  onJumpToTimestamp: (seconds: number) => void;
}

export default function NotesTab({
  video,
  notes,
  onSaveNote,
  onDeleteNote,
  onJumpToTimestamp
}: NotesTabProps) {
  const [content, setContent] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSaveNote(content);
    setContent("");
  };

  // Convert seconds to readable MM:SS format
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const filteredNotes = notes.filter((n) => n.videoId === video.id);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Editor Box */}
      <form onSubmit={handleAddNote} className="space-y-2 shrink-0">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Capture an equation, concept, or timestamped reminder..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 resize-none transition-all"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <span>Hit Save Note</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-950/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Save Focused Note
        </button>
      </form>

      {/* Captured Notes List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-900">
          <span className="font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            Saved Notes ({filteredNotes.length})
          </span>
          <span className="text-[10px] font-mono">Auto-Saved locally</span>
        </div>

        <AnimatePresence initial={false}>
          {filteredNotes.length === 0 ? (
            <div className="text-center py-10 text-slate-600">
              <Bookmark className="w-7 h-7 text-slate-800 mx-auto mb-2" />
              <p className="text-xs font-medium">No study notes captured yet.</p>
              <p className="text-[10px] text-slate-700 mt-1">
                Type above and hit save. It will record your study time.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3.5 rounded-xl border border-slate-900 bg-[#0d1425] hover:border-slate-800 hover:bg-slate-900/30 transition-all flex items-start gap-3.5 group"
              >
                {/* Timestamp Jump Badge */}
                <button
                  type="button"
                  onClick={() => onJumpToTimestamp(note.timestamp)}
                  className="px-2.5 py-1 rounded bg-teal-950 hover:bg-teal-900 border border-teal-900/40 text-teal-300 text-xs font-mono font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer group-hover:scale-105"
                  title="Jump to this part of the video"
                >
                  <Clock className="w-3 h-3 text-teal-400" />
                  {formatTime(note.timestamp)}
                </button>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-wrap font-sans">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteNote(note.id)}
                  className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                  title="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
