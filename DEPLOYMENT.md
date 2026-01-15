# Deployment Guide

## Overview

This app requires both a **frontend** and a **backend** to be deployed separately.

## Architecture

- **Frontend**: Static React app (can deploy to Vercel, Netlify, etc.)
- **Backend**: Node.js Express server (can deploy to Render, Railway, Heroku, etc.)

---

## Backend Deployment

The backend (`server.js`) handles Replicate API calls securely.

### Option 1: Deploy to Render.com (Recommended)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `paint-visualizer-api`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `REPLICATE_API_TOKEN` = your Replicate API token
6. Click "Create Web Service"
7. Copy the deployed URL (e.g., `https://paint-visualizer-api.onrender.com`)

### Option 2: Deploy to Railway.app

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variable:
   - `REPLICATE_API_TOKEN` = your token
5. Railway will auto-detect Node.js and deploy
6. Copy the deployed URL

---

## Frontend Deployment

The frontend is a static React app.

### Option 1: Deploy to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_BACKEND_URL` = your backend URL + `/api/predictions`
     - Example: `https://paint-visualizer-api.onrender.com/api/predictions`
5. Click "Deploy"

### Option 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**:
     - `VITE_BACKEND_URL` = your backend URL + `/api/predictions`
5. Click "Deploy site"

---

## Environment Variables Summary

### Backend (.env or platform settings):
```
REPLICATE_API_TOKEN=r8_your_actual_token_here
PORT=3001
```

### Frontend (build-time environment variables):
```
VITE_BACKEND_URL=https://your-backend-url.com/api/predictions
```

---

## Testing Your Deployment

1. Open your deployed frontend URL
2. Upload a room image
3. Select a color
4. Click "Generate Painted Room"
5. Wait for the result

If you get CORS errors, make sure your backend's CORS settings allow your frontend domain.

---

## Troubleshooting

### Error: "Replicate API token is not configured"
- Make sure `REPLICATE_API_TOKEN` is set in your **backend** environment variables
- Restart your backend service after adding the variable

### Error: "Failed to fetch" or CORS error
- Make sure `VITE_BACKEND_URL` points to your deployed backend
- Check that your backend is running (visit the backend URL in browser)
- Verify backend CORS allows your frontend domain

### Images not generating
- Check backend logs for API errors
- Verify Replicate account has credits
- Test backend directly: `curl https://your-backend-url.com/api/predictions`

---

## Cost Considerations

- Frontend hosting: Free on Vercel/Netlify
- Backend hosting: Free tier available on Render/Railway
- Replicate API: ~$0.01-0.05 per image generation

Monitor usage at https://replicate.com/account/billing
