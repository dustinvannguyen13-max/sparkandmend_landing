import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { APP_DOMAIN } from "@/utils/constants/site";
import {
  GOOGLE_CALENDAR_ID,
  GOOGLE_CALENDAR_TIMEZONE,
  GOOGLE_EVENT_DURATION_HOURS,
  getGoogleAccessToken,
  updateIntegrationLastSynced,
} from "@/lib/google-calendar";

type BookingRecord = {
  reference: string;
  service?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  contact_postcode?: string;
  preferred_date?: string;
  preferred_time?: string;
  status?: string;
  notes?: string;
};

type EventMapping = {
  booking_reference: string;
  event_id: string;
  calendar_id?: string;
  status?: string;
  last_synced_at?: string;
};

type GoogleEvent = {
  id?: string;
  summary?: string;
  description?: string;
  status?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  extendedProperties?: {
    private?: { bookingReference?: string };
  };
};

const GOOGLE_API_BASE = "https://www.googleapis.com/calendar/v3";
const EVENT_TABLE = "booking_google_events";
const BOOKING_TABLE = "bookings";

const ensureSupabase = () => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }
};

const formatDateParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const find = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    year: find("year"),
    month: find("month"),
    day: find("day"),
  };
};

const formatDateForZone = (date: Date, timeZone: string) => {
  const parts = formatDateParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const formatTimeForZone = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

const buildDateTimeString = (date: string, time: string) =>
  `${date}T${time}:00`;

const addHours = (date: string, time: string, hours: number) => {
  const [hour, minute] = time.split(":").map((value) => Number(value));
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return buildDateTimeString(date, time);
  }

  const totalMinutes = hour * 60 + minute + hours * 60;
  const dayOffset = Math.floor(totalMinutes / (24 * 60));
  const normalizedMinutes =
    ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const nextHour = Math.floor(normalizedMinutes / 60);
  const nextMinute = normalizedMinutes % 60;
  const dateObj = new Date(`${date}T00:00:00`);
  dateObj.setDate(dateObj.getDate() + dayOffset);
  const parts = formatDateParts(dateObj, GOOGLE_CALENDAR_TIMEZONE);
  const timeLabel = `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(
    2,
    "0",
  )}`;

  return `${parts.year}-${parts.month}-${parts.day}T${timeLabel}:00`;
};

const bookingReferencePattern = /\bSMQ-[A-Z0-9]+\b|\bSM-[A-Z0-9]+\b/;

const extractBookingReference = (event: GoogleEvent) => {
  const direct = event.extendedProperties?.private?.bookingReference;
  if (direct) return direct;
  const text = `${event.summary ?? ""} ${event.description ?? ""}`;
  const match = text.match(bookingReferencePattern);
  return match ? match[0] : null;
};

const buildEventDescription = (booking: BookingRecord) => {
  const lines = [
    `Spark & Mend booking`,
    `Reference: ${booking.reference}`,
    booking.service ? `Service: ${booking.service}` : null,
    booking.status ? `Status: ${booking.status}` : null,
    booking.contact_name ? `Customer: ${booking.contact_name}` : null,
    booking.contact_email ? `Email: ${booking.contact_email}` : null,
    booking.contact_phone ? `Phone: ${booking.contact_phone}` : null,
    booking.contact_address ? `Address: ${booking.contact_address}` : null,
    booking.contact_postcode ? `Postcode: ${booking.contact_postcode}` : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
    `Manage booking: ${APP_DOMAIN}/my-booking?reference=${booking.reference}`,
  ];

  return lines.filter(Boolean).join("\n");
};

const buildEventPayload = (booking: BookingRecord) => {
  const date = booking.preferred_date;
  if (!date) return null;
  const time = booking.preferred_time || "09:00";
  const startDateTime = buildDateTimeString(date, time);
  const endDateTime = addHours(date, time, GOOGLE_EVENT_DURATION_HOURS);

  return {
    summary: `Spark & Mend Booking ${booking.reference}`,
    description: buildEventDescription(booking),
    start: {
      dateTime: startDateTime,
      timeZone: GOOGLE_CALENDAR_TIMEZONE,
    },
    end: {
      dateTime: endDateTime,
      timeZone: GOOGLE_CALENDAR_TIMEZONE,
    },
    location: booking.contact_address || undefined,
    extendedProperties: {
      private: {
        bookingReference: booking.reference,
      },
    },
  };
};

