import { FREQUENCY_META, type Frequency } from "@/utils/quote";

const NORMALIZED_FREQUENCY_LABELS = Object.entries(FREQUENCY_META).reduce<
  Record<string, Frequency>
>((acc, [key, meta]) => {
  acc[meta.label.toLowerCase()] = key as Frequency;
  return acc;
}, {});

export const getFrequencyKey = (value?: string | null): Frequency | null => {
  if (!value) return null;
  if (value in FREQUENCY_META) {
    return value as Frequency;
  }
  const normalized = value.trim().toLowerCase();
  return NORMALIZED_FREQUENCY_LABELS[normalized] ?? null;
};

export const getFrequencyLabel = (value?: string | null): string | null => {
  if (!value) return null;
  const key = getFrequencyKey(value);
  return key ? FREQUENCY_META[key].label : value;
};
