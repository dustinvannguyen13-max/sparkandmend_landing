export type CleaningService = "basic" | "intermediate" | "advanced" | "commercial";
export type Frequency = "one-time" | "weekly" | "bi-weekly" | "monthly";
export type OvenOption = "none" | "single" | "double";
export type PropertyType =
  | "house"
  | "flat"
  | "office"
  | "restaurant"
  | "kitchen"
  | "retail"
  | "clinic"
  | "other";
export type ExtraOption =
  | "fridge"
  | "inside-cupboards"
  | "interior-windows"
  | "laundry"
  | "carpet-refresh";

export interface QuoteInput {
  service: CleaningService;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  rooms: number;
  frequency: Frequency;
  oven: OvenOption;
  extras: ExtraOption[];
}

export interface QuoteResult {
  serviceLabel: string;
  frequencyLabel: string;
  propertySummary: string;
  perVisitPrice: number;
  ovenAddon: number;
  monthlyEstimate?: number;
  visitsPerMonth?: number;
  packageItems: string[];
  addOns: string[];
  paymentSummary: string;
}

const PRICE_MULTIPLIER = 0.5;

const roundToNearest5 = (value: number) => Math.round(value / 5) * 5;

const scalePrice = (value: number) => roundToNearest5(value * PRICE_MULTIPLIER);

export const SERVICE_LABELS: Record<CleaningService, string> = {
  basic: "Basic Clean",
  intermediate: "Intermediate Clean",
  advanced: "Advanced Clean",
  commercial: "Commercial Cleaning",
};

export const SERVICE_DESCRIPTIONS: Record<CleaningService, string> = {
  basic: "Weekly or bi-weekly upkeep for homes and small offices.",
  intermediate: "A deeper, more detailed clean each visit.",
  advanced: "End-of-tenancy, seasonal, or full reset cleans.",
  commercial: "Reliable cleans for offices and workspaces.",
};

export const PROPERTY_LABELS: Record<PropertyType, string> = {
  house: "house",
  flat: "flat",
  office: "office",
  restaurant: "restaurant",
  kitchen: "commercial kitchen",
  retail: "retail space",
  clinic: "clinic",
  other: "commercial space",
};

export const RESIDENTIAL_PROPERTY_TYPES: PropertyType[] = ["house", "flat"];
export const COMMERCIAL_PROPERTY_TYPES: PropertyType[] = [
  "office",
  "restaurant",
  "kitchen",
  "retail",
  "clinic",
  "other",
];

export const PACKAGE_ITEMS: Record<CleaningService, string[]> = {
  basic: [
    "Kitchen and bathroom clean",
    "Dusting and wipe-downs",
    "Vacuum and mop floors",
    "Bins emptied and reset",
  ],
  intermediate: [
    "Everything in Basic Clean",
    "Skirting boards and doors",
    "Extra attention to high-touch areas",
    "Spot clean walls and fixtures",
  ],
  advanced: [
    "End-of-tenancy checklist focus",
    "Deep clean of kitchens and bathrooms",
    "Inside cupboards (where accessible)",
    "Fixtures, tiles, and grout detailing",
  ],
  commercial: [
    "Workstations and common areas",
    "Restroom sanitation",
    "Touchpoint disinfection",
    "Bins, recycling, and floor care",
  ],
};

const EXTRA_PRICING: Record<ExtraOption, number> = {
  fridge: scalePrice(15),
  "inside-cupboards": scalePrice(25),
  "interior-windows": scalePrice(20),
  laundry: scalePrice(15),
  "carpet-refresh": scalePrice(30),
};

