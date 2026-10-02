import { createApiHandler, fetchYouTubeChannelData, isForceRefresh } from '../../server/youtube.js';

export default createApiHandler('GET', async req => {
  const data = await fetchYouTubeChannelData(isForceRefresh(req));
  return {
    body: {
      channel: data.channel,
      stats: data.stats,
      lastSynced: data.lastSynced,
    },
  };
});
