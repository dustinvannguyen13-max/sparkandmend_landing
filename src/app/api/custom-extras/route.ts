import { NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

const DEFAULT_RATE = 20;

const roundPrice = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;

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
  rate?: number;
};

const QUANTITY_DEFINITIONS: QuantityDefinition[] = [
  {
    key: "cages",
    keywords: ["cage", "cages", "kennel", "kennels"],
    label: "Dog cages",
    quantityLabel: "cages",
    baseHours: 0.2,
    perUnitHours: 0.18,
    rate: 20,
  },
  {
    key: "bins",
    keywords: [
      "bin",
      "bins",
      "dustbin",
      "dustbins",
      "dust bin",
      "dust bins",
      "wheelie bin",
      "wheelie bins",
      "rubbish bin",
      "rubbish bins",
    ],
    label: "Outdoor bins",
    quantityLabel: "bins",
    baseHours: 0.35,
    perUnitHours: 0.2,
    rate: 20,
  },
  {
    key: "windows",
    keywords: ["window", "windows"],
    label: "Windows",
    quantityLabel: "windows",
    baseHours: 1,
    perUnitHours: 0.08,
    rate: 28,
  },
  {
    key: "cars",
    keywords: ["car", "cars", "vehicle", "vehicles"],
    label: "Car interior/exterior",
    quantityLabel: "cars",
    baseHours: 1.1,
    perUnitHours: 1,
    rate: 30,
  },
];

const TASK_DEFINITIONS = [
  { key: "oven", keywords: ["oven"], label: "Oven clean", hours: 0.8, rate: 28 },
  {
    key: "fridge",
    keywords: ["fridge", "freezer"],
    label: "Inside fridge/freezer",
    hours: 0.6,
    rate: 22,
  },
  {
    key: "windows",
    keywords: ["window", "windows"],
    label: "Windows",
    hours: 1.4,
    rate: 28,
  },
  {
    key: "car",
    keywords: ["car", "vehicle"],
    label: "Car interior/exterior",
    hours: 1.2,
    rate: 30,
  },
  {
    key: "carpet",
    keywords: ["carpet", "carpets", "rug", "rugs"],
    label: "Carpet refresh",
    hours: 1.2,
    rate: 30,
  },
  {
    key: "sofa",
    keywords: ["sofa", "upholstery"],
    label: "Upholstery refresh",
    hours: 0.9,
    rate: 28,
  },
  {
    key: "cupboard",
    keywords: ["cupboard", "cupboards", "cabinet", "cabinets"],
    label: "Inside cupboards",
    hours: 0.8,
    rate: 22,
  },
  {
    key: "laundry",
    keywords: ["laundry", "washing"],
    label: "Laundry",
    hours: 0.5,
    rate: 20,
  },
  {
    key: "ironing",
    keywords: ["ironing"],
    label: "Ironing",
    hours: 0.7,
    rate: 22,
  },
  {
    key: "skirting",
    keywords: ["skirting"],
    label: "Skirting detail",
    hours: 0.7,
    rate: 24,
  },
  {
    key: "walls",
    keywords: ["walls", "wall marks"],
    label: "Wall marks",
    hours: 1,
    rate: 26,
  },
  {
    key: "balcony",
    keywords: ["balcony", "patio"],
    label: "Balcony/patio tidy",
    hours: 0.8,
    rate: 24,
  },
  {
    key: "garage",
    keywords: ["garage"],
    label: "Garage sweep",
    hours: 1.6,
    rate: 28,
  },
  {
    key: "driveway",
    keywords: ["driveway", "drive way", "front drive", "front path"],
    label: "Driveway sweep",
    hours: 0.9,
    rate: 24,
  },
  {
    key: "basement",
    keywords: ["basement", "cellar"],
    label: "Basement reset",
    hours: 2.4,
    rate: 32,
  },
  {
    key: "loft",
    keywords: ["loft", "attic"],
    label: "Loft reset",
    hours: 2,
    rate: 30,
  },
  {
    key: "after-builders",
    keywords: ["after builders", "post builders"],
    label: "After builders detail",
    hours: 2.8,
    rate: 34,
  },
  {
    key: "organise",
    keywords: ["organise", "organize", "sorting", "sort", "boxes"],
    label: "Sorting and organising",
    hours: 1.2,
    rate: 26,
  },
  {
    key: "fence",
    keywords: ["fence", "fencing"],
    label: "Outdoor fence clean",
    hours: 1.4,
    rate: 28,
  },
  {
    key: "bin",
    keywords: ["bin", "bins"],
    label: "Outdoor bin clean",
    hours: 0.5,
    rate: 20,
  },
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
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    total += Number(match[1]) || 0;
  }
  return total;
};

