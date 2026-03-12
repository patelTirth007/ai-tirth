import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export interface ReportAnalysis {
  summary: string;
  abnormalValues: {
    parameter: string;
    value: string;
    referenceRange: string;
    explanation: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  riskScore: number;
  riskExplanation: string;
  personalizedAdvice: string[];
  simplifiedTerms: {
    term: string;
    definition: string;
  }[];
}

export const analyzeMedicalReport = async (fileBase64: string, mimeType: string): Promise<ReportAnalysis> => {
  const ai = getAI();
  const model = "gemini-3.1-pro-preview";

  const prompt = `
    Analyze this medical report and provide a simplified explanation for a patient.
    Return the response in JSON format with the following structure:
    {
      "summary": "A brief, encouraging summary of the report in simple terms.",
      "abnormalValues": [
        {
          "parameter": "Name of the test/value",
          "value": "The actual value found",
          "referenceRange": "The normal range",
          "explanation": "Why this is abnormal and what it means in simple terms",
          "severity": "low" | "medium" | "high"
        }
      ],
      "riskScore": 0-100 (where 0 is healthy and 100 is high risk),
      "riskExplanation": "A simple explanation of the risk score",
      "personalizedAdvice": ["List of actionable health tips based on the report"],
      "simplifiedTerms": [
        {
          "term": "Complex medical term",
          "definition": "Simple, easy to understand definition"
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: fileBase64.split(',')[1] || fileBase64,
              mimeType: mimeType
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || "{}");
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: `Translate the following medical analysis into ${targetLanguage}. Keep the tone professional but empathetic and easy to understand. \n\n ${text}`,
  });

  return response.text || text;
};

export const chatWithReport = async (history: { role: string, parts: string }[], message: string, reportContext: string) => {
  const ai = getAI();
  const model = "gemini-3.1-pro-preview";

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are a helpful medical assistant. You have access to the patient's medical report summary: ${reportContext}. 
      Answer their questions based on this report and general medical knowledge. 
      Always advise them to consult a doctor. Use Google Search to provide up-to-date information if needed.`,
      tools: [{ googleSearch: {} }]
    },
    history: history.map(h => ({ role: h.role, contents: [{ text: h.parts }] }))
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: "Transcribe this audio message accurately." },
          {
            inlineData: {
              data: base64Audio.split(',')[1] || base64Audio,
              mimeType: "audio/wav"
            }
          }
        ]
      }
    ]
  });

  return response.text || "";
};

