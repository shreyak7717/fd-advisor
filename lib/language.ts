import { Language } from "@/types";

// franc-min language code → our Language type
const FRANC_TO_LANG: Record<string, Language> = {
  hin: "hi",  // Hindi
  bho: "bho", // Bhojpuri
  awa: "awa", // Awadhi
  eng: "en"
};

export async function detectLanguage(text: string): Promise<Language> {
  if (!text || text.trim().length < 5) return "hi"; // default to Hindi

  try {
    // Dynamic import to avoid SSR issues
    const { franc } = await import("franc-min");
    const detected = franc(text, {
      only: ["hin", "bho", "awa", "eng"]
    });

    return FRANC_TO_LANG[detected] ?? "hi";
  } catch {
    return "hi";
  }
}

// Language to BCP-47 for Web Speech API
export const LANG_TO_BCP47: Record<Language, string> = {
  hi: "hi-IN",
  bho: "hi-IN", // Bhojpuri falls back to Hindi ASR
  awa: "hi-IN", // Awadhi falls back to Hindi ASR
  en: "en-IN"
};

// System prompt instructions per language
export const LANG_INSTRUCTIONS: Record<Language, string> = {
  hi: "सरल हिन्दी में जवाब दें। वित्तीय शब्दों को आम भाषा में समझाएं।",
  bho: "भोजपुरी में जवाब दिहीं। गोरखपुर के आम आदमी के समझे लायक भाषा में।",
  awa: "अवधी में जवाब दिहीं। अवध के आम आदमी के समझे लायक भाषा में।",
  en: "Reply in simple English. Avoid financial jargon."
};
