import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Tv, 
  Radio, 
  Layers, 
  Search, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { YouTubeVideo } from '../types/youtube';
import { VideoCard } from './VideoCard';
import { ShortsCard } from './ShortsCard';
import { LiveStreamSection } from './LiveStreamSection';

interface ContentFeedProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  videos: YouTubeVideo[];
  shorts: YouTubeVideo[];
  liveStatus: any;
  loading: boolean;
  error?: string;
  lastSynced?: string;
  onRefresh: () => void;
  onPlayVideo: (video: YouTubeVideo) => void;
}

export const ContentFeed: React.FC<ContentFeedProps> = ({
  activeTab,
  onTabChange,
  videos,
  shorts,
  liveStatus,
  loading,
  error,
  lastSynced,
  onRefresh,
  onPlayVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');

  // Categories list
  const tabs = [
    { id: 'all', label: 'ALL CONTENT', icon: Layers, count: videos.length + shorts.length },
    { id: 'videos', label: 'VIDEOS', icon: Film, count: videos.length },
    { id: 'shorts', label: 'SHORTS', icon: Tv, count: shorts.length, badge: 'HOT' },
    { id: 'live', label: 'LIVE', icon: Radio, count: (liveStatus.recentLiveVideos?.length || 0) + (liveStatus.isCurrentlyLive ? 1 : 0), isLive: liveStatus.isCurrentlyLive },
  ];

  // Dynamic sub-category filters extracted from actual video tags/titles
  const subCategories = ['ALL', 'Minecraft Survival', 'Horror', 'Multiplayer', 'Soda SMP', 'Challenges'];

  // Filtered lists
  const filteredVideos = useMemo(() => {
    return videos.filter((vid) => {
      const matchesSearch = searchQuery === '' || 
        vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSub = selectedSubCategory === 'ALL' || 
        vid.title.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
        (vid.subCategory && vid.subCategory.toLowerCase().includes(selectedSubCategory.toLowerCase()));
      return matchesSearch && matchesSub;
    });
  }, [videos, searchQuery, selectedSubCategory]);

  const filteredShorts = useMemo(() => {
    return shorts.filter((sh) => {
      return searchQuery === '' || 
        sh.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sh.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [shorts, searchQuery]);

  return (
    <section id="content-feed" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Top Header Row with Refresh and Last Updated Time */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-wide flex items-center gap-2">
            Channel Uploads
            <span className="text-xs font-mono-gaming font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              ● Connected to YouTube Data API v3
            </span>
          </h2>
          <p className="text-xs font-mono-gaming text-purple-300/80 mt-1">
            Real uploads automatically fetched from the channel's uploads playlist
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastSynced && (
            <div className="flex items-center gap-1.5 text-xs font-mono-gaming text-gray-400">
              <Clock className="w-3.5 h-3.5 text-[#B026FF]" />
              <span>Last updated: <span className="text-white font-bold">{lastSynced}</span></span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-[#12001F] hover:bg-[#7B00FF]/30 border border-[#B026FF]/40 text-xs font-mono-gaming text-purple-200 hover:text-white transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#B026FF]' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Feed Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-[#7B00FF]/25">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-5 py-3 rounded-2xl font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7B00FF] to-[#B026FF] text-white shadow-[0_0_20px_rgba(176,38,255,0.45)]'
                    : 'bg-[#12001F]/60 border border-purple-900/40 text-gray-300 hover:text-white hover:border-[#B026FF]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-300'}`} />
                <span>{tab.label}</span>

                <span className={`text-xs px-2 py-0.5 rounded-full font-mono-gaming font-bold ${
                  isActive ? 'bg-black/30 text-white' : 'bg-[#050507] text-purple-300 border border-purple-900/40'
                }`}>
                  {tab.count}
                </span>

                {tab.isLive && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12001F]/80 border border-purple-900/60 focus:border-[#B026FF] focus:outline-none text-white text-xs font-mono-gaming placeholder:text-gray-500 transition-colors shadow-inner"
          />
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-white text-xs absolute right-3 top-1/2 -translate-y-1/2 font-mono"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Subcategory Pills (when viewing Videos or All) */}
      {(activeTab === 'videos' || activeTab === 'all') && (
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          <span className="text-xs font-mono-gaming text-purple-300/70 mr-1 flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {subCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedSubCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedSubCategory === cat
                  ? 'bg-[#B026FF]/30 border border-[#B026FF] text-white shadow-[0_0_12px_rgba(176,38,255,0.3)]'
                  : 'bg-[#050507]/60 border border-purple-900/30 text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Error Notice State (Specific YouTube API error) */}
      {error && (
        <div className="my-6 p-5 rounded-2xl bg-red-950/40 border-2 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <h4 className="font-heading font-bold text-sm uppercase text-red-300">
                YouTube API Error
              </h4>
              <p className="text-xs sm:text-sm text-red-200 font-mono-gaming mt-0.5">
                {error}
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>TRY AGAIN</span>
          </button>
        </div>
      )}

      {/* LOADING SKELETON STATE */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#12001F]/40 border border-purple-900/30 overflow-hidden p-4 space-y-4 animate-pulse">
              <div className="aspect-video bg-purple-900/20 rounded-xl" />
              <div className="h-5 bg-purple-900/30 rounded w-4/5" />
              <div className="h-3 bg-purple-900/20 rounded w-1/2" />
              <div className="h-8 bg-purple-900/20 rounded" />
            </div>
          ))}
        </div>
      ) : (
        /* CONTENT DISPLAY BASED ON TAB */
        <div className="pt-6">
          {/* TAB 1: ALL CONTENT */}
          {activeTab === 'all' && (
            <div className="space-y-16">
              {/* Top Normal Videos */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <Film className="w-5 h-5 text-[#B026FF]" />
                    <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                      Latest Videos ({videos.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => onTabChange('videos')}
                    className="text-xs font-mono-gaming text-[#D9B3FF] hover:text-white hover:underline uppercase"
                  >
                    View All Videos ({videos.length}) →
                  </button>
                </div>

                {filteredVideos.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl bg-[#12001F]/40 border border-purple-900/30">
                    <p className="text-gray-300 font-mono-gaming text-sm font-semibold">
                      No YouTube videos were returned.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                      <VideoCard key={video.id} video={video} onPlay={onPlayVideo} />
                    ))}
                  </div>
                )}
              </div>

              {/* Shorts Showcase Shelf if shorts available */}
              {shorts.length > 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#12001F]/50 border border-[#B026FF]/25 shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded-lg bg-[#B026FF] text-white">
                        <Flame className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                          YouTube Shorts ({shorts.length})
                        </h3>
                        <p className="text-xs text-purple-300 font-mono-gaming">
                          Short clips & highlights
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onTabChange('shorts')}
                      className="text-xs font-mono-gaming text-[#D9B3FF] hover:text-white hover:underline uppercase"
                    >
                      View All Shorts ({shorts.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {shorts.map((short) => (
                      <ShortsCard key={short.id} short={short} onPlay={onPlayVideo} />
                    ))}
                  </div>
                </div>
              )}

              {/* Live Streams Preview */}
              <LiveStreamSection liveStatus={liveStatus} onPlay={onPlayVideo} />
            </div>
          )}

          {/* TAB 2: VIDEOS ONLY */}
          {activeTab === 'videos' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
                    Full Videos
                  </h3>
                  <p className="text-xs font-mono-gaming text-purple-300/80">
                    Showing {filteredVideos.length} YouTube uploads
                  </p>
                </div>
              </div>

              {filteredVideos.length === 0 ? (
                <div className="text-center py-16 rounded-2xl bg-[#12001F]/40 border border-purple-900/30">
                  <p className="text-gray-300 font-mono-gaming text-sm font-semibold">
                    No YouTube videos were returned.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} onPlay={onPlayVideo} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHORTS ONLY */}
          {activeTab === 'shorts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B026FF] text-white font-heading font-black text-xs uppercase tracking-wider">
                      VERTICAL SHORTS
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mt-1">
                    YouTube Shorts
                  </h3>
                  <p className="text-xs font-mono-gaming text-purple-300/80">
                    Bite-sized clips ({filteredShorts.length})
                  </p>
                </div>
              </div>

              {filteredShorts.length === 0 ? (
                <div className="text-center py-16 rounded-2xl bg-[#12001F]/40 border border-purple-900/30">
                  <p className="text-gray-300 font-mono-gaming text-sm font-semibold">
                    No YouTube shorts were returned for this channel.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {filteredShorts.map((short) => (
                    <ShortsCard key={short.id} short={short} onPlay={onPlayVideo} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LIVE ONLY */}
          {activeTab === 'live' && (
            <LiveStreamSection liveStatus={liveStatus} onPlay={onPlayVideo} />
          )}
        </div>
      )}
    </section>
  );
};