const googleRequest = async (
  accessToken: string,
  path: string,
  init?: RequestInit,
) => {
  const response = await fetch(`${GOOGLE_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message || "Google Calendar request failed.");
  }

  return response;
};

const fetchBookings = async () => {
  ensureSupabase();
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/${BOOKING_TABLE}?select=reference,service,contact_name,contact_email,contact_phone,contact_address,contact_postcode,preferred_date,preferred_time,status,notes`,
    { headers: supabaseHeaders },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to load bookings.");
  }

  return (await response.json()) as BookingRecord[];
};

const fetchEventMappings = async () => {
  ensureSupabase();
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/${EVENT_TABLE}?select=booking_reference,event_id,calendar_id,status,last_synced_at`,
    { headers: supabaseHeaders },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to load calendar mappings.");
  }

  return (await response.json()) as EventMapping[];
};

const upsertEventMapping = async (payload: EventMapping) => {
  ensureSupabase();
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/${EVENT_TABLE}?on_conflict=booking_reference`,
    {
      method: "POST",
      headers: {
        ...supabaseHeaders,
        Prefer: "return=representation,resolution=merge-duplicates",
      },
      body: JSON.stringify({
        ...payload,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to save calendar mapping.");
  }

  const data = (await response.json()) as EventMapping[];
  return data[0] ?? null;
};

const updateBooking = async (reference: string, updates: Partial<BookingRecord>) => {
  ensureSupabase();
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/${BOOKING_TABLE}?reference=eq.${encodeURIComponent(
      reference,
    )}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to update booking.");
  }

  return response.json();
};

const listGoogleEvents = async (
  accessToken: string,
  timeMin: string,
  timeMax: string,
) => {
  const items: GoogleEvent[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: "true",
      showDeleted: "true",
      orderBy: "startTime",
      maxResults: "2500",
      fields:
        "nextPageToken,items(id,summary,description,status,start,end,extendedProperties)",
    });
    if (pageToken) {
      params.set("pageToken", pageToken);
    }
    const response = await googleRequest(
      accessToken,
      `/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?${params.toString()}`,
    );
    const payload = (await response.json()) as {
      items?: GoogleEvent[];
      nextPageToken?: string;
    };
    items.push(...(payload.items ?? []));
    pageToken = payload.nextPageToken;
  } while (pageToken);

  return items;
};

const createGoogleEvent = async (
  accessToken: string,
  payload: Record<string, unknown>,
) => {
  const response = await googleRequest(
    accessToken,
    `/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return (await response.json()) as GoogleEvent;
};

const updateGoogleEvent = async (
  accessToken: string,
  eventId: string,
  payload: Record<string, unknown>,
) => {
  const response = await googleRequest(
    accessToken,
    `/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return (await response.json()) as GoogleEvent;
};

const cancelGoogleEvent = async (accessToken: string, eventId: string) => {
  await googleRequest(
    accessToken,
    `/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events/${encodeURIComponent(eventId)}`,
    { method: "DELETE" },
  );
};

const buildDateRange = (bookings: BookingRecord[]) => {
  const dates = bookings
    .map((booking) => booking.preferred_date)
    .filter(Boolean) as string[];
  if (!dates.length) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 6, 0);
    return { start, end };
  }

  const parsed = dates.map((value) => new Date(`${value}T00:00:00`));
  const min = new Date(Math.min(...parsed.map((date) => date.getTime())));
  const max = new Date(Math.max(...parsed.map((date) => date.getTime())));
  min.setDate(min.getDate() - 1);
  max.setDate(max.getDate() + 1);
  return { start: min, end: max };
};

const getEventStart = (event: GoogleEvent) => {
  if (event.start?.dateTime) {
    const date = new Date(event.start.dateTime);
    return {
      date: formatDateForZone(date, GOOGLE_CALENDAR_TIMEZONE),
      time: formatTimeForZone(date, GOOGLE_CALENDAR_TIMEZONE),
    };
  }

  if (event.start?.date) {
    const date = new Date(`${event.start.date}T00:00:00`);
    return {
      date: formatDateForZone(date, GOOGLE_CALENDAR_TIMEZONE),
      time: null,
    };
  }

  return null;
};

