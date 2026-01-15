# Quick Start Guide

Get the Room Paint Visualizer running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get Your Replicate API Key

1. Go to [replicate.com](https://replicate.com) and sign up
2. Navigate to [Account Settings → API Tokens](https://replicate.com/account/api-tokens)
3. Copy your API token (starts with `r8_`)

## Step 3: Configure Environment

Create a `.env.local` file in the root directory:

```bash
echo "VITE_REPLICATE_API_TOKEN=your_actual_token_here" > .env.local
```

Replace `your_actual_token_here` with your actual Replicate token.

## Step 4: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Step 5: Test the Application

1. **Upload an image**: Drag and drop a photo of a room, or click to browse
2. **Select a color**: Click a preset color or use the color picker
3. **Generate**: Click "Generate Painted Room" and wait 30-60 seconds
4. **View results**: Compare before/after with side-by-side or slider view
5. **Download**: Save your generated image

## Common Issues

### API Key Not Working?
- Make sure the file is named exactly `.env.local` (not `.env`)
- Verify the variable name is `VITE_REPLICATE_API_TOKEN`
- Restart the dev server after adding the token

### Build Issues?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use?
```bash
# Vite will try port 5174, 5175, etc. automatically
# Or specify a port:
npm run dev -- --port 3000
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize colors in `src/types/index.ts`
- Adjust AI parameters in `src/services/aiService.ts`

## Cost Warning

⚠️ Each image generation costs approximately $0.01-0.05 on Replicate. Monitor your usage at [replicate.com/account/billing](https://replicate.com/account/billing)

---

Enjoy visualizing your room with new paint colors!
