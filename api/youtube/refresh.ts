import { createApiHandler, fetchYouTubeChannelData, invalidateYouTubeCache } from '../../server/youtube.js';

export default createApiHandler('POST', async () => {
  invalidateYouTubeCache();
  const data = await fetchYouTubeChannelData(true);
  return {
    body: {
      success: true,
      message: 'YouTube channel data refreshed',
      data,
    },
  };
});