export const syncGoogleCalendar = async () => {
  ensureSupabase();
  const { accessToken } = await getGoogleAccessToken();
  const bookings = await fetchBookings();
  const mappings = await fetchEventMappings();

  const mappingByReference = new Map(
    mappings.map((mapping) => [mapping.booking_reference, mapping]),
  );
  const bookingByReference = new Map(
    bookings.map((booking) => [booking.reference, booking]),
  );

  let created = 0;
  let updated = 0;
  let cancelled = 0;
  let pulledUpdates = 0;
  let pulledCancelled = 0;

  for (const booking of bookings) {
    if (!booking.preferred_date) continue;
    const mapping = mappingByReference.get(booking.reference);

    if (booking.status === "cancelled") {
      if (mapping?.event_id) {
        await cancelGoogleEvent(accessToken, mapping.event_id);
        await upsertEventMapping({
          booking_reference: booking.reference,
          event_id: mapping.event_id,
          calendar_id: GOOGLE_CALENDAR_ID,
          status: "cancelled",
          last_synced_at: new Date().toISOString(),
        });
        cancelled += 1;
      }
      continue;
    }

    const payload = buildEventPayload(booking);
    if (!payload) continue;

    if (mapping?.event_id) {
      await updateGoogleEvent(accessToken, mapping.event_id, payload);
      await upsertEventMapping({
        booking_reference: booking.reference,
        event_id: mapping.event_id,
        calendar_id: GOOGLE_CALENDAR_ID,
        status: booking.status,
        last_synced_at: new Date().toISOString(),
      });
      updated += 1;
    } else {
      const createdEvent = await createGoogleEvent(accessToken, payload);
      if (createdEvent.id) {
        await upsertEventMapping({
          booking_reference: booking.reference,
          event_id: createdEvent.id,
          calendar_id: GOOGLE_CALENDAR_ID,
          status: booking.status,
          last_synced_at: new Date().toISOString(),
        });
        created += 1;
      }
    }
  }

  const range = buildDateRange(bookings);
  const events = await listGoogleEvents(
    accessToken,
    range.start.toISOString(),
    range.end.toISOString(),
  );

  for (const event of events) {
    const reference = extractBookingReference(event);
    if (!reference) continue;
    const booking = bookingByReference.get(reference);
    if (!booking) continue;

    if (event.status === "cancelled") {
      if (booking.status !== "cancelled") {
        await updateBooking(reference, { status: "cancelled" });
        pulledCancelled += 1;
      }
      if (event.id) {
        await upsertEventMapping({
          booking_reference: reference,
          event_id: event.id,
          calendar_id: GOOGLE_CALENDAR_ID,
          status: "cancelled",
          last_synced_at: new Date().toISOString(),
        });
      }
      continue;
    }

    const start = getEventStart(event);
    if (!start) continue;
    const updates: Partial<BookingRecord> = {};
    if (start.date && start.date !== booking.preferred_date) {
      updates.preferred_date = start.date;
    }
    if (
      start.time &&
      start.time !== booking.preferred_time &&
      booking.preferred_time
    ) {
      updates.preferred_time = start.time;
    } else if (start.time && !booking.preferred_time) {
      updates.preferred_time = start.time;
    }

    if (Object.keys(updates).length > 0) {
      await updateBooking(reference, updates);
      pulledUpdates += 1;
    }

    if (event.id) {
      await upsertEventMapping({
        booking_reference: reference,
        event_id: event.id,
        calendar_id: GOOGLE_CALENDAR_ID,
        status: booking.status,
        last_synced_at: new Date().toISOString(),
      });
    }
  }

  const syncedAt = new Date().toISOString();
  await updateIntegrationLastSynced(syncedAt);

  return {
    created,
    updated,
    cancelled,
    pulledUpdates,
    pulledCancelled,
    totalBookings: bookings.length,
    totalEvents: events.length,
    syncedAt,
  };
};
