import { detectLanguage } from "@/lib/language";
import { buildSystemPrompt } from "@/lib/prompts";
import { generateAIResponse } from "@/lib/ai/generateAIResponse";
import { Language, FDRate } from "@/types";

export const runtime = "nodejs"; // Gemini SDK needs Node runtime, not edge

export async function POST(req: Request) {
  const { messages, language: clientLang, currentFD } = (await req.json()) as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    language?: Language;
    currentFD?: FDRate | null;
  };

  if (!messages || messages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  // Detect language from last user message
  const lastUserMsg = messages.findLast((m) => m.role === "user")?.content ?? "";
  const detectedLang = clientLang ?? (await detectLanguage(lastUserMsg));

  const systemPrompt = buildSystemPrompt(detectedLang, currentFD);
  const conversation = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
  const prompt = `${systemPrompt}\n\nConversation:\n${conversation}\n\nASSISTANT:`;

  const aiResult = await generateAIResponse(prompt);
  if (!aiResult.success) {
    console.error("AI response failed:", aiResult.error);
    return new Response("AI provider unavailable. Please try again.", { status: 503 });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const data = JSON.stringify({
          text: aiResult.text,
          language: detectedLang,
          provider: aiResult.provider,
          model: aiResult.model
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        console.error("AI stream error:", err);
        controller.error(err);
      }
    }
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
}
