import { createApiHandler, fetchYouTubeChannelData, invalidateYouTubeCache } from './_lib';

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
