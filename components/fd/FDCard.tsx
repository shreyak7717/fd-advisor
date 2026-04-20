"use client";
import { FDRate } from "@/types";
import { formatINR, tenorLabel, calculateMaturity } from "@/lib/calculations";
import { Shield, TrendingUp, Clock } from "lucide-react";
import clsx from "clsx";

interface Props {
  rate: FDRate;
  isSelected: boolean;
  onSelect: (rate: FDRate) => void;
}

const BANK_TYPE_LABELS: Record<FDRate["bank_type"], { hi: string; color: string }> = {
  small_finance: { hi: "स्मॉल फाइनेंस बैंक", color: "text-saffron-600 bg-saffron-50 border-saffron-200" },
  public:        { hi: "सरकारी बैंक",         color: "text-blue-600 bg-blue-50 border-blue-200" },
  private:       { hi: "प्राइवेट बैंक",        color: "text-purple-600 bg-purple-50 border-purple-200" },
  cooperative:   { hi: "सहकारी बैंक",          color: "text-green-600 bg-green-50 border-green-200" }
};

export function FDCard({ rate, isSelected, onSelect }: Props) {
  const maturityOn10k = calculateMaturity(10000, rate.interest_rate, rate.tenor_months);
  const interestOn10k = maturityOn10k - 10000;
  const typeInfo = BANK_TYPE_LABELS[rate.bank_type];

  return (
    <button
      onClick={() => onSelect(rate)}
      className={clsx(
        "fd-card w-full text-left rounded-2xl border p-4 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:ring-offset-2",
        isSelected
          ? "border-saffron-400 bg-white shadow-md ring-2 ring-saffron-400 ring-offset-1"
          : "border-ink-100 bg-white hover:border-ink-200"
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-display font-bold text-ink-900 text-sm leading-snug">
            {rate.bank_name_hi}
          </p>
          <p className="text-xs text-ink-400 mt-0.5">{rate.bank_name}</p>
        </div>
        <span
          className={clsx(
            "text-[10px] font-medium px-2 py-0.5 rounded-full border devanagari",
            typeInfo.color
          )}
        >
          {typeInfo.hi}
        </span>
      </div>

      {/* Rate + tenor */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-saffron-500" />
          <span className="font-display font-bold text-2xl text-saffron-600">
            {rate.interest_rate}%
          </span>
          <span className="text-xs text-ink-400 devanagari">प्रति वर्ष</span>
        </div>
        <div className="flex items-center gap-1.5 text-ink-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-sm devanagari">{tenorLabel(rate.tenor_months)}</span>
        </div>
      </div>

      {/* ₹10,000 example */}
      <div className="bg-ink-50 rounded-xl p-3 mb-3">
        <p className="text-[11px] text-ink-400 devanagari mb-1">
          ₹10,000 जमा करने पर {tenorLabel(rate.tenor_months)} बाद:
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-ink-900 text-base">
            {formatINR(Math.round(maturityOn10k))}
          </span>
          <span className="text-xs text-green-600 devanagari">
            +{formatINR(Math.round(interestOn10k))} ब्याज
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-green-600">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[11px] devanagari">DICGC बीमा ₹5 लाख</span>
        </div>
        <div className="text-[11px] text-ink-400 devanagari">
          न्यूनतम {formatINR(rate.min_amount)}
        </div>
      </div>

      {rate.senior_citizen_rate && (
        <p className="mt-2 text-[10px] text-saffron-600 devanagari">
          ⭐ वरिष्ठ नागरिक: {rate.senior_citizen_rate}% प्रति वर्ष
        </p>
      )}

      {isSelected && (
        <div className="mt-3 pt-3 border-t border-saffron-200 text-center">
          <span className="text-xs font-medium text-saffron-600 devanagari">
            ✓ चुना गया — नीचे बुकिंग शुरू करें
          </span>
        </div>
      )}
    </button>
  );
}
