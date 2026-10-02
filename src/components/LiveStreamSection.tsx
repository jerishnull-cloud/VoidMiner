import React from 'react';
import { Radio, Users, Play, Calendar, Bell, ExternalLink, Sparkles, Clock } from 'lucide-react';
import { LiveStreamStatus, YouTubeVideo } from '../types/youtube';
import { CHANNEL_CONFIG } from '../config/channelConfig';

interface LiveStreamSectionProps {
  liveStatus: LiveStreamStatus;
  onPlay: (video: YouTubeVideo) => void;
}

export const LiveStreamSection: React.FC<LiveStreamSectionProps> = ({ liveStatus, onPlay }) => {
  const { isCurrentlyLive, activeLiveVideo, recentLiveVideos } = liveStatus;

  return (
    <section id="live" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-[#7B00FF]/25 gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${isCurrentlyLive ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-[#12001F] border-[#B026FF]/40 text-[#B026FF]'}`}>
            <Radio className={`w-6 h-6 ${isCurrentlyLive ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-gaming uppercase tracking-widest text-purple-300">
                BROADCAST HUB
              </span>
              {isCurrentlyLive && (
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] tracking-wider uppercase animate-pulse">
                  🔴 LIVE NOW
                </span>
              )}
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-white">
              Live Streams & VODs
            </h2>
          </div>
        </div>

        {/* Channel Schedule / Notification CTA */}
        <div className="flex items-center gap-3">
          <a
            href={CHANNEL_CONFIG.socials.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#12001F] border border-[#B026FF]/30 hover:border-[#B026FF] text-xs font-mono-gaming text-purple-200 hover:text-white transition-all flex items-center gap-2"
          >
            <Bell className="w-4 h-4 text-[#B026FF]" />
            <span>Stream Alerts on Discord</span>
          </a>
        </div>
      </div>

      {/* ACTIVE LIVE STREAM CARD (If currently streaming) */}
      {isCurrentlyLive && activeLiveVideo ? (
        <div className="relative mb-12 rounded-3xl bg-gradient-to-br from-[#12001F] via-[#20002A] to-[#050507] border-2 border-red-500/60 p-6 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(239,68,68,0.35)] backdrop-blur-2xl">
          {/* Animated red ping ring */}
          <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/30 border border-red-500 text-red-300">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="font-heading font-black text-xs tracking-wider uppercase text-white">
              BROADCASTING LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Live Stream Media Preview */}
            <div 
              onClick={() => onPlay(activeLiveVideo)}
              className="lg:col-span-7 relative aspect-video rounded-2xl overflow-hidden bg-black border border-red-500/40 shadow-2xl cursor-pointer group"
            >
              <img
                src={activeLiveVideo.thumbnail}
                alt={activeLiveVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.8)] border-2 border-white/60 transform group-hover:scale-110 transition-transform"
                  aria-label="Watch Live Broadcast"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              </div>

              {activeLiveVideo.liveViewerCount !== undefined && activeLiveVideo.liveViewerCount > 0 && (
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-red-500/50 text-white font-mono-gaming text-xs font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-400" />
                  <span>{activeLiveVideo.liveViewerCount.toLocaleString()} Viewers</span>
                </div>
              )}
            </div>

            {/* Live Stream Info */}
            <div className="lg:col-span-5 space-y-5">
              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {activeLiveVideo.title}
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-4">
                {activeLiveVideo.description || 'VOID miner is currently streaming Minecraft on YouTube. Hop into the stream, chat with the community, and witness the action live!'}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <button
                  onClick={() => onPlay(activeLiveVideo)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-heading font-black text-sm tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>WATCH LIVE NOW</span>
                </button>

                <a
                  href={activeLiveVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-heading font-bold text-sm tracking-wider uppercase text-purple-200 bg-[#050507] hover:bg-white/10 border border-purple-800 hover:border-[#B026FF] transition-all flex items-center justify-center gap-2"
                >
                  <span>OPEN ON YOUTUBE</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* NO ACTIVE STREAM CARD */
        <div className="relative mb-12 rounded-3xl bg-[#12001F]/60 border border-[#B026FF]/25 p-8 sm:p-12 text-center backdrop-blur-xl shadow-[0_10px_35px_rgba(18,0,31,0.8)] overflow-hidden">
          {/* Subtle radar pulse effect */}
          <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#B026FF]/30 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute -inset-2 rounded-full border border-[#7B00FF]/20 animate-ping delay-500" style={{ animationDuration: '4s' }} />
            <div className="relative w-16 h-16 rounded-2xl bg-[#050507] border border-[#B026FF]/60 flex items-center justify-center shadow-[0_0_20px_rgba(176,38,255,0.4)]">
              <Radio className="w-8 h-8 text-[#B026FF]" />
            </div>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-2">
            NO ACTIVE STREAM
          </h3>

          <p className="max-w-md mx-auto text-sm sm:text-base text-purple-200/80 mb-6">
            Check back later for the next live stream. We regularly stream Minecraft Hardcore challenges, SMP survival, and community PvP tournaments.
          </p>

          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#050507]/80 border border-purple-800 text-xs font-mono-gaming text-purple-300">
            <Sparkles className="w-4 h-4 text-[#B026FF]" />
            <span>Turn on YouTube notifications (🔔) to get notified instantly when we go live!</span>
          </div>
        </div>
      )}

      {/* COMPLETED LIVE STREAMS / VODS */}
      {recentLiveVideos && recentLiveVideos.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#B026FF]" />
            <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              Recent Completed Live Streams (VODs)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentLiveVideos.map((vod) => (
              <div
                key={vod.id}
                className="group relative rounded-2xl bg-[#12001F]/50 border border-[#B026FF]/20 hover:border-[#B026FF] overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(176,38,255,0.3)] transition-all duration-300 flex flex-col justify-between"
              >
                <div 
                  onClick={() => onPlay(vod)}
                  className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
                >
                  <img
                    src={vod.thumbnail}
                    alt={vod.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-80" />

                  {/* VOD Tag */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-purple-900/90 border border-[#B026FF] text-white font-mono-gaming text-[10px] font-bold uppercase">
                    STREAM REPLAY
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 border border-white/20 text-white font-mono-gaming text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#B026FF]" />
                    <span>{vod.durationFormatted}</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#B026FF] text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h4 
                      onClick={() => onPlay(vod)}
                      className="font-heading text-lg font-bold text-white group-hover:text-[#D9B3FF] line-clamp-2 leading-snug cursor-pointer mb-2"
                    >
                      {vod.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {vod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-purple-900/30 text-xs font-mono-gaming text-purple-300">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#B026FF]" />
                      <span>{vod.viewCountFormatted} views</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{vod.publishedAtFormatted}</span>
                    </div>

                    <a
                      href={vod.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-white flex items-center gap-1"
                    >
                      <span>VOD</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
