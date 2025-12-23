import { PredictionResult } from '../types';

// 🔑 Hard fallback ensures Render is used even if env fails
const BACKEND_URL =
  import.meta.env.VITE_API_BASE ||
  'https://phishing-website-detection-backend.onrender.com';

export const checkPhishing = async (url: string): Promise<PredictionResult> => {
  const response = await fetch(`${BACKEND_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Backend error: ${text}`);
  }

  const data = await response.json();

  return {
    url,
    isPhishing: data.prediction === 'phishing',
    confidence: data.confidence,
  };
};
