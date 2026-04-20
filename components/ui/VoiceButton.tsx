"use client";
import { Mic, MicOff, Loader2 } from "lucide-react";
import clsx from "clsx";

interface Props {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function VoiceButton({ isListening, onStart, onStop, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      className={clsx(
        "relative flex items-center justify-center w-10 h-10 rounded-full",
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:ring-offset-2",
        isListening
          ? "bg-saffron-500 text-white voice-active"
          : "bg-ink-100 text-ink-400 hover:bg-ink-200 hover:text-ink-700",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      title={isListening ? "रोकें" : "बोलकर पूछें"}
    >
      {isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