export const EXTRA_OPTIONS: Array<{
  id: ExtraOption;
  label: string;
  price: number;
  description: string;
}> = [
  {
    id: "fridge",
    label: "Fridge clean",
    price: EXTRA_PRICING.fridge,
    description: "Shelves and drawers wiped.",
  },
  {
    id: "inside-cupboards",
    label: "Inside cupboards",
    price: EXTRA_PRICING["inside-cupboards"],
    description: "Accessible cupboards wiped.",
  },
  {
    id: "interior-windows",
    label: "Interior windows",
    price: EXTRA_PRICING["interior-windows"],
    description: "Glass and frames cleaned.",
  },
  {
    id: "laundry",
    label: "Laundry and linen change",
    price: EXTRA_PRICING.laundry,
    description: "One load plus linen change.",
  },
  {
    id: "carpet-refresh",
    label: "Carpet and rug refresh",
    price: EXTRA_PRICING["carpet-refresh"],
    description: "Vacuum plus spot treatment.",
  },
];

const EXTRA_LABELS: Record<ExtraOption, string> = {
  fridge: "Fridge clean",
  "inside-cupboards": "Inside cupboards",
  "interior-windows": "Interior windows",
  laundry: "Laundry and linen change",
  "carpet-refresh": "Carpet and rug refresh",
};

export const DEFAULT_QUOTE_INPUT: QuoteInput = {
  service: "basic",
  propertyType: "house",
  bedrooms: 2,
  bathrooms: 1,
  rooms: 3,
  frequency: "weekly",
  oven: "none",
  extras: [],
};

const FREQUENCY_META: Record<
  Frequency,
  { label: string; visitsPerMonth?: number; multiplier: number }
> = {
  "one-time": { label: "One-time", multiplier: 1.3 },
  weekly: { label: "Weekly", visitsPerMonth: 4, multiplier: 1 },
  "bi-weekly": { label: "Every 2 weeks", visitsPerMonth: 2, multiplier: 1.1 },
  monthly: { label: "Monthly", visitsPerMonth: 1, multiplier: 1.2 },
};

export const OVEN_PRICING: Record<OvenOption, number> = {
  none: 0,
  single: scalePrice(30),
  double: scalePrice(40),
};

const getBasicBase = (bedrooms: number) => {
  if (bedrooms <= 1) return 45;
  if (bedrooms <= 3) return 60;
  if (bedrooms === 4) return 75;
  if (bedrooms === 5) return 90;
  return 105 + (bedrooms - 6) * 15;
};

const getAdvancedBase = (bedrooms: number) => {
  if (bedrooms <= 1) return 140;
  if (bedrooms <= 3) return 170;
  if (bedrooms === 4) return 240;
  if (bedrooms === 5) return 300;
  return 360 + (bedrooms - 6) * 60;
};

const getCommercialBase = (rooms: number) => {
  if (rooms <= 3) return 90;
  if (rooms <= 7) return 140;
  if (rooms <= 12) return 200;
  if (rooms <= 20) return 260;
  return 320 + (rooms - 20) * 12;
};

export const formatCurrency = (value: number) => `£${value.toFixed(0)}`;

