import React, { useState, useEffect } from 'react';
import { Users, Eye, Video, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChannelStatsData } from '../types/youtube';
import { CHANNEL_CONFIG } from '../config/channelConfig';

interface ChannelStatsProps {
  stats: ChannelStatsData;
  isLiveApi?: boolean;
}

// Custom animated counter hook
function useAnimatedCounter(endValue: number, durationMs = 1500): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!endValue || isNaN(endValue)) {
      setCount(0);
      return;
    }

    let startTimestamp: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * (endValue - startValue) + startValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [endValue, durationMs]);

  return count;
}

export const ChannelStats: React.FC<ChannelStatsProps> = ({ stats, isLiveApi = false }) => {
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // Animated values
  const animatedSubs = useAnimatedCounter(stats.subscribers);
  const animatedViews = useAnimatedCounter(stats.totalViews);
  const animatedVideos = useAnimatedCounter(stats.videoCount);
  const animatedShorts = useAnimatedCounter(stats.shortsCount);

  const formatDisplay = (val: number, formattedFallback: string) => {
    if (val === 0 && formattedFallback) return formattedFallback;
    if (val >= 1000000000) return (val / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return val.toLocaleString();
  };

  const handleSubscribeClick = () => {
    setHasSubscribed(true);
    // Fire festive purple & gold confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B026FF', '#7B00FF', '#D9B3FF', '#FFFFFF', '#FFD700'],
    });

    // Open actual channel in new tab
    window.open(CHANNEL_CONFIG.socials.youtube + '?sub_confirmation=1', '_blank', 'noopener,noreferrer');
  };

  const statItems = [
    {
      id: 'subscribers',
      label: 'SUBSCRIBERS',
      rawValue: stats.subscribers,
      formattedValue: formatDisplay(animatedSubs, stats.subscribersFormatted),
      icon: Users,
      color: 'from-[#7B00FF] to-[#B026FF]',
      textColor: 'text-[#D9B3FF]',
      borderGlow: 'hover:border-[#B026FF]',
    },
    {
      id: 'views',
      label: 'TOTAL VIEWS',
      rawValue: stats.totalViews,
      formattedValue: formatDisplay(animatedViews, stats.totalViewsFormatted),
      icon: Eye,
      color: 'from-[#B026FF] to-[#D9B3FF]',
      textColor: 'text-purple-200',
      borderGlow: 'hover:border-[#D9B3FF]',
    },
    {
      id: 'videos',
      label: 'VIDEOS',
      rawValue: stats.videoCount,
      formattedValue: animatedVideos ? animatedVideos.toString() : stats.videoCount.toString(),
      icon: Video,
      color: 'from-[#4B0082] to-[#7B00FF]',
      textColor: 'text-white',
      borderGlow: 'hover:border-[#7B00FF]',
    },
    {
      id: 'shorts',
      label: 'SHORTS',
      rawValue: stats.shortsCount,
      formattedValue: animatedShorts ? animatedShorts.toString() : stats.shortsCount.toString(),
      icon: Flame,
      color: 'from-[#B026FF] to-red-500',
      textColor: 'text-red-300',
      borderGlow: 'hover:border-red-500',
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-20 -mt-8 sm:-mt-12">
      {/* Container with Glassmorphism HUD Style */}
      <div className="relative rounded-3xl bg-[#12001F]/70 border border-[#B026FF]/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_15px_40px_rgba(18,0,31,0.9)] overflow-hidden">
        {/* Subtle grid and decorative lighting */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-l from-[#B026FF]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-40 bg-gradient-to-r from-[#7B00FF]/20 to-transparent blur-3xl pointer-events-none" />

        {/* Top Header Row: Status & Subscribe CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-[#7B00FF]/25 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveApi ? 'bg-emerald-400' : 'bg-[#B026FF]'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLiveApi ? 'bg-emerald-500' : 'bg-[#B026FF]'}`}></span>
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
                Channel Statistics
                <span className="text-[11px] font-mono-gaming normal-case px-2.5 py-0.5 rounded-full bg-white/5 border border-purple-500/30 text-purple-200">
                  {isLiveApi ? '● Live YouTube API' : '● Verified Sync'}
                </span>
              </h2>
              <p className="text-xs text-purple-300/70 font-mono-gaming">
                Real-time metrics updated directly from YouTube Data API
              </p>
            </div>
          </div>

          {/* Quick Subscribe Button with Confetti */}
          <button
            onClick={handleSubscribeClick}
            className={`px-5 py-2.5 rounded-xl font-heading font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all duration-300 shadow-md ${
              hasSubscribed
                ? 'bg-emerald-600/90 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] active:scale-95'
            }`}
          >
            {hasSubscribed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>SUBSCRIBED!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>SUBSCRIBE TO VOID MINER</span>
              </>
            )}
          </button>
        </div>

        {/* 4-Column Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`relative group p-5 rounded-2xl bg-[#050507]/60 border border-white/10 ${item.borderGlow} transition-all duration-300 hover:scale-[1.02] hover:bg-[#12001F]/80 shadow-inner flex flex-col justify-between`}
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#B026FF] rounded-tl-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#B026FF] rounded-br-sm opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-heading font-bold tracking-widest uppercase text-gray-400 group-hover:text-purple-300 transition-colors">
                    {item.label}
                  </span>
                  <div className="p-2 rounded-lg bg-white/5 border border-purple-500/20 text-purple-300 group-hover:text-white group-hover:bg-[#B026FF]/20 group-hover:border-[#B026FF]/50 transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${item.textColor} drop-shadow-[0_0_15px_rgba(176,38,255,0.3)]`}>
                    {item.formattedValue}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono-gaming text-gray-500 group-hover:text-purple-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B026FF]" />
                  <span>Real-time counter</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
