import { createApiHandler, getApiStatus } from '../../server/youtube.js';

export default createApiHandler('GET', async () => ({ body: getApiStatus() }));
