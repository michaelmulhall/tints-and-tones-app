# Setup Checklist

Use this checklist to get your Room Paint Visualizer running for the first time.

## Pre-Setup Requirements
- [ ] Node.js 18+ installed (`node --version` to check)
- [ ] npm installed (`npm --version` to check)
- [ ] Text editor or IDE ready (VS Code recommended)

## Step-by-Step Setup

### 1. Dependencies
- [ ] Run `npm install` in the project directory
- [ ] Wait for all packages to install (should take 30-60 seconds)
- [ ] Verify no errors in the installation output

### 2. Replicate API Setup
- [ ] Visit https://replicate.com and create an account
- [ ] Verify your email address
- [ ] Navigate to https://replicate.com/account/api-tokens
- [ ] Click "Create token" or copy existing token
- [ ] Token should start with `r8_`

### 3. Environment Configuration
- [ ] Copy `.env.example` to `.env.local` OR create new `.env.local` file
- [ ] Open `.env.local` in your editor
- [ ] Replace `your_api_key_here` with your actual Replicate token
- [ ] Save the file
- [ ] Verify the file is named exactly `.env.local` (not `.env` or `.env.txt`)

### 4. Build Test
- [ ] Run `npm run build` to verify everything compiles
- [ ] Check that `dist/` folder is created
- [ ] Verify no TypeScript or build errors

### 5. Development Server
- [ ] Run `npm run dev`
- [ ] Look for the local URL (usually http://localhost:5173)
- [ ] Open the URL in your browser
- [ ] Verify the page loads with "Room Paint Visualizer" header

### 6. Functionality Test
- [ ] Find a room photo on your computer (or use a sample image)
- [ ] Drag the image onto the upload area OR click to browse
- [ ] Verify the image preview appears
- [ ] Click a preset color swatch
- [ ] Verify the selected color updates
- [ ] Click "Generate Painted Room" button
- [ ] Wait for generation (30-60 seconds)
- [ ] Verify the generated image appears
- [ ] Toggle between "Side by Side" and "Slider" views
- [ ] Try the slider comparison
- [ ] Click "Download Image" and verify the file downloads
- [ ] Click "Try Another Color" to reset

### 7. Optional: Git Setup
- [ ] Initialize git: `git init` (if not already a repo)
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Make initial commit: `git add . && git commit -m "Initial commit"`

## Troubleshooting

### If dependencies won't install:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### If API key doesn't work:
- Check the token in your Replicate dashboard
- Make sure there are no extra spaces in `.env.local`
- Restart the dev server after adding the token
- Check browser console for specific error messages

### If the build fails:
- Run `npm run lint` to check for code issues
- Check that all files were created correctly
- Verify Node version is 18 or higher

### If images won't upload:
- Check file format (must be JPG, PNG, or WebP)
- Check file size (must be under 5MB)
- Try a different image
- Check browser console for error messages

### If generation hangs:
- Check your internet connection
- Verify your Replicate account has credits
- Check Replicate status page
- Try a smaller/simpler image

## Success Criteria

You know everything is working when:
- ✅ The application loads without errors
- ✅ You can upload and see a room image
- ✅ You can select colors from the picker or presets
- ✅ Clicking "Generate" produces a new painted room image
- ✅ The comparison views work smoothly
- ✅ You can download the generated image

## Cost Tracking

After testing:
- [ ] Check your usage at https://replicate.com/account/billing
- [ ] Verify charges match your test generations (~$0.01-0.05 each)
- [ ] Set up billing alerts if available

## Next Steps

Once setup is complete:
- [ ] Read the full README.md for detailed documentation
- [ ] Review PROJECT_SUMMARY.md for implementation details
- [ ] Customize preset colors in `src/types/index.ts`
- [ ] Consider implementing backend API for production use

---

**Estimated Total Setup Time**: 10-15 minutes (including account creation)

**Questions?** Check README.md → Troubleshooting section
