// Language types
export type Language = "hi" | "bho" | "awa" | "en";

export const LANGUAGE_NAMES: Record<Language, string> = {
  hi: "हिन्दी",
  bho: "भोजपुरी",
  awa: "अवधी",
  en: "English"
};

// FD Rate types
export interface FDRate {
  id: string;
  bank_name: string;
  bank_name_hi: string;
  bank_type: "small_finance" | "public" | "private" | "cooperative";
  interest_rate: number;
  tenor_months: number;
  min_amount: number;
  max_amount: number | null;
  senior_citizen_rate: number | null;
  is_featured: boolean;
  created_at: string;
}

// Chat types
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: Language;
  timestamp: Date;
}

// Booking flow types
export type BookingStep =
  | "idle"
  | "fd_selected"
  | "amount_input"
  | "tenor_confirmed"
  | "personal_details"
  | "kyc_pending"
  | "review"
  | "confirmed";

export interface BookingContext {
  selectedFD: FDRate | null;
  amount: number | null;
  tenorMonths: number | null;
  fullName: string;
  phone: string;
  panNumber: string;
  maturityAmount: number | null;
  bookingId: string | null;
}

// Voice types
export interface VoiceState {
  isListening: boolean;
  transcript: string;
  language: Language;
  error: string | null;
}
