import React, { useEffect } from 'react';
import { X, ExternalLink, Eye, Calendar, ThumbsUp, Share2, Check } from 'lucide-react';
import { YouTubeVideo } from '../types/youtube';

interface VideoModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (video) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(video.youtubeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#12001F] border border-[#B026FF]/50 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(176,38,255,0.4)] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-900/40 bg-[#050507]/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B026FF] animate-pulse" />
            <span className="font-heading font-bold text-sm tracking-wide text-white uppercase truncate max-w-[280px] sm:max-w-md">
              {video.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Copy Video Link"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-purple-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono-gaming"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Embed (16:9 or Vertical for Shorts) */}
        <div className="relative w-full bg-black flex items-center justify-center">
          <div className={`w-full ${video.isShort ? 'aspect-[9/16] max-h-[60vh] max-w-sm mx-auto' : 'aspect-video'}`}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Bottom Details & Links */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#050507]/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              {video.title}
            </h3>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-red-600 to-[#B026FF] hover:from-red-500 hover:to-[#D9B3FF] shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <span>WATCH ON YOUTUBE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-gaming text-purple-300/80 pt-2 border-t border-purple-900/30">
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

            {video.subCategory && (
              <span className="px-2 py-0.5 rounded-full bg-[#7B00FF]/30 border border-[#B026FF]/40 text-[#D9B3FF] text-[10px] uppercase font-bold">
                {video.subCategory}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto pr-2">
            <p className="whitespace-pre-line">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
