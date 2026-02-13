"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/quote";

type BookingRecord = {
  reference: string;
  contact_email?: string;
  contact_name?: string;
  preferred_date?: string;
  status?: string;
  payment_amount?: number;
  per_visit_price?: number;
};

const RANGE_OPTIONS = [
  { label: "Last 1 month", value: "1" },
  { label: "Last 3 months", value: "3" },
  { label: "Last 6 months", value: "6" },
  { label: "Last 12 months", value: "12" },
  { label: "Last 24 months", value: "24" },
];

const getBookingDate = (booking: BookingRecord) => {
  if (booking.preferred_date) {
    return new Date(`${booking.preferred_date}T00:00:00`);
  }
  return null;
};

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}`;

const formatMonthLabel = (date: Date) =>
  date.toLocaleString("en-GB", { month: "short", year: "2-digit" });

const AdminMetrics = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [rangeMonths, setRangeMonths] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/bookings");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load bookings.");
        }
        setBookings(data.bookings ?? []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const { monthBuckets, summary, topCustomers, rangeLabel } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (rangeMonths - 1), 1);
    const months: Date[] = [];
    for (let i = 0; i < rangeMonths; i += 1) {
      months.push(new Date(start.getFullYear(), start.getMonth() + i, 1));
    }
    const monthMap = new Map(
      months.map((date) => [
        getMonthKey(date),
        {
          key: getMonthKey(date),
          label: formatMonthLabel(date),
          paid: 0,
          pending: 0,
          cancelled: 0,
          revenue: 0,
          newCustomers: 0,
          returningCustomers: 0,
        },
      ]),
    );

    const bookingsWithDates = bookings
      .map((booking) => ({ booking, date: getBookingDate(booking) }))
      .filter((item) => item.date && item.date >= start && item.date <= now) as Array<{
      booking: BookingRecord;
      date: Date;
    }>;

    const firstBookingByEmail = new Map<string, Date>();
    bookings.forEach((booking) => {
      if (!booking.contact_email) return;
      const date = getBookingDate(booking);
      if (!date) return;
      const current = firstBookingByEmail.get(booking.contact_email.toLowerCase());
      if (!current || date < current) {
        firstBookingByEmail.set(booking.contact_email.toLowerCase(), date);
      }
    });

    const revenueByEmail = new Map<string, { label: string; total: number }>();

    bookingsWithDates.forEach(({ booking, date }) => {
      const key = getMonthKey(date);
      const bucket = monthMap.get(key);
      if (!bucket) return;
      const status = booking.status ?? "pending";
      if (status === "paid") {
        bucket.paid += 1;
        bucket.revenue += booking.payment_amount ?? booking.per_visit_price ?? 0;
      } else if (status === "cancelled") {
        bucket.cancelled += 1;
      } else {
        bucket.pending += 1;
      }

      if (booking.contact_email) {
        const emailKey = booking.contact_email.toLowerCase();
        const firstDate = firstBookingByEmail.get(emailKey);
        if (firstDate) {
          if (getMonthKey(firstDate) === key) {
            bucket.newCustomers += 1;
          } else {
            bucket.returningCustomers += 1;
          }
        }
      }

      if (status === "paid" && booking.contact_email) {
        const emailKey = booking.contact_email.toLowerCase();
        const label = booking.contact_name || booking.contact_email;
        const current = revenueByEmail.get(emailKey) ?? { label, total: 0 };
        current.total += booking.payment_amount ?? booking.per_visit_price ?? 0;
        revenueByEmail.set(emailKey, current);
      }
    });

    const monthBuckets = Array.from(monthMap.values());
    const summary = monthBuckets.reduce(
      (acc, bucket) => {
        acc.total += bucket.paid + bucket.pending + bucket.cancelled;
        acc.paid += bucket.paid;
        acc.cancelled += bucket.cancelled;
        acc.revenue += bucket.revenue;
        acc.pending += bucket.pending;
        return acc;
      },
      { total: 0, paid: 0, cancelled: 0, pending: 0, revenue: 0 },
    );

    const topCustomers = Array.from(revenueByEmail.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((item) => ({
        label: item.label ?? "Customer",
        total: item.total,
      }));

    return {
      monthBuckets,
      summary,
      topCustomers,
      rangeLabel:
        RANGE_OPTIONS.find((option) => option.value === String(rangeMonths))?.label ??
        `${rangeMonths} months`,
    };
  }, [bookings, rangeMonths]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Monthly metrics</h1>
          <p className="text-sm text-muted-foreground">
            Metrics use preferred dates only. Processed means paid (set on payment confirmation).
          </p>
        </div>
        <Select
          value={String(rangeMonths)}
          onValueChange={(value) => setRangeMonths(Number(value))}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading metrics...</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardDescription>Total bookings</CardDescription>
            <CardTitle>{summary.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardDescription>Processed (paid)</CardDescription>
            <CardTitle>{summary.paid}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardDescription>Cancelled</CardDescription>
            <CardTitle>{summary.cancelled}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardDescription>Revenue ({rangeLabel})</CardDescription>
            <CardTitle>{formatCurrency(summary.revenue)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Bookings by status</CardTitle>
            <CardDescription>Paid vs pending vs cancelled</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthBuckets}>
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="paid" stackId="a" fill="#0ea5e9" name="Paid" />
                <Bar dataKey="pending" stackId="a" fill="#94a3b8" name="Pending" />
                <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
            <CardDescription>Paid revenue by month</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthBuckets}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>New vs returning customers</CardTitle>
            <CardDescription>Based on first booking date</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthBuckets}>
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="newCustomers" stackId="b" fill="#f97316" name="New" />
                <Bar
                  dataKey="returningCustomers"
                  stackId="b"
                  fill="#6366f1"
                  name="Returning"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Top customers</CardTitle>
            <CardDescription>By revenue in this range</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCustomers} layout="vertical" margin={{ left: 24 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="label" width={120} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="total" fill="#0f766e" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMetrics;
