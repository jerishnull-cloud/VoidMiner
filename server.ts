import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import channelHandler from './api/youtube/channel';
import dataHandler from './api/youtube/data';
import liveHandler from './api/youtube/live';
import refreshHandler from './api/youtube/refresh';
import statusHandler from './api/youtube/status';
import videosHandler from './api/youtube/videos';

if (process.env.NODE_ENV !== 'production') dotenv.config();

const filename = fileURLToPath(import.meta.url);
const directory = path.dirname(filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

app.all('/api/youtube/channel', (req, res) => { void channelHandler(req, res); });
app.all('/api/youtube/videos', (req, res) => { void videosHandler(req, res); });
app.all('/api/youtube/live', (req, res) => { void liveHandler(req, res); });
app.all('/api/youtube/data', (req, res) => { void dataHandler(req, res); });
app.all('/api/youtube/status', (req, res) => { void statusHandler(req, res); });
app.all('/api/youtube/refresh', (req, res) => { void refreshHandler(req, res); });

async function startServer(): Promise<void> {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(directory, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(directory, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[VOID miner] Local server listening on http://0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch(error => {
  console.error('Failed to start local server:', error);
  process.exit(1);
});
