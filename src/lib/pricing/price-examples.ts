import {
  DEFAULT_QUOTE_INPUT,
  calculateQuote,
  formatCurrency,
  type Frequency,
  type QuoteInput,
} from "@/utils/quote";

const FREQUENCY_RANGE: Frequency[] = ["weekly", "bi-weekly", "monthly"];

const buildInput = (overrides: Partial<QuoteInput>): QuoteInput => ({
  ...DEFAULT_QUOTE_INPUT,
  extras: [],
  oven: "none",
  ...overrides,
});

const formatRange = (min: number, max: number) =>
  min === max
    ? formatCurrency(min)
    : `${formatCurrency(min)}-${formatCurrency(max)}`;

const buildRangeForFrequencies = (
  input: QuoteInput,
  frequencies: Frequency[]
) => {
  const prices = frequencies.map((frequency) =>
    calculateQuote({ ...input, frequency }).perVisitPrice
  );
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return { min, max, label: formatRange(min, max) };
};

const buildRangeForBathrooms = (input: QuoteInput, bathrooms: number[]) => {
  const prices = bathrooms.map((bathroomCount) =>
    calculateQuote({ ...input, bathrooms: bathroomCount }).perVisitPrice
  );
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return { min, max, label: formatRange(min, max) };
};

export const pricingTables = {
  regular: {
    title: "Regular House Cleaning (Basic Clean)",
    priceLabel: "Estimated per-visit price (weekly-monthly)",
    rows: [
      { label: "1 bed / 1 bath", bedrooms: 1, bathrooms: 1 },
      { label: "2 bed / 1 bath", bedrooms: 2, bathrooms: 1 },
      { label: "3 bed / 2 bath", bedrooms: 3, bathrooms: 2 },
      { label: "4 bed / 2 bath", bedrooms: 4, bathrooms: 2 },
    ].map((row) => ({
      label: row.label,
      estimate: buildRangeForFrequencies(
        buildInput({
          service: "basic",
          propertyType: "house",
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
        }),
        FREQUENCY_RANGE
      ).label,
    })),
  },
  deep: {
    title: "Deep Cleaning (Intermediate Clean)",
    priceLabel: "Estimated per-visit price (weekly-monthly)",
    rows: [
      { label: "1 bed / 1 bath", bedrooms: 1, bathrooms: 1 },
      { label: "2 bed / 1 bath", bedrooms: 2, bathrooms: 1 },
      { label: "3 bed / 2 bath", bedrooms: 3, bathrooms: 2 },
      { label: "4 bed / 2 bath", bedrooms: 4, bathrooms: 2 },
    ].map((row) => ({
      label: row.label,
      estimate: buildRangeForFrequencies(
        buildInput({
          service: "intermediate",
          propertyType: "house",
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
        }),
        FREQUENCY_RANGE
      ).label,
    })),
  },
  endOfTenancy: {
    title: "End of Tenancy Cleaning (Advanced Clean)",
    priceLabel: "Estimated one-time total (bathroom range shown)",
    rows: [
      { label: "1 bed / 1-2 bath", bedrooms: 1, bathrooms: [1, 2] },
      { label: "2 bed / 1-2 bath", bedrooms: 2, bathrooms: [1, 2] },
      { label: "3 bed / 2-3 bath", bedrooms: 3, bathrooms: [2, 3] },
      { label: "4 bed / 2-3 bath", bedrooms: 4, bathrooms: [2, 3] },
    ].map((row) => ({
      label: row.label,
      estimate: buildRangeForBathrooms(
        buildInput({
          service: "advanced",
          propertyType: "house",
          bedrooms: row.bedrooms,
          frequency: "one-time",
        }),
        row.bathrooms
      ).label,
    })),
  },
  commercial: {
    title: "Commercial Cleaning",
    priceLabel: "Estimated per-visit price (weekly-monthly)",
    rows: [
      { label: "3 rooms", rooms: 3 },
      { label: "6 rooms", rooms: 6 },
      { label: "10 rooms", rooms: 10 },
      { label: "15 rooms", rooms: 15 },
    ].map((row) => ({
      label: row.label,
      estimate: buildRangeForFrequencies(
        buildInput({
          service: "commercial",
          propertyType: "office",
          rooms: row.rooms,
        }),
        FREQUENCY_RANGE
      ).label,
    })),
  },
};

export const pricingExamples = [
  {
    title: "Regular cleaning example",
    detail: "2 bed, 1 bath house on a weekly schedule",
    price: formatCurrency(
      calculateQuote(
        buildInput({
          service: "basic",
          propertyType: "house",
          bedrooms: 2,
          bathrooms: 1,
          frequency: "weekly",
        })
      ).perVisitPrice
    ),
    priceLabel: "per visit",
  },
  {
    title: "Deep cleaning example",
    detail: "3 bed, 2 bath house on a monthly schedule",
    price: formatCurrency(
      calculateQuote(
        buildInput({
          service: "intermediate",
          propertyType: "house",
          bedrooms: 3,
          bathrooms: 2,
          frequency: "monthly",
        })
      ).perVisitPrice
    ),
    priceLabel: "per visit",
  },
  {
    title: "End of tenancy example",
    detail: "2 bed, 1 bath house (one-time clean)",
    price: formatCurrency(
      calculateQuote(
        buildInput({
          service: "advanced",
          propertyType: "house",
          bedrooms: 2,
          bathrooms: 1,
          frequency: "one-time",
        })
      ).perVisitPrice
    ),
    priceLabel: "one-time total",
  },
  {
    title: "Commercial example",
    detail: "6-room office on a bi-weekly schedule",
    price: formatCurrency(
      calculateQuote(
        buildInput({
          service: "commercial",
          propertyType: "office",
          rooms: 6,
          frequency: "bi-weekly",
        })
      ).perVisitPrice
    ),
    priceLabel: "per visit",
  },
];

export const pricingNotes = [
  "Examples assume no add-ons like oven or interior window cleaning.",
  "Prices are generated by the same calculator used in the quote form.",
  "Your exact price may change with property size, frequency, and add-ons.",
];

export const pricingCtas = [
  { label: "Quote Regular Cleaning", href: "/get-a-quote?service=basic" },
  { label: "Quote Deep Cleaning", href: "/get-a-quote?service=intermediate" },
  { label: "Quote End of Tenancy", href: "/get-a-quote?service=advanced" },
  { label: "Quote Commercial", href: "/get-a-quote?service=commercial" },
];