export const calculateQuote = (input: QuoteInput): QuoteResult => {
  const bathrooms = Math.max(1, input.bathrooms || 1);
  const bedrooms = Math.max(1, input.bedrooms || 1);
  const rooms = Math.max(1, input.rooms || 1);
  const extras = Array.from(new Set(input.extras || [])).filter(
    (extra): extra is ExtraOption => extra in EXTRA_PRICING
  );

  let basePrice = 0;
  let bathroomAdd = 0;
  let frequency = input.frequency;

  if (input.service === "basic") {
    basePrice = getBasicBase(bedrooms);
    bathroomAdd = Math.max(0, bathrooms - 1) * 5;
  } else if (input.service === "intermediate") {
    basePrice = roundToNearest5(getBasicBase(bedrooms) * 1.25);
    bathroomAdd = Math.max(0, bathrooms - 1) * 10;
  } else if (input.service === "advanced") {
    basePrice = getAdvancedBase(bedrooms);
    bathroomAdd = Math.max(0, bathrooms - 1) * 15;
    frequency = "one-time";
  } else {
    basePrice = getCommercialBase(rooms);
  }

  const frequencyMeta =
    input.service === "advanced"
      ? { ...FREQUENCY_META["one-time"], multiplier: 1 }
      : FREQUENCY_META[frequency];

  const perVisit = roundToNearest5(
    (basePrice + bathroomAdd) * frequencyMeta.multiplier * PRICE_MULTIPLIER
  );
  const ovenAddon = OVEN_PRICING[input.oven] ?? 0;
  const extrasTotal = extras.reduce(
    (total, extra) => total + EXTRA_PRICING[extra],
    0
  );
  const totalPerVisit = perVisit + ovenAddon + extrasTotal;

  const visitsPerMonth = frequencyMeta.visitsPerMonth;
  const monthlyEstimate =
    visitsPerMonth && frequency !== "one-time"
      ? totalPerVisit * visitsPerMonth
      : undefined;

  const propertyLabel = PROPERTY_LABELS[input.propertyType] || "property";
  const propertySummary =
    input.service === "commercial"
      ? `${rooms} room${rooms === 1 ? "" : "s"} ${propertyLabel}`
      : `${bedrooms} bed${bedrooms === 1 ? "" : "s"}, ${bathrooms} bath${bathrooms === 1 ? "" : "s"} ${propertyLabel}`;

  const paymentSummary =
    frequency === "one-time"
      ? `One-time total of ${formatCurrency(totalPerVisit)}`
      : `${formatCurrency(totalPerVisit)} per visit, billed ${frequencyMeta.label.toLowerCase()}`;

  const packageItems = [...PACKAGE_ITEMS[input.service]];
  const addOns: string[] = [];
  if (ovenAddon > 0) {
    addOns.push(
      `${input.oven === "single" ? "Single" : "Double"} oven clean (+${formatCurrency(ovenAddon)})`
    );
  }
  extras.forEach((extra) => {
    addOns.push(`${EXTRA_LABELS[extra]} (+${formatCurrency(EXTRA_PRICING[extra])})`);
  });

  return {
    serviceLabel: SERVICE_LABELS[input.service],
    frequencyLabel: frequencyMeta.label,
    propertySummary,
    perVisitPrice: totalPerVisit,
    ovenAddon,
    monthlyEstimate,
    visitsPerMonth,
    packageItems,
    addOns,
    paymentSummary,
  };
};

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

export const parseQuoteSearchParams = (
  params: Record<string, string | string[] | undefined>
): QuoteInput => {
  const service = getParam(params, "service") as CleaningService;
  const propertyType = getParam(params, "propertyType") as PropertyType;
  const frequency = getParam(params, "frequency") as Frequency;
  const oven = getParam(params, "oven") as OvenOption;
  const extrasParam = getParam(params, "extras");
  const extras = extrasParam
    ? extrasParam.split(",").filter((extra): extra is ExtraOption => extra in EXTRA_PRICING)
    : [];

  return {
    service: SERVICE_LABELS[service] ? service : DEFAULT_QUOTE_INPUT.service,
    propertyType: PROPERTY_LABELS[propertyType]
      ? propertyType
      : DEFAULT_QUOTE_INPUT.propertyType,
    bedrooms: Number(getParam(params, "bedrooms")) || DEFAULT_QUOTE_INPUT.bedrooms,
    bathrooms: Number(getParam(params, "bathrooms")) || DEFAULT_QUOTE_INPUT.bathrooms,
    rooms: Number(getParam(params, "rooms")) || DEFAULT_QUOTE_INPUT.rooms,
    frequency: FREQUENCY_META[frequency] ? frequency : DEFAULT_QUOTE_INPUT.frequency,
    oven: oven && oven in OVEN_PRICING ? oven : DEFAULT_QUOTE_INPUT.oven,
    extras,
  };
};

export { FREQUENCY_META };
