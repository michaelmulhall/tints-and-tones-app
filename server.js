import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config(); // Also load from .env if exists

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
// Support both naming conventions
const API_TOKEN = process.env.REPLICATE_API_TOKEN || process.env.VITE_REPLICATE_API_TOKEN;

// Create prediction endpoint
app.post('/api/predictions', async (req, res) => {
  console.log('[SERVER] Received prediction request');
  
  if (!API_TOKEN) {
    console.error('[SERVER] API token not found');
    return res.status(500).json({ error: 'API token not configured' });
  }

  try {
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log('[SERVER] Replicate response status:', response.status);
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('[SERVER] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get prediction status endpoint
app.get('/api/predictions/:id', async (req, res) => {
  const { id } = req.params;
  console.log('[SERVER] Checking prediction status:', id);

  try {
    const response = await fetch(`${REPLICATE_API_URL}/${id}`, {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('[SERVER] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
  console.log(`[SERVER] API token configured: ${!!API_TOKEN}`);
});
