<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# VOID miner

## Local development

Prerequisite: Node.js.

1. Install dependencies with `npm install`.
2. Set `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`, and (if you enable server-side Gemini features) `GEMINI_API_KEY` in your local `.env`.
3. Start the local Vite/Express development host with `npm run dev`.

The local Express host mounts the same API handlers that Vercel deploys from `api/youtube/`. The serverless handlers read configuration only from `process.env`; they do not read `.env` files.

## Deploy to Vercel

Import the repository in Vercel and use these project settings:

- Framework preset: **Vite**
- Root directory: repository root
- Install command: `npm install` (or leave Vercel's detected npm install command)
- Build command: `npm run build`
- Output directory: `dist`

Add these server-side environment variables in **Project Settings → Environment Variables**. Apply them to each environment you deploy (Production, Preview, and Development as needed):

- `YOUTUBE_API_KEY` — Google API key with YouTube Data API v3 enabled
- `YOUTUBE_CHANNEL_ID` — YouTube channel ID, or a handle beginning with `@`
- `GEMINI_API_KEY` — set this only if a server-side Gemini feature is enabled

Do not prefix secret variables with `VITE_`; Vite-prefixed variables are intended for client-side exposure. These variables are read only by server code. The current YouTube endpoints do not use Gemini yet.

Vercel automatically deploys the functions in `api/youtube/` alongside the Vite output, so no `vercel.json` rewrite is required. Available routes are `GET /api/youtube/channel`, `GET /api/youtube/videos`, `GET /api/youtube/live`, `GET /api/youtube/data`, `GET /api/youtube/status`, and `POST /api/youtube/refresh`.

## Verify before pushing

Run `npm ci`, `npm run lint`, and `npm run build`. The `.env` file is ignored by Git; do not force-add it.
"# VoidMiner" 
