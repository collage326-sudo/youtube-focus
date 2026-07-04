import React, { useState, useEffect } from "react";
import { Video, Note, Playlist, UserProgress, QuizQuestion, Flashcard } from "./types";
import { CURATED_VIDEOS, PRESET_PLAYLISTS, CATEGORIES } from "./data";
import {
  GraduationCap,
  Play,
  Layers,
  FolderHeart,
  BarChart3,
  Lightbulb,
  Search,
  Plus,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  Info,
  Youtube,
  ArrowLeft,
  Sparkles,
  ClipboardList,
  Flame,
  CheckCircle,
  Clock,
  Heart,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ChallengeCardModal from "./components/ChallengeCardModal";
import StudyDashboard from "./components/StudyDashboard";
import VideoCard from "./components/VideoCard";
import PlaylistModal from "./components/PlaylistModal";
import NotesTab from "./components/NotesTab";
import QuizTab from "./components/QuizTab";
import FlashcardsTab from "./components/FlashcardsTab";
import StudyBuddyTab from "./components/StudyBuddyTab";
import PomodoroTimer from "./components/PomodoroTimer";

export default function App() {
  // --- LAYOUT & WORKSPACE NAVIGATION ---
  const [activeView, setActiveView] = useState<"discover" | "library" | "progress">("discover");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [learningMode, setLearningMode] = useState(true);

  // --- STATE FOR MODALS & OVERLAYS ---
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  // --- RECTIFY AND INITIALIZE LOCAL STORAGE PERSISTENCE ---
  const [videos, setVideos] = useState<Video[]>(CURATED_VIDEOS);
  const [playlists, setPlaylists] = useState<Playlist[]>(PRESET_PLAYLISTS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [progress, setProgress] = useState<UserProgress>({
    watchedVideoIds: [],
    videoWatchTime: {},
    totalStudyTime: 15, // default starter metric
    streakDays: 3, // default starter streak
    lastStudyDate: new Date().toISOString().split("T")[0],
    notesWrittenCount: 1,
    completedVideosCount: 0,
    pomodoroSessions: []
  });

  // --- PASTING CUSTOM VIDEOS STATE ---
  const [customUrl, setCustomUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState("Math");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customUrlError, setCustomUrlError] = useState("");

  // --- AI STUDY ENGINE ACTIVE STATES ---
  const [activeTab, setActiveTab] = useState<"buddy" | "notes" | "quiz" | "flashcards">("buddy");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "spark"; text: string }[]>([]);
  
  // AI loader states
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryMarkdown, setSummaryMarkdown] = useState<string | null>(null);

  // --- LOAD INITIAL DATA ON MOUNT ---
  useEffect(() => {
    try {
      const storedVideos = localStorage.getItem("yt_focus_videos");
      if (storedVideos) setVideos(JSON.parse(storedVideos));

      const storedPlaylists = localStorage.getItem("yt_focus_playlists");
      if (storedPlaylists) setPlaylists(JSON.parse(storedPlaylists));

      const storedNotes = localStorage.getItem("yt_focus_notes");
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
        // Sync note count metric
        setProgress(prev => ({ ...prev, notesWrittenCount: parsedNotes.length }));
      }

      const storedProgress = localStorage.getItem("yt_focus_progress");
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      } else {
        // First run initialization
        localStorage.setItem("yt_focus_progress", JSON.stringify(progress));
      }
    } catch (err) {
      console.error("Local storage sync error:", err);
    }
  }, []);

  // --- HELPER WRITER TO RE-PERSIST TO LOCAL STORAGE ---
  const saveProgressToStorage = (updatedProgress: UserProgress) => {
    setProgress(updatedProgress);
    localStorage.setItem("yt_focus_progress", JSON.stringify(updatedProgress));
  };

  // --- VIDEO WATCH TIME SIMULATED ACCUMULATOR ---
  // Increments actual study time on the video currently being played
  useEffect(() => {
    if (!activeVideo) return;

    const interval = setInterval(() => {
      // Accumulate watched seconds for this video
      const currentSeconds = progress.videoWatchTime[activeVideo.id] || 0;
      const updatedSeconds = currentSeconds + 10; // Log batches of seconds for responsive performance

      const updatedWatchTime = {
        ...progress.videoWatchTime,
        [activeVideo.id]: updatedSeconds
      };

      // Calculate total study focus minutes (seconds / 60)
      const totalSecondsWatched = Object.keys(updatedWatchTime).reduce((acc: number, k: string) => acc + (updatedWatchTime[k] || 0), 0);
      const calculatedMins = Math.max(15, Math.floor(totalSecondsWatched / 60));

      const updatedProgress = {
        ...progress,
        videoWatchTime: updatedWatchTime,
        totalStudyTime: calculatedMins
      };

      saveProgressToStorage(updatedProgress);
    }, 10000); // Trigger watch sync every 10 seconds

    return () => clearInterval(interval);
  }, [activeVideo, progress]);

  // --- EXPLICIT MARK VIDEO COMPLETED HANDLER ---
  const handleMarkCompleted = () => {
    if (!activeVideo) return;
    
    const isAlreadyCompleted = progress.watchedVideoIds.includes(activeVideo.id);
    if (isAlreadyCompleted) return;

    const updatedWatchedIds = [...progress.watchedVideoIds, activeVideo.id];
    
    // Reward with +15 study minutes and update count
    const updatedProgress: UserProgress = {
      ...progress,
      watchedVideoIds: updatedWatchedIds,
      completedVideosCount: updatedWatchedIds.length,
      totalStudyTime: progress.totalStudyTime + 15
    };

    saveProgressToStorage(updatedProgress);
    alert("Congratulations! Video marked completed. +15 study minutes rewarded on your progress board.");
  };

  // --- CREATE STUDY PLAYLIST HANDLER ---
  const handleCreatePlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: "pl-" + Date.now(),
      name,
      description,
      videoIds: [],
      createdAt: new Date().toISOString()
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem("yt_focus_playlists", JSON.stringify(updatedPlaylists));
  };

  // --- DELETE PLAYLIST HANDLER ---
  const handleDeletePlaylist = (id: string) => {
    const updatedPlaylists = playlists.filter((pl) => pl.id !== id);
    setPlaylists(updatedPlaylists);
    localStorage.setItem("yt_focus_playlists", JSON.stringify(updatedPlaylists));
  };

  // --- PLAY PLAYLIST SEQUENCE HANDLER ---
  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.videoIds.length === 0) {
      alert("This playlist has no videos yet. Add some videos from the catalog first!");
      setIsPlaylistOpen(false);
      return;
    }
    
    // Find first video in sequence
    const firstVideo = videos.find((v) => v.id === playlist.videoIds[0]);
    if (firstVideo) {
      handlePlayVideo(firstVideo);
    }
    setIsPlaylistOpen(false);
  };

  // --- ADD TO PLAYLIST HELPER ---
  const handleAddVideoToPlaylist = (videoId: string, playlistId: string) => {
    const updatedPlaylists = playlists.map((pl) => {
      if (pl.id === playlistId) {
        if (pl.videoIds.includes(videoId)) {
          alert("This video is already in that study playlist!");
          return pl;
        }
        return {
          ...pl,
          videoIds: [...pl.videoIds, videoId]
        };
      }
      return pl;
    });

    setPlaylists(updatedPlaylists);
    localStorage.setItem("yt_focus_playlists", JSON.stringify(updatedPlaylists));
    alert("Video successfully added to your Study Playlist.");
  };

  // --- SAVE FOCUSED STUDY NOTE HANDLER ---
  const handleSaveNote = (content: string) => {
    if (!activeVideo) return;

    // Grab rough current duration seconds (mocked from current storage time)
    const currentSeconds = progress.videoWatchTime[activeVideo.id] || 15;

    const newNote: Note = {
      id: "note-" + Date.now(),
      videoId: activeVideo.id,
      timestamp: currentSeconds,
      content,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("yt_focus_notes", JSON.stringify(updatedNotes));

    // Update study counts
    const updatedProgress = {
      ...progress,
      notesWrittenCount: updatedNotes.length
    };
    saveProgressToStorage(updatedProgress);
  };

  // --- DELETE NOTE HANDLER ---
  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("yt_focus_notes", JSON.stringify(updatedNotes));

    const updatedProgress = {
      ...progress,
      notesWrittenCount: updatedNotes.length
    };
    saveProgressToStorage(updatedProgress);
  };

  // --- MOCK TS SEEK / RELOAD AT TARGET SECOND ---
  const [playerTimestamp, setPlayerTimestamp] = useState<number | null>(null);

  const handleJumpToTimestamp = (seconds: number) => {
    setPlayerTimestamp(seconds);
  };

  // --- PARSE AND INTEGRATE CUSTOM YOUTUBE VIDEO LINK ---
  const parseYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomUrlError("");

    const videoId = parseYouTubeId(customUrl);
    if (!videoId) {
      setCustomUrlError("Invalid YouTube URL. Please supply a valid desktop, mobile, embed, or shorts link.");
      return;
    }

    // Check duplicates
    if (videos.some((v) => v.id === videoId)) {
      setCustomUrlError("This video is already cataloged in your workspace!");
      return;
    }

    const newVideo: Video = {
      id: videoId,
      title: customTitle.trim() || "Custom Study Topic Video",
      channelTitle: "User Imported Course",
      category: customCategory,
      duration: "Calculated",
      description: `Imported learning guide focused on standard ${customCategory} topics. Study notes and interactive companion tutors are ready for this video.`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };

    const updatedVideos = [newVideo, ...videos];
    setVideos(updatedVideos);
    localStorage.setItem("yt_focus_videos", JSON.stringify(updatedVideos));

    setCustomUrl("");
    setCustomTitle("");
    setShowCustomForm(false);
    alert("Video cataloged successfully! You can select and study it in Focused Learning Mode.");
  };

  // --- PLAY VIDEO WORKSPACE TRIGGER ---
  const handlePlayVideo = (video: Video) => {
    setActiveVideo(video);
    // Reset AI states for this specific video session
    setQuizQuestions([]);
    setFlashcards([]);
    setSummaryMarkdown(null);
    setChatHistory([]);
    setActiveTab("buddy");
    setPlayerTimestamp(null);
  };

  // --- SECURE BACKEND GEMINI DISPATCHERS ---

  // 1. AI Chat Study Companion "Spark"
  const handleSendChatMessage = async (msgText: string) => {
    if (!activeVideo) return;

    // Instantly append user message to local history
    const userMsg = { role: "user" as const, text: msgText };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgText,
          videoTitle: activeVideo.title,
          videoDescription: activeVideo.description,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error("Chat response failed.");
      }

      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: "spark", text: data.reply }]);
    } catch (error: any) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { role: "spark", text: "I ran into a server error. Please ensure your GEMINI_API_KEY is defined in the Secrets Panel!" }
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // 2. AI Quiz Generator
  const handleGenerateQuiz = async () => {
    if (!activeVideo) return;
    setIsGeneratingQuiz(true);

    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: activeVideo.title,
          videoDescription: activeVideo.description
        })
      });

      if (!response.ok) {
        throw new Error("Failed to construct quiz questions.");
      }

      const data = await response.json();
      setQuizQuestions(data.quiz);
    } catch (err: any) {
      console.error(err);
      alert("Could not generate quiz. Check that GEMINI_API_KEY is set in your Secrets panel.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // 3. AI Revision Flashcards Generator
  const handleGenerateFlashcards = async () => {
    if (!activeVideo) return;
    setIsGeneratingFlashcards(true);

    try {
      const response = await fetch("/api/gemini/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: activeVideo.title,
          videoDescription: activeVideo.description
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate revision flashcards.");
      }

      const data = await response.json();
      setFlashcards(data.flashcards.map((f: any, idx: number) => ({
        id: `card-${idx}-${Date.now()}`,
        videoId: activeVideo.id,
        front: f.front,
        back: f.back
      })));
    } catch (err: any) {
      console.error(err);
      alert("Failed to synthesize flashcards. Check your server credentials.");
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  // 4. AI Topic Quick-Summarizer
  const handleGenerateSummary = async () => {
    if (!activeVideo) return;
    setIsSummarizing(true);

    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: activeVideo.title,
          videoDescription: activeVideo.description
        })
      });

      if (!response.ok) throw new Error("Summary service offline.");
      const data = await response.json();
      setSummaryMarkdown(data.summary);
    } catch (err) {
      console.error(err);
      setSummaryMarkdown("Could not generate summary at this time. Please make sure your server has a valid GEMINI_API_KEY.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // --- LOG POMODORO PROGRESS TO TOTAL MINUTES ---
  const handlePomodoroSessionComplete = (minutes: number) => {
    const newSession = {
      id: "pomo-" + Date.now(),
      date: new Date().toISOString(),
      durationMinutes: minutes
    };

    const updatedSessions = [...progress.pomodoroSessions, newSession];
    const updatedProgress = {
      ...progress,
      pomodoroSessions: updatedSessions,
      totalStudyTime: progress.totalStudyTime + minutes
    };

    saveProgressToStorage(updatedProgress);
  };

  // --- FILTER AND SEARCH LOGIC FOR DISCOVER CATALOGUE ---
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* GLOBAL HEADER PANEL */}
      <header className="sticky top-0 z-40 bg-[#030712]/80 border-b border-slate-800/30 backdrop-blur-md px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* App title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveVideo(null);
                setActiveView("discover");
              }}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-all">
                <Youtube className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                  YouTube Focus
                </h1>
                <span className="text-[10px] font-medium text-teal-400 uppercase tracking-widest font-mono">
                  Study Workspace
                </span>
              </div>
            </button>
          </div>

          {/* Search bar (In catalog discover view) */}
          {activeView === "discover" && !activeVideo && (
            <div className="hidden md:flex items-center flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search educational topics (Math, Physics, Bio)..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-950 border border-slate-900 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all"
              />
            </div>
          )}

          {/* Quick-action buttons & Profile Badge */}
          <div className="flex items-center gap-3">
            {/* Learning Mode switch */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Learning Mode
              </span>
              <button
                onClick={() => setLearningMode(!learningMode)}
                className="text-teal-400 hover:text-teal-300 transition-all cursor-pointer"
                title="Toggle focused layout (blocks recommendations and comments)"
              >
                {learningMode ? (
                  <ToggleRight className="w-8 h-8 text-teal-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>

            {/* Brief Card Button */}
            <button
              onClick={() => setIsChallengeOpen(true)}
              className="p-2 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Show Challenge Brief"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Student badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-900 bg-slate-950/80">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">Student profile</p>
                <p className="text-[10px] font-mono text-slate-500">collage326@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE SCREEN */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* VIEW A: Active Player / Cinematic focused Study view */}
        <AnimatePresence mode="wait">
          {activeVideo ? (
            <motion.div
              key="player-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              
              {/* LEFT COLUMN: Clean Cinematic Iframe player & Description */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Back button */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 font-semibold cursor-pointer transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Catalog
                </button>

                {/* Cinematic Iframe Container */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-900 bg-black shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3${
                      playerTimestamp !== null ? `&start=${playerTimestamp}` : ""
                    }`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>

                {/* Video Info Panel */}
                <div className="p-5 bento-card bento-highlight-cyan space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-950 text-teal-400 border border-teal-900/60">
                          {activeVideo.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{activeVideo.channelTitle}</span>
                      </div>
                      <h2 className="text-lg font-display font-bold text-white leading-snug">
                        {activeVideo.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Add to playlist button */}
                      <div className="relative group">
                        <button
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <FolderHeart className="w-4 h-4" /> Add to...
                        </button>
                        
                        {/* Dropdown list of playlists on hover */}
                        <div className="absolute right-0 top-full mt-2 w-56 hidden group-hover:block bg-slate-950 border border-slate-800 rounded-xl p-2 z-50 shadow-2xl">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
                            Choose Study Playlist
                          </p>
                          {playlists.map((pl) => (
                            <button
                              key={pl.id}
                              onClick={() => handleAddVideoToPlaylist(activeVideo.id, pl.id)}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-all truncate"
                            >
                              + {pl.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Completed button */}
                      <button
                        onClick={handleMarkCompleted}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          progress.watchedVideoIds.includes(activeVideo.id)
                            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-900/40 cursor-default"
                            : "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-950/20"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {progress.watchedVideoIds.includes(activeVideo.id) ? "Finished" : "Complete Task"}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans border-t border-slate-900/60 pt-3">
                    {activeVideo.description}
                  </p>
                </div>

                {/* AI TOPIC QUICK SUMMARY BANNER */}
                <div className="p-5 bento-card bento-highlight-cyan space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-display font-bold flex items-center gap-1.5 text-teal-400">
                      <Sparkles className="w-4 h-4 fill-teal-400" />
                      Topic Summary Sheet
                    </h3>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isSummarizing}
                      className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSummarizing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <ClipboardList className="w-3.5 h-3.5" /> {summaryMarkdown ? "Regenerate" : "Generate Summary"}
                        </>
                      )}
                    </button>
                  </div>

                  {summaryMarkdown ? (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap break-words">
                      {summaryMarkdown}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-sans">
                      Request an AI Study summary sheet to instantly compile takeaways, definitions, and cheat sheets about this topic.
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Tabbed Active Study utilities & Pomodoro Timer */}
              <div className="space-y-4">
                
                {/* 1. Pomodoro Timer Panel */}
                <PomodoroTimer onSessionComplete={handlePomodoroSessionComplete} />

                {/* 2. Focused Revision tools */}
                <div className="bento-card bento-highlight-purple p-5 flex flex-col h-[520px]">
                  {/* Tab Selector Header */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 border border-slate-900 rounded-xl mb-4 shrink-0">
                    {[
                      { id: "buddy", label: "Study Buddy", icon: GraduationCap },
                      { id: "notes", label: "Notes", icon: BookOpen },
                      { id: "quiz", label: "Quiz", icon: ClipboardList },
                      { id: "flashcards", label: "Revision", icon: Lightbulb }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-2 rounded-lg text-[10px] font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          activeTab === tab.id
                            ? "bg-slate-900 text-teal-400"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <tab.icon className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab content wrapper */}
                  <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      {activeTab === "buddy" && (
                        <motion.div
                          key="buddy-tab"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full"
                        >
                          <StudyBuddyTab
                            video={activeVideo}
                            chatHistory={chatHistory}
                            isSending={isSendingChat}
                            onSendMessage={handleSendChatMessage}
                          />
                        </motion.div>
                      )}

                      {activeTab === "notes" && (
                        <motion.div
                          key="notes-tab"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full"
                        >
                          <NotesTab
                            video={activeVideo}
                            notes={notes}
                            onSaveNote={handleSaveNote}
                            onDeleteNote={handleDeleteNote}
                            onJumpToTimestamp={handleJumpToTimestamp}
                          />
                        </motion.div>
                      )}

                      {activeTab === "quiz" && (
                        <motion.div
                          key="quiz-tab"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full"
                        >
                          <QuizTab
                            video={activeVideo}
                            quizQuestions={quizQuestions}
                            isLoading={isGeneratingQuiz}
                            onGenerateQuiz={handleGenerateQuiz}
                          />
                        </motion.div>
                      )}

                      {activeTab === "flashcards" && (
                        <motion.div
                          key="flashcards-tab"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full"
                        >
                          <FlashcardsTab
                            video={activeVideo}
                            flashcards={flashcards}
                            isLoading={isGeneratingFlashcards}
                            onGenerateFlashcards={handleGenerateFlashcards}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // VIEW B: Standard dashboard interfaces (Discover / Playlists / Progress)
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Dashboard Sub-navigation tabs */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 flex-wrap gap-4">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-900/60">
                  {[
                    { id: "discover", label: "Subject Catalog", icon: Layers },
                    { id: "library", label: "My Track Lists", icon: FolderHeart },
                    { id: "progress", label: "Study Progress", icon: BarChart3 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveView(tab.id as any)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        activeView === tab.id
                          ? "bg-slate-900 text-teal-400 border border-slate-800"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Catalog action: paste link */}
                {activeView === "discover" && (
                  <button
                    onClick={() => setShowCustomForm(!showCustomForm)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-950 hover:bg-teal-900 text-teal-400 border border-teal-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Import Custom Video
                  </button>
                )}
              </div>

              {/* Collapsible custom URL pasting box */}
              <AnimatePresence>
                {showCustomForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <form
                      onSubmit={handleAddCustomVideo}
                      className="p-5 bento-card bento-highlight-cyan space-y-4 max-w-2xl"
                    >
                      <div className="flex items-center gap-2.5 text-teal-400">
                        <Plus className="w-4 h-4" />
                        <h3 className="text-sm font-bold font-display uppercase tracking-wider">
                          Import Video into Catalog
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">
                            YouTube Link (Desktop, Embed, shorts)
                          </label>
                          <input
                            type="url"
                            required
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Learning Title (Optional)
                          </label>
                          <input
                            type="text"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            placeholder="e.g. Introduction to Quantum Physics"
                            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Subject Category
                          </label>
                          <select
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                          >
                            <option value="Math">Math</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="History">History</option>
                          </select>
                        </div>
                      </div>

                      {customUrlError && (
                        <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 leading-none pt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {customUrlError}
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-lg transition-all"
                        >
                          Catalog Study Video
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomUrl("");
                            setCustomTitle("");
                            setShowCustomForm(false);
                          }}
                          className="px-3 py-2 text-slate-400 hover:text-white text-xs transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUB-VIEW 1: DISCOVER SUBJECT CATALOG */}
              {activeView === "discover" && (
                <div className="space-y-6">
                  {/* Subject category filter row */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                          selectedCategory === cat
                            ? "bg-teal-500 border-teal-500 text-slate-950 font-bold"
                            : "border-slate-900 bg-slate-950/40 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Curated list video grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onPlay={handlePlayVideo}
                        isCompleted={progress.watchedVideoIds.includes(video.id)}
                      />
                    ))}
                  </div>

                  {filteredVideos.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl text-slate-500">
                      <Search className="w-10 h-10 text-slate-700 mx-auto mb-2.5 animate-pulse" />
                      <p className="text-sm font-semibold">No educational matches found.</p>
                      <p className="text-xs text-slate-600 mt-1">Try refining your filter or search query!</p>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 2: PLAYLIST TRACKS & SAVED TRACKS */}
              {activeView === "library" && (
                <div className="space-y-6 p-6 bento-card bento-highlight-cyan">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-display font-bold">Custom Study Programs</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Build customized track schedules to prepare for exams or master curriculum topics sequentially.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setIsPlaylistOpen(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <FolderHeart className="w-4 h-4" /> Manage Playlists
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {playlists.map((playlist) => {
                      const playlistVideos = videos.filter((v) => playlist.videoIds.includes(v.id));

                      return (
                        <div
                          key={playlist.id}
                          className="p-5 rounded-2xl border border-slate-800/40 bg-slate-950/40 hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest font-mono">
                              {playlistVideos.length} Track Video{playlistVideos.length !== 1 ? "s" : ""}
                            </span>
                            <h4 className="text-base font-bold text-slate-100">{playlist.name}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                              {playlist.description || "Organized schedule tracks."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-900/60">
                            <div className="flex -space-x-2 overflow-hidden">
                              {playlistVideos.slice(0, 3).map((v) => (
                                <img
                                  key={v.id}
                                  src={v.thumbnailUrl}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="inline-block h-6 w-10 object-cover rounded border border-[#0c1324]"
                                />
                              ))}
                            </div>

                            <button
                              onClick={() => handlePlayPlaylist(playlist)}
                              disabled={playlistVideos.length === 0}
                              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-200 border border-slate-800 hover:text-white transition-all cursor-pointer"
                            >
                              Play Tracks
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 3: PROGRESS TRACKER */}
              {activeView === "progress" && (
                <StudyDashboard
                  progress={progress}
                  videos={videos}
                  onPlayVideo={handlePlayVideo}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER BLOCK */}
      <footer className="border-t border-slate-900/80 bg-slate-950/60 mt-16 text-xs text-slate-600 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans">
            © 2026 YouTube Focus Study Workspace. Engineered to minimize distractions and support concentrated study.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-teal-500 font-semibold font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              Learning Mode Active
            </span>
          </div>
        </div>
      </footer>

      {/* CHANNELS MODALS OVERLAYS */}
      <ChallengeCardModal isOpen={isChallengeOpen} onClose={() => setIsChallengeOpen(false)} />
      
      <PlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        playlists={playlists}
        videos={videos}
        onCreatePlaylist={handleCreatePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onPlayPlaylist={handlePlayPlaylist}
      />
    </div>
  );
}
