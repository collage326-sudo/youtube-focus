export interface Video {
  id: string; // YouTube Video ID
  title: string;
  description: string;
  channelTitle: string;
  category: string;
  duration: string;
  thumbnailUrl: string;
}

export interface Note {
  id: string;
  videoId: string;
  timestamp: number; // in seconds
  content: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  videoIds: string[];
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  date: string;
  durationMinutes: number;
}

export interface UserProgress {
  watchedVideoIds: string[]; // completed video IDs
  videoWatchTime: { [videoId: string]: number }; // seconds watched per video
  totalStudyTime: number; // in minutes
  streakDays: number;
  lastStudyDate: string; // YYYY-MM-DD
  notesWrittenCount: number;
  completedVideosCount: number;
  pomodoroSessions: PomodoroSession[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  videoId: string;
  front: string;
  back: string;
}
