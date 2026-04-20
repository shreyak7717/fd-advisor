import type { AIProviderResult } from "./gemini";

const GROQ_MODEL = "llama-3.3-70b-versatile";

interface GroqChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function generateWithGroq(prompt: string): Promise<AIProviderResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4
    })
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq request failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as GroqChatResponse;
  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("Groq returned an empty response");
  }

  return {
    text,
    provider: "groq",
    model: GROQ_MODEL
  };
}
