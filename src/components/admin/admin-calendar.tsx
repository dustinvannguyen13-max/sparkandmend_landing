"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils";
import { Eye, Pencil } from "lucide-react";
import { formatCurrency } from "@/utils/quote";
import { getFrequencyLabel } from "@/lib/booking-frequency";

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
  promo_type?: string;
  promo_label?: string;
  promo_discount?: number;
  frequency?: string;
  frequency_key?: string;
  property_summary?: string;
  per_visit_price?: number;
  payment_amount?: number;
  payment_currency?: string;
  extras?: string[];
  custom_extras_items?: string[];
  custom_extras_text?: string;
  custom_extras_reason?: string;
  custom_extras_source?: string;
  custom_extras_fallback_reason?: string;
  custom_extras_price?: number;
  notes?: string;
};

type GoogleStatus = {
  connected: boolean;
  email?: string | null;
  lastSyncedAt?: string | null;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (value: string) => new Date(`${value}T00:00:00`);

const formatFrequency = (frequency?: string | null, key?: string | null) => {
  const label = getFrequencyLabel(frequency ?? key ?? undefined);
  return label ?? "—";
};

const AdminCalendar = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [statusFilter, setStatusFilter] = useState<"all" | "paid">("all");
  const [googleStatus, setGoogleStatus] = useState<GoogleStatus | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [extendMessage, setExtendMessage] = useState<string | null>(null);
  const [extendError, setExtendError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<BookingRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load bookings.");
      }
      const withDates = (data.bookings ?? []).filter(
        (booking: BookingRecord) => booking.preferred_date,
      );
      setBookings(withDates);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    const fetchStatus = async () => {
      setGoogleError(null);
      try {
        const response = await fetch("/api/google-calendar/status");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load Google Calendar status.");
        }
        setGoogleStatus(data);
      } catch (err) {
        setGoogleError((err as Error).message);
      }
    };

    fetchStatus();
  }, []);

  const monthLabel = currentMonth.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const totalDays = monthEnd.getDate();
  const startOffset = (monthStart.getDay() + 6) % 7;

  const filteredBookings = useMemo(() => {
    if (statusFilter === "paid") {
      return bookings.filter((booking) => booking.status === "paid");
    }
    return bookings;
  }, [bookings, statusFilter]);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, BookingRecord[]>();
    filteredBookings.forEach((booking) => {
      if (!booking.preferred_date) return;
      const key = booking.preferred_date;
      const list = map.get(key) ?? [];
      list.push(booking);
      map.set(key, list);
    });
    return map;
  }, [filteredBookings]);

  const selectedBookings = selectedDate ? bookingsByDate.get(selectedDate) ?? [] : [];

  const goPrev = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
    setSelectedDate(null);
  };

  const goNext = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
    setSelectedDate(null);
  };

  const todayKey = formatDateKey(new Date());
  const formatDate = (value?: string) => {
    if (!value) return "—";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    setGoogleError(null);
    try {
      const response = await fetch("/api/google-calendar/sync", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Sync failed.");
      }
      const summary = data.result;
      setSyncMessage(
        `Synced ${summary.totalBookings} bookings. Created ${summary.created}, updated ${summary.updated}, cancelled ${summary.cancelled}.`,
      );
      setGoogleStatus((prev) => ({
        connected: true,
        email: prev?.email ?? null,
        lastSyncedAt: summary.syncedAt ?? prev?.lastSyncedAt ?? null,
      }));
    } catch (err) {
      setGoogleError((err as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExtendSeries = async () => {
    setIsExtending(true);
    setExtendMessage(null);
    setExtendError(null);
    try {
      const response = await fetch("/api/admin/bookings/extend-series", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to extend bookings.");
      }
      setExtendMessage(
        `Extended ${data.extendedSeries ?? 0} series and created ${data.created ?? 0} new bookings.`,
      );
      await loadBookings();
    } catch (err) {
      setExtendError((err as Error).message);
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Booking calendar</h1>
          <p className="text-sm text-muted-foreground">
            Calendar view shows bookings with a preferred date.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as "all" | "paid")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All bookings</SelectItem>
              <SelectItem value="paid">Paid only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={goPrev}>
            Previous
          </Button>
          <Button variant="outline" onClick={goNext}>
            Next
          </Button>
          <Button variant="outline" onClick={handleExtendSeries} disabled={isExtending}>
            {isExtending ? "Extending..." : "Extend schedules"}
          </Button>
        </div>
      </div>
      {extendMessage && <p className="text-sm text-foreground">{extendMessage}</p>}
      {extendError && <p className="text-sm text-destructive">{extendError}</p>}

      <Card className="border-border/60 bg-card/90">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Google Calendar sync</CardTitle>
            <p className="text-sm text-muted-foreground">
              Two-way sync for all bookings with a preferred date.
            </p>
          </div>
          {googleStatus?.connected ? (
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? "Syncing..." : "Sync now"}
            </Button>
          ) : (
            <Button asChild>
              <a href="/api/google-calendar/connect">Connect Google Calendar</a>
            </Button>
          )}
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          {googleStatus?.connected ? (
            <p>
              Connected{googleStatus.email ? ` as ${googleStatus.email}` : ""}.
            </p>
          ) : (
            <p>Not connected yet. Connect to sync bookings into the primary calendar.</p>
          )}
          {googleStatus?.lastSyncedAt && (
            <p>
              Last synced:{" "}
              {new Date(googleStatus.lastSyncedAt).toLocaleString("en-GB")}
            </p>
          )}
          {syncMessage && <p className="text-foreground">{syncMessage}</p>}
          {googleError && <p className="text-destructive">{googleError}</p>}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/90">
        <CardHeader>
          <CardTitle>{monthLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground">
            {DAYS.map((day) => (
              <div key={day} className="text-center uppercase tracking-[0.2em]">
                {day}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {Array.from({ length: startOffset }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24 rounded-xl border border-transparent" />
            ))}
            {Array.from({ length: totalDays }).map((_, index) => {
              const dayNumber = index + 1;
              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                dayNumber,
              );
              const key = formatDateKey(date);
              const count = bookingsByDate.get(key)?.length ?? 0;
              const isSelected = selectedDate === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(key)}
                  className={cn(
                    "flex h-24 flex-col items-start justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                    isSelected
                      ? "border-primary/70 bg-primary/10 text-foreground"
                      : "border-border/60 bg-background/70 text-foreground hover:bg-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      key === todayKey && "text-primary",
                    )}
                  >
                    {dayNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {count ? `${count} booking${count > 1 ? "s" : ""}` : "—"}
                  </span>
                </button>
              );
            })}
          </div>
          {isLoading && (
            <p className="mt-4 text-sm text-muted-foreground">Loading bookings...</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/90">
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? `Bookings on ${selectedDate}`
              : "Select a date to see bookings"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {!selectedDate && (
            <p>Choose a date on the calendar to see the booking list.</p>
          )}
          {selectedDate && selectedBookings.length === 0 && (
            <p>No bookings scheduled for this date.</p>
          )}
          {selectedDate &&
            selectedBookings.map((booking) => (
              <div
                key={booking.reference}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {booking.reference}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {booking.service ?? "Cleaning service"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.contact_name || booking.contact_email || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-right text-xs text-muted-foreground">
                  <div>
                    <p>{booking.preferred_time || "Time TBC"}</p>
                    <p>{booking.status ?? "pending"}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewing(booking)}
                    aria-label="View booking details"
                    title="View booking details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    aria-label="Edit booking"
                    title="Edit booking"
                  >
                    <Link href={`/dashboard?reference=${booking.reference}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription>
              {viewing?.reference} • {viewing?.service || "Cleaning service"}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Customer
                  </p>
                  <p className="text-foreground">{viewing.contact_name || "—"}</p>
                  <p className="text-muted-foreground">
                    {viewing.contact_email || "—"}
                  </p>
                  <p className="text-muted-foreground">
                    {viewing.contact_phone || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Schedule
                  </p>
                  <p className="text-foreground">
                    {formatDate(viewing.preferred_date)}
                  </p>
                  <p className="text-muted-foreground">
                    {viewing.preferred_time || "Time TBC"}
                  </p>
                  <p className="text-muted-foreground">
                    {formatFrequency(viewing.frequency, viewing.frequency_key)}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Pricing
                  </p>
                  <p className="text-foreground">
                    {viewing.payment_amount
                      ? formatCurrency(viewing.payment_amount)
                      : viewing.per_visit_price
                      ? formatCurrency(viewing.per_visit_price)
                      : "—"}
                  </p>
                  {viewing.promo_type && viewing.promo_discount ? (
                    <p className="text-xs text-muted-foreground">
                      Promo applied: {viewing.promo_label || "Free bathroom"} (-
                      {formatCurrency(viewing.promo_discount)})
                    </p>
                  ) : null}
                  <Badge variant="secondary">
                    {viewing.status ?? "pending"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Property
                  </p>
                  <p className="text-foreground">{viewing.property_summary || "—"}</p>
                  <p className="text-muted-foreground">
                    {viewing.contact_address || "—"}
                  </p>
                  <p className="text-muted-foreground">
                    {viewing.contact_postcode || "—"}
                  </p>
                  {viewing.contact_address && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full sm:w-auto"
                      asChild
                    >
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                          "25 Belgrave Road, Plymouth, England, PL4 7DP",
                        )}&destination=${encodeURIComponent(
                          viewing.contact_address,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Directions from Belgrave Road
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Extras
                </p>
                {viewing.extras && viewing.extras.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {viewing.extras.map((extra) => (
                      <Badge key={extra} variant="secondary">
                        {extra}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No extras selected.</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Custom extras
                </p>
                <div className="rounded-xl border border-border/60 bg-background/70 p-3 text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="text-foreground">Items:</span>{" "}
                    {viewing.custom_extras_items?.length
                      ? viewing.custom_extras_items.join(", ")
                      : "—"}
                  </p>
                  <p>
                    <span className="text-foreground">Request:</span>{" "}
                    {viewing.custom_extras_text || "—"}
                  </p>
                  <p>
                    <span className="text-foreground">Reason:</span>{" "}
                    {viewing.custom_extras_reason || "—"}
                  </p>
                  <p>
                    <span className="text-foreground">Source:</span>{" "}
                    {viewing.custom_extras_source || "—"}
                  </p>
                  <p>
                    <span className="text-foreground">Fallback reason:</span>{" "}
                    {viewing.custom_extras_fallback_reason || "—"}
                  </p>
                  <p>
                    <span className="text-foreground">Price:</span>{" "}
                    {viewing.custom_extras_price
                      ? formatCurrency(viewing.custom_extras_price)
                      : "—"}
                  </p>
                </div>
              </div>
              {viewing.notes && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Notes
                  </p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {viewing.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCalendar;
