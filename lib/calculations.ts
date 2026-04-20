export function calculateMaturity(
  principal: number,
  annualRate: number,
  tenorMonths: number,
  compounding: "quarterly" | "simple" = "quarterly"
): number {
  const years = tenorMonths / 12;

  if (compounding === "quarterly") {
    return principal * Math.pow(1 + annualRate / 400, 4 * years);
  }
  return principal * (1 + (annualRate / 100) * years);
}

export function calculateInterestEarned(
  principal: number,
  maturity: number
): number {
  return maturity - principal;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatINRWords(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} करोड़`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} लाख`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)} हज़ार`;
  return `₹${amount}`;
}

export function tenorLabel(months: number): string {
  if (months < 12) return `${months} महीने`;
  if (months === 12) return "1 साल";
  if (months % 12 === 0) return `${months / 12} साल`;
  return `${Math.floor(months / 12)} साल ${months % 12} महीने`;
}

// Generate a fake booking ID for demo
export function generateBookingId(): string {
  return "FD" + Date.now().toString(36).toUpperCase();
}
