
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
