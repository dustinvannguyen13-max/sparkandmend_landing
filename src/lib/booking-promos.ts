import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import type { QuoteInput, QuoteResult } from "@/utils/quote";
import {
  FREE_BATHROOM_DISCOUNT,
  FREE_BATHROOM_PROMO_LABEL,
  FREE_BATHROOM_PROMO_TYPE,
} from "@/lib/booking-promos/constants";

export type FreeBathroomPromo = {
  type: typeof FREE_BATHROOM_PROMO_TYPE;
  label: string;
  discountAmount: number;
};

const normalizeEmail = (value?: string | null) =>
  (value || "").trim().toLowerCase();

const normalizeAddress = (value?: string | null) => (value || "").trim();

export const isResidentialService = (service?: QuoteInput["service"]) =>
  service !== "commercial";

export const isFreeBathroomEligible = (
  input: QuoteInput,
  isFirstTime: boolean,
) => {
  return (
    isFirstTime &&
    isResidentialService(input.service) &&
    Number(input.bathrooms || 0) > 0
  );
};

export const applyFreeBathroomPromo = (
  quote: Pick<QuoteResult, "perVisitPrice">,
  input: QuoteInput,
  isFirstTime: boolean,
) => {
  if (!isFreeBathroomEligible(input, isFirstTime)) {
    return { firstVisitPrice: quote.perVisitPrice, promo: null };
  }

  const discountAmount = Math.min(FREE_BATHROOM_DISCOUNT, quote.perVisitPrice);
  const firstVisitPrice = Math.max(0, quote.perVisitPrice - discountAmount);

  const promo: FreeBathroomPromo = {
    type: FREE_BATHROOM_PROMO_TYPE,
    label: FREE_BATHROOM_PROMO_LABEL,
    discountAmount,
  };

  return { firstVisitPrice, promo };
};

export const isFirstTimeCustomer = async (
  email?: string | null,
  address?: string | null,
) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedAddress = normalizeAddress(address);
  if (!normalizedEmail || !normalizedAddress) return false;
  if (!supabaseConfig.url || !supabaseHeaders) return false;

  try {
    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/bookings?select=reference,status&contact_email=eq.${encodeURIComponent(
        normalizedEmail,
      )}&contact_address=eq.${encodeURIComponent(
        normalizedAddress,
      )}&status=in.("pending","paid")&limit=1`,
      { headers: supabaseHeaders },
    );
    if (!response.ok) {
      return false;
    }
    const data = (await response.json()) as Array<{ reference: string }>;
    return data.length === 0;
  } catch {
    return false;
  }
};
