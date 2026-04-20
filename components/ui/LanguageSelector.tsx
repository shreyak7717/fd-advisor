"use client";
import { Language, LANGUAGE_NAMES } from "@/types";
import clsx from "clsx";

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

const LANGUAGES: Language[] = ["hi", "bho", "awa", "en"];

export function LanguageSelector({ current, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-ink-100 rounded-xl">
      {LANGUAGES.map(lang => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={clsx(
            "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
            "font-body devanagari",
            current === lang
              ? "bg-white text-ink-800 shadow-sm"
              : "text-ink-400 hover:text-ink-600"
          )}
        >
          {LANGUAGE_NAMES[lang]}
        </button>
      ))}
    </div>
  );
}
