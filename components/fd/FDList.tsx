"use client";
import { FDRate } from "@/types";
import { FDCard } from "./FDCard";
import { useFDRates } from "@/hooks/useFDRates";
import { Loader2, TrendingUp } from "lucide-react";

interface Props {
  selectedFD: FDRate | null;
  onSelect: (rate: FDRate) => void;
}

export function FDList({ selectedFD, onSelect }: Props) {
  const { rates, isLoading, error } = useFDRates();

  return (
    <div className="flex flex-col h-full min-h-0 bg-ink-50">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-white border-b border-ink-100">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-saffron-500" />
          <h2 className="font-display font-bold text-ink-900 text-base">
            FD दरें
          </h2>
        </div>
        <p className="text-xs text-ink-400 devanagari">
          सर्वोत्तम ब्याज दर के अनुसार क्रमबद्ध
        </p>
        {error && (
          <p className="mt-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-lg devanagari">
            ℹ {error}
          </p>
        )}
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 text-saffron-400 animate-spin" />
          </div>
        ) : (
          rates.map(rate => (
            <FDCard
              key={rate.id}
              rate={rate}
              isSelected={selectedFD?.id === rate.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
