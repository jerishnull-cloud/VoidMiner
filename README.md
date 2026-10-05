<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# VOID miner

## Local development

Prerequisite: Node.js.

1. Install dependencies with `npm install`.
2. Set YouTube/Gemini values in `.env` and `VITE_SUPABASE_URL` plus `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
3. Start the local Vite/Express development host with `npm run dev`.

The local Express host mounts the same API handlers that Vercel deploys from `api/youtube/`. The serverless handlers read configuration only from `process.env`; they do not read `.env` files.

### Direct database connection

The server and Prisma can connect to Supabase Postgres using `DATABASE_URL` for the IPv4 transaction pooler (port 6543) and `DIRECT_URL` for the session pooler used by Prisma migrations (port 5432). Set both in the ignored local `.env` file or as server-only environment variables; never add them to `VITE_` variables or frontend code. The local `.env` includes the provided pooler host and password placeholders. Replace `YOUR_DATABASE_PASSWORD` with your database password, percent-encoding reserved URL characters (for example, `@` as `%40`). Run `npm run db:check` to verify the transaction-pool connection; this check executes `SELECT current_database()` and does not print the connection string or password.

Prisma is initialized with the matching `DATABASE_URL`/`DIRECT_URL` schema configuration in `prisma/schema.prisma`. Run `npm run db:validate` to validate the schema and `npm run db:generate` to generate Prisma Client. Prisma migrations should use the session-pool URL through `directUrl`; don’t run migrations against the transaction pooler. The project uses Prisma 6.12.0 to retain the requested `directUrl` schema syntax and avoid current Prisma CLI audit advisories.

The direct `db.<project-ref>.supabase.co:5432` host may require IPv6. For an IPv4-only environment, select **Session pooler** in Supabase's Connect dialog and use that connection string instead.

## Authentication pages

The frontend includes `/login`, `/register`, `/forgot-password`, `/reset-password`, and the protected `/login-success` confirmation page. Successful email/password and Google sign-ins pass through `/login-success` before continuing to `/`. The existing `/account` page remains available for profile and logout access. Supabase Auth handles password registration and sign-in, email recovery, Google OAuth redirects, session refresh, and logout. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for local development and in your deployment environment. The publishable key is intended for client-side use; never use a Supabase `service_role` key in a `VITE_` variable.

The app is built with Vite/React, not Next.js, and uses React Router for client-side navigation. It uses the existing browser client from `@supabase/ssr` and does not use Next's `cookies()`, `page.tsx`, or `middleware.ts`. Supabase refreshes sessions in the browser and stores the session in cookies. One app-level auth provider restores the session on startup and listens for Supabase auth changes. The `/login-success` page requires a valid session; `/account` also verifies the user with Supabase before showing account data. Enforce authorization for database/API data with Supabase Row Level Security (RLS); client-side route checks alone are not authorization.

For Google sign-in, configure Google as an enabled provider in **Supabase Dashboard → Authentication → Providers → Google**, using the Google OAuth client ID in `VITE_GOOGLE_CLIENT_ID` and its client secret in the Supabase dashboard only. Add the site's origin and `https://<your-project-ref>.supabase.co/auth/v1/callback` to the Google OAuth client's authorized settings, and allow the `/login-success` redirect URL in Supabase Auth URL configuration.

For password reset, `resetPasswordForEmail` redirects to `${window.location.origin}/reset-password`. Allow the corresponding `/reset-password` URL for each local, production, and preview origin in Supabase Auth's redirect URL configuration. The recovery page requires a valid Supabase recovery session, updates the password through Supabase Auth, and then signs out before offering navigation to `/login`. For email confirmation, allow `${APP_URL}/login?registered=1`. Configure the email templates and SMTP/provider settings in Supabase as needed. Passwords are sent directly to Supabase Auth over HTTPS and are never written to browser storage by this app; Supabase handles password hashing and credential validation.

## Deploy to Vercel

Import the repository in Vercel and use these project settings:

- Framework preset: **Vite**
- Root directory: repository root
- Install command: `npm install` (or leave Vercel's detected npm install command)
- Build command: `npm run build`
- Output directory: `dist`

Add the server-only environment variables in **Project Settings → Environment Variables**. Apply them to each environment you deploy (Production, Preview, and Development as needed):

- `YOUTUBE_API_KEY` — Google API key with YouTube Data API v3 enabled
- `YOUTUBE_CHANNEL_ID` — YouTube channel ID, or a handle beginning with `@`
- `GEMINI_API_KEY` — set this only if a server-side Gemini feature is enabled

The browser authentication configuration is public and is embedded into the Vite build. Set these exact names in Vercel for every deployment environment, then redeploy:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable key (never the `service_role` key)

Vite now fails the build with the missing variable name if either required Supabase browser variable is absent. Do not prefix secret variables with `VITE_`; Vite-prefixed variables are intended for client-side exposure. Supabase's Google provider client secret belongs only in the Supabase dashboard. The current YouTube endpoints do not use Gemini yet.

Vercel automatically deploys the functions in `api/youtube/` alongside the Vite output, so no `vercel.json` rewrite is required. Available routes are `GET /api/youtube/channel`, `GET /api/youtube/videos`, `GET /api/youtube/live`, `GET /api/youtube/data`, `GET /api/youtube/status`, and `POST /api/youtube/refresh`.

## Verify before pushing

Run `npm ci`, `npm run lint`, and `npm run build`. The `.env` file is ignored by Git; do not force-add it.
"# VoidMiner" 
