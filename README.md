# Arth Saathi — Vernacular FD Advisor

A multilingual Fixed Deposit advisor for Hindi, Bhojpuri & Awadhi speakers. Built for people in Gorakhpur and UP who want to understand and book FDs in their own language.

---

## Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | Next.js 14 (App Router)       |
| AI         | Gemini 1.5 Flash + Groq (Llama 3) via Google AI SDK & Groq SDK |
| Streaming  | SSE (native ReadableStream)   |
| Language   | franc-min (auto-detect)       |
| i18n fonts | Noto Sans Devanagari          |
| Voice      | Web Speech API                |
| State      | XState v5 (booking machine)   |
| Storage    | localStorage (client-side)    |
| Deployment | Vercel                        |

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd arth-saathi
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
GEMINI_API_KEY=AIza...           ← from aistudio.google.com/apikey (FREE)
GROQ_API_KEY=gsk_...              ← from console.groq.com (FREE tier)
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note**: No database setup needed! All FD rates and bookings are stored in `localStorage` — works offline and persists across sessions.

---

## Deploy to Vercel

```bash
npx vercel
```

Add the same environment variables in your Vercel project settings.

---

## Features

### Multilingual Chat (Gemini + Groq)
- Auto-detects Hindi, Bhojpuri, Awadhi, English from user input
- Responds in the same language
- Gemini 1.5 Flash for general conversation + Groq (Llama 3) for fast FD-specific queries
- System prompt has a full FD jargon glossary (p.a., tenor, maturity, TDS, DICGC...)
- Voice input via Web Speech API (Hindi ASR)

### FD Rate Browser
- Rates stored in `localStorage` with seeded default data
- Sorted by interest rate (highest first)
- Shows maturity amount for ₹10,000 example
- DICGC insurance badge on small finance banks
- Senior citizen rates highlighted
- Users can add/edit rates (persists in localStorage)

### Booking Flow (XState)
```
idle → fd_selected → amount_input → tenor_confirmed
     → personal_details → kyc_pending → confirmed
```
- State machine ensures users can't skip steps
- Maturity calculator with quarterly compounding
- Mock KYC (DigiLocker integration ready)
- Booking confirmation with ID
- All bookings saved to `localStorage`

---

## Project Structure

```
arth-saathi/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      ← Gemini + Groq streaming endpoint
│   │   └── rates/route.ts     ← localStorage rates API
│   ├── layout.tsx             ← Fonts, metadata
│   ├── page.tsx               ← Main 3-column layout
│   └── globals.css
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx     ← Full chat UI
│   │   ├── ChatBubble.tsx     ← Message bubbles
│   │   └── ChatInput.tsx      ← Input + voice + quick prompts
│   ├── fd/
│   │   ├── FDList.tsx         ← Rates panel
│   │   └── FDCard.tsx         ← Individual rate card
│   ├── booking/
│   │   ├── BookingFlow.tsx    ← All booking steps
│   │   └── BookingSteps.tsx   ← Progress indicator
│   └── ui/
│       ├── LanguageSelector.tsx
│       ├── VoiceButton.tsx
│       └── TypingIndicator.tsx
├── hooks/
│   ├── useChat.ts             ← Chat state + streaming
│   ├── useFDRates.ts          ← FD data fetching (localStorage)
│   └── useVoiceInput.ts       ← Web Speech API
├── lib/
│   ├── storage.ts             ← localStorage CRUD operations
│   ├── language.ts            ← franc-min detection
│   ├── prompts.ts             ← System prompt + jargon
│   ├── calculations.ts        ← Maturity math
│   └── booking-machine.ts     ← XState machine
├── data/
│   └── defaultRates.ts        ← Seeded FD rates data
└── types/index.ts             ← All TypeScript types
```

---

## localStorage Structure

```javascript
// FD Rates
localStorage.setItem('fd_rates', JSON.stringify([
  {
    id: '1',
    bankName: 'Suryoday SFB',
    interestRate: 8.5,
    tenorMonths: 12,
    minAmount: 10000,
    isSmallFinanceBank: true,
    seniorCitizenRate: 9.1
  }
]))

// Bookings
localStorage.setItem('bookings', JSON.stringify([
  {
    id: 'FD_12345',
    fdId: '1',
    amount: 50000,
    customerName: 'Rajesh Kumar',
    status: 'confirmed',
    createdAt: '2026-04-20T10:30:00Z'
  }
]))
```

---

## Demo Script 

1. **Open the app** → Show FD rates panel with default bank data
2. **Select Suryoday SFB** (8.5%) → Card highlights, chat gets context
3. **Switch to Chat tab** → Ask in Hindi: "यह बैंक कितना सुरक्षित है?"
4. **Test Gemini response** → Ask "Compare 1 year vs 5 year FD"
5. **Test Groq speed** → Ask "What does 8.50% p.a. mean?" — notice faster response
6. **Use voice input** → Speak in Hindi, show transcript filling the input
7. **Switch to Booking** → Enter ₹50,000 → See maturity calculator
8. **Complete the flow** → Show booking confirmation ID
9. **Refresh the page** → Show that rates & bookings persist in localStorage


---

## License

MIT

---

**Arth Saathi** — Your Financial Companion in Your Language 🇮🇳
