import React from "react";
import { Video } from "../types";
import { Play, Clock } from "lucide-react";
import { motion } from "motion/react";

interface VideoCardProps {
  key?: any;
  video: Video;
  onPlay: (video: Video) => void;
  isCompleted?: boolean;
}

export default function VideoCard({ video, onPlay, isCompleted }: VideoCardProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="bento-card-interactive group"
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail Aspect frame */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-[1.15rem] bg-slate-950">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-3.5 rounded-full bg-teal-500 text-white shadow-xl scale-95 group-hover:scale-100 transition-all duration-300">
            <Play className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {video.duration}
        </span>

        {/* Completion indicator */}
        {isCompleted && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-900/40 text-[9px] font-bold uppercase tracking-wider shadow-lg">
            ✓ Finished
          </span>
        )}
      </div>

      {/* Video metadata */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-teal-950 text-teal-400 border border-teal-900/50">
              {video.category}
            </span>
            <span className="text-[10px] text-slate-500 font-medium truncate">
              {video.channelTitle}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-teal-400 transition-colors">
            {video.title}
          </h3>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2">
          {video.description}
        </p>
      </div>
    </motion.div>
  );
}
