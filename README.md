# Dubey's Dhaba (Split Frontend/Backend)

This repository now hosts a **Next.js frontend** inside `src/` and a dedicated **NestJS backend** under `backend/`. The frontend keeps its UI, while every `/api/*` request in `MenuApp` and the dashboard is rewritten to `NEXT_PUBLIC_API_BASE_URL` (see `next.config.mjs`), so the UI continues to call the familiar endpoints but the traffic is routed to the standalone API service.

## Environment
- `DATABASE_URL` / `POSTGRES_URL` (used by the backend to connect to Neon Postgres).
- `NEXT_PUBLIC_API_BASE_URL` tells the frontend where to proxy `/api` calls (defaults to `http://localhost:3001` for local dev).
- `ADMIN_SESSION_SECRET` (optional) stabilizes dashboard session tokens.
- `POSTGRES_*` helpers and any other Postgres connection details are reused directly by the backend from `.env`.

## Local development
1. Install dependencies from the repo root: `npm install`.
2. Install backend deps: `cd backend && npm install`.
3. Run both services together with `npm run dev:all` (loads `.env`, starts Next dev plus `backend` with `tsx watch src/main.ts`).
4. Alternatively, run frontend-only with `npm run dev` and backend-only with `cd backend && npm run dev`.

## Deployment
### Frontend (Vercel)
1. Push the repo (root package.json still points to the Next app). Vercel will run `npm run build`.
2. In Vercel’s Environment Variables, set `NEXT_PUBLIC_API_BASE_URL` to the public URL of your deployed backend.
3. Any other needed env vars (e.g., `NEXT_PUBLIC_MAP_KEY` if you add more) stay in Vercel now.

### Backend (Render / other host)
1. Point your host (Render, Railway, Fly, etc.) to the `backend/` directory.
2. Install dependencies there, then run `npm run build` and `npm run start` (or `npm run dev` for preview).
3. Copy all `.env` values used by the backend (`DATABASE_URL`, `POSTGRES_URL`, `ADMIN_SESSION_SECRET`, `PORT`, `CORS_ORIGIN`, etc.) into the platform’s env settings so the Nest app can connect to Neon and issue cookies.
4. Once the service is live (e.g., `https://api-dubeysdhaba.onrender.com`), update Vercel’s `NEXT_PUBLIC_API_BASE_URL` to that URL so the frontend continues to use the new backend.

## Notes
- The backend still seeds schema/menu data via the helper modules (`admin-store`, `db`, `security`) moved under `backend/src/services`.
- The frontend never needs to know where the backend lives beyond `NEXT_PUBLIC_API_BASE_URL`, and the rewrite keeps `/api/*` calls unchanged.
