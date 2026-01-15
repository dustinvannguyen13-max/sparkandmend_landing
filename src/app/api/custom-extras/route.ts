import { NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

const HOURLY_RATE = 25;
const MIN_CUSTOM_PRICE = 15;
const MAX_CUSTOM_PRICE = 250;
const MAX_CUSTOM_HOURS = 10;

const roundToNearest5 = (value: number) => Math.round(value / 5) * 5;

const clampPrice = (value: number) => {
  if (value <= 0) return 0;
  return Math.min(
    MAX_CUSTOM_PRICE,
    Math.max(MIN_CUSTOM_PRICE, roundToNearest5(value)),
  );
};

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/(?:x|×)\s*(\d+)/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();

type QuantityDefinition = {
  key: string;
  keywords: string[];
  label: string;
  quantityLabel?: string;
  baseHours: number;
  perUnitHours: number;
};

const QUANTITY_DEFINITIONS: QuantityDefinition[] = [
  {
    key: "cages",
    keywords: ["cage", "cages", "kennel", "kennels"],
    label: "Dog cages",
    quantityLabel: "cages",
    baseHours: 0.2,
    perUnitHours: 0.18,
  },
  {
    key: "bins",
    keywords: ["bin", "bins"],
    label: "Outdoor bins",
    quantityLabel: "bins",
    baseHours: 0.35,
    perUnitHours: 0.2,
  },
  {
    key: "windows",
    keywords: ["window", "windows"],
    label: "Windows",
    quantityLabel: "windows",
    baseHours: 1,
    perUnitHours: 0.08,
  },
  {
    key: "cars",
    keywords: ["car", "cars", "vehicle", "vehicles"],
    label: "Car interior/exterior",
    quantityLabel: "cars",
    baseHours: 1.1,
    perUnitHours: 1,
  },
];

const TASK_DEFINITIONS = [
  { key: "oven", keywords: ["oven"], label: "Oven clean", hours: 0.8 },
  {
    key: "fridge",
    keywords: ["fridge", "freezer"],
    label: "Inside fridge/freezer",
    hours: 0.6,
  },
  { key: "windows", keywords: ["window", "windows"], label: "Windows", hours: 1.4 },
  {
    key: "car",
    keywords: ["car", "vehicle"],
    label: "Car interior/exterior",
    hours: 1.2,
  },
  { key: "carpet", keywords: ["carpet", "carpets", "rug", "rugs"], label: "Carpet refresh", hours: 1.2 },
  { key: "sofa", keywords: ["sofa", "upholstery"], label: "Upholstery refresh", hours: 0.9 },
  {
    key: "cupboard",
    keywords: ["cupboard", "cupboards", "cabinet", "cabinets"],
    label: "Inside cupboards",
    hours: 0.8,
  },
  { key: "laundry", keywords: ["laundry", "washing"], label: "Laundry", hours: 0.5 },
  { key: "ironing", keywords: ["ironing"], label: "Ironing", hours: 0.7 },
  { key: "skirting", keywords: ["skirting"], label: "Skirting detail", hours: 0.7 },
  { key: "walls", keywords: ["walls", "wall marks"], label: "Wall marks", hours: 1 },
  { key: "balcony", keywords: ["balcony", "patio"], label: "Balcony/patio tidy", hours: 0.8 },
  { key: "garage", keywords: ["garage"], label: "Garage sweep", hours: 1.6 },
  { key: "basement", keywords: ["basement", "cellar"], label: "Basement reset", hours: 2.4 },
  { key: "loft", keywords: ["loft", "attic"], label: "Loft reset", hours: 2 },
  {
    key: "after-builders",
    keywords: ["after builders", "post builders"],
    label: "After builders detail",
    hours: 2.8,
  },
  {
    key: "organise",
    keywords: ["organise", "organize", "sorting", "sort", "boxes"],
    label: "Sorting and organising",
    hours: 1.2,
  },
  { key: "bin", keywords: ["bin", "bins"], label: "Outdoor bin clean", hours: 0.5 },
];

const extractQuantities = (text: string, keywords: string[]) => {
  const keywordPattern = keywords
    .map((keyword) =>
      keyword
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\s+/g, "\\s+"),
    )
    .join("|");
  if (!keywordPattern) return 0;
  const regex = new RegExp(
    `\\b(\\d+)\\s*(?:x\\s*)?(?:[a-z]+\\s+){0,2}(?:${keywordPattern})\\b`,
    "gi",
  );
  let total = 0;
  for (const match of text.matchAll(regex)) {
    total += Number(match[1]) || 0;
  }
  return total;
};

