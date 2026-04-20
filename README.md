# एफडी मित्र — Vernacular FD Advisor

A multilingual Fixed Deposit advisor for Hindi, Bhojpuri & Awadhi speakers.
Built for people in Gorakhpur and UP who want to understand and book FDs in their own language.

---

## Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | Next.js 14 (App Router)       |
| AI         | Gemini 1.5 Flash (free tier) via Google AI SDK |
| Streaming  | SSE (native ReadableStream)   |
| Language   | franc-min (auto-detect)       |
| i18n fonts | Noto Sans Devanagari          |
| Voice      | Web Speech API                |
| State      | XState v5 (booking machine)   |
| Database   | Supabase (Postgres)           |
| Deployment | Vercel                        |

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd fd-advisor
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
GEMINI_API_KEY=AIza...           ← from aistudio.google.com/apikey (FREE)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Open the SQL Editor
3. Copy the SQL from `lib/supabase.ts` (the big comment block)
4. Run it — this creates the `fd_rates` and `bookings` tables and seeds real data

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note**: The app works without Supabase too — it falls back to mock FD data automatically.

---

## Deploy to Vercel

```bash
npx vercel
```

Add the same environment variables in your Vercel project settings.

---

## Features

### Multilingual Chat
- Auto-detects Hindi, Bhojpuri, Awadhi, English from user input
- Responds in the same language
- Claude system prompt has a full FD jargon glossary (p.a., tenor, maturity, TDS, DICGC...)
- Voice input via Web Speech API (Hindi ASR)

### FD Rate Browser
- Live rates from Supabase, sorted by interest rate
- Shows maturity amount for ₹10,000 example
- DICGC insurance badge on small finance banks
- Senior citizen rates highlighted

### Booking Flow (XState)
```
idle → fd_selected → amount_input → tenor_confirmed
     → personal_details → kyc_pending → confirmed
```
- State machine ensures users can't skip steps
- Maturity calculator with quarterly compounding
- Mock KYC (DigiLocker integration ready)
- Booking confirmation with ID

---

## Project Structure

```
fd-advisor/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      ← Claude streaming endpoint
│   │   └── rates/route.ts     ← Supabase FD rates
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
│   ├── useFDRates.ts          ← FD data fetching
│   └── useVoiceInput.ts       ← Web Speech API
├── lib/
│   ├── supabase.ts            ← DB client + SQL setup
│   ├── language.ts            ← franc-min detection
│   ├── prompts.ts             ← Claude system prompt + jargon
│   ├── calculations.ts        ← Maturity math
│   └── booking-machine.ts    ← XState machine
└── types/index.ts             ← All TypeScript types
```

---

## Demo Script (for judges)

1. **Open the app** → Show FD rates panel with real bank data
2. **Select Suryoday SFB** (8.5%) → Card highlights, chat gets context
3. **Switch to Chat tab** → Ask in Hindi: "यह बैंक कितना सुरक्षित है?"
4. **Switch to English** → Ask "What does 8.50% p.a. mean?" — shows jargon simplification
5. **Use voice input** → Speak in Hindi, show transcript filling the input
6. **Switch to Booking** → Enter ₹50,000 → See maturity calculator
7. **Complete the flow** → Show booking confirmation ID

---

## Pitch Points

- **500M+ Indians** without English literacy can now understand FDs
- **₹180 lakh crore** FD market — most of it locked behind English jargon
- **B2B2C opportunity**: White-label to small finance banks as their vernacular onboarding layer
- DICGC insurance info built-in → builds trust in small finance banks
- Works on low-end Android phones (Chrome, Jio network friendly)
