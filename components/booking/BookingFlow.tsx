"use client";
import { useMachine } from "@xstate/react";
import { useState } from "react";
import { FDRate } from "@/types";
import { bookingMachine } from "@/lib/booking-machine";
import { BookingSteps } from "./BookingSteps";
import {
  calculateMaturity,
  formatINR,
  tenorLabel,
  formatINRWords
} from "@/lib/calculations";
import { CheckCircle2, ArrowRight, Landmark } from "lucide-react";
import clsx from "clsx";

interface Props {
  selectedFD: FDRate | null;
}

export function BookingFlow({ selectedFD }: Props) {
  const [state, send] = useMachine(bookingMachine);
  const ctx = state.context;

  // Form states
  const [amountInput, setAmountInput] = useState("");
  const [formData, setFormData] = useState({ fullName: "", phone: "", panNumber: "" });
  const [formError, setFormError] = useState("");

  // Sync selected FD from parent into machine
  if (
    selectedFD &&
    selectedFD.id !== ctx.selectedFD?.id &&
    state.matches("idle")
  ) {
    send({ type: "SELECT_FD", fd: selectedFD });
  }

  const currentStep = state.value as string;

  // ─── IDLE ───────────────────────────────────────────────────────────────
  if (state.matches("idle")) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-saffron-50 border border-saffron-200 flex items-center justify-center">
          <Landmark className="w-6 h-6 text-saffron-500" />
        </div>
        <div>
          <h3 className="font-display font-bold text-ink-900 text-lg">FD बुकिंग</h3>
          <p className="text-sm text-ink-400 devanagari mt-1">
            बाईं तरफ से कोई FD चुनें, फिर बुकिंग शुरू होगी
          </p>
        </div>
      </div>
    );
  }

  // ─── FD SELECTED ────────────────────────────────────────────────────────
  if (state.matches("fd_selected") && ctx.selectedFD) {
    const fd = ctx.selectedFD;
    const minAmt = fd.min_amount;

    const handleAmount = () => {
      const amt = parseInt(amountInput.replace(/,/g, ""), 10);
      if (!amt || amt < minAmt) {
        setFormError(`न्यूनतम राशि ${formatINR(minAmt)} है`);
        return;
      }
      setFormError("");
      send({ type: "SET_AMOUNT", amount: amt });
    };

    return (
      <StepWrapper step={currentStep} title="निवेश राशि चुनें">
        <div className="bg-saffron-50 border border-saffron-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-ink-500 devanagari mb-0.5">चुना गया FD</p>
          <p className="font-display font-bold text-ink-900">{fd.bank_name_hi}</p>
          <p className="text-saffron-600 font-bold text-lg">{fd.interest_rate}% · {tenorLabel(fd.tenor_months)}</p>
        </div>

        <label className="block text-sm font-medium text-ink-700 devanagari mb-2">
          कितना पैसा जमा करना चाहते हैं?
        </label>
        <div className="relative mb-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 font-bold">₹</span>
          <input
            type="number"
            min={minAmt}
            step={1000}
            value={amountInput}
            onChange={e => setAmountInput(e.target.value)}
            placeholder={`जैसे 50000`}
            className="w-full pl-8 pr-4 py-3 rounded-xl border border-ink-200 bg-white text-ink-900 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent"
          />
        </div>

        {amountInput && !formError && (
          <p className="text-xs text-ink-500 devanagari mb-1">
            = {formatINRWords(parseInt(amountInput, 10) || 0)}
          </p>
        )}
        {formError && <p className="text-xs text-red-500 devanagari mb-2">{formError}</p>}

        <SuggestedAmounts
          min={minAmt}
          onPick={v => setAmountInput(String(v))}
        />

        <PrimaryBtn onClick={handleAmount}>आगे बढ़ें →</PrimaryBtn>
      </StepWrapper>
    );
  }

  // ─── AMOUNT INPUT ────────────────────────────────────────────────────────
  if (state.matches("amount_input") && ctx.selectedFD && ctx.amount) {
    const fd = ctx.selectedFD;
    const maturity = calculateMaturity(ctx.amount, fd.interest_rate, fd.tenor_months);
    const interest = maturity - ctx.amount;

    return (
      <StepWrapper step={currentStep} title="अवधि की पुष्टि करें">
        <MaturityCard
          principal={ctx.amount}
          maturity={maturity}
          interest={interest}
          tenor={fd.tenor_months}
          rate={fd.interest_rate}
        />
        <p className="text-sm text-ink-600 devanagari mb-4">
          {tenorLabel(fd.tenor_months)} बाद आपको{" "}
          <strong>{formatINR(Math.round(maturity))}</strong> मिलेंगे।
          इसमें <strong>{formatINR(Math.round(interest))}</strong> का ब्याज शामिल है।
        </p>
        <PrimaryBtn onClick={() => send({ type: "CONFIRM_TENOR" })}>
          हाँ, यह ठीक है →
        </PrimaryBtn>
        <SecondaryBtn onClick={() => send({ type: "RESET" })}>
          वापस जाएं
        </SecondaryBtn>
      </StepWrapper>
    );
  }

  // ─── TENOR CONFIRMED ─────────────────────────────────────────────────────
  if (state.matches("tenor_confirmed")) {
    const handleDetails = () => {
      if (!formData.fullName.trim()) { setFormError("नाम जरूरी है"); return; }
      if (!/^[6-9]\d{9}$/.test(formData.phone)) { setFormError("सही मोबाइल नंबर डालें"); return; }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber.toUpperCase())) {
        setFormError("PAN नंबर सही नहीं है (जैसे ABCDE1234F)"); return;
      }
      setFormError("");
      send({
        type: "SET_DETAILS",
        fullName: formData.fullName,
        phone: formData.phone,
        panNumber: formData.panNumber.toUpperCase()
      });
    };

    return (
      <StepWrapper step={currentStep} title="व्यक्तिगत जानकारी">
        <div className="space-y-3 mb-4">
          <FormField
            label="पूरा नाम"
            placeholder="जैसे राम प्रसाद गुप्ता"
            value={formData.fullName}
            onChange={v => setFormData(p => ({ ...p, fullName: v }))}
          />
          <FormField
            label="मोबाइल नंबर"
            placeholder="10 अंकों का नंबर"
            type="tel"
            value={formData.phone}
            onChange={v => setFormData(p => ({ ...p, phone: v }))}
          />
          <FormField
            label="PAN नंबर"
            placeholder="ABCDE1234F"
            value={formData.panNumber}
            onChange={v => setFormData(p => ({ ...p, panNumber: v.toUpperCase() }))}
          />
        </div>
        {formError && <p className="text-xs text-red-500 devanagari mb-3">{formError}</p>}
        <PrimaryBtn onClick={handleDetails}>आगे बढ़ें →</PrimaryBtn>
      </StepWrapper>
    );
  }

  // ─── PERSONAL DETAILS / KYC ──────────────────────────────────────────────
  if (state.matches("personal_details")) {
    return (
      <StepWrapper step={currentStep} title="KYC — पहचान जांच">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-blue-800 devanagari mb-1">
            आधार से KYC करें
          </p>
          <p className="text-xs text-blue-600 devanagari">
            यह एक demo है। असल ऐप में DigiLocker से आधार लिंक होगा।
          </p>
        </div>
        <div className="space-y-2 mb-4 text-sm text-ink-600 devanagari">
          <p>✅ नाम: <strong>{ctx.fullName}</strong></p>
          <p>✅ मोबाइल: <strong>{ctx.phone}</strong></p>
          <p>✅ PAN: <strong>{ctx.panNumber}</strong></p>
        </div>
        <PrimaryBtn onClick={() => send({ type: "COMPLETE_KYC" })}>
          KYC पूरी करें (Mock) →
        </PrimaryBtn>
      </StepWrapper>
    );
  }

  // ─── KYC PENDING / REVIEW ────────────────────────────────────────────────
  if (state.matches("kyc_pending") && ctx.selectedFD && ctx.amount) {
    const fd = ctx.selectedFD;
    const maturity = calculateMaturity(ctx.amount, fd.interest_rate, fd.tenor_months);

    return (
      <StepWrapper step={currentStep} title="बुकिंग की समीक्षा">
        <div className="space-y-2 text-sm mb-4">
          <ReviewRow label="बैंक" value={fd.bank_name_hi} />
          <ReviewRow label="ब्याज दर" value={`${fd.interest_rate}% प्रति वर्ष`} />
          <ReviewRow label="अवधि" value={tenorLabel(fd.tenor_months)} />
          <ReviewRow label="राशि" value={formatINR(ctx.amount)} />
          <ReviewRow label="परिपक्वता राशि" value={formatINR(Math.round(maturity))} highlight />
          <ReviewRow label="नाम" value={ctx.fullName} />
          <ReviewRow label="PAN" value={ctx.panNumber} />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <p className="text-xs text-amber-700 devanagari">
            ⚠️ यह एक demo है। असल पैसे नहीं लगेंगे। वास्तविक बुकिंग के लिए सीधे बैंक से संपर्क करें।
          </p>
        </div>

        <PrimaryBtn onClick={() => send({ type: "CONFIRM_BOOKING" })}>
          बुकिंग पक्की करें ✓
        </PrimaryBtn>
        <SecondaryBtn onClick={() => send({ type: "RESET" })}>रद्द करें</SecondaryBtn>
      </StepWrapper>
    );
  }

  // ─── CONFIRMED ───────────────────────────────────────────────────────────
  if (state.matches("confirmed") && ctx.selectedFD && ctx.amount) {
    const fd = ctx.selectedFD;
    const maturity = calculateMaturity(ctx.amount, fd.interest_rate, fd.tenor_months);

    return (
      <div className="flex flex-col items-center text-center px-6 py-8 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="font-display font-bold text-ink-900 text-xl">बधाई हो! 🎉</h3>
          <p className="text-sm text-ink-500 devanagari mt-1">आपकी FD बुकिंग हो गई</p>
        </div>

        <div className="w-full bg-ink-50 rounded-2xl p-4 text-left space-y-2">
          <p className="text-xs text-ink-400 devanagari">बुकिंग ID</p>
          <p className="font-mono font-bold text-ink-900 text-lg tracking-wider">
            {ctx.bookingId}
          </p>
          <div className="border-t border-ink-200 pt-2 mt-2 space-y-1 text-sm text-ink-600 devanagari">
            <p>{fd.bank_name_hi}</p>
            <p>{formatINR(ctx.amount)} → <strong>{formatINR(Math.round(maturity))}</strong></p>
            <p>{tenorLabel(fd.tenor_months)} में</p>
          </div>
        </div>

        <SecondaryBtn onClick={() => send({ type: "RESET" })}>
          नई FD बुक करें
        </SecondaryBtn>
      </div>
    );
  }

  return null;
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function StepWrapper({
  children,
  step,
  title
}: {
  children: React.ReactNode;
  step: string;
  title: string;
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <BookingSteps currentStep={step as any} />
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 scrollbar-thin">
        <h3 className="font-display font-bold text-ink-900 text-base mb-4 devanagari">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 bg-saffron-500 hover:bg-saffron-600 active:scale-98 text-white font-bold rounded-xl transition-all duration-150 devanagari mt-2"
    >
      {children}
    </button>
  );
}

