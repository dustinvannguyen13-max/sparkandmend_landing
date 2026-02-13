"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  calculateQuote,
  DEFAULT_QUOTE_INPUT,
  EXTRA_OPTIONS,
  OVEN_PRICING,
  RESIDENTIAL_PROPERTY_TYPES,
  COMMERCIAL_PROPERTY_TYPES,
  SERVICE_LABELS,
  PROPERTY_LABELS,
  type CleaningService,
  type Frequency,
  type OvenOption,
  type PropertyType,
  type QuoteInput,
  formatCurrency,
} from "@/utils/quote";
import { Ban, Eye, Pencil, Plus, Save, Trash2, User } from "lucide-react";
import { APP_DOMAIN } from "@/utils/constants/site";

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
  promo_type?: string;
  promo_label?: string;
  promo_discount?: number;
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

type BookingContactForm = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  address: string;
  preferredContact: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

type EmailTemplateOption = "amended" | "cancelled" | "custom";

const statusStyles: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  cancelled: "destructive",
};

const CONTACT_METHOD_OPTIONS = [
  { id: "text", label: "Text message" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "call", label: "Phone call" },
  { id: "email", label: "Email" },
];

const FREQUENCY_OPTIONS: Array<{ id: Frequency; label: string }> = [
  { id: "one-time", label: "One-time" },
  { id: "weekly", label: "Weekly" },
  { id: "bi-weekly", label: "Every 2 weeks" },
  { id: "monthly", label: "Monthly" },
];

