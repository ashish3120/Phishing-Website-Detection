
// import { PredictionResult } from '../types';

// const BACKEND_URL = 'https://phishing-website-detection-backend.onrender.com';

// export const checkPhishing = async (url: string): Promise<PredictionResult> => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/predict`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ url }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to connect to detection backend');
//     }

//     const data = await response.json();

//     // Adjusting for common backend response formats
//     // Prediction might be a string "phishing"/"legitimate" or a number 0/1
//     const result = data.prediction || data.result || data.label;
//     const isPhishing = result === 'phishing' || result === 1 || result === '1';

//     return {
//       url,
//       isPhishing,
//       confidence: data.confidence,
//       message: data.message
//     };
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };


import { PredictionResult } from '../types';

// ✅ Change 1: make backend URL configurable + safe fallback
const BACKEND_URL =
  (import.meta as any).env?.VITE_API_BASE ||
  'https://phishing-website-detection-backend.onrender.com';

export const checkPhishing = async (url: string): Promise<PredictionResult> => {
  // ✅ Change 2: validate input early (prevents useless API calls)
  if (!url || !url.trim()) {
    throw new Error('URL is required');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ✅ Change 3: ensure trimmed, clean payload
      body: JSON.stringify({ url: url.trim() }),
    });

    // ✅ Change 4: surface backend errors instead of silent crashes
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to connect to detection backend');
    }

    const data = await response.json();

    // ✅ Change 5: normalize backend response defensively
    const result =
      data.prediction ??
      data.result ??
      data.label ??
      data.is_phishing ??
      data.isPhishing;

    const isPhishing =
      result === 'phishing' ||
      result === 'Phishing' ||
      result === 1 ||
      result === '1' ||
      result === true;

    return {
      url: url.trim(),
      isPhishing,
      confidence: typeof data.confidence === 'number' ? data.confidence : undefined,
      message: data.message ?? undefined,
    };
  } catch (error) {
    // ✅ Change 6: log but DO NOT crash React
    console.error('Phishing API Error:', error);
    throw error;
  }
};
