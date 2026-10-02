import React from 'react';
import { Play, Eye, Calendar, Flame, ExternalLink } from 'lucide-react';
import { YouTubeVideo } from '../types/youtube';

interface ShortsCardProps {
  short: YouTubeVideo;
  onPlay: (short: YouTubeVideo) => void;
}

export const ShortsCard: React.FC<ShortsCardProps> = ({ short, onPlay }) => {
  const shortUrl = short.isShort 
    ? `https://www.youtube.com/shorts/${short.id}` 
    : `https://www.youtube.com/watch?v=${short.id}`;

  return (
    <div className="group relative rounded-2xl bg-[#12001F]/70 border border-[#B026FF]/25 hover:border-[#B026FF] overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(176,38,255,0.4)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5 select-none">
      {/* Vertical Media Container (9:16 Aspect Ratio) */}
      <a 
        href={shortUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[9/16] w-full overflow-hidden bg-black block cursor-pointer"
      >
        <img
          src={short.thumbnail}
          alt={short.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Ambient Gradient Shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/40" />

        {/* Purple Glowing "SHORTS" Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#B026FF] text-white font-heading font-black text-[11px] tracking-wider uppercase flex items-center gap-1 shadow-[0_0_12px_rgba(176,38,255,0.8)] border border-white/30">
          <Flame className="w-3 h-3 fill-current text-amber-200" />
          <span>SHORTS</span>
        </div>

        {/* Duration badge & ID */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {short.durationFormatted && (
            <div className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-white/20 text-white font-mono-gaming text-[10px] font-bold">
              {short.durationFormatted}
            </div>
          )}
        </div>

        {/* Hover Center Play Circle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7B00FF] to-[#B026FF] text-white flex items-center justify-center shadow-[0_0_25px_rgba(176,38,255,0.9)] border border-white/40 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Overlay Content at bottom of vertical card */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#050507] via-[#050507]/90 to-transparent">
          <h3 className="font-heading text-sm sm:text-base font-bold text-white group-hover:text-[#D9B3FF] line-clamp-2 leading-snug mb-2.5 transition-colors">
            {short.title}
          </h3>

          <div className="flex items-center justify-between text-[11px] font-mono-gaming text-purple-200/90 pt-2 border-t border-purple-800/40">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#B026FF]" />
              <span className="font-bold text-white">{short.viewCountFormatted}</span>
            </div>

            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{short.publishedAtFormatted}</span>
            </div>
          </div>
        </div>
      </a>

      {/* Action Footer */}
      <div className="p-2.5 bg-[#050507]/80 border-t border-purple-900/30 flex items-center gap-2">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-1.5 rounded-lg font-heading font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-[#B026FF] hover:from-red-500 hover:to-[#D9B3FF] transition-all flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(176,38,255,0.3)]"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>WATCH</span>
        </a>

        <button
          onClick={() => onPlay(short)}
          title="Watch in Cinema Player"
          aria-label="Embed Player"
          className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-purple-800 hover:border-[#B026FF] text-purple-300 hover:text-white transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
