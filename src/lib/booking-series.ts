import { type Frequency } from "@/utils/quote";

const DEFAULT_SERIES_COUNTS: Record<Frequency, number> = {
  "one-time": 1,
  weekly: 12,
  "bi-weekly": 8,
  monthly: 6,
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const addMonths = (date: Date, months: number) => {
  const day = date.getDate();
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  target.setDate(Math.min(day, lastDay));
  return target;
};

export const buildSeriesDates = (
  startDate: string,
  frequency: Frequency,
  count = DEFAULT_SERIES_COUNTS[frequency],
) => {
  const base = parseDate(startDate);
  if (!base || count <= 0) return [];

  const dates: string[] = [];
  let current = base;

  for (let index = 0; index < count; index += 1) {
    if (index === 0) {
      dates.push(formatDate(current));
      continue;
    }

    if (frequency === "weekly") {
      current = addDays(current, 7);
    } else if (frequency === "bi-weekly") {
      current = addDays(current, 14);
    } else if (frequency === "monthly") {
      current = addMonths(current, 1);
    }
    dates.push(formatDate(current));
  }

  return dates;
};

export const buildNextSeriesDates = (
  lastDate: string,
  frequency: Frequency,
  count = DEFAULT_SERIES_COUNTS[frequency],
) => {
  if (frequency === "one-time") return [];
  const base = parseDate(lastDate);
  if (!base || count <= 0) return [];

  const dates: string[] = [];
  let current = base;

  for (let index = 0; index < count; index += 1) {
    if (frequency === "weekly") {
      current = addDays(current, 7);
    } else if (frequency === "bi-weekly") {
      current = addDays(current, 14);
    } else if (frequency === "monthly") {
      current = addMonths(current, 1);
    }
    dates.push(formatDate(current));
  }

  return dates;
};

export const buildSeriesReferences = (baseReference: string, count: number) => {
  if (count <= 1) return [baseReference];
  const references = [baseReference];
  for (let index = 1; index < count; index += 1) {
    references.push(`${baseReference}-R${String(index + 1).padStart(2, "0")}`);
  }
  return references;
};
