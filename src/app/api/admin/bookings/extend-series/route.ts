import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { getFrequencyKey, getFrequencyLabel } from "@/lib/booking-frequency";
import { buildNextSeriesDates, buildSeriesDates } from "@/lib/booking-series";
import { type Frequency } from "@/utils/quote";

const MIN_UPCOMING = 3;
const STALE_SERIES_DAYS = 90;
const EXTEND_COUNTS: Record<Frequency, number> = {
  "one-time": 0,
  weekly: 12,
  "bi-weekly": 8,
  monthly: 6,
};

type BookingRecord = {
  reference: string;
  series_id?: string | null;
  series_reference?: string | null;
  series_index?: number | null;
  frequency?: string | null;
  frequency_key?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  status?: string | null;
  service?: string | null;
  property_summary?: string | null;
  per_visit_price?: number | null;
  extras?: string[] | null;
  custom_extras_items?: string[] | null;
  custom_extras_text?: string | null;
  custom_extras_reason?: string | null;
  custom_extras_source?: string | null;
  custom_extras_fallback_reason?: string | null;
  custom_extras_price?: number | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_postcode?: string | null;
  contact_address?: string | null;
  contact_method?: string | null;
  notes?: string | null;
  promo_type?: string | null;
  promo_label?: string | null;
  promo_discount?: number | null;
};

const normalizeDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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

const getNextOccurrenceOnOrAfter = (
  lastDate: string,
  frequency: Frequency,
  minDate: Date,
) => {
  const base = normalizeDate(lastDate);
  if (!base) return null;
  let current = new Date(base);
  let safety = 0;
  while (current < minDate && safety < 500) {
    if (frequency === "weekly") {
      current = addDays(current, 7);
    } else if (frequency === "bi-weekly") {
      current = addDays(current, 14);
    } else if (frequency === "monthly") {
      current = addMonths(current, 1);
    } else {
      break;
    }
    safety += 1;
  }
  return current < minDate ? null : current;
};

const getSeriesReference = (bookings: BookingRecord[]) => {
  const base =
    bookings.find((booking) => booking.series_index === 0) ?? bookings[0];
  return base?.series_reference ?? base?.reference ?? "";
};

const getTemplateBooking = (bookings: BookingRecord[]) => {
  return (
    bookings
      .filter((booking) => booking.preferred_date)
      .sort((a, b) => {
        const aDate = normalizeDate(a.preferred_date)?.getTime() ?? 0;
        const bDate = normalizeDate(b.preferred_date)?.getTime() ?? 0;
        return bDate - aDate;
      })[0] ?? bookings[0]
  );
};

const buildReferenceForIndex = (base: string, index: number) =>
  `${base}-R${String(index + 1).padStart(2, "0")}`;

