"use client";
import { useState, useRef, useCallback } from "react";
import { Message, Language, FDRate } from "@/types";
import { detectLanguage } from "@/lib/language";

export function useChat(currentFD: FDRate | null) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "नमस्ते! मैं एफडी मित्र हूं। मैं आपको Fixed Deposit (FD) के बारे में सरल हिन्दी में समझाऊंगा। आप मुझसे हिन्दी, भोजपुरी या अवधी में बात कर सकते हैं। 🙏\n\nआज मैं आपकी किस तरह मदद करूं?",
      language: "hi",
      timestamp: new Date()
    }
  ]);

  const [language, setLanguage] = useState<Language>("hi");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (userContent: string) => {
      if (!userContent.trim() || isLoading) return;

      // Detect language from user input
      const detectedLang = await detectLanguage(userContent);
      setLanguage(detectedLang);

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: userContent,
        language: detectedLang,
        timestamp: new Date()
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      // Placeholder assistant message for streaming
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          language: detectedLang,
          timestamp: new Date()
        }
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map(m => ({
              role: m.role,
              content: m.content
            })),
            language: detectedLang,
            currentFD
          }),
          signal: controller.signal
        });

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data) as { text: string; language: Language };
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.text }
                    : m
                )
              );
            } catch {}
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? { ...m, content: "माफ करें, कुछ गड़बड़ हो गई। दोबारा कोशिश करें।" }
                : m
            )
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, currentFD]
  );

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsLoading(false);
  }, []);

  return { messages, language, isLoading, sendMessage, clearChat, setLanguage };
}
