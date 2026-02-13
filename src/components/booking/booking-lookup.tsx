"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/quote";
import { getFrequencyLabel } from "@/lib/booking-frequency";

type BookingRecord = {
  reference: string;
  service?: string;
  property_summary?: string;
  frequency?: string;
  frequency_key?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_subscription_status?: string;
  stripe_current_period_end?: string;
  per_visit_price?: number;
  extras?: string[];
  custom_extras_items?: string[];
  custom_extras_text?: string;
  custom_extras_price?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_postcode?: string;
  contact_address?: string;
  contact_method?: string;
  preferred_date?: string;
  preferred_time?: string;
  notes?: string;
  status?: string;
  payment_amount?: number;
  payment_currency?: string;
};

type BookingLookupProps = {
  initialReference?: string;
  paymentStatus?: string;
};

const buildStatusLabel = (booking: BookingRecord) => {
  if (booking.stripe_subscription_id && booking.status !== "cancelled") {
    return "Subscription active";
  }
  const status = booking.status?.toLowerCase();
  if (status === "cancelled") return "Cancelled";
  if (status === "paid") {
    if (booking.preferred_date) {
      const preferred = new Date(booking.preferred_date);
      const today = new Date();
      preferred.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return preferred < today ? "Completed" : "Confirmed";
    }
    return "Confirmed";
  }
  return "Awaiting payment";
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const BookingLookup = ({ initialReference, paymentStatus }: BookingLookupProps) => {
  const [searchQuery, setSearchQuery] = useState(initialReference ?? "");
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<BookingRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const hasSubscription = Boolean(booking?.stripe_subscription_id);
  const subscriptionStatus = booking?.stripe_subscription_status;
  const subscriptionPeriodEnd = booking?.stripe_current_period_end
    ? new Date(booking.stripe_current_period_end)
    : null;
  const [form, setForm] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    contact_postcode: "",
    contact_address: "",
    contact_method: "",
    preferred_date: "",
    preferred_time: "",
    notes: "",
  });

  const statusLabel = useMemo(() => {
    if (!booking) return "";
    return buildStatusLabel(booking);
  }, [booking]);

  useEffect(() => {
    if (!booking) return;
    setForm({
      contact_name: booking.contact_name ?? "",
      contact_email: booking.contact_email ?? "",
      contact_phone: booking.contact_phone ?? "",
      contact_postcode: booking.contact_postcode ?? "",
      contact_address: booking.contact_address ?? "",
      contact_method: booking.contact_method ?? "",
      preferred_date: booking.preferred_date ?? "",
      preferred_time: booking.preferred_time ?? "",
      notes: booking.notes ?? "",
    });
  }, [booking]);

  const lookupByReference = async (value: string) => {
    setSearchError(null);
    setSuccess(null);
    setSearchResults([]);
    const trimmed = value.trim();
    if (!trimmed) {
      setSearchError("Add your booking reference or email to continue.");
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to find that booking.");
      }
      setBooking(data.booking);
      setSuccess(null);
    } catch (err) {
      setBooking(null);
      setSearchError((err as Error).message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSearchError(null);
    setSuccess(null);
    setBooking(null);
    setSearchResults([]);
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchError("Add your booking reference or email to continue.");
      return;
    }
    if (!trimmed.includes("@")) {
      await lookupByReference(trimmed);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch("/api/bookings/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to find bookings.");
      }
      setSearchResults(data.bookings ?? []);
      if (!data.bookings?.length) {
        setSearchError("No bookings found for that email address.");
      }
    } catch (err) {
      setSearchError((err as Error).message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    if (!booking) return;
    setSearchError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      const response = await fetch("/api/bookings/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: booking.reference, updates: form }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update booking.");
      }
      setBooking(data.booking);
      setSuccess("Booking details updated.");
    } catch (err) {
      setSearchError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    setSearchError(null);
    setSuccess(null);
    const confirmed = window.confirm(
      "Cancel this booking? You can still contact us if you need to reschedule.",
    );
    if (!confirmed) return;
    setIsCancelling(true);
    try {
      const response = await fetch("/api/bookings/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: booking.reference,
          updates: { status: "cancelled" },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to cancel booking.");
      }
      setBooking(data.booking);
      setSuccess("Booking cancelled.");
    } catch (err) {
      setSearchError((err as Error).message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePay = async () => {
    if (!booking) return;
    setSearchError(null);
    setSuccess(null);
    setIsPaying(true);
    try {
      const response = await fetch("/api/stripe/checkout-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: booking.reference }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start payment.");
      }
      window.location.href = data.url as string;
    } catch (err) {
      setSearchError((err as Error).message);
      setIsPaying(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!booking?.stripe_subscription_id && !booking?.stripe_customer_id) return;
    setSearchError(null);
    setSuccess(null);
    setIsManaging(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: booking.reference,
          subscriptionId: booking.stripe_subscription_id,
          customerId: booking.stripe_customer_id,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to open billing portal.");
      }
      window.location.href = data.url as string;
    } catch (err) {
      setSearchError((err as Error).message);
      setIsManaging(false);
    }
  };

  return (
    <div className="grid gap-8">
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Find your booking</CardTitle>
          </CardHeader>
          <CardContent>
          {paymentStatus === "cancelled" && (
            <p className="mb-4 text-sm text-muted-foreground">
              Payment was cancelled. You can try again when you are ready.
            </p>
          )}
          <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="booking-search">Booking reference or email</Label>
              <Input
                id="booking-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="e.g. SMQ-1A2B3C or you@email.com"
              />
            </div>
            <div className="flex items-end">
              <PrimaryButton type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : "Find booking"}
              </PrimaryButton>
            </div>
          </form>
          {searchError && (
            <p className="mt-3 text-sm text-muted-foreground">{searchError}</p>
          )}
          {success && <p className="mt-3 text-sm text-emerald-600">{success}</p>}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Bookings found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {searchResults.map((result) => (
                <div
                  key={result.reference}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {buildStatusLabel(result)}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {result.reference}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(result.service as string) ?? "Cleaning service"}
                      {result.preferred_date
                        ? ` • ${formatDate(result.preferred_date as string)}`
                        : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(result.reference);
                      lookupByReference(result.reference);
                    }}
                  >
                    View booking
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {booking && (
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Booking overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                {statusLabel}
              </span>
              <span className="text-xs uppercase tracking-[0.2em]">
                Ref: {booking.reference}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">Service</p>
                <p className="text-foreground">{booking.service ?? "Cleaning service"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">Property</p>
                <p className="text-foreground">{booking.property_summary ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">Schedule</p>
                <p className="text-foreground">
                  {getFrequencyLabel(booking.frequency ?? booking.frequency_key) ??
                    "—"}
                </p>
              </div>
              {hasSubscription && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Billing</p>
                  <p className="text-foreground">
                    {subscriptionStatus ? subscriptionStatus.replace("_", " ") : "Subscription"}
                  </p>
                  {subscriptionPeriodEnd && (
                    <p className="text-xs text-muted-foreground">
                      Next billing:{" "}
                      {subscriptionPeriodEnd.toLocaleDateString("en-GB")}
                    </p>
                  )}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">Estimated price</p>
                <p className="text-foreground">
                  {typeof booking.per_visit_price === "number"
                    ? formatCurrency(booking.per_visit_price)
                    : "—"}
                </p>
              </div>
              {booking.preferred_date && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Preferred date
                  </p>
                  <p className="text-foreground">{formatDate(booking.preferred_date)}</p>
                </div>
              )}
              {booking.preferred_time && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Preferred time
                  </p>
                  <p className="text-foreground">{booking.preferred_time}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {booking.status !== "paid" && !hasSubscription && (
                <PrimaryButton onClick={handlePay} disabled={isPaying}>
                  {isPaying ? "Preparing payment..." : "Make payment"}
                </PrimaryButton>
              )}
              {hasSubscription && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleManageSubscription}
                    disabled={isManaging}
                  >
                    {isManaging ? "Opening portal..." : "Manage subscription"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This booking is billed automatically via subscription.
                  </p>
                </>
              )}
              <Button variant="outline" onClick={handleCancel} disabled={isCancelling}>
                {isCancelling ? "Cancelling..." : "Cancel booking"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {booking && (
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Update your details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                value={form.contact_name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.contact_email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact_email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                type="tel"
                value={form.contact_phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact_phone: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred contact</Label>
              <Input
                value={form.contact_method}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact_method: event.target.value }))
                }
                placeholder="Call / WhatsApp / Email"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input
                value={form.contact_address}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact_address: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Postcode</Label>
              <Input
                value={form.contact_postcode}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact_postcode: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred date</Label>
              <Input
                type="date"
                value={form.preferred_date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, preferred_date: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred time</Label>
              <Input
                type="time"
                value={form.preferred_time}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, preferred_time: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <PrimaryButton onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </PrimaryButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingLookup;
