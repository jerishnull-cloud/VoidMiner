import { createApiHandler, fetchYouTubeChannelData, isForceRefresh } from './_lib';

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
