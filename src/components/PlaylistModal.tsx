import React, { useState } from "react";
import { Playlist, Video } from "../types";
import { X, FolderHeart, Plus, Trash2, ListStart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  videos: Video[];
  onCreatePlaylist: (name: string, description: string) => void;
  onDeletePlaylist: (id: string) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
}

export default function PlaylistModal({
  isOpen,
  onClose,
  playlists,
  videos,
  onCreatePlaylist,
  onDeletePlaylist,
  onPlayPlaylist
}: PlaylistModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreatePlaylist(name, description);
    setName("");
    setDescription("");
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1324] text-white shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-900 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderHeart className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-display font-bold">My Study Playlists</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Playlists content area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <AnimatePresence mode="wait">
            {isCreating ? (
              <motion.form
                key="create-form"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-4 p-4 rounded-xl border border-teal-900/40 bg-teal-950/10"
              >
                <h3 className="text-sm font-semibold text-teal-400">Create New Study Track</h3>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Playlist Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Calculus BC Exam Prep"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Curated school curriculum materials to study daily..."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all flex items-center gap-1"
                  >
                    Create Playlist
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="playlists-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-between items-center"
              >
                <p className="text-xs text-slate-400">
                  Select and start watching an educational study track in focused sequence.
                </p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-950 hover:bg-teal-900 text-teal-400 border border-teal-900/60 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> New Playlist
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3.5">
            {playlists.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-900 rounded-xl text-slate-500">
                <ListStart className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-semibold">No custom study playlists found.</p>
                <p className="text-xs text-slate-600 mt-1">Create one above to begin clustering topics!</p>
              </div>
            ) : (
              playlists.map((playlist) => {
                const playlistVideos = videos.filter((v) => playlist.videoIds.includes(v.id));

                return (
                  <div
                    key={playlist.id}
                    className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-100">{playlist.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-1">
                        {playlist.description || "No description provided."}
                      </p>
                      
                      {/* Video counts/titles list preview */}
                      <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
                        <span className="font-semibold text-teal-400">
                          {playlist.videoIds.length} video{playlist.videoIds.length !== 1 ? "s" : ""}
                        </span>
                        {playlistVideos.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[250px]">
                              Preview: {playlistVideos.map(v => v.title).join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onPlayPlaylist(playlist)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1 transition-all shadow-md shadow-teal-950/20"
                        title="Start sequence watching"
                      >
                        Play Track <ArrowRight className="w-3 h-3" />
                      </button>
                      
                      {/* Hide trash for system preset playlists */}
                      {!playlist.id.startsWith("p") && (
                        <button
                          onClick={() => onDeletePlaylist(playlist.id)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/30 text-slate-500 hover:text-red-400 border border-slate-800/40 hover:border-red-900/30 transition-all"
                          title="Delete study track"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
