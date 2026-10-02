import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// In-memory cache for YouTube API to avoid quota exhaustion
interface CacheStore {
  channelData: any | null;
  timestamp: number;
}

const cache: CacheStore = {
  channelData: null,
  timestamp: 0,
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// Helper functions for formatting
export function formatCompactNumber(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return '0';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString();
}

export function formatISODuration(isoDuration?: string): string {
  if (!isoDuration || isoDuration === 'P0D') return '0:00';
  if (!isoDuration.startsWith('PT')) return isoDuration;

  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return '0:00';

  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${minutes}:${formattedSeconds}`;
}

export function parseISODurationSeconds(isoDuration?: string): number {
  if (!isoDuration || isoDuration === 'P0D') return 0;
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
    return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
  } catch {
    return 'Recently';
  }
}

// Credentials reader with .env file fallback and sanitization
function getCredentials() {
  let apiKey = (process.env.YOUTUBE_API_KEY || '').trim();
  let channelId = (process.env.YOUTUBE_CHANNEL_ID || '').trim();

  // Try reading directly from .env file if available
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('YOUTUBE_API_KEY=')) {
          const val = trimmed.replace('YOUTUBE_API_KEY=', '').trim().replace(/^["']|["']$/g, '');
          if (val && !val.includes('YOUR_API_KEY')) apiKey = val;
        }
        if (trimmed.startsWith('YOUTUBE_CHANNEL_ID=')) {
          const val = trimmed.replace('YOUTUBE_CHANNEL_ID=', '').trim().replace(/^["']|["']$/g, '');
          if (val && !val.includes('YOUR_CHANNEL_ID')) channelId = val;
        }
      }
    } catch (err) {
      console.warn('Could not read .env directly:', err);
    }
  }

  // Clean quotes or stray prefixes
  apiKey = apiKey.replace(/^["']|["']$/g, '');
  channelId = channelId.replace(/^["']|["']$/g, '');

  return { apiKey, channelId };
}

// Detailed YouTube API fetcher
async function fetchYouTubeChannelData(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cache.channelData && (now - cache.timestamp < CACHE_TTL_MS)) {
    return { success: true, data: cache.channelData };
  }

  const { apiKey, channelId } = getCredentials();

  // Validate missing configuration
  if (!apiKey && !channelId) {
    const errorMsg = 'YouTube API error: Missing YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID in environment variables.';
    console.error(errorMsg);
    return { success: false, error: errorMsg, code: 'MISSING_ALL_CONFIG' };
  }

  if (!apiKey) {
    const errorMsg = 'YouTube API error: Missing YOUTUBE_API_KEY. Please provide a valid YouTube Data API v3 key.';
    console.error(errorMsg);
    return { success: false, error: errorMsg, code: 'MISSING_API_KEY' };
  }

  if (!channelId) {
    const errorMsg = 'YouTube API error: Missing YOUTUBE_CHANNEL_ID. Please provide your YouTube Channel ID.';
    console.error(errorMsg);
    return { success: false, error: errorMsg, code: 'MISSING_CHANNEL_ID' };
  }

  // 1. Fetch channel information
  const channelQueryParam = channelId.startsWith('@')
    ? `forHandle=${encodeURIComponent(channelId)}`
    : `id=${encodeURIComponent(channelId)}`;

  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&${channelQueryParam}&key=${encodeURIComponent(apiKey)}`;

  let channelRes: Response;
  try {
    channelRes = await fetch(channelUrl);
  } catch (netErr: any) {
    const errorMsg = `YouTube API error: Network connection failed (${netErr.message || 'Check server connection'})`;
    console.error(errorMsg);
    return { success: false, error: errorMsg, code: 'NETWORK_ERROR' };
  }

  if (!channelRes.ok) {
    let apiErrorDetail = '';
    try {
      const errJson = await channelRes.json();
      apiErrorDetail = errJson.error?.message || JSON.stringify(errJson);
    } catch {
      apiErrorDetail = await channelRes.text();
    }

    let detailedMessage = `YouTube API error (${channelRes.status}): ${apiErrorDetail}`;
    if (channelRes.status === 400) {
      detailedMessage = `YouTube API error (400): Bad Request. API key or Channel ID may be invalid or malformed (${apiErrorDetail})`;
    } else if (channelRes.status === 401) {
      detailedMessage = `YouTube API error (401): API key invalid. Please verify your YOUTUBE_API_KEY in Google Cloud Console.`;
    } else if (channelRes.status === 403) {
      if (apiErrorDetail.toLowerCase().includes('quota')) {
        detailedMessage = `YouTube API error (403): Quota exceeded. YouTube Data API v3 daily quota reached.`;
      } else if (apiErrorDetail.toLowerCase().includes('disabled') || apiErrorDetail.toLowerCase().includes('not enabled')) {
        detailedMessage = `YouTube API error (403): YouTube Data API v3 is not enabled in your Google Cloud Project. Please enable it in the API Console.`;
      } else {
        detailedMessage = `YouTube API error (403): API key restricted or forbidden (${apiErrorDetail}).`;
      }
    } else if (channelRes.status === 404) {
      detailedMessage = `YouTube API error (404): Channel not found with ID "${channelId}".`;
    }

    console.error(detailedMessage);
    return { success: false, error: detailedMessage, status: channelRes.status, code: 'API_ERROR' };
  }

  const channelJson = await channelRes.json();
  const channelItem = channelJson.items?.[0];

  if (!channelItem) {
    const errorMsg = `YouTube API error (404): No YouTube channel found with ID "${channelId}". Check your YOUTUBE_CHANNEL_ID.`;
    console.error(errorMsg);
    return { success: false, error: errorMsg, code: 'CHANNEL_NOT_FOUND' };
  }

  const snippet = channelItem.snippet || {};
  const stats = channelItem.statistics || {};
  const contentDetails = channelItem.contentDetails || {};
  const uploadsPlaylistId = contentDetails.relatedPlaylists?.uploads;

  const subscriberCount = parseInt(stats.subscriberCount || '0', 10);
  const viewCount = parseInt(stats.viewCount || '0', 10);
  const videoCount = parseInt(stats.videoCount || '0', 10);

  const channel = {
    id: channelItem.id,
    title: snippet.title || 'VoidMinerMC',
    description: snippet.description || '',
    customUrl: snippet.customUrl || '@VoidMINER00',
    youtubeUrl: 'https://www.youtube.com/@VoidMINER00',
    publishedAt: snippet.publishedAt || '',
    avatarUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '/images/void-miner-logo.png',
    subscriberCount,
    viewCount,
    videoCount,
    uploadsPlaylistId,
    hiddenSubscriberCount: stats.hiddenSubscriberCount || false,
  };

  // 2. Fetch uploaded videos using the uploads playlist
  let rawVideoIds: string[] = [];
  if (uploadsPlaylistId) {
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=20&key=${encodeURIComponent(apiKey)}`;
    try {
      const playlistRes = await fetch(playlistUrl);
      if (playlistRes.ok) {
        const playlistJson = await playlistRes.json();
        rawVideoIds = (playlistJson.items || []).map((item: any) => item.contentDetails?.videoId).filter(Boolean);
      } else {
        const playlistErrText = await playlistRes.text();
        console.error(`YouTube API playlistItems error (${playlistRes.status}): ${playlistErrText}`);
      }
    } catch (err: any) {
      console.error('Error fetching uploads playlist:', err);
    }
  }

  // 3. Get detailed video information (durations, views, live streaming details)
  let rawVideosList: any[] = [];
  if (rawVideoIds.length > 0) {
    const idsBatch = rawVideoIds.join(',');
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,liveStreamingDetails&id=${encodeURIComponent(idsBatch)}&key=${encodeURIComponent(apiKey)}`;
    try {
      const videoDetailsRes = await fetch(videoDetailsUrl);
      if (videoDetailsRes.ok) {
        const videoDetailsJson = await videoDetailsRes.json();
        rawVideosList = videoDetailsJson.items || [];
      } else {
        const vidErrText = await videoDetailsRes.text();
        console.error(`YouTube API videos details error (${videoDetailsRes.status}): ${vidErrText}`);
      }
    } catch (err: any) {
      console.error('Error fetching video details:', err);
    }
  }

  // 4. Check for active live broadcast
  let isCurrentlyLive = false;
  let activeLiveVideo: any = null;
  try {
    const liveSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channel.id)}&type=video&eventType=live&key=${encodeURIComponent(apiKey)}`;
    const liveRes = await fetch(liveSearchUrl);
    if (liveRes.ok) {
      const liveJson = await liveRes.json();
      const liveItem = liveJson.items?.[0];
      if (liveItem) {
        isCurrentlyLive = true;
        const liveId = liveItem.id?.videoId;
        activeLiveVideo = {
          id: liveId,
          title: liveItem.snippet?.title || 'LIVE STREAM',
          description: liveItem.snippet?.description || '',
          publishedAt: liveItem.snippet?.publishedAt || new Date().toISOString(),
          publishedAtFormatted: 'Live now',
          thumbnail: liveItem.snippet?.thumbnails?.maxres?.url || liveItem.snippet?.thumbnails?.high?.url || liveItem.snippet?.thumbnails?.medium?.url || liveItem.snippet?.thumbnails?.default?.url,
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
    }
  } catch (err: any) {
    console.error('Error checking live search:', err);
  }

  // 5. Categorize videos into regular videos, shorts, and live VODs
  const normalVideos: any[] = [];
  const shortsList: any[] = [];
  const completedLives: any[] = [];

  for (const item of rawVideosList) {
    const id = item.id;
    const snip = item.snippet || {};
    const itemStats = item.statistics || {};
    const cd = item.contentDetails || {};
    const liveDetails = item.liveStreamingDetails;

    const durationIso = cd.duration || '';
    const durationSeconds = parseISODurationSeconds(durationIso);
    const durationFormatted = formatISODuration(durationIso);
    const views = parseInt(itemStats.viewCount || '0', 10);
    const likes = itemStats.likeCount ? parseInt(itemStats.likeCount, 10) : undefined;
    const title = snip.title || '';
    const desc = snip.description || '';
    const publishedAt = snip.publishedAt || '';
    const publishedAtFormatted = formatRelativeDate(publishedAt);
    const thumb = snip.thumbnails?.maxres?.url || snip.thumbnails?.high?.url || snip.thumbnails?.medium?.url || snip.thumbnails?.default?.url;

    // Detect Shorts: duration <= 60 seconds (or title/description has #shorts)
    const hasShortTag = /#shorts\b/i.test(title) || /#shorts\b/i.test(desc);
    const isShortDuration = durationSeconds > 0 && durationSeconds <= 60;
    const isShort = hasShortTag || isShortDuration;

    // Live broadcast flag
    const isLiveBroadcast = snip.liveBroadcastContent === 'live';
    const isPastLive = !!liveDetails && !isLiveBroadcast;

    const videoObj = {
      id,
      title,
      description: desc,
      publishedAt,
      publishedAtFormatted,
      thumbnail: thumb,
      duration: durationIso,
      durationFormatted: isLiveBroadcast ? 'LIVE' : durationFormatted,
      durationSeconds,
      viewCount: views,
      viewCountFormatted: formatCompactNumber(views),
      likeCount: likes,
      likeCountFormatted: likes !== undefined ? formatCompactNumber(likes) : undefined,
      commentCount: itemStats.commentCount ? parseInt(itemStats.commentCount, 10) : undefined,
      category: isShort ? 'SHORTS' : (isLiveBroadcast || isPastLive ? 'LIVE' : 'VIDEOS'),
      subCategory: isShort ? 'Shorts' : (isPastLive ? 'Live Stream VOD' : 'Minecraft'),
      isShort,
      isLive: isLiveBroadcast,
      isCompletedLive: isPastLive,
      youtubeUrl: isShort ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    };

    if (isLiveBroadcast) {
      isCurrentlyLive = true;
      if (!activeLiveVideo) activeLiveVideo = videoObj;
    }

    if (isShort) {
      shortsList.push(videoObj);
    } else if (isPastLive) {
      completedLives.push(videoObj);
      normalVideos.push(videoObj);
    } else {
      normalVideos.push(videoObj);
    }
  }

  const resultData = {
    channel,
    stats: {
      subscribers: channel.subscriberCount,
      subscribersFormatted: formatCompactNumber(channel.subscriberCount),
      totalViews: channel.viewCount,
      totalViewsFormatted: formatCompactNumber(channel.viewCount),
      videoCount: channel.videoCount,
      shortsCount: shortsList.length,
      liveCount: completedLives.length + (isCurrentlyLive ? 1 : 0),
      lastUpdated: new Date().toLocaleTimeString(),
    },
    featuredVideo: normalVideos[0] || null,
    videos: normalVideos,
    shorts: shortsList,
    liveStatus: {
      isCurrentlyLive,
      activeLiveVideo: activeLiveVideo || null,
      recentLiveVideos: completedLives,
    },
    isLiveApi: true,
    lastSynced: new Date().toLocaleTimeString(),
  };

  cache.channelData = resultData;
  cache.timestamp = now;

  return { success: true, data: resultData };
}

// ==========================================
// API Routes
// ==========================================

// 1. /api/youtube/channel
app.get('/api/youtube/channel', async (req, res) => {
  const result = await fetchYouTubeChannelData(req.query.force === 'true');
  if (!result.success) {
    return res.status(result.status || 500).json({ error: result.error, code: result.code });
  }
  res.json({
    channel: result.data.channel,
    stats: result.data.stats,
    lastSynced: result.data.lastSynced,
  });
});

// 2. /api/youtube/videos
app.get('/api/youtube/videos', async (req, res) => {
  const result = await fetchYouTubeChannelData(req.query.force === 'true');
  if (!result.success) {
    return res.status(result.status || 500).json({ error: result.error, code: result.code });
  }
  res.json({
    videos: result.data.videos,
    shorts: result.data.shorts,
    featuredVideo: result.data.featuredVideo,
    totalVideosCount: result.data.videos.length + result.data.shorts.length,
  });
});

// 3. /api/youtube/live
app.get('/api/youtube/live', async (req, res) => {
  const result = await fetchYouTubeChannelData(req.query.force === 'true');
  if (!result.success) {
    return res.status(result.status || 500).json({ error: result.error, code: result.code });
  }
  res.json(result.data.liveStatus);
});

// 4. /api/youtube/data (Unified Data endpoint)
app.get('/api/youtube/data', async (req, res) => {
  const result = await fetchYouTubeChannelData(req.query.force === 'true');
  if (!result.success) {
    return res.status(result.status || 500).json({ error: result.error, code: result.code });
  }
  res.json(result.data);
});

// 5. /api/youtube/status (Environment & Configuration Health Check)
app.get('/api/youtube/status', (req, res) => {
  const { apiKey, channelId } = getCredentials();
  res.json({
    hasApiKey: Boolean(apiKey),
    hasChannelId: Boolean(channelId),
    channelId: channelId || 'MISSING_YOUTUBE_CHANNEL_ID',
    isLive: Boolean(apiKey && channelId),
    cached: Boolean(cache.channelData),
    lastSyncTimestamp: cache.timestamp,
    cacheExpiresInSeconds: Math.max(0, Math.round((CACHE_TTL_MS - (Date.now() - cache.timestamp)) / 1000)),
  });
});

// 6. /api/youtube/refresh (Manual Refresh)
app.post('/api/youtube/refresh', async (req, res) => {
  cache.channelData = null;
  cache.timestamp = 0;
  const result = await fetchYouTubeChannelData(true);
  if (!result.success) {
    return res.status(result.status || 500).json({ error: result.error, code: result.code });
  }
  res.json({ success: true, message: 'YouTube channel data refreshed', data: result.data });
});

// Vite Middleware integration in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[VOID miner] Server listening on http://0.0.0.0:${PORT} (Mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
