# Room Paint Visualizer

A React application that allows users to upload photos of their rooms and visualize what they would look like with different paint colors using AI image generation.

![Room Paint Visualizer](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Features

- **Image Upload**: Drag-and-drop or click to upload room photos
- **Color Selection**: Choose colors using:
  - Visual color picker
  - HEX code input
  - 12 preset popular paint colors
- **AI Generation**: Uses Replicate's InstructPix2Pix model to transform room images
- **Before/After Comparison**: View results with:
  - Side-by-side comparison
  - Interactive slider comparison
- **Download Results**: Save generated images to your device
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Validation**: Instant feedback on file types, sizes, and color formats

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Service**: Replicate API (InstructPix2Pix model)
- **Image Processing**: HTML5 File API & Canvas API

## Prerequisites

- Node.js 18+ and npm/yarn
- Replicate API account and token ([Sign up here](https://replicate.com))

## Installation

1. **Clone or navigate to the repository**

```bash
cd tints-and-tones-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure API Key**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Replicate API token:

```env
VITE_REPLICATE_API_TOKEN=r8_your_actual_token_here
```

To get your API token:
1. Sign up at [Replicate](https://replicate.com)
2. Go to [Account Settings](https://replicate.com/account/api-tokens)
3. Copy your API token

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

1. **Upload a Room Image**
   - Click the upload area or drag-and-drop an image
   - Supported formats: JPG, PNG, WebP
   - Maximum file size: 5MB
   - Best results with clear, well-lit photos

2. **Select a Paint Color**
   - Use the color picker for visual selection
   - Type a HEX code directly (e.g., `#FF5733`)
   - Click a preset color swatch

3. **Generate Painted Room**
   - Click "Generate Painted Room" button
   - Wait 30-60 seconds for AI processing
   - View your transformed room!

4. **Compare Results**
   - Toggle between "Side by Side" and "Slider" views
   - Download the generated image
   - Try another color by clicking "Try Another Color"

## Project Structure

```
tints-and-tones-app/
├── src/
│   ├── components/
│   │   ├── RoomPaintVisualizer.tsx    # Main orchestrating component
│   │   ├── ImageUploader.tsx           # Image upload & preview
│   │   ├── ColorSelector.tsx           # Color picker & preset swatches
│   │   └── ResultDisplay.tsx           # Before/after comparison
│   ├── services/
│   │   └── aiService.ts                # Replicate API integration
│   ├── utils/
│   │   ├── imageProcessing.ts          # Image conversion utilities
│   │   └── validation.ts               # File & color validation
│   ├── types/
│   │   └── index.ts                    # TypeScript types & constants
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Global styles & Tailwind
├── .env.example                         # Example environment variables
├── .env.local                           # Your API keys (gitignored)
├── tailwind.config.js                   # Tailwind configuration
├── vite.config.ts                       # Vite configuration
└── package.json                         # Dependencies & scripts
```

## Tips for Best Results

- ✅ Use clear, well-lit photos
- ✅ Ensure walls are clearly visible
- ✅ Avoid heavy shadows or glare
- ✅ Take photos straight-on when possible
- ⚠️ Processing takes 30-60 seconds
- ⚠️ AI results may vary - try different angles if needed

## API Costs

This application uses Replicate's API, which charges per prediction:
- **Cost per generation**: ~$0.01-0.05
- **Processing time**: 30-60 seconds
- Monitor usage at [Replicate Billing](https://replicate.com/account/billing)

## Security Considerations

⚠️ **Important**: The current implementation stores the API key in a frontend environment variable (`.env.local`). This is **NOT secure for production** because:

- Anyone can extract the API key from the built application
- Your API key could be used by others, incurring charges
- This setup is only suitable for demos and local testing

**For production use**, implement a backend proxy:
- Create a server-side API endpoint (Node.js/Express, Next.js API routes, etc.)
- Store API keys securely on the server
- Have your frontend make requests to your backend
- Your backend then communicates with Replicate

## Troubleshooting

### API Token Error
**Error**: "Replicate API token is not configured"

**Solution**: 
1. Ensure `.env.local` exists in the root directory
2. Verify the token starts with `VITE_`
3. Restart the dev server after adding the token

### Image Upload Fails
**Error**: "Invalid file type" or "File too large"

**Solution**:
- Only use JPG, PNG, or WebP images
- Compress images larger than 5MB
- Use online tools like [TinyPNG](https://tinypng.com)

### Generation Takes Too Long
**Error**: "Processing timed out"

**Solution**:
- Try a smaller image file
- Check your internet connection
- Verify Replicate API status
- Some images may be too complex - try a simpler room photo

### Colors Look Wrong
**Issue**: Generated colors don't match selection

**Solution**:
- AI interpretation can vary
- Try adjusting the color slightly
- Ensure the original image has good lighting
- Some room conditions (shadows, existing colors) affect results

## Development

### Adding New Color Presets

Edit `src/types/index.ts` and add to the `PRESET_COLORS` array:

```typescript
{ name: "Your Color", hex: "#HEXCODE", description: "Description" }
```

### Changing AI Model

To use a different Replicate model, edit `src/services/aiService.ts`:

1. Update `MODEL_VERSION` with the new model's version ID
2. Adjust the `input` parameters based on the model's requirements
3. Test thoroughly as different models have different capabilities

### Customizing Styling

All styles use Tailwind CSS. To customize:

1. Edit `tailwind.config.js` for theme changes
2. Modify component classes for specific styling
3. Add custom CSS in `src/index.css` if needed

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- AI powered by [Replicate](https://replicate.com)
- InstructPix2Pix model by [Timothy Brooks](https://github.com/timothybrooks)
- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Note**: This is a demo application. For production use, implement proper backend API key management and consider rate limiting to prevent abuse.
# tints-and-tones-app
