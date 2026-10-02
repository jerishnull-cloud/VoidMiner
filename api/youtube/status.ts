import { createApiHandler, getApiStatus } from './_lib';

export default createApiHandler('GET', async () => ({ body: getApiStatus() }));
