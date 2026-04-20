"use client";
import { useState, useRef, useCallback } from "react";
import { Language, VoiceState } from "@/types";
import { LANG_TO_BCP47 } from "@/lib/language";

export function useVoiceInput(language: Language) {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    transcript: "",
    language,
    error: null
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setVoiceState(s => ({ ...s, error: "Voice input not supported in this browser" }));
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = LANG_TO_BCP47[language];
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState(s => ({ ...s, isListening: true, error: null, transcript: "" }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceState(s => ({ ...s, transcript }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setVoiceState(s => ({
        ...s,
        isListening: false,
        error: event.error === "not-allowed"
          ? "Microphone permission denied"
          : `Voice error: ${event.error}`
      }));
    };

    recognition.onend = () => {
      setVoiceState(s => ({ ...s, isListening: false }));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const clearTranscript = useCallback(() => {
    setVoiceState(s => ({ ...s, transcript: "" }));
  }, []);

  return { voiceState, startListening, stopListening, clearTranscript };
}
