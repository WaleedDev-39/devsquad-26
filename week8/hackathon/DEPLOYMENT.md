Vercel deployment notes
=======================

This project is a monorepo with a Next.js frontend and a NestJS backend.

Key points
- Frontend: `frontend` (Next.js)
- Backend: `backend` (NestJS compiled to `backend/dist`)

Build
- The root `package.json` provides a `build` script that builds both packages:

  ```bash
  npm run build
  ```

Vercel configuration
- `vercel.json` at the repo root routes `/api/*` to the NestJS serverless handler compiled at `backend/dist/main.js` and the rest to the frontend.
- Ensure the Project's **Root Directory** in Vercel is the repository root (where this `vercel.json` lives).
- Set the root Build Command to:

  ```bash
  npm run build
  ```

Environment variables (set these in Vercel Project > Settings > Environment Variables)
- `MONGODB_URI` — Your MongoDB connection string (do NOT commit to the repo).
- `OPENAI_API_KEY` — Your OpenAI API key.
- Optional: `NEXT_PUBLIC_API_URL` — if you want the frontend to call a different backend URL. By default the frontend uses relative `/api/`.

Notes & troubleshooting
- We removed `backend/.env` from the repository; add secrets only via Vercel settings.
- If Vercel build fails with TypeScript errors, check `backend/tsconfig.json` and ensure `esModuleInterop` is enabled (already set).
- The backend `src/main.ts` now exports a default handler for Vercel serverless. When run locally (with `node backend/dist/main.js`) it will still start a listener for development.
- If you get `FUNCTION_INVOCATION_FAILED` after deploy, open the Vercel Functions logs (Project > Deployments > [deployment] > Functions) and paste the error for further debugging. Common causes:
  - Missing environment variables (`MONGODB_URI`, `OPENAI_API_KEY`).
  - Long-running synchronous tasks exceeding function timeout.
  - Incorrect route mapping in `vercel.json`.
