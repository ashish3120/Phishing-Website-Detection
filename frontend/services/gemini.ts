
// import { GoogleGenAI, Type } from "@google/genai";
// import { AIAnalysis } from "../types";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// export const analyzeUrlWithAI = async (url: string, isPhishing: boolean): Promise<AIAnalysis> => {
//   const prompt = `
//     Analyze the following URL: "${url}"
//     The automated detection system has flagged this as ${isPhishing ? 'SUSPICIOUS/PHISHING' : 'LEGITIMATE'}.

//     Provide a security analysis including:
//     1. A brief summary of the URL's structure.
//     2. Threat level (Low, Medium, High).
//     3. Specific reasons why it might be a threat (e.g., typosquatting, suspicious TLD, subdomain abuse) or why it looks safe.
//     4. A clear recommendation for the user.
//   `;

//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: {
//         type: Type.OBJECT,
//         properties: {
//           summary: { type: Type.STRING },
//           threatLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
//           reasons: {
//             type: Type.ARRAY,
//             items: { type: Type.STRING }
//           },
//           recommendation: { type: Type.STRING }
//         },
//         required: ["summary", "threatLevel", "reasons", "recommendation"]
//       }
//     }
//   });

//   return JSON.parse(response.text);
// };


import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

// ❌ DO NOT initialize Gemini at top-level
// ❌ DO NOT throw at module load time

let ai: GoogleGenAI | null = null;

// ✅ Lazy initialization (only when needed)
function getGeminiClient(): GoogleGenAI {
  if (ai) return ai;

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    // ❗ Do NOT throw — return controlled error later
    console.error("Gemini API key missing (VITE_GEMINI_API_KEY)");
    throw new Error("AI analysis is not configured.");
  }

  ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai;
}

export const analyzeUrlWithAI = async (
  url: string,
  isPhishing: boolean
): Promise<AIAnalysis> => {
  const client = getGeminiClient();

  const prompt = `
Analyze the following URL: "${url}"
The automated detection system has flagged this as ${isPhishing ? "SUSPICIOUS/PHISHING" : "LEGITIMATE"
    }.

Provide:
1. Summary
2. Threat level (Low, Medium, High)
3. Reasons
4. Recommendation
`;

  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          threatLevel: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High"],
          },
          reasons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendation: { type: Type.STRING },
        },
        required: ["summary", "threatLevel", "reasons", "recommendation"],
      },
    },
  });

  return JSON.parse(response.text);
};

