import React from 'react';
import { Play, Eye, Calendar, Clock, ThumbsUp, ExternalLink, Sparkles } from 'lucide-react';
import { YouTubeVideo } from '../types/youtube';

interface FeaturedVideoProps {
  video?: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
}

export const FeaturedVideo: React.FC<FeaturedVideoProps> = ({ video, onPlay }) => {
  if (!video) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-1.5 rounded-lg bg-[#B026FF]/20 border border-[#B026FF]/40 text-[#D9B3FF]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono-gaming uppercase tracking-widest text-[#B026FF]">
            LATEST PREMIERE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            Featured Video
          </h2>
        </div>
      </div>

      {/* Cinematic Featured Container */}
      <div className="relative rounded-3xl bg-[#12001F]/80 border border-[#B026FF]/40 overflow-hidden shadow-[0_20px_50px_rgba(18,0,31,0.9)] backdrop-blur-xl group">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7B00FF]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B026FF]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          {/* Left/Main: Cinematic Video Preview (Cols 1-7) */}
          <div className="lg:col-span-7 relative aspect-video overflow-hidden bg-black cursor-pointer group/media"
               onClick={() => onPlay(video)}>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transform group-hover/media:scale-105 transition-transform duration-700 opacity-90 group-hover/media:opacity-100"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#12001F]/90 hidden lg:block" />

            {/* Central Glowing Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#7B00FF] to-[#B026FF] rounded-full blur-xl opacity-70 group-hover/media:opacity-100 group-hover/media:scale-125 transition-all duration-300" />
                <button
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#7B00FF] to-[#B026FF] text-white flex items-center justify-center shadow-[0_0_30px_rgba(176,38,255,0.8)] border border-white/30 transform group-hover/media:scale-110 transition-transform duration-200"
                  aria-label="Play Featured Video"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              </div>
            </div>

            {/* Duration Tag */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono-gaming text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Clock className="w-3.5 h-3.5 text-[#B026FF]" />
              <span>{video.durationFormatted}</span>
            </div>

            {/* Category Tag */}
            {video.subCategory && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#7B00FF]/90 backdrop-blur-md border border-[#B026FF] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg">
                {video.subCategory}
              </div>
            )}
          </div>

          {/* Right: Video Information & Metadata (Cols 8-12) */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B026FF]/20 border border-[#B026FF]/50 text-[#D9B3FF] text-xs font-mono-gaming tracking-wide mb-3">
                <span className="w-2 h-2 rounded-full bg-[#B026FF] animate-ping" />
                <span>NEW RELEASE</span>
              </div>

              {/* Title */}
              <h3 
                onClick={() => onPlay(video)}
                className="font-heading text-2xl sm:text-3xl font-extrabold text-white hover:text-[#D9B3FF] transition-colors leading-tight cursor-pointer line-clamp-2"
              >
                {video.title}
              </h3>

              {/* Description Preview */}
              <p className="mt-3 text-sm sm:text-base text-gray-300 font-normal leading-relaxed line-clamp-3">
                {video.description}
              </p>
            </div>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-gaming text-purple-200/80 py-3 border-y border-[#7B00FF]/25">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#B026FF]" />
                <span className="text-white font-bold">{video.viewCountFormatted}</span> views
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{video.publishedAtFormatted}</span>
              </div>

              {video.likeCountFormatted && (
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-bold">{video.likeCountFormatted}</span> likes
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onPlay(video)}
                className="flex-1 py-3 px-6 rounded-xl font-heading font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#7B00FF] to-[#B026FF] hover:from-[#B026FF] hover:to-[#D9B3FF] shadow-[0_0_20px_rgba(176,38,255,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group active:scale-95"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>WATCH NOW</span>
              </button>

              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl font-heading font-bold text-sm tracking-wider uppercase text-purple-200 bg-[#050507] hover:bg-white/10 border border-purple-800 hover:border-[#B026FF] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>YOUTUBE</span>
                <ExternalLink className="w-4 h-4 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
