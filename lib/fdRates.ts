import { FDRate } from "@/types";

export const MOCK_RATES: FDRate[] = [
  {
    id: "1",
    bank_name: "Suryoday Small Finance Bank",
    bank_name_hi: "सूर्योदय स्मॉल फाइनेंस बैंक",
    bank_type: "small_finance",
    interest_rate: 8.5,
    tenor_months: 12,
    min_amount: 1000,
    max_amount: null,
    senior_citizen_rate: 9.0,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    bank_name: "Jana Small Finance Bank",
    bank_name_hi: "जना स्मॉल फाइनेंस बैंक",
    bank_type: "small_finance",
    interest_rate: 8.25,
    tenor_months: 12,
    min_amount: 1000,
    max_amount: null,
    senior_citizen_rate: 8.75,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    bank_name: "Ujjivan Small Finance Bank",
    bank_name_hi: "उज्जीवन स्मॉल फाइनेंस बैंक",
    bank_type: "small_finance",
    interest_rate: 7.9,
    tenor_months: 12,
    min_amount: 1000,
    max_amount: null,
    senior_citizen_rate: 8.4,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    bank_name: "AU Small Finance Bank",
    bank_name_hi: "एयू स्मॉल फाइनेंस बैंक",
    bank_type: "small_finance",
    interest_rate: 7.75,
    tenor_months: 12,
    min_amount: 1000,
    max_amount: null,
    senior_citizen_rate: 8.25,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: "5",
    bank_name: "State Bank of India",
    bank_name_hi: "भारतीय स्टेट बैंक",
    bank_type: "public",
    interest_rate: 6.8,
    tenor_months: 12,
    min_amount: 1000,
    max_amount: null,
    senior_citizen_rate: 7.3,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: "6",
    bank_name: "HDFC Bank",
    bank_name_hi: "एचडीएफसी बैंक",
    bank_type: "private",
    interest_rate: 7.1,
    tenor_months: 12,
    min_amount: 5000,
    max_amount: null,
    senior_citizen_rate: 7.6,
    is_featured: false,
    created_at: new Date().toISOString()
  }
];