function SecondaryBtn({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 border border-ink-200 text-ink-500 hover:text-ink-700 hover:border-ink-300 rounded-xl transition-all duration-150 devanagari mt-2 text-sm"
    >
      {children}
    </button>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-600 devanagari mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-ink-200 bg-white text-ink-900 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent devanagari"
      />
    </div>
  );
}

function ReviewRow({
  label,
  value,
  highlight
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-ink-100">
      <span className="text-ink-400 devanagari">{label}</span>
      <span
        className={clsx(
          "font-medium devanagari",
          highlight ? "text-saffron-600 font-bold text-base" : "text-ink-800"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function MaturityCard({
  principal,
  maturity,
  interest,
  tenor,
  rate
}: {
  principal: number;
  maturity: number;
  interest: number;
  tenor: number;
  rate: number;
}) {
  return (
    <div className="bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-2xl p-4 mb-4 text-white">
      <p className="text-saffron-100 text-xs devanagari mb-1">
        {tenorLabel(tenor)} में मिलेगा
      </p>
      <p className="font-display font-bold text-3xl">{formatINR(Math.round(maturity))}</p>
      <div className="flex gap-4 mt-3 text-sm">
        <div>
          <p className="text-saffron-200 text-xs devanagari">आपका पैसा</p>
          <p className="font-semibold">{formatINR(principal)}</p>
        </div>
        <div>
          <p className="text-saffron-200 text-xs devanagari">ब्याज</p>
          <p className="font-semibold text-yellow-300">+{formatINR(Math.round(interest))}</p>
        </div>
        <div>
          <p className="text-saffron-200 text-xs devanagari">दर</p>
          <p className="font-semibold">{rate}% p.a.</p>
        </div>
      </div>
    </div>
  );
}

function SuggestedAmounts({
  min,
  onPick
}: {
  min: number;
  onPick: (v: number) => void;
}) {
  const suggestions = [10000, 25000, 50000, 100000].filter(v => v >= min);
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {suggestions.map(v => (
        <button
          key={v}
          onClick={() => onPick(v)}
          className="px-3 py-1.5 rounded-full text-xs border border-ink-200 text-ink-600 hover:border-saffron-400 hover:text-saffron-600 transition-all"
        >
          {formatINR(v)}
        </button>
      ))}
    </div>
  );
}
