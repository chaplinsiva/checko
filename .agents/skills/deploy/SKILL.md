---
name: deploy
description: Pre-flight checks and deployment workflow for Next.js applications (Vercel, Docker, or Node production server).
---

# Deploy Skill — Checko Deployment Workflow

Use this skill when preparing to deploy or deploying the Checko Next.js application.

## 1. Pre-Flight Verification

Before deploying, ensure all local checks pass cleanly:

1. **Verify Environment Variables**:
   - Check `.env` or production environment settings for `GEMINI_API_KEY` (or `NEXT_PUBLIC_GEMINI_API_KEY`).
2. **Run Production Build**:
   ```bash
   npm run build
   ```
   *Ensure the build completes with zero errors.*

3. **Verify Node & Dependency Integrity**:
   - Node v20+ LTS installed.
   - Clean `node_modules` and platform-native binaries compiled.

---

## 2. Deployment Options

### Option A: Vercel (Recommended for Next.js)
1. Install Vercel CLI if needed:
   ```bash
   npm install -g vercel
   ```
2. Deploy preview or production:
   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod
   ```
3. Set Environment Variables on Vercel:
   ```bash
   vercel env add GEMINI_API_KEY
   ```

### Option B: Node.js Production Server
1. Build the production application:
   ```bash
   npm run build
   ```
2. Start the production server on port 3000 (or custom `$PORT`):
   ```bash
   npm run start
   ```

### Option C: Docker Container
1. Create or verify `Dockerfile` for Next.js standalone output.
2. Build image:
   ```bash
   docker build -t checko-app .
   ```
3. Run container:
   ```bash
   docker run -d -p 3000:3000 --env-file .env checko-app
   ```

---

## 3. Post-Deployment Verification

1. Verify HTTP status 200 on main entry point `/`.
2. Test Gemini API response on interactive chat/debate components.
3. Check browser console for missing assets or CORS issues.
