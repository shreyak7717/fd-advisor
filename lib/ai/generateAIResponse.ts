import { generateWithGemini, type AIProviderResult } from "./providers/gemini";
import { generateWithGroq } from "./providers/groq";

export interface GenerateAIResponseResult {
  success: boolean;
  text: string;
  provider: "gemini" | "groq";
  model: string;
  error?: string;
}

const GEMINI_MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

async function generateWithGeminiRetry(prompt: string): Promise<AIProviderResult> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt += 1) {
    try {
      return await generateWithGemini(prompt);
    } catch (err) {
      lastError = err;
      if (attempt === GEMINI_MAX_RETRIES) break;

      const backoffMs = BASE_BACKOFF_MS * 2 ** attempt;
      await sleep(backoffMs);
    }
  }

  throw lastError ?? new Error("Gemini failed after retries");
}

export async function generateAIResponse(prompt: string): Promise<GenerateAIResponseResult> {
  try {
    const geminiResult = await generateWithGeminiRetry(prompt);
    return {
      success: true,
      text: geminiResult.text,
      provider: geminiResult.provider,
      model: geminiResult.model
    };
  } catch (geminiError) {
    try {
      const groqResult = await generateWithGroq(prompt);
      return {
        success: true,
        text: groqResult.text,
        provider: groqResult.provider,
        model: groqResult.model,
        error: `Gemini failed and Groq fallback was used: ${toErrorMessage(geminiError)}`
      };
    } catch (groqError) {
      return {
        success: false,
        text: "",
        provider: "groq",
        model: "llama-3.3-70b-versatile",
        error: `Gemini failed: ${toErrorMessage(geminiError)} | Groq failed: ${toErrorMessage(groqError)}`
      };
    }
  }
}
