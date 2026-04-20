import { NextRequest, NextResponse } from "next/server";
import { MOCK_RATES } from "@/lib/fdRates";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured") === "true";
  const bankType = searchParams.get("bank_type");

  let rates = [...MOCK_RATES].sort((a, b) => b.interest_rate - a.interest_rate);
  if (featured) rates = rates.filter(r => r.is_featured);
  if (bankType) rates = rates.filter(r => r.bank_type === bankType);

  return NextResponse.json({ rates });
}