const estimateFromText = (text: string) => {
  const normalized = normalizeText(text);
  const items: string[] = [];
  const quantities: string[] = [];
  const matchedKeys = new Set<string>();
  let hours = 0;

  QUANTITY_DEFINITIONS.forEach((definition) => {
    const qty = extractQuantities(normalized, definition.keywords);
    if (qty > 0) {
      const itemHours = definition.baseHours + definition.perUnitHours * qty;
      hours += itemHours;
      items.push(`${definition.label} x${qty}`);
      quantities.push(
        `${qty} ${definition.quantityLabel ?? definition.label.toLowerCase()}`,
      );
      matchedKeys.add(definition.key);
    }
  });

  TASK_DEFINITIONS.forEach((definition) => {
    if (matchedKeys.has(definition.key)) return;
    if (definition.keywords.some((keyword) => normalized.includes(keyword))) {
      hours += definition.hours;
      items.push(definition.label);
      matchedKeys.add(definition.key);
    }
  });

  if (hours > 0) {
    const hasInteriorExterior =
      /interior and exterior|interior & exterior|inside and outside|inside & outside/.test(
        normalized,
      );
    if (
      hasInteriorExterior &&
      (normalized.includes("window") ||
        normalized.includes("car") ||
        normalized.includes("vehicle"))
    ) {
      hours *= 1.4;
    }

    if (/\b(entire|whole|full|complete)\b/.test(normalized)) {
      hours *= 1.25;
    }

    if (/\b(deep|detail|detailed|scrub|intensive)\b/.test(normalized)) {
      hours *= 1.15;
    }
  }

  if (hours <= 0) {
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    hours = Math.min(MAX_CUSTOM_HOURS, Math.max(0.75, wordCount / 18));
  }

  return {
    hours: Math.min(MAX_CUSTOM_HOURS, Number(hours.toFixed(2))),
    items,
    quantities,
  };
};

const buildReason = (
  hours: number,
  quantities: string[],
  aiReason?: string,
) => {
  if (!hours) {
    const fallback = aiReason?.trim() || "We need a little more detail to estimate.";
    return fallback.slice(0, 160);
  }
  const quantityNote = quantities.length ? `Qty: ${quantities.join(", ")}` : "";
  const timeNote = `Est. ${hours.toFixed(1)}h @ £${HOURLY_RATE}/hr`;
  return [quantityNote, timeNote].filter(Boolean).join(" · ").slice(0, 160);
};

const fallbackEstimate = (text: string) => {
  const estimate = estimateFromText(text);
  const summary =
    estimate.items.slice(0, 3).join(", ") ||
    "Custom extras requested (estimate)";
  const price = clampPrice(estimate.hours * HOURLY_RATE);
  const reason = buildReason(estimate.hours, estimate.quantities);

  return {
    price,
    summary: summary.slice(0, 120),
    reason,
    items: estimate.items,
  };
};

const extractResponseText = (data: unknown) => {
  if (!data || typeof data !== "object") return "";
  const payload = data as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string; value?: string }> }>;
  };
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }
  const content = Array.isArray(payload.output)
    ? payload.output
        .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
        .map((item) => item.text ?? item.value ?? "")
        .filter(Boolean)
        .join("\n")
    : "";
  return content;
};

const parseEstimate = (content: string) => {
  const trimmed = content.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
};

const normalizeEffortHours = (value: unknown) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(MAX_CUSTOM_HOURS, Math.max(0, numeric));
};

export async function POST(request: Request) {
  try {
    const { text, service, propertyType } = (await request.json()) as {
      text?: string;
      service?: string;
      propertyType?: string;
    };

    if (!text || !text.trim()) {
      return NextResponse.json({ price: 0, summary: "", items: [] });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(fallbackEstimate(text));
    }

    const systemPrompt = [
      "You estimate add-on pricing for a UK cleaning company in Plymouth.",
      "Return a short summary of the extra tasks requested plus estimated effortHours.",
      "EffortHours should scale with quantity and scope (e.g. 17 cages > 3 cages).",
      "Use 0 if the request is too unclear to estimate.",
      "Keep the summary under 120 characters. Provide a short reason under 160 characters.",
      "Output JSON only.",
    ].join(" ");

    const requestBody = {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Service: ${service || "unknown"}; Property: ${
            propertyType || "unknown"
          }; Extras: ${text}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "custom_extra_estimate",
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              effortHours: { type: "number" },
              reason: { type: "string" },
              items: { type: "array", items: { type: "string" } },
            },
            required: ["summary", "effortHours", "reason", "items"],
            additionalProperties: false,
          },
        },
      },
    };

    const runRequest = async () => {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
      const textBody = await response.text();
      return { response, textBody };
    };

    let result = await runRequest();
    if (!result.response.ok && (result.response.status === 429 || result.response.status >= 500)) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      result = await runRequest();
    }

    if (!result.response.ok) {
      return NextResponse.json(fallbackEstimate(text));
    }

    let data: unknown;
    try {
      data = JSON.parse(result.textBody);
    } catch {
      return NextResponse.json(fallbackEstimate(text));
    }

    const content = extractResponseText(data);
    if (!content) {
      return NextResponse.json(fallbackEstimate(text));
    }

    const parsed = parseEstimate(content) as
      | { summary: string; effortHours: number; reason?: string; items: string[] }
      | null;
    if (!parsed) {
      return NextResponse.json(fallbackEstimate(text));
    }

    const heuristic = estimateFromText(text);
    const aiHours = normalizeEffortHours(parsed.effortHours);
    const finalHours = aiHours > 0 ? Math.max(aiHours, heuristic.hours) : heuristic.hours;
    const price = clampPrice(finalHours * HOURLY_RATE);
    const summary =
      parsed.summary?.trim() ||
      parsed.items?.filter(Boolean).slice(0, 3).join(", ") ||
      heuristic.items.slice(0, 3).join(", ") ||
      "Custom extras requested";
    const reason = buildReason(finalHours, heuristic.quantities, parsed.reason);
    const items =
      Array.isArray(parsed.items) && parsed.items.length
        ? parsed.items
        : heuristic.items;

    return NextResponse.json({
      price,
      summary: summary.slice(0, 120),
      reason,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      fallbackEstimate("Custom extras requested."),
    );
  }
}
