import { useState, useEffect, useCallback, useRef } from 'react';
import { ChannelResponseData, ApiStatus } from '../types/youtube';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => null) as { error?: string } | null;
  if (!response.ok) {
    throw new Error(body?.error || `Request failed with HTTP ${response.status}`);
  }
  if (body === null) throw new Error(`API returned invalid JSON for ${url}`);
  return body as T;
}

export async function fetchYouTubeData(force = false): Promise<ChannelResponseData> {
  try {
    return await fetchJson<ChannelResponseData>(`/api/youtube/data${force ? '?force=true' : ''}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to connect to YouTube Data API';
    if (import.meta.env.DEV) console.error('[YouTube API] Failed to load channel data:', error);
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
      error: message,
    };
  }
}

export async function fetchApiStatus(): Promise<ApiStatus> {
  try {
    return await fetchJson<ApiStatus>('/api/youtube/status');
  } catch (error) {
    if (import.meta.env.DEV) console.error('[YouTube API] Status check failed:', error);
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
  const response = await fetchJson<{ data: ChannelResponseData }>('/api/youtube/refresh', {
    method: 'POST',
  });
  return response.data;
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