const handleExtend = async (request: Request) => {
  const session = getAdminSession();
  const cronSecret = request.headers.get("x-cron-secret")?.trim();
  const expectedSecret = process.env.ADMIN_CRON_SECRET;
  const isCron = request.headers.get("x-vercel-cron") === "1";
  const hasSecret = Boolean(
    expectedSecret && cronSecret && cronSecret === expectedSecret,
  );

  if (!session && !hasSecret && !isCron) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!supabaseConfig.url || !supabaseHeaders) {
    return NextResponse.json(
      { error: "Supabase configuration is missing." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/bookings?select=reference,series_id,series_reference,series_index,frequency,frequency_key,preferred_date,preferred_time,status,service,property_summary,per_visit_price,extras,custom_extras_items,custom_extras_text,custom_extras_reason,custom_extras_source,custom_extras_fallback_reason,custom_extras_price,contact_name,contact_email,contact_phone,contact_postcode,contact_address,contact_method,notes,promo_type,promo_label,promo_discount&series_id=not.is.null&preferred_date=not.is.null`,
      { headers: supabaseHeaders },
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: text || "Unable to fetch bookings." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as BookingRecord[];
    const grouped = new Map<string, BookingRecord[]>();
    data.forEach((booking) => {
      if (!booking.series_id) return;
      const list = grouped.get(booking.series_id) ?? [];
      list.push(booking);
      grouped.set(booking.series_id, list);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const created: BookingRecord[] = [];
    let extendedSeries = 0;

    for (const entry of Array.from(grouped.entries())) {
      const [seriesId, bookings] = entry;
      const active = bookings.filter((booking) => booking.status !== "cancelled");
      if (active.length === 0) continue;

      const frequencyKey =
        getFrequencyKey(bookings[0]?.frequency_key ?? bookings[0]?.frequency) ??
        "one-time";
      if (frequencyKey === "one-time") continue;

      const upcoming = active.filter((booking) => {
        const date = normalizeDate(booking.preferred_date);
        return date ? date >= today : false;
      });

      if (upcoming.length >= MIN_UPCOMING) continue;

      const latest = bookings
        .filter((booking) => booking.preferred_date)
        .sort((a, b) => {
          const aDate = normalizeDate(a.preferred_date)?.getTime() ?? 0;
          const bDate = normalizeDate(b.preferred_date)?.getTime() ?? 0;
          return bDate - aDate;
        })[0];
      const lastDate = latest?.preferred_date;
      if (!lastDate) continue;

      const seriesReference = getSeriesReference(bookings);
      if (!seriesReference) continue;

      const maxIndex = bookings.reduce(
        (max, booking) =>
          Math.max(
            max,
            Number.isFinite(booking.series_index)
              ? booking.series_index ?? 0
              : 0,
          ),
        0,
      );
      const template = getTemplateBooking(bookings);
      if (!template) continue;

      const existingDates = new Set(
        bookings.map((booking) => booking.preferred_date).filter(Boolean),
      );
      let datesToAdd: string[] = [];
      if (upcoming.length === 0) {
        const lastDateValue = normalizeDate(lastDate);
        if (!lastDateValue) continue;
        const daysSinceLast =
          (today.getTime() - lastDateValue.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLast > STALE_SERIES_DAYS) continue;
        const nextOccurrence = getNextOccurrenceOnOrAfter(
          lastDate,
          frequencyKey,
          today,
        );
        if (!nextOccurrence) continue;
        const anchor = nextOccurrence.toISOString().slice(0, 10);
        datesToAdd = buildSeriesDates(
          anchor,
          frequencyKey,
          EXTEND_COUNTS[frequencyKey],
        );
      } else {
        datesToAdd = buildNextSeriesDates(
          lastDate,
          frequencyKey,
          EXTEND_COUNTS[frequencyKey],
        );
      }
      datesToAdd = datesToAdd.filter((date) => !existingDates.has(date));

      if (datesToAdd.length === 0) continue;

      const frequencyLabel = getFrequencyLabel(frequencyKey) ?? template.frequency ?? "";
      const basePayload = {
        series_id: seriesId,
        series_reference: seriesReference,
        service: template.service ?? "",
        property_summary: template.property_summary ?? "",
        frequency: frequencyLabel,
        frequency_key: frequencyKey,
        per_visit_price: template.per_visit_price ?? 0,
        extras: template.extras ?? [],
        custom_extras_items: template.custom_extras_items ?? [],
        custom_extras_text: template.custom_extras_text ?? "",
        custom_extras_reason: template.custom_extras_reason ?? "",
        custom_extras_source: template.custom_extras_source ?? "",
        custom_extras_fallback_reason: template.custom_extras_fallback_reason ?? "",
        custom_extras_price: template.custom_extras_price ?? 0,
        contact_name: template.contact_name ?? "",
        contact_email: template.contact_email ?? "",
        contact_phone: template.contact_phone ?? "",
        contact_postcode: template.contact_postcode ?? "",
        contact_address: template.contact_address ?? "",
        contact_method: template.contact_method ?? "",
        preferred_time: template.preferred_time ?? null,
        notes: template.notes ?? "",
        status: "pending",
        payment_amount: null,
        payment_currency: null,
        promo_type: "",
        promo_label: "",
        promo_discount: 0,
      };

      const payloads = datesToAdd.map((date, index) => {
        const seriesIndex = maxIndex + index + 1;
        return {
          ...basePayload,
          reference: buildReferenceForIndex(seriesReference, seriesIndex),
          series_index: seriesIndex,
          preferred_date: date,
        };
      });

      const insertResponse = await fetch(`${supabaseConfig.url}/rest/v1/bookings`, {
        method: "POST",
        headers: supabaseHeaders,
        body: JSON.stringify(payloads),
      });

      if (!insertResponse.ok) {
        const text = await insertResponse.text();
        return NextResponse.json(
          { error: text || "Unable to extend booking series." },
          { status: 502 },
        );
      }

      const inserted = (await insertResponse.json()) as BookingRecord[];
      created.push(...inserted);
      extendedSeries += 1;
    }

    return NextResponse.json({
      ok: true,
      extendedSeries,
      created: created.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to extend bookings." },
      { status: 500 },
    );
  }
};

export const GET = handleExtend;
export const POST = handleExtend;
