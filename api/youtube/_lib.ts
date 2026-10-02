import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ApiStatus, ChannelInfo, ChannelResponseData, YouTubeVideo } from '../../src/types/youtube';

const CACHE_TTL_MS = 5 * 60 * 1000;

type ApiHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;
type ApiResult = { status?: number; body: unknown };
type Operation = (req: IncomingMessage) => Promise<ApiResult>;
type ThumbnailSet = {
  default?: { url?: string };
  medium?: { url?: string };
  high?: { url?: string };
  maxres?: { url?: string };
};
type VideoSnippet = {
  title?: string;
  description?: string;
  publishedAt?: string;
  thumbnails?: ThumbnailSet;
  liveBroadcastContent?: string;
};
type YouTubeChannelItem = {
  id?: string;
  snippet?: VideoSnippet & { customUrl?: string };
  statistics?: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
    hiddenSubscriberCount?: boolean;
  };
  contentDetails?: { relatedPlaylists?: { uploads?: string } };
};
type YouTubePlaylistItem = { contentDetails?: { videoId?: string } };
type YouTubeVideoItem = {
  id?: string;
  snippet?: VideoSnippet;
  statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
  contentDetails?: { duration?: string };
  liveStreamingDetails?: Record<string, unknown>;
};
type YouTubeSearchItem = { id?: { videoId?: string }; snippet?: VideoSnippet };
type YouTubeResponse<T> = { items?: T[]; error?: { message?: string } };

export class YouTubeApiError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
    public readonly code = 'YOUTUBE_API_ERROR',
  ) {
    super(message);
    this.name = 'YouTubeApiError';
  }
}

let cachedData: ChannelResponseData | null = null;
let cacheTimestamp = 0;
let pendingRequest: Promise<ChannelResponseData> | null = null;

export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export function createApiHandler(method: 'GET' | 'POST', operation: Operation): ApiHandler {
  return async (req, res) => {
    if (req.method !== method) {
      res.setHeader('Allow', method);
      sendJson(res, 405, { error: `Method ${req.method || 'unknown'} not allowed`, code: 'METHOD_NOT_ALLOWED' });
      return;
    }

    try {
      const result = await operation(req);
      sendJson(res, result.status || 200, result.body);
    } catch (error) {
      const apiError = error instanceof YouTubeApiError
        ? error
        : new YouTubeApiError('Unexpected YouTube API failure.', 500, 'INTERNAL_ERROR');
      console.error(`[YouTube API] ${apiError.code}: ${apiError.message}`);
      sendJson(res, apiError.status, { error: apiError.message, code: apiError.code });
    }
  };
}

export function isForceRefresh(req: IncomingMessage): boolean {
  const url = new URL(req.url || '/', 'http://localhost');
  return url.searchParams.get('force') === 'true';
}

export function getApiStatus(): ApiStatus & { cached: boolean } {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim() || '';
  const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim() || '';
  const now = Date.now();

  return {
    hasApiKey: Boolean(apiKey),
    hasChannelId: Boolean(channelId),
    channelId: channelId || 'MISSING_YOUTUBE_CHANNEL_ID',
    isLive: Boolean(apiKey && channelId),
    lastSyncTimestamp: cacheTimestamp,
    cacheExpiresInSeconds: Math.max(0, Math.ceil((CACHE_TTL_MS - (now - cacheTimestamp)) / 1000)),
    activeStreamCount: cachedData?.liveStatus.isCurrentlyLive ? 1 : 0,
    cached: Boolean(cachedData),
  };
}

export async function fetchYouTubeChannelData(forceRefresh = false): Promise<ChannelResponseData> {
  const now = Date.now();
  if (!forceRefresh && cachedData && now - cacheTimestamp < CACHE_TTL_MS) return cachedData;
  if (!forceRefresh && pendingRequest) return pendingRequest;

  const request = loadYouTubeChannelData();
  pendingRequest = request;
  try {
    const data = await request;
    cachedData = data;
    cacheTimestamp = Date.now();
    return data;
  } finally {
    if (pendingRequest === request) pendingRequest = null;
  }
}

export function invalidateYouTubeCache(): void {
  cachedData = null;
  cacheTimestamp = 0;
}

export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0';
  if (value >= 1_000_000_000) return `${trimDecimal(value / 1_000_000_000)}B`;
  if (value >= 1_000_000) return `${trimDecimal(value / 1_000_000)}M`;
  if (value >= 1_000) return `${trimDecimal(value / 1_000)}K`;
  return value.toLocaleString();
}

function trimDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