const OVEN_OPTIONS: Array<{ id: OvenOption; label: string; price: number }> = [
  { id: "none", label: "No oven clean", price: OVEN_PRICING.none },
  { id: "single", label: "Single oven", price: OVEN_PRICING.single },
  { id: "double", label: "Double oven", price: OVEN_PRICING.double },
];

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
  const [isCreating, setIsCreating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"save" | "cancel" | "delete" | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplateOption>("amended");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<QuoteInput>(DEFAULT_QUOTE_INPUT);
  const [createContact, setCreateContact] = useState<BookingContactForm>({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    address: "",
    preferredContact: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });
  const [createStatus, setCreateStatus] = useState<"pending" | "paid" | "cancelled">(
    "pending",
  );
  const [createPaymentAmount, setCreatePaymentAmount] = useState("");

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

  const createQuote = useMemo(() => calculateQuote(createForm), [createForm]);
  const createFieldClassName = "bg-[#fff7ed]";
  const createCheckboxRowClassName = "bg-[#fff7ed]";

  const buildEmailTemplate = (
    template: EmailTemplateOption,
    booking: BookingRecord,
  ) => {
    const name = booking.contact_name || "there";
    const reference = booking.reference || "your booking";
    const subject =
      template === "cancelled"
        ? `Booking cancelled for ${reference}`
        : `Booking updated for ${reference}`;
    const intro =
      template === "cancelled"
        ? `Hi ${name}, your booking has been cancelled as requested.`
        : `Hi ${name}, your booking details have been updated.`;
    const lines = [
      intro,
      "",
      `Reference: ${reference}`,
      booking.service ? `Service: ${booking.service}` : null,
      booking.property_summary ? `Property: ${booking.property_summary}` : null,
      booking.frequency ? `Schedule: ${booking.frequency}` : null,
      booking.preferred_date ? `Preferred date: ${formatDate(booking.preferred_date)}` : null,
      booking.preferred_time ? `Preferred time: ${booking.preferred_time}` : null,
      booking.notes ? `Notes: ${booking.notes}` : null,
      "",
      `Manage your booking: ${APP_DOMAIN}/my-booking?reference=${reference}`,
    ]
      .filter(Boolean)
      .join("\n");
    return { subject, body: lines };
  };

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

  useEffect(() => {
    if (!viewing) {
      setEmailTemplate("amended");
      setEmailSubject("");
      setEmailBody("");
      setEmailError(null);
      setEmailSuccess(null);
      return;
    }
    if (emailTemplate === "custom") {
      return;
    }
    const { subject, body } = buildEmailTemplate(emailTemplate, viewing);
    setEmailSubject(subject);
    setEmailBody(body);
  }, [viewing, emailTemplate]);

  useEffect(() => {
    if (createStatus === "paid") {
      setCreatePaymentAmount((prev) =>
        prev ? prev : String(createQuote.perVisitPrice),
      );
      return;
    }
    setCreatePaymentAmount("");
  }, [createStatus, createQuote.perVisitPrice]);

  const resetCreateForm = () => {
    setCreateForm(DEFAULT_QUOTE_INPUT);
    setCreateContact({
      name: "",
      email: "",
      phone: "",
      postcode: "",
      address: "",
      preferredContact: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    });
    setCreateStatus("pending");
    setCreatePaymentAmount("");
  };

  const handleCreateServiceChange = (service: CleaningService) => {
    setCreateForm((prev) => {
      const next: QuoteInput = { ...prev, service };
      if (service === "commercial") {
        next.propertyType = COMMERCIAL_PROPERTY_TYPES.includes(prev.propertyType)
          ? prev.propertyType
          : "office";
      } else {
        next.propertyType = RESIDENTIAL_PROPERTY_TYPES.includes(prev.propertyType)
          ? prev.propertyType
          : "house";
      }
      if (service === "advanced") {
        next.frequency = "one-time";
      } else if (prev.frequency === "one-time") {
        next.frequency = "weekly";
      }
      return next;
    });
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);
    setSuccess(null);

    if (!createContact.name.trim() || !createContact.email.trim() || !createContact.phone.trim()) {
      setError("Name, email, and phone are required.");
      setIsCreating(false);
      return;
    }

    const paymentAmount =
      createStatus === "paid"
        ? Number(createPaymentAmount || createQuote.perVisitPrice)
        : undefined;

    try {
      const response = await fetch("/api/admin/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: createForm,
          contact: createContact,
          status: createStatus,
          paymentAmount,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to create booking.");
      }
      setSuccess("Booking created.");
      setCreateOpen(false);
      resetCreateForm();
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!viewing) return;
    setEmailSending(true);
    setEmailError(null);
    setEmailSuccess(null);

    if (!viewing.contact_email) {
      setEmailError("No customer email on this booking.");
      setEmailSending(false);
      return;
    }
    if (!emailSubject.trim() || !emailBody.trim()) {
      setEmailError("Subject and message are required.");
      setEmailSending(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/bookings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: viewing.reference,
          to: viewing.contact_email,
          subject: emailSubject,
          body: emailBody,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to send email.");
      }
      setEmailSuccess("Email sent.");
    } catch (err) {
      setEmailError((err as Error).message);
    } finally {
      setEmailSending(false);
    }
  };

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
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>
                {metrics.pending} awaiting payment • {metrics.cancelled} cancelled • Unpaid
                value {formatCurrency(metrics.unpaidValue)}
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setError(null);
                setSuccess(null);
                setCreateOpen(true);
              }}
              className="self-start"
            >
              <Plus className="mr-2 h-4 w-4" />
              New booking
            </Button>
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
                    {booking.promo_type && booking.promo_discount ? (
                      <p>
                        <span className="font-medium text-foreground">Promo:</span>{" "}
                        {booking.promo_label || "1x free bathroom"}
                      </p>
                    ) : null}
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
                      {booking.promo_type && booking.promo_discount ? (
                        <Badge variant="secondary" className="ml-2">
                          {booking.promo_label || "1x free bathroom"}
                        </Badge>
                      ) : null}
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

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) resetCreateForm();
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New booking</DialogTitle>
            <DialogDescription>
              Add a booking manually using the same fields as the booking form.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 text-sm">
            <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Estimated price
              </p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(createQuote.perVisitPrice)} per visit
              </p>
              <p className="text-xs text-muted-foreground">
                {createQuote.paymentSummary}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Service</Label>
                <Select
                  value={createForm.service}
                  onValueChange={(value) =>
                    handleCreateServiceChange(value as CleaningService)
                  }
                >
                  <SelectTrigger className={createFieldClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_LABELS).map(([id, label]) => (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={createForm.frequency}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      frequency: value as Frequency,
                    }))
                  }
                >
                  <SelectTrigger
                    disabled={createForm.service === "advanced"}
                    className={createFieldClassName}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.service === "advanced" && (
                  <p className="text-xs text-muted-foreground">
                    Advanced cleans are one-time bookings.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Property type</Label>
                <Select
                  value={createForm.propertyType}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      propertyType: value as PropertyType,
                    }))
                  }
                >
                  <SelectTrigger className={createFieldClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(createForm.service === "commercial"
                      ? COMMERCIAL_PROPERTY_TYPES
                      : RESIDENTIAL_PROPERTY_TYPES
                    ).map((type) => (
                      <SelectItem key={type} value={type}>
                        {PROPERTY_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {createForm.service === "commercial" ? (
                <div className="space-y-2">
                  <Label>Rooms/areas</Label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={createForm.rooms}
                    className={createFieldClassName}
                    onChange={(event) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        rooms: Number(event.target.value) || 1,
                      }))
                    }
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={createForm.bedrooms}
                    className={createFieldClassName}
                    onChange={(event) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        bedrooms: Number(event.target.value) || 1,
                      }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={createForm.bathrooms}
                    className={createFieldClassName}
                    onChange={(event) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        bathrooms: Number(event.target.value) || 1,
                      }))
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Oven clean</Label>
                <Select
                  value={createForm.oven}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      oven: value as OvenOption,
                    }))
                  }
                >
                  <SelectTrigger className={createFieldClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OVEN_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={createStatus}
                  onValueChange={(value) =>
                    setCreateStatus(value as "pending" | "paid" | "cancelled")
                  }
                >
                  <SelectTrigger className={createFieldClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {createStatus === "paid" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Payment amount</Label>
                  <Input
                    type="number"
                    value={createPaymentAmount}
                    className={createFieldClassName}
                    onChange={(event) => setCreatePaymentAmount(event.target.value)}
                  />
                </div>
              )}
            </div>

              <div className="space-y-2">
                <Label>Add-ons</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {EXTRA_OPTIONS.map((extra) => {
                    const checked = createForm.extras.includes(extra.id);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        aria-pressed={checked}
                        onClick={() =>
                          setCreateForm((prev) => {
                            const nextExtras = checked
                              ? prev.extras.filter((item) => item !== extra.id)
                              : [...prev.extras, extra.id];
                            return { ...prev, extras: nextExtras };
                          })
                        }
                        className={`flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-left text-xs transition-colors hover:bg-muted/40 ${createCheckboxRowClassName}`}
                      >
                        <Checkbox checked={checked} className="pointer-events-none" />
                        <span>
                          {extra.label} (+{formatCurrency(extra.price)})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Custom extras</Label>
                <Textarea
                  value={createForm.customExtras ?? ""}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      customExtras: event.target.value,
                    }))
                  }
                  placeholder="Extra requests beyond the standard checklist."
                />
              </div>
              <div className="space-y-2">
                <Label>Custom extras price</Label>
                <Input
                  type="number"
                  value={createForm.customExtrasPrice ?? ""}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      customExtrasPrice: Number(event.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input
                  value={createContact.name}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={createContact.email}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={createContact.phone}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred contact</Label>
                <Select
                  value={createContact.preferredContact}
                  onValueChange={(value) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      preferredContact: value,
                    }))
                  }
                >
                  <SelectTrigger className={createFieldClassName}>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_METHOD_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Input
                  value={createContact.address}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Postcode</Label>
                <Input
                  value={createContact.postcode}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      postcode: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred date</Label>
                <Input
                  type="date"
                  value={createContact.preferredDate}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      preferredDate: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred time</Label>
                <Input
                  type="time"
                  value={createContact.preferredTime}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      preferredTime: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={createContact.notes}
                  className={createFieldClassName}
                  onChange={(event) =>
                    setCreateContact((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateOpen(false);
                  resetCreateForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                  {viewing.promo_type && viewing.promo_discount ? (
                    <p className="text-xs text-muted-foreground">
                      Promo applied: {viewing.promo_label || "1x free bathroom"} (-
                      {formatCurrency(viewing.promo_discount)})
                    </p>
                  ) : null}
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
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Email customer
                    </p>
                    <p className="text-sm text-foreground">
                      {viewing.contact_email || "No email on file"}
                    </p>
                  </div>
                  <Select
                    value={emailTemplate}
                    onValueChange={(value) =>
                      setEmailTemplate(value as EmailTemplateOption)
                    }
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amended">Booking updated</SelectItem>
                      <SelectItem value="cancelled">Booking cancelled</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={emailSubject}
                      onChange={(event) => setEmailSubject(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      value={emailBody}
                      onChange={(event) => setEmailBody(event.target.value)}
                      className="min-h-[140px]"
                    />
                  </div>
                  {emailError && (
                    <p className="text-xs text-destructive">{emailError}</p>
                  )}
                  {emailSuccess && (
                    <p className="text-xs text-emerald-600">{emailSuccess}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={handleSendEmail}
                      disabled={emailSending || !viewing.contact_email}
                    >
                      {emailSending ? "Sending..." : "Send email"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const { subject, body } = buildEmailTemplate(
                          emailTemplate === "custom" ? "amended" : emailTemplate,
                          viewing,
                        );
                        setEmailSubject(subject);
                        setEmailBody(body);
                      }}
                    >
                      Reset template
                    </Button>
                  </div>
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
