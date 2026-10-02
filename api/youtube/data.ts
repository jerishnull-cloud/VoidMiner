import { createApiHandler, fetchYouTubeChannelData, isForceRefresh } from './_lib';

export default createApiHandler('GET', async req => ({
  body: await fetchYouTubeChannelData(isForceRefresh(req)),
}));
