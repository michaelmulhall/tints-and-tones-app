import { resizeImage } from '../utils/imageProcessing';

// Use backend proxy instead of direct Replicate API
// In production, use the deployed backend URL
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/predictions';

// Back to InstructPix2Pix - proven working model (quality varies)
// Model: timothybrooks/instruct-pix2pix
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
  // No token check needed - backend handles authentication

  try {
    onProgress?.('Resizing and converting image...');
    
    // Resize and convert image to base64 (max 1024px to prevent GPU memory issues)
    const imageBase64 = await resizeImage(image, 1024);

    // Create prompt optimized for better results
    const prompt = `Repaint only the walls to ${hexColor} color. Keep all furniture, objects, floor, ceiling, and lighting exactly the same. High quality interior photography.`;

    onProgress?.('Sending to AI...');

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c1d04ec1-d55c-4c73-bb7b-66159d307229',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiService.ts:38',message:'Using InstructPix2Pix',data:{modelVersion:MODEL_VERSION},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v2',hypothesisId:'FALLBACK'})}).catch(()=>{});
    // #endregion

    // Start the prediction via backend proxy with optimized parameters
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
          num_inference_steps: 30,
          image_guidance_scale: 1.8, // Higher = more faithful to original
          guidance_scale: 9, // Higher = follows prompt better
        },
      }),
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c1d04ec1-d55c-4c73-bb7b-66159d307229',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'aiService.ts:52',message:'Response received',data:{ok:response.ok,status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v2',hypothesisId:'FALLBACK'})}).catch(()=>{});
    // #endregion

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
