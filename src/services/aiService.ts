import { resizeImage } from '../utils/imageProcessing';

// Use local backend proxy instead of direct Replicate API
const BACKEND_API_URL = 'http://localhost:3001/api/predictions';
const API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;

// Using instruct-pix2pix model for image editing
// Model version for timothybrooks/instruct-pix2pix
const MODEL_VERSION = '30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f';

interface ReplicateResponse {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
  logs?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generatePaintedRoom = async (
  image: File,
  hexColor: string,
  onProgress?: (status: string) => void
): Promise<string> => {
  if (!API_TOKEN || API_TOKEN === 'your_api_key_here') {
    throw new Error(
      'Replicate API token is not configured. Please set VITE_REPLICATE_API_TOKEN in your .env.local file.'
    );
  }

  try {
    onProgress?.('Resizing and converting image...');
    
    // Resize and convert image to base64 (max 1024px to prevent GPU memory issues)
    const imageBase64 = await resizeImage(image, 1024);

    // Create prompt for the AI
    const prompt = `Change all the wall colors in this room to ${hexColor}. Keep the furniture, decorations, lighting, and room layout exactly the same. Only repaint the walls.`;

    onProgress?.('Sending to AI...');

    // Start the prediction via backend proxy
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          image: imageBase64,
          prompt: prompt,
          num_inference_steps: 20,
          image_guidance_scale: 1.5,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || `API request failed with status ${response.status}`
      );
    }

    const prediction: ReplicateResponse = await response.json();

    // Poll for results
    const resultUrl = await pollForResult(prediction.id, onProgress);
    
    return resultUrl;
  } catch (error) {
    console.error('Error generating painted room:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate painted room. Please try again.');
  }
};

const pollForResult = async (
  predictionId: string,
  onProgress?: (status: string) => void,
  maxAttempts: number = 60
): Promise<string> => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    await delay(2000); // Wait 2 seconds between polls
    attempts++;

    const response = await fetch(`${BACKEND_API_URL}/${predictionId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check prediction status: ${response.status}`);
    }

    const prediction: ReplicateResponse = await response.json();

    switch (prediction.status) {
      case 'starting':
        onProgress?.('Starting AI processing...');
        break;
      case 'processing':
        onProgress?.(`Processing... (${attempts * 2}s)`);
        break;
      case 'succeeded':
        if (prediction.output) {
          const output = Array.isArray(prediction.output)
            ? prediction.output[0]
            : prediction.output;
          onProgress?.('Complete!');
          return output;
        }
        throw new Error('No output received from AI');
      case 'failed':
        throw new Error(prediction.error || 'AI processing failed');
      case 'canceled':
        throw new Error('Processing was canceled');
    }
  }

  throw new Error('Processing timed out. Please try again with a different image.');
};

// Alternative: Using Stability AI inpainting (if you switch to this service)
export const generatePaintedRoomStability = async (
  _image: File,
  _hexColor: string
): Promise<string> => {
  // This is a placeholder for Stability AI implementation
  // You would need to:
  // 1. Set up Stability AI API key
  // 2. Use their inpainting endpoint
  // 3. Provide a mask for the walls (this is the challenging part)
  
  throw new Error('Stability AI integration not yet implemented');
};
