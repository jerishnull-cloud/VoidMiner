import { createApiHandler, fetchYouTubeChannelData, isForceRefresh } from './_lib';

export default createApiHandler('GET', async req => {
  const data = await fetchYouTubeChannelData(isForceRefresh(req));
  return {
    body: {
      videos: data.videos,
      shorts: data.shorts,
      featuredVideo: data.featuredVideo,
      totalVideosCount: data.videos.length + data.shorts.length,
    },
  };
});
