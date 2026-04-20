"use client";
import { useState, useEffect, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Language } from "@/types";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import clsx from "clsx";

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
  language: Language;
}

const QUICK_PROMPTS: Record<Language, string[]> = {
  hi: ["FD क्या होता है?", "ब्याज कैसे मिलता है?", "पैसा कितना सुरक्षित है?", "बुकिंग कैसे करें?"],
  bho: ["FD का मतलब का हऊ?", "ब्याज केतना मिलत बा?", "पईसा सुरक्षित बा का?"],
  awa: ["FD कहत हैं केका?", "ब्याज कइसे मिलत है?", "बुकिंग कइसे होय?"],
  en: ["What is an FD?", "How is interest calculated?", "Is my money safe?", "How to book?"]
};

export function ChatInput({ onSend, isLoading, language }: Props) {
  const [input, setInput] = useState("");
  const { voiceState, startListening, stopListening } = useVoiceInput(language);

  // Auto-fill input from voice transcript
  useEffect(() => {
    if (voiceState.transcript) {
      setInput(voiceState.transcript);
    }
  }, [voiceState.transcript]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    onSend(text);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = QUICK_PROMPTS[language] ?? QUICK_PROMPTS.hi;

  return (
    <div className="border-t border-ink-100 bg-white/80 backdrop-blur-sm p-4 space-y-3">
      {/* Quick prompt chips */}
      {!input && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {quickPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => onSend(prompt)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1.5 text-xs bg-ink-50 border border-ink-100 text-ink-600 rounded-full hover:bg-saffron-50 hover:border-saffron-200 hover:text-saffron-700 transition-all duration-150 devanagari whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Voice error */}
      {voiceState.error && (
        <p className="text-xs text-red-500 px-1">{voiceState.error}</p>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <VoiceButton
          isListening={voiceState.isListening}
          onStart={startListening}
          onStop={stopListening}
          disabled={isLoading}
        />

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === "hi"
              ? "हिन्दी में पूछें... (Enter भेजें)"
              : language === "bho"
              ? "भोजपुरी में पूछीं..."
              : language === "awa"
              ? "अवधी में पूछीं..."
              : "Ask in English..."
          }
          rows={1}
          disabled={isLoading}
          className={clsx(
            "flex-1 resize-none rounded-xl border border-ink-200 bg-ink-50",
            "px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-300",
            "focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent",
            "transition-all duration-150 devanagari leading-relaxed",
            "min-h-[44px] max-h-[120px]",
            isLoading && "opacity-50"
          )}
          style={{ fieldSizing: "content" } as any}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={clsx(
            "flex items-center justify-center w-10 h-10 rounded-full",
            "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:ring-offset-2",
            input.trim() && !isLoading
              ? "bg-saffron-500 text-white hover:bg-saffron-600 active:scale-95"
              : "bg-ink-100 text-ink-300 cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
