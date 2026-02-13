"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/quote";
import { Ban, Eye, Pencil, Save, Trash2, User } from "lucide-react";

type BookingRecord = {
  reference: string;
  service?: string;
  property_summary?: string;
  frequency?: string;
  per_visit_price?: number;
  extras?: string[];
  custom_extras_items?: string[];
  custom_extras_text?: string;
  custom_extras_reason?: string;
  custom_extras_source?: string;
  custom_extras_fallback_reason?: string;
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
  created_at?: string;
};

const statusStyles: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  cancelled: "destructive",
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filtered, setFiltered] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<BookingRecord | null>(null);
  const [editForm, setEditForm] = useState<BookingRecord | null>(null);
  const [viewing, setViewing] = useState<BookingRecord | null>(null);
  const [customerFilter, setCustomerFilter] = useState<{
    email?: string;
    name?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"save" | "cancel" | "delete" | null>(null);

  const metrics = useMemo(() => {
    const total = bookings.length;
    const paid = bookings.filter((item) => item.status === "paid");
    const pending = bookings.filter((item) => item.status !== "paid" && item.status !== "cancelled");
    const cancelled = bookings.filter((item) => item.status === "cancelled");
    const revenue = paid.reduce((sum, item) => sum + (item.payment_amount ?? 0), 0);
    const unpaidValue = pending.reduce(
      (sum, item) => sum + (item.per_visit_price ?? 0),
      0,
    );
    return {
      total,
      paid: paid.length,
      pending: pending.length,
      cancelled: cancelled.length,
      revenue,
      unpaidValue,
    };
  }, [bookings]);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to fetch bookings.");
      }
      setBookings(data.bookings ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(bookings);
      return;
    }
    const query = searchQuery.trim().toLowerCase();
    setFiltered(
      bookings.filter((item) =>
        [
          item.reference,
          item.contact_email,
          item.contact_name,
          item.contact_phone,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      ),
    );
  }, [bookings, searchQuery]);

  useEffect(() => {
    if (!customerFilter?.email) return;
    setSearchQuery(customerFilter.email);
  }, [customerFilter]);

  useEffect(() => {
    if (!selected) {
      setEditForm(null);
      return;
    }
    setEditForm({ ...selected });
  }, [selected]);

  const handleSave = async () => {
    if (!editForm) return;
    setIsSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: editForm.reference,
          updates: editForm,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update booking.");
      }
      setSuccess("Booking updated.");
      setSelected(data.booking);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsDeleting(true);
    setSuccess(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: selected.reference }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete booking.");
      }
      setSelected(null);
      setEditForm(null);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const upcomingBookings = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    return bookings
      .filter((booking) => booking.preferred_date)
      .filter((booking) => booking.status !== "cancelled")
      .map((booking) => ({
        ...booking,
        preferredDateObj: booking.preferred_date
          ? new Date(`${booking.preferred_date}T00:00:00`)
          : null,
      }))
      .filter(
        (booking) =>
          booking.preferredDateObj &&
          booking.preferredDateObj >= now &&
          booking.preferredDateObj <= end,
      )
      .sort((a, b) =>
        a.preferredDateObj && b.preferredDateObj
          ? a.preferredDateObj.getTime() - b.preferredDateObj.getTime()
          : 0,
      )
      .slice(0, 8);
  }, [bookings]);

  const customerBookings = useMemo(() => {
    if (!selected?.contact_email) return [];
    return bookings
      .filter(
        (booking) =>
          booking.contact_email?.toLowerCase() ===
          selected.contact_email?.toLowerCase(),
      )
      .sort((a, b) => {
        const aDate = a.preferred_date ? new Date(`${a.preferred_date}T00:00:00`) : null;
        const bDate = b.preferred_date ? new Date(`${b.preferred_date}T00:00:00`) : null;
        if (aDate && bDate) {
          return bDate.getTime() - aDate.getTime();
        }
        return 0;
      });
  }, [bookings, selected?.contact_email]);

  const handleCancelBooking = async () => {
    if (!selected) return;
    setIsCancelling(true);
    setSuccess(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: selected.reference,
          updates: { status: "cancelled" },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to cancel booking.");
      }
      setSelected(data.booking);
      setSuccess("Booking cancelled.");
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsCancelling(false);
    }
  };

  const confirmConfig = useMemo(() => {
    if (!confirmAction) return null;
    if (confirmAction === "save") {
      return {
        title: "Save changes?",
        description: "Confirm updates to this booking before saving.",
        actionLabel: isSaving ? "Saving..." : "Save changes",
        variant: "default",
      };
    }
    if (confirmAction === "cancel") {
      return {
        title: "Cancel this booking?",
        description: "The booking will remain in the system with a cancelled status.",
        actionLabel: isCancelling ? "Cancelling..." : "Cancel booking",
        variant: "outline",
      };
    }
    return {
      title: "Delete this booking?",
      description: "This action cannot be undone.",
      actionLabel: isDeleting ? "Deleting..." : "Delete booking",
      variant: "destructive",
    };
  }, [confirmAction, isSaving, isCancelling, isDeleting]);

  const handleConfirm = async () => {
    const action = confirmAction;
    setConfirmAction(null);
    if (action === "save") {
      await handleSave();
      return;
    }
    if (action === "cancel") {
      await handleCancelBooking();
      return;
    }
    if (action === "delete") {
      await handleDelete();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage bookings, update status, and track revenue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={refresh} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardDescription>Total bookings</CardDescription>
            <CardTitle>{metrics.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardDescription>Paid bookings</CardDescription>
            <CardTitle>{metrics.paid}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardDescription>Pending bookings</CardDescription>
            <CardTitle>{metrics.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardDescription>Revenue collected</CardDescription>
            <CardTitle>{formatCurrency(metrics.revenue)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-[1.75fr_1.25fr]">
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              {metrics.pending} awaiting payment • {metrics.cancelled} cancelled • Unpaid
              value {formatCurrency(metrics.unpaidValue)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="booking-search">Search</Label>
                <Input
                  id="booking-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Reference, name, email, phone"
                />
              </div>
              {customerFilter?.email && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCustomerFilter(null);
                    setSearchQuery("");
                  }}
                  className="self-start sm:self-end"
                >
                  Clear customer filter
                </Button>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}
            <div className="grid gap-3 lg:hidden">
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                  {isLoading ? "Loading bookings..." : "No bookings found."}
                </div>
              )}
              {filtered.map((booking) => (
                <div
                  key={booking.reference}
                  className={
                    selected?.reference === booking.reference
                      ? "rounded-2xl border border-primary/50 bg-primary/5 px-4 py-4 text-sm"
                      : "rounded-2xl border border-border/60 bg-background/70 px-4 py-4 text-sm"
                  }
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {booking.reference}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {booking.contact_name || "—"}
                      </p>
                    </div>
                    <Badge variant={statusStyles[booking.status ?? "pending"] ?? "outline"}>
                      {booking.status ?? "pending"}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Service:</span>{" "}
                      {booking.service || "—"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Date:</span>{" "}
                      {formatDate(booking.preferred_date)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Amount:</span>{" "}
                      {booking.payment_amount
                        ? formatCurrency(booking.payment_amount)
                        : booking.per_visit_price
                        ? formatCurrency(booking.per_visit_price)
                        : "—"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Contact:</span>{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setCustomerFilter({
                            email: booking.contact_email ?? undefined,
                            name: booking.contact_name ?? undefined,
                          })
                        }
                        className="text-left text-foreground underline-offset-4 hover:underline"
                      >
                        {booking.contact_email || booking.contact_phone || "—"}
                      </button>
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelected(booking)}
                      aria-label="Edit booking"
                      title="Edit booking"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewing(booking)}
                      aria-label="View details"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Table className="hidden lg:table">
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Preferred date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-sm text-muted-foreground">
                      {isLoading ? "Loading bookings..." : "No bookings found."}
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((booking) => (
                  <TableRow
                    key={booking.reference}
                    className={
                      selected?.reference === booking.reference
                        ? "bg-primary/10"
                        : undefined
                    }
                  >
                    <TableCell className="font-medium text-foreground">
                      {booking.reference}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomerFilter({
                            email: booking.contact_email ?? undefined,
                            name: booking.contact_name ?? undefined,
                          })
                        }
                        className="text-left"
                      >
                        <div className="text-sm text-foreground">
                          {booking.contact_name || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.contact_email || booking.contact_phone || "—"}
                        </div>
                      </button>
                    </TableCell>
                    <TableCell>{booking.service || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusStyles[booking.status ?? "pending"] ?? "outline"}>
                        {booking.status ?? "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.status === "paid" ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>{formatDate(booking.preferred_date)}</TableCell>
                    <TableCell>
                      {booking.payment_amount
                        ? formatCurrency(booking.payment_amount)
                        : booking.per_visit_price
                        ? formatCurrency(booking.per_visit_price)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelected(booking)}
                          aria-label="Edit booking"
                          title="Edit booking"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setViewing(booking)}
                          aria-label="View details"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 bg-card/90">
            <CardHeader>
              <CardTitle>Upcoming (next 7 days)</CardTitle>
              <CardDescription>Bookings with a preferred date coming up.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingBookings.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming bookings.</p>
              )}
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.reference}
                  className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(booking)}
                      className="flex-1 text-left"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {booking.reference}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {booking.contact_name || "—"}
                      </p>
                    </button>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusStyles[booking.status ?? "pending"] ?? "outline"}>
                        {booking.status ?? "pending"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewing(booking)}
                        aria-label="View booking details"
                        title="View booking details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {formatDate(booking.preferred_date)} • {booking.preferred_time || "Time TBC"}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/90 xl:sticky xl:top-24">
          <CardHeader>
            <CardTitle>Booking details</CardTitle>
            <CardDescription>
              {selected
                ? `Editing ${selected.reference}`
                : "Select a booking to edit details."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editForm && (
              <p className="text-sm text-muted-foreground">
                Choose a booking from the table to update it here.
              </p>
            )}
            {editForm && (
              <>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editForm.status ?? "pending"}
                    onValueChange={(value) =>
                      setEditForm((prev) => (prev ? { ...prev, status: value } : prev))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Input
                    value={editForm.service ?? ""}
                    onChange={(event) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, service: event.target.value } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Property summary</Label>
                  <Input
                    value={editForm.property_summary ?? ""}
                    onChange={(event) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, property_summary: event.target.value } : prev,
                      )
                    }
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Preferred date</Label>
                    <Input
                      type="date"
                      value={editForm.preferred_date ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, preferred_date: event.target.value } : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred time</Label>
                    <Input
                      type="time"
                      value={editForm.preferred_time ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, preferred_time: event.target.value } : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Contact name</Label>
                    <Input
                      value={editForm.contact_name ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, contact_name: event.target.value } : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editForm.contact_email ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, contact_email: event.target.value } : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={editForm.contact_phone ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, contact_phone: event.target.value } : prev,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment amount</Label>
                    <Input
                      type="number"
                      value={editForm.payment_amount ?? ""}
                      onChange={(event) =>
                        setEditForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                payment_amount: Number(event.target.value) || 0,
                              }
                            : prev,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={editForm.contact_address ?? ""}
                    onChange={(event) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, contact_address: event.target.value } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editForm.notes ?? ""}
                    onChange={(event) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, notes: event.target.value } : prev,
                      )
                    }
                  />
                </div>
                {customerBookings.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Customer bookings</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCustomerFilter({
                            email: editForm.contact_email ?? undefined,
                            name: editForm.contact_name ?? undefined,
                          })
                        }
                      >
                        View all
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {customerBookings.map((booking) => (
                        <button
                          key={booking.reference}
                          type="button"
                          onClick={() => setSelected(booking)}
                          className="w-full rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="uppercase tracking-[0.2em]">
                              {booking.reference}
                            </span>
                            <Badge
                              variant={
                                statusStyles[booking.status ?? "pending"] ?? "outline"
                              }
                            >
                              {booking.status ?? "pending"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-foreground">
                            {formatDate(booking.preferred_date)} •{" "}
                            {booking.service || "Service"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmAction("save")}
                    disabled={isSaving || isCancelling || isDeleting}
                    aria-label="Save changes"
                    title="Save changes"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmAction("cancel")}
                    disabled={isSaving || isCancelling || isDeleting}
                    aria-label="Cancel booking"
                    title="Cancel booking"
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setConfirmAction("delete")}
                    disabled={isSaving || isCancelling || isDeleting}
                    aria-label="Delete booking"
                    title="Delete booking"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmConfig?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmConfig?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                confirmAction === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : confirmAction === "cancel"
                  ? "border border-border/60 bg-background text-foreground hover:bg-accent"
                  : undefined
              }
            >
              {confirmConfig?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                    {viewing.frequency || "—"}
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
                  <p className="text-muted-foreground">
                    {viewing.payment_currency || "GBP"}
                  </p>
                  <Badge
                    variant={statusStyles[viewing.status ?? "pending"] ?? "outline"}
                  >
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
              {viewing.contact_email && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2"
                  onClick={() =>
                    (setCustomerFilter({
                      email: viewing.contact_email ?? undefined,
                      name: viewing.contact_name ?? undefined,
                    }),
                    setViewing(null))
                  }
                >
                  <User className="h-4 w-4" />
                  View customer bookings
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