function numeric(value?: string): number {
  const parsed = Number.parseInt(value || '0', 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function thumbnailUrl(thumbnails: ThumbnailSet | undefined, videoId?: string): string {
  return thumbnails?.maxres?.url
    || thumbnails?.high?.url
    || thumbnails?.medium?.url
    || thumbnails?.default?.url
    || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '');
}

function formatDuration(isoDuration?: string): string {
  const seconds = parseDurationSeconds(isoDuration);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${paddedSeconds}`;
  return `${minutes}:${paddedSeconds}`;
}

function parseDurationSeconds(isoDuration?: string): number {
  const matches = isoDuration?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!matches) return 0;
  return numeric(matches[1]) * 3600 + numeric(matches[2]) * 60 + numeric(matches[3]);
}

function formatRelativeDate(isoDate: string): string {
  const published = new Date(isoDate).getTime();
  if (!Number.isFinite(published)) return 'Recently';

  const diffSeconds = Math.max(0, Math.floor((Date.now() - published) / 1000));
  if (diffSeconds < 60) return 'Just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
}

async function youtubeRequest<T>(
  resource: string,
  params: Record<string, string>,
  apiKey: string,
): Promise<YouTubeResponse<T>> {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set('key', apiKey);

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new YouTubeApiError('YouTube API network request failed.', 502, 'NETWORK_ERROR');
  }

  let payload: YouTubeResponse<T> = {};
  try {
    payload = await response.json() as YouTubeResponse<T>;
  } catch {
    if (!response.ok) {
      throw new YouTubeApiError(`YouTube API request failed with HTTP ${response.status}.`, response.status, 'API_ERROR');
    }
  }

  if (!response.ok) {
    const detail = payload.error?.message || `HTTP ${response.status}`;
    const safeDetail = apiKey ? detail.split(apiKey).join('[redacted]') : detail;
    let message = `YouTube API error (${response.status}): ${safeDetail}`;
    if (response.status === 403 && /quota/i.test(detail)) {
      message = 'YouTube API error (403): YouTube Data API quota exceeded.';
    } else if (response.status === 401) {
      message = 'YouTube API error (401): The configured YouTube API key is invalid.';
    } else if (response.status === 403 && /disabled|not enabled/i.test(detail)) {
      message = 'YouTube API error (403): YouTube Data API v3 is not enabled for this Google Cloud project.';
    }
    throw new YouTubeApiError(message, response.status, 'API_ERROR');
  }

  return payload;
}

async function loadYouTubeChannelData(): Promise<ChannelResponseData> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim() || '';
  const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim() || '';

  if (!apiKey || !channelId) {
    const missing = [!apiKey && 'YOUTUBE_API_KEY', !channelId && 'YOUTUBE_CHANNEL_ID'].filter(Boolean).join(' and ');
    throw new YouTubeApiError(`Missing required server environment variable${missing.includes(' and ') ? 's' : ''}: ${missing}.`, 500, 'MISSING_CONFIG');
  }

  const channelParams: Record<string, string> = { part: 'snippet,contentDetails,statistics' };
  if (channelId.startsWith('@')) channelParams.forHandle = channelId;
  else channelParams.id = channelId;

  const channelResponse = await youtubeRequest<YouTubeChannelItem>('channels', channelParams, apiKey);
  const channelItem = channelResponse.items?.[0];
  if (!channelItem?.id) {
    throw new YouTubeApiError(`No YouTube channel was found for YOUTUBE_CHANNEL_ID "${channelId}".`, 404, 'CHANNEL_NOT_FOUND');
  }

  const snippet = channelItem.snippet || {};
  const youtubeStats = channelItem.statistics || {};
  const subscriberCount = numeric(youtubeStats.subscriberCount);
  const viewCount = numeric(youtubeStats.viewCount);
  const videoCount = numeric(youtubeStats.videoCount);
  const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;

  const channel: ChannelInfo = {
    id: channelItem.id,
    title: snippet.title || 'VoidMinerMC',
    description: snippet.description || '',
    customUrl: snippet.customUrl || '@VoidMINER00',
    youtubeUrl: 'https://www.youtube.com/@VoidMINER00',
    publishedAt: snippet.publishedAt || '',
    avatarUrl: thumbnailUrl(snippet.thumbnails) || '/images/void-miner-logo.png',
    subscriberCount,
    viewCount,
    videoCount,
    shortsCount: 0,
    hiddenSubscriberCount: youtubeStats.hiddenSubscriberCount || false,
  };

  let videoIds: string[] = [];
  if (uploadsPlaylistId) {
    const playlistResponse = await youtubeRequest<YouTubePlaylistItem>('playlistItems', {
      part: 'snippet,contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: '20',
    }, apiKey);
    videoIds = (playlistResponse.items || [])
      .map(item => item.contentDetails?.videoId)
      .filter((id): id is string => Boolean(id));
  }

  const [videosResponse, liveResponse] = await Promise.all([
    videoIds.length > 0
      ? youtubeRequest<YouTubeVideoItem>('videos', {
        part: 'snippet,contentDetails,statistics,liveStreamingDetails',
        id: videoIds.join(','),
      }, apiKey)
      : Promise.resolve({ items: [] } as YouTubeResponse<YouTubeVideoItem>),
    youtubeRequest<YouTubeSearchItem>('search', {
      part: 'snippet',
      channelId: channel.id,
      type: 'video',
      eventType: 'live',
      maxResults: '1',
    }, apiKey),
  ]);

  const shorts: YouTubeVideo[] = [];
  const videos: YouTubeVideo[] = [];
  const completedLives: YouTubeVideo[] = [];
  let isCurrentlyLive = false;
  let activeLiveVideo: YouTubeVideo | undefined;

  for (const item of videosResponse.items || []) {
    if (!item.id) continue;
    const videoSnippet = item.snippet || {};
    const videoStats = item.statistics || {};
    const duration = item.contentDetails?.duration || '';
    const durationSeconds = parseDurationSeconds(duration);
    const title = videoSnippet.title || '';
    const description = videoSnippet.description || '';
    const isShort = /#shorts\b/i.test(title)
      || /#shorts\b/i.test(description)
      || (durationSeconds > 0 && durationSeconds <= 60);
    const isLive = videoSnippet.liveBroadcastContent === 'live';
    const isCompletedLive = Boolean(item.liveStreamingDetails) && !isLive;
    const viewCount = numeric(videoStats.viewCount);
    const likeCount = videoStats.likeCount === undefined ? undefined : numeric(videoStats.likeCount);
    const video: YouTubeVideo = {
      id: item.id,
      title,
      description,
      publishedAt: videoSnippet.publishedAt || '',
      publishedAtFormatted: formatRelativeDate(videoSnippet.publishedAt || ''),
      thumbnail: thumbnailUrl(videoSnippet.thumbnails, item.id),
      duration,
      durationFormatted: isLive ? 'LIVE' : formatDuration(duration),
      durationSeconds,
      viewCount,
      viewCountFormatted: formatCompactNumber(viewCount),
      likeCount,
      likeCountFormatted: likeCount === undefined ? undefined : formatCompactNumber(likeCount),
      commentCount: videoStats.commentCount === undefined ? undefined : numeric(videoStats.commentCount),
      category: isShort ? 'SHORTS' : (isLive || isCompletedLive ? 'LIVE' : 'VIDEOS'),
      subCategory: isShort ? 'Shorts' : (isCompletedLive ? 'Live Stream VOD' : 'Minecraft'),
      isShort,
      isLive,
      isCompletedLive,
      youtubeUrl: isShort
        ? `https://www.youtube.com/shorts/${item.id}`
        : `https://www.youtube.com/watch?v=${item.id}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${item.id}`,
    };

    if (isLive) {
      isCurrentlyLive = true;
      activeLiveVideo ||= video;
    }
    if (isShort) shorts.push(video);
    else {
      videos.push(video);
      if (isCompletedLive) completedLives.push(video);
    }
  }

  const liveItem = liveResponse.items?.[0];
  const liveId = liveItem?.id?.videoId;
  if (liveId && !activeLiveVideo) {
    isCurrentlyLive = true;
    const liveSnippet = liveItem.snippet || {};
    activeLiveVideo = {
      id: liveId,
      title: liveSnippet.title || 'LIVE STREAM',
      description: liveSnippet.description || '',
      publishedAt: liveSnippet.publishedAt || new Date().toISOString(),
      publishedAtFormatted: 'Live now',
      thumbnail: thumbnailUrl(liveSnippet.thumbnails, liveId),
      durationFormatted: 'LIVE',
      viewCount: 0,
      viewCountFormatted: 'Streaming',
      category: 'LIVE',
      isShort: false,
      isLive: true,
      youtubeUrl: `https://www.youtube.com/watch?v=${liveId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${liveId}?autoplay=1`,
    };
  }

  const lastSynced = new Date().toISOString();
  channel.shortsCount = shorts.length;
  return {
    channel,
    stats: {
      subscribers: subscriberCount,
      subscribersFormatted: formatCompactNumber(subscriberCount),
      totalViews: viewCount,
      totalViewsFormatted: formatCompactNumber(viewCount),
      videoCount,
      shortsCount: shorts.length,
      liveCount: completedLives.length + (isCurrentlyLive ? 1 : 0),
      lastUpdated: lastSynced,
    },
    featuredVideo: videos[0] || null,
    videos,
    shorts,
    liveStatus: {
      isCurrentlyLive,
      activeLiveVideo,
      recentLiveVideos: completedLives,
    },
    isLiveApi: true,
    lastSynced,
  };
}
