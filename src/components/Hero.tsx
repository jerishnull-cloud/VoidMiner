import React from 'react';
import { Play, Sparkles, Youtube, ChevronDown, Flame, Shield, Swords } from 'lucide-react';
import { CHANNEL_CONFIG } from '../config/channelConfig';
import { Logo } from './Logo';

interface HeroProps {
  onExploreClick: () => void;
  subscriberCountFormatted?: string;
  isCurrentlyLive?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  subscriberCountFormatted = '124K',
  isCurrentlyLive = false,
}) => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {/* Deep dark purple radial aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-b from-[#7B00FF]/25 via-[#B026FF]/15 to-transparent blur-[120px] rounded-full" />
        
        {/* Subtle geometric grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#7B00FF15_1px,transparent_1px),linear-gradient(to_bottom,#7B00FF15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        {/* Ambient floating glowing light orbs */}
        <div className="absolute top-20 left-10 sm:left-1/4 w-3 h-3 bg-[#B026FF] rounded-full blur-[2px] animate-pulse" />
        <div className="absolute top-1/3 right-10 sm:right-1/4 w-4 h-4 bg-[#7B00FF] rounded-full blur-[3px] animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-[#D9B3FF] rounded-full blur-[2px] animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center z-10">
        {/* Live Broadcast / Creator Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#12001F]/80 border border-[#B026FF]/40 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(176,38,255,0.25)] hover:border-[#B026FF] transition-all">
          {isCurrentlyLive ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-heading uppercase tracking-wider text-red-300 font-bold">
                🔴 STREAMING LIVE ON YOUTUBE NOW
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#B026FF] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-mono-gaming uppercase tracking-widest text-[#D9B3FF]">
                Official Gaming Channel • {subscriberCountFormatted} SUBSCRIBERS
              </span>
            </>
          )}
        </div>

        {/* Official VOID miner Logo with subtle purple neon glow */}
        <div className="relative mb-6 group cursor-pointer flex justify-center">
          <div className="relative flex items-center justify-center">
            <Logo variant="hero" />
          </div>
        </div>

        {/* Typography / Channel Title */}
        <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-2 leading-none uppercase">
          VOID <span className="bg-gradient-to-r from-[#B026FF] via-[#D9B3FF] to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(176,38,255,0.6)]">miner</span>
        </h1>

        <p className="font-heading text-lg sm:text-2xl text-purple-200/90 font-semibold tracking-wider uppercase mb-4">
          Official Gaming Channel
        </p>

        {/* Exact Brief Tagline */}
        <p className="max-w-2xl text-base sm:text-xl text-gray-300 font-normal leading-relaxed mb-10">
          "Gaming. Minecraft. Challenges. Survival. And more."
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* WATCH ON YOUTUBE */}
          <a
            href={CHANNEL_CONFIG.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-heading font-bold text-base tracking-wider uppercase text-white bg-gradient-to-r from-red-600 via-[#7B00FF] to-[#B026FF] hover:from-red-500 hover:to-[#D9B3FF] shadow-[0_0_25px_rgba(176,38,255,0.5)] hover:shadow-[0_0_35px_rgba(176,38,255,0.8)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group active:scale-95"
          >
            <Youtube className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            <span>WATCH ON YOUTUBE</span>
          </a>

          {/* EXPLORE VIDEOS */}
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-heading font-bold text-base tracking-wider uppercase text-white bg-[#12001F]/80 hover:bg-[#12001F] border border-[#B026FF]/50 hover:border-[#B026FF] shadow-[0_0_15px_rgba(176,38,255,0.2)] hover:shadow-[0_0_25px_rgba(176,38,255,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group active:scale-95"
          >
            <Play className="w-5 h-5 text-[#B026FF] group-hover:text-white group-hover:scale-110 transition-transform" />
            <span>EXPLORE VIDEOS</span>
          </button>
        </div>

        {/* Feature Badges / Highlights */}
        <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl pt-8 border-t border-[#7B00FF]/20">
          <div className="flex flex-col items-center p-3 rounded-xl bg-[#12001F]/40 border border-purple-900/30">
            <Shield className="w-5 h-5 text-[#B026FF] mb-1" />
            <span className="font-heading font-bold text-xs sm:text-sm text-gray-200 uppercase">Hardcore 100 Days</span>
            <span className="text-[10px] font-mono-gaming text-purple-300/70">No Cheats • Pure Survival</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-[#12001F]/40 border border-purple-900/30">
            <Swords className="w-5 h-5 text-[#B026FF] mb-1" />
            <span className="font-heading font-bold text-xs sm:text-sm text-gray-200 uppercase">PvP & SMP</span>
            <span className="text-[10px] font-mono-gaming text-purple-300/70">Community Tournaments</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-[#12001F]/40 border border-purple-900/30">
            <Flame className="w-5 h-5 text-[#B026FF] mb-1" />
            <span className="font-heading font-bold text-xs sm:text-sm text-gray-200 uppercase">Void Challenges</span>
            <span className="text-[10px] font-mono-gaming text-purple-300/70">Mods & Chaos</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={onExploreClick}
          className="mt-10 text-purple-300/60 hover:text-[#B026FF] transition-colors flex flex-col items-center gap-1 group cursor-pointer"
          aria-label="Scroll to videos"
        >
          <span className="text-[11px] font-mono-gaming tracking-widest uppercase">Scroll Down</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-white" />
        </button>
      </div>
    </section>
  );
};
