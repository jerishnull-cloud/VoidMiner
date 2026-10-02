import React from 'react';
import { Play, Eye, Calendar, Clock, ExternalLink } from 'lucide-react';
import { YouTubeVideo } from '../types/youtube';

interface VideoCardProps {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div className="group relative rounded-2xl bg-[#12001F]/60 border border-[#B026FF]/25 hover:border-[#B026FF] overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(176,38,255,0.35)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#B026FF] opacity-40 group-hover:opacity-100 transition-opacity z-10" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#B026FF] opacity-40 group-hover:opacity-100 transition-opacity z-10" />

      {/* Video Media Container */}
      <a 
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-video w-full overflow-hidden bg-black block cursor-pointer"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-70" />

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7B00FF] to-[#B026FF] text-white flex items-center justify-center shadow-[0_0_20px_rgba(176,38,255,0.9)] transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/20 text-white font-mono-gaming text-[11px] font-bold flex items-center gap-1 shadow">
          <Clock className="w-3 h-3 text-[#B026FF]" />
          <span>{video.durationFormatted}</span>
        </div>

        {/* Video ID Badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-[#B026FF]/60 text-purple-200 font-mono-gaming text-[10px] font-bold">
          ID: {video.id}
        </div>
      </a>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-base sm:text-lg font-bold text-white group-hover:text-[#D9B3FF] transition-colors line-clamp-2 leading-snug cursor-pointer mb-2 block"
          >
            {video.title}
          </a>

          {/* Description Preview */}
          <p className="text-xs text-gray-400 font-normal line-clamp-2 leading-relaxed mb-4">
            {video.description || 'Watch the latest Minecraft episode by VoidMinerMC.'}
          </p>
        </div>

        <div>
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs font-mono-gaming text-purple-300/80 pt-3 border-t border-purple-900/30 mb-4">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#B026FF]" />
              <span className="text-white font-semibold">{video.viewCountFormatted}</span> views
            </div>

            <div className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{video.publishedAtFormatted}</span>
            </div>
          </div>

          {/* Buttons: Watch on YouTube & Cinema Embed */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg font-heading font-bold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-red-600 to-[#B026FF] hover:from-red-500 hover:to-[#D9B3FF] shadow-[0_0_12px_rgba(176,38,255,0.35)] transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>WATCH</span>
            </a>

            <button
              onClick={() => onPlay(video)}
              className="w-full py-2 px-3 rounded-lg font-heading font-bold text-xs tracking-wider uppercase text-purple-300 hover:text-white bg-black/40 hover:bg-white/10 border border-purple-900/50 hover:border-[#B026FF] transition-all flex items-center justify-center gap-1.5"
            >
              <span>EMBED</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
