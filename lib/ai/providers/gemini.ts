import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIProviderResult {
  text: string;
  provider: "gemini" | "groq";
  model: string;
}

const GEMINI_MODEL = "gemini-1.5-flash";

export async function generateWithGemini(prompt: string): Promise<AIProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return {
    text,
    provider: "gemini",
    model: GEMINI_MODEL
  };
}
