"use client";
import { useState, useEffect } from "react";
import { FDRate } from "@/types";
import { MOCK_RATES } from "@/lib/fdRates";

export function useFDRates(featured?: boolean) {
  const [rates, setRates] = useState<FDRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = featured ? "/api/rates?featured=true" : "/api/rates";
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setRates(data.rates ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback mock data so the app works without Supabase during dev
        setRates(MOCK_RATES);
        setIsLoading(false);
        setError("Using mock data — connect Supabase for live rates");
      });
  }, [featured]);

  return { rates, isLoading, error };
}