const estimateFromText = (text: string) => {
  const normalized = normalizeText(text);
  const items: string[] = [];
  const matchedKeys = new Set<string>();
  let hours = 0;
  let rateTotal = 0;

  QUANTITY_DEFINITIONS.forEach((definition) => {
    const qty = extractQuantities(normalized, definition.keywords);
    if (qty > 0) {
      const itemHours = definition.baseHours + definition.perUnitHours * qty;
      hours += itemHours;
      rateTotal += itemHours * (definition.rate ?? DEFAULT_RATE);
      items.push(`${definition.label} x${qty}`);
      matchedKeys.add(definition.key);
    }
  });

  TASK_DEFINITIONS.forEach((definition) => {
    if (matchedKeys.has(definition.key)) return;
    if (definition.keywords.some((keyword) => normalized.includes(keyword))) {
      hours += definition.hours;
      rateTotal += definition.hours * (definition.rate ?? DEFAULT_RATE);
      items.push(definition.label);
      matchedKeys.add(definition.key);
    }
  });

  if (hours > 0) {
    let multiplier = 1;
    const hasInteriorExterior =
      /interior and exterior|interior & exterior|inside and outside|inside & outside|inside and out|inside & out|inside\/outside/.test(
        normalized,
      );
    if (
      hasInteriorExterior &&
      (normalized.includes("window") ||
        normalized.includes("car") ||
        normalized.includes("vehicle"))
    ) {
      multiplier *= 1.4;
    }

    if (/\b(entire|whole|full|complete)\b/.test(normalized)) {
      multiplier *= 1.25;
    }

    if (/\b(deep|detail|detailed|scrub|intensive)\b/.test(normalized)) {
      multiplier *= 1.15;
    }

    hours *= multiplier;
    rateTotal *= multiplier;
  }

  if (hours <= 0) {
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    hours = Math.max(0.75, wordCount / 18);
    rateTotal = hours * DEFAULT_RATE;
  }

  const cost = roundPrice(rateTotal);
  return {
    hours: Number(hours.toFixed(2)),
    cost,
    items,
  };
};

const buildReason = (items: string[]) => {
  if (!items.length) {
    return "Picked up: custom extras requested.";
  }
  return `Picked up: ${items.join(", ")}`;
};

const dedupeItems = (items: string[]) => {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(trimmed);
  }
  return unique;
};

const fallbackEstimate = (text: string) => {
  const estimate = estimateFromText(text);
  const deduped = dedupeItems(estimate.items);
  const summary =
    deduped.slice(0, 3).join(", ") ||
    "Custom extras requested (estimate)";
  const price = estimate.cost;
  const reason = buildReason(deduped);

  return {
    price,
    summary: summary.slice(0, 120),
    reason,
    items: deduped,
    source: "fallback",
  };
};

const fallbackResponse = (text: string, reason: string) =>
  NextResponse.json({
    ...fallbackEstimate(text),
    fallbackReason: reason,
  });

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
  return Math.max(0, numeric);
};

export async function POST(request: Request) {
  try {
    const { text, service, propertyType } = (await request.json()) as {
      text?: string;
      service?: string;
      propertyType?: string;
    };

    if (!text || !text.trim()) {
      return NextResponse.json({
        price: 0,
        summary: "",
        items: [],
        source: "fallback",
        fallbackReason: "empty_input",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return fallbackResponse(text, "missing_api_key");
    }

    const systemPrompt = [
      "You estimate add-on pricing for a UK cleaning company in Plymouth.",
      "Return a short summary of the extra tasks requested plus estimated effortHours.",
      "EffortHours should scale with quantity and scope (e.g. 17 cages > 3 cages).",
      "Use 0 if the request is too unclear to estimate.",
      "Include all detected tasks in the items array.",
      "Keep the summary under 120 characters.",
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
      text: {
        format: {
          type: "json_schema",
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
      return fallbackResponse(
        text,
        `openai_http_${result.response.status}`,
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(result.textBody);
    } catch {
      return fallbackResponse(text, "openai_invalid_json");
    }

    const content = extractResponseText(data);
    if (!content) {
      return fallbackResponse(text, "openai_empty_response");
    }

    const parsed = parseEstimate(content) as
      | { summary: string; effortHours: number; reason?: string; items: string[] }
      | null;
    if (!parsed) {
      return fallbackResponse(text, "openai_parse_failed");
    }

    const heuristic = estimateFromText(text);
    const aiHours = normalizeEffortHours(parsed.effortHours);
    const finalHours =
      aiHours > 0 ? Math.max(aiHours, heuristic.hours) : heuristic.hours;
    const baseHours = heuristic.hours || finalHours || 1;
    const price =
      heuristic.cost > 0
        ? roundPrice(heuristic.cost * (finalHours / baseHours))
        : roundPrice(finalHours * DEFAULT_RATE);
    const summary =
      parsed.summary?.trim() ||
      parsed.items?.filter(Boolean).slice(0, 3).join(", ") ||
      heuristic.items.slice(0, 3).join(", ") ||
      "Custom extras requested";
    const items = dedupeItems([
      ...(parsed.items || []),
      ...heuristic.items,
    ]);
    const reason = buildReason(items);

    return NextResponse.json({
      price,
      summary: summary.slice(0, 120),
      reason,
      items,
      source: "ai",
    });
  } catch (error) {
    return fallbackResponse("Custom extras requested.", "openai_exception");
  }
}
