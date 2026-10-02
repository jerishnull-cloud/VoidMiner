import { createApiHandler, fetchYouTubeChannelData, isForceRefresh } from '../../server/youtube.js';

export default createApiHandler('GET', async req => ({
  body: await fetchYouTubeChannelData(isForceRefresh(req)),
}));
