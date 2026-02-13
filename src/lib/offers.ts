import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { formatCurrency, type QuoteResult } from "@/utils/quote";

export type Offer = {
  id: string;
  title: string;
  message?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  discount_type: "percent" | "amount";
  discount_value: number;
  enabled: boolean;
  start_at?: string | null;
  end_at?: string | null;
  created_at?: string | null;
};

export type OfferSummary = {
  id: string;
  title: string;
  message?: string | null;
  label: string;
  discountAmount: number;
};

const roundToNearest5 = (value: number) => Math.round(value / 5) * 5;

const isOfferActive = (offer: Offer, now = new Date()) => {
  if (!offer.enabled) return false;
  if (offer.start_at) {
    const start = new Date(offer.start_at);
    if (now < start) return false;
  }
  if (offer.end_at) {
    const end = new Date(offer.end_at);
    if (now > end) return false;
  }
  return true;
};

export const formatOfferLabel = (offer: Offer) => {
  if (offer.discount_type === "percent") {
    return `${offer.discount_value}% off`;
  }
  return `${formatCurrency(offer.discount_value)} off`;
};

export const getActiveOffer = async (): Promise<Offer | null> => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    return null;
  }

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/offers?select=*`,
    {
      headers: supabaseHeaders,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as Offer[];
  const now = new Date();
  const active = data
    .filter((offer) => isOfferActive(offer, now))
    .sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bDate - aDate;
    });

  return active[0] ?? null;
};

export const applyOfferToPrice = (basePrice: number, offer?: Offer | null) => {
  if (!offer) {
    return { finalPrice: basePrice, discountAmount: 0, offerSummary: null };
  }

  const safeBase = Math.max(0, basePrice);
  const rawDiscount =
    offer.discount_type === "percent"
      ? (safeBase * Math.max(0, Math.min(offer.discount_value, 100))) / 100
      : Math.max(0, offer.discount_value);

  const finalPrice = Math.max(0, roundToNearest5(safeBase - rawDiscount));
  const discountAmount = Math.max(0, safeBase - finalPrice);
  if (discountAmount <= 0) {
    return { finalPrice: basePrice, discountAmount: 0, offerSummary: null };
  }

  const offerSummary: OfferSummary = {
    id: offer.id,
    title: offer.title,
    message: offer.message ?? null,
    label: formatOfferLabel(offer),
    discountAmount,
  };

  return { finalPrice, discountAmount, offerSummary };
};

export const applyOfferToQuote = (quote: QuoteResult, offer?: Offer | null) => {
  const { finalPrice, discountAmount, offerSummary } = applyOfferToPrice(
    quote.perVisitPrice,
    offer,
  );

  if (!offerSummary || discountAmount <= 0) {
    return { quote, offerSummary: null };
  }

  const monthlyEstimate =
    quote.monthlyEstimate && quote.visitsPerMonth
      ? Math.max(0, quote.monthlyEstimate - discountAmount * quote.visitsPerMonth)
      : quote.monthlyEstimate;

  const paymentSummary = quote.visitsPerMonth
    ? `${formatCurrency(finalPrice)} per visit, billed ${quote.frequencyLabel.toLowerCase()}`
    : `One-time total of ${formatCurrency(finalPrice)}`;

  return {
    quote: {
      ...quote,
      perVisitPrice: finalPrice,
      monthlyEstimate,
      paymentSummary,
    },
    offerSummary,
  };
};
