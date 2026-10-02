export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  youtubeUrl?: string;
  publishedAt: string;
  avatarUrl: string;
  bannerUrl?: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  shortsCount: number;
  hiddenSubscriberCount: boolean;
}

export type VideoCategory = 'ALL' | 'VIDEOS' | 'SHORTS' | 'LIVE';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  publishedAtFormatted: string;
  thumbnail: string;
  duration?: string; // ISO 8601 string or mm:ss
  durationFormatted: string;
  durationSeconds?: number;
  viewCount: number;
  viewCountFormatted: string;
  likeCount?: number;
  likeCountFormatted?: string;
  commentCount?: number;
  category: 'VIDEOS' | 'SHORTS' | 'LIVE';
  subCategory?: string; // e.g. "Hardcore Survival", "PvP Challenge", "Mods Showcase"
  isShort: boolean;
  isLive: boolean;
  isCompletedLive?: boolean;
  liveViewerCount?: number;
  youtubeUrl: string;
  embedUrl: string;
}

export interface LiveStreamStatus {
  isCurrentlyLive: boolean;
  activeLiveVideo?: YouTubeVideo;
  upcomingLiveVideo?: YouTubeVideo;
  recentLiveVideos: YouTubeVideo[];
}

export interface ChannelStatsData {
  subscribers: number;
  subscribersFormatted: string;
  totalViews: number;
  totalViewsFormatted: string;
  videoCount: number;
  shortsCount: number;
  liveCount: number;
  lastUpdated: string;
}

export interface ChannelResponseData {
  channel: ChannelInfo;
  stats: ChannelStatsData;
  featuredVideo?: YouTubeVideo;
  videos: YouTubeVideo[];
  shorts: YouTubeVideo[];
  liveStatus: LiveStreamStatus;
  isLiveApi: boolean;
  lastSynced: string;
  error?: string;
}

export interface ApiStatus {
  configured: boolean;
  hasApiKey: boolean;
  hasChannelId: boolean;
  channelId: string;
  isLive: boolean;
  lastSyncTimestamp: number;
  cacheExpiresInSeconds: number;
  activeStreamCount: number;
  isPlaceholderKey?: boolean;
}
