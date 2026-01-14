type PlanFeature = {
  text: string;
  tooltip?: string;
};

type Plan = {
  name: string;
  info: string;
  price: {
    monthly: number | string;
    yearly: number | string;
  };
  features: PlanFeature[];
  btn: {
    text: string;
    href: string;
  };
};

export const PLANS: Plan[] = [
  {
    name: "Basic",
    info: "Regular upkeep for homes and small offices",
    price: {
      monthly: "Contact us",
      yearly: "Contact us",
    },
    features: [
      { text: "Weekly or bi-weekly cleans" },
      { text: "Kitchens, bathrooms, floors, surfaces" },
      { text: "Dusting, vacuuming, and tidy-up" },
      { text: "Tailored checklist each visit" },
      { text: "Ideal for ongoing maintenance" },
    ],
    btn: {
      text: "Get a Free Quote",
      href: "/get-a-quote",
    },
  },
  {
    name: "Intermediate",
    info: "A deeper clean for busier spaces",
    price: {
      monthly: "Contact us",
      yearly: "Contact us",
    },
    features: [
      { text: "All Basic tasks included" },
      { text: "Skirting boards, doors, switches" },
      { text: "High-touch surfaces sanitized" },
      { text: "Appliance exteriors and detailing" },
      { text: "Great for monthly resets" },
    ],
    btn: {
      text: "Get a Free Quote",
      href: "/get-a-quote",
    },
  },
  {
    name: "Advanced",
    info: "End-of-tenancy and deep cleans",
    price: {
      monthly: "Contact us",
      yearly: "Contact us",
    },
    features: [
      { text: "Full deep clean, top to bottom" },
      { text: "Inside cupboards, oven, and fridge" },
      { text: "Limescale and grout attention" },
      { text: "Move-in/move-out ready" },
      { text: "Seasonal or post-renovation resets" },
    ],
    btn: {
      text: "Get a Free Quote",
      href: "/get-a-quote",
    },
  },
];

export const PRICING_FEATURES = [
  {
    text: "Checklist-based cleans",
    tooltip: "Clear standards for consistent results",
  },
  {
    text: "Flexible scheduling",
    tooltip: "Weekly, bi-weekly, monthly, or one-off",
  },
  {
    text: "Residential and commercial",
    tooltip: "Homes, offices, and rental properties",
  },
  {
    text: "End-of-tenancy options",
    tooltip: "Deep cleans for move-in or move-out",
  },
  {
    text: "Friendly local team",
    tooltip: "Professional, reliable cleaners",
  },
  {
    text: "Fast responses",
    tooltip: "Quick quotes and clear communication",
  },
  {
    text: "Custom packages",
    tooltip: "Tailored to your space and needs",
  },
];

export const WORKSPACE_LIMIT = 2;
