import { useState, useEffect, useCallback, useRef } from 'react';
import { ChannelResponseData, ApiStatus } from '../types/youtube';

export async function fetchChannelInfo(force = false) {
  const res = await fetch(`/api/youtube/channel${force ? '?force=true' : ''}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Failed to fetch channel info (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function fetchVideosList(force = false) {
  const res = await fetch(`/api/youtube/videos${force ? '?force=true' : ''}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Failed to fetch videos (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function fetchLiveStatus(force = false) {
  const res = await fetch(`/api/youtube/live${force ? '?force=true' : ''}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Failed to fetch live status (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function fetchYouTubeData(force = false): Promise<ChannelResponseData> {
  try {
    // Request API routes
    const [channelRes, videosRes, liveRes] = await Promise.all([
      fetchChannelInfo(force),
      fetchVideosList(force),
      fetchLiveStatus(force),
    ]);

    const channel = channelRes.channel;
    const stats = channelRes.stats;
    const videos = videosRes.videos || [];
    const shorts = videosRes.shorts || [];
    const featuredVideo = videosRes.featuredVideo || (videos.length > 0 ? videos[0] : null);
    const liveStatus = liveRes || { isCurrentlyLive: false, recentLiveVideos: [] };

    return {
      channel,
      stats: {
        subscribers: stats.subscribers,
        subscribersFormatted: stats.subscribersFormatted || stats.subscribers.toString(),
        totalViews: stats.totalViews,
        totalViewsFormatted: stats.totalViewsFormatted || stats.totalViews.toString(),
        videoCount: stats.videoCount,
        shortsCount: shorts.length,
        liveCount: liveStatus.recentLiveVideos?.length || 0,
        lastUpdated: channelRes.lastSynced || new Date().toLocaleTimeString(),
      },
      featuredVideo,
      videos,
      shorts,
      liveStatus,
      isLiveApi: true,
      lastSynced: channelRes.lastSynced || new Date().toLocaleTimeString(),
    };
  } catch (err: any) {
    console.error('fetchYouTubeData error:', err);
    return {
      channel: {
        id: '',
        title: 'VoidMinerMC',
        description: '',
        customUrl: '',
        publishedAt: '',
        avatarUrl: '/images/void-miner-logo.png',
        subscriberCount: 0,
        viewCount: 0,
        videoCount: 0,
        shortsCount: 0,
        hiddenSubscriberCount: false,
      },
      stats: {
        subscribers: 0,
        subscribersFormatted: '0',
        totalViews: 0,
        totalViewsFormatted: '0',
        videoCount: 0,
        shortsCount: 0,
        liveCount: 0,
        lastUpdated: new Date().toLocaleTimeString(),
      },
      videos: [],
      shorts: [],
      liveStatus: {
        isCurrentlyLive: false,
        recentLiveVideos: [],
      },
      isLiveApi: false,
      lastSynced: new Date().toLocaleTimeString(),
      error: err.message || 'Unable to connect to YouTube Data API',
    };
  }
}

export async function fetchApiStatus(): Promise<ApiStatus> {
  try {
    const res = await fetch('/api/youtube/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Status check failed:', err);
  }
  return {
    hasApiKey: false,
    hasChannelId: false,
    channelId: 'Loading...',
    isLive: false,
    lastSyncTimestamp: Date.now(),
    cacheExpiresInSeconds: 300,
    activeStreamCount: 0,
  };
}

export async function triggerManualRefresh(): Promise<ChannelResponseData> {
  try {
    const res = await fetch('/api/youtube/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      return fetchYouTubeData(true);
    }
  } catch (err) {
    console.error('Manual refresh failed:', err);
  }
  return fetchYouTubeData(true);
}

export async function updateRuntimeConfig(apiKey: string, channelId: string): Promise<{ success: boolean; isLiveApi: boolean; error?: string }> {
  try {
    const res = await fetch('/api/youtube/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, channelId }),
    });
    if (res.ok) {
      return { success: true, isLiveApi: true };
    }
    const err = await res.json().catch(() => ({ error: 'Failed to update' }));
    return { success: false, isLiveApi: false, error: err.error };
  } catch (err: any) {
    return { success: false, isLiveApi: false, error: err.message };
  }
}

export function useYouTubeData() {
  const [data, setData] = useState<ChannelResponseData | null>(null);
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const prevVideoCountRef = useRef<number | null>(null);
  const [newUploadDetected, setNewUploadDetected] = useState(false);

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [channelData, apiStatus] = await Promise.all([
        isManual ? triggerManualRefresh() : fetchYouTubeData(false),
        fetchApiStatus(),
      ]);

      if (prevVideoCountRef.current !== null && channelData.videos.length > prevVideoCountRef.current) {
        setNewUploadDetected(true);
        setTimeout(() => setNewUploadDetected(false), 8000);
      }
      prevVideoCountRef.current = channelData.videos.length;

      setData(channelData);
      setStatus(apiStatus);
    } catch (err) {
      console.error('loadData error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Periodic auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[Auto-Sync] Periodic YouTube API poll...');
      loadData(false);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  const refreshNow = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  return {
    data,
    status,
    loading,
    refreshing,
    newUploadDetected,
    refreshNow,
  };
}
