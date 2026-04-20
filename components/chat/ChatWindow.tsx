"use client";
import { useEffect, useRef } from "react";
import { FDRate } from "@/types";
import { useChat } from "@/hooks/useChat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { MessageSquare } from "lucide-react";

interface Props {
  currentFD: FDRate | null;
}

export function ChatWindow({ currentFD }: Props) {
  const { messages, language, isLoading, sendMessage, setLanguage } = useChat(currentFD);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-ink-50">
      {/* Chat header */}
      <div className="px-4 pt-4 pb-3 bg-white border-b border-ink-100 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-saffron-500 flex items-center justify-center shadow-sm">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-ink-900 text-base leading-tight">
              अर्थ साथी
            </h2>
            <p className="text-xs text-ink-400 devanagari">
              आपका विश्वसनीय FD सलाहकार
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-ink-400">Online</span>
          </div>
        </div>
        <LanguageSelector current={language} onChange={setLanguage} />
      </div>

      {/* Messages area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="ml-10">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* FD context banner */}
      {currentFD && (
        <div className="mx-4 mb-2 px-3 py-2 bg-saffron-50 border border-saffron-200 rounded-xl flex items-center gap-2">
          <span className="text-saffron-500 text-xs">●</span>
          <p className="text-xs text-saffron-700 devanagari">
            <span className="font-medium">{currentFD.bank_name_hi}</span> —{" "}
            {currentFD.interest_rate}% ब्याज · {currentFD.tenor_months} महीने
          </p>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} language={language} />
    </div>
  );
}
