"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/quote";

type OfferRecord = {
  id?: string;
  title: string;
  message?: string;
  cta_label?: string;
  cta_href?: string;
  discount_type: "percent" | "amount";
  discount_value: number;
  enabled: boolean;
  start_at?: string | null;
  end_at?: string | null;
  created_at?: string | null;
};

const emptyOffer: OfferRecord = {
  title: "",
  message: "",
  cta_label: "",
  cta_href: "",
  discount_type: "amount",
  discount_value: 0,
  enabled: false,
  start_at: null,
  end_at: null,
};

const normalizeDateValue = (value: string) => {
  let normalized = value.replace(" ", "T");
  if (/([+-]\d{2})$/.test(normalized)) {
    normalized = `${normalized}:00`;
  }
  return normalized;
};

const toLocalInputValue = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  const date = new Date(normalizeDateValue(value));
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toSupabaseTimestamp = (value?: string | null) => {
  if (!value) return null;
  if (/[Zz]|[+-]\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  const base = value.length === 16 ? `${value}:00` : value;
  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = String(abs % 60).padStart(2, "0");
  return `${base}${sign}${hours}:${minutes}`;
};

const parseLocalDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const AdminOffers = () => {
  const [offer, setOffer] = useState<OfferRecord>(emptyOffer);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const previewLabel = useMemo(() => {
    if (offer.discount_type === "percent") {
      return `${offer.discount_value}% off`;
    }
    return offer.discount_value ? `${formatCurrency(offer.discount_value)} off` : "Offer";
  }, [offer.discount_type, offer.discount_value]);

  const fetchOffer = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/offers", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load offers.");
      }
      const first = Array.isArray(data.offers) ? data.offers[0] : null;
        if (first) {
          setOffer({
            id: first.id,
            title: first.title ?? "",
            message: first.message ?? "",
          cta_label: first.cta_label ?? "",
          cta_href: first.cta_href ?? "",
          discount_type: first.discount_type ?? "amount",
          discount_value: Number(first.discount_value) || 0,
          enabled: Boolean(first.enabled),
            start_at: toLocalInputValue(first.start_at ?? null),
            end_at: toLocalInputValue(first.end_at ?? null),
            created_at: first.created_at ?? null,
          });
        } else {
          setOffer(emptyOffer);
        }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffer();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    const startDate = parseLocalDate(offer.start_at);
    const endDate = parseLocalDate(offer.end_at);
    if (startDate && endDate && endDate < startDate) {
      setError("End date/time must be after the start date/time.");
      setIsSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer: {
            ...offer,
            start_at: toSupabaseTimestamp(offer.start_at),
            end_at: toSupabaseTimestamp(offer.end_at),
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to save offer.");
      }
      const updated = data.offer ?? {};
      setOffer((prev) => ({
        ...prev,
        ...updated,
        start_at: toLocalInputValue(updated.start_at ?? prev.start_at),
        end_at: toLocalInputValue(updated.end_at ?? prev.end_at),
      }));
      setSuccess("Offer updated.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Offers</h1>
          <p className="text-sm text-muted-foreground">
            Toggle the site-wide offer bar and apply discounts on quotes.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save offer"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}

      <Card className="border-border/60 bg-card/90">
        <CardHeader>
          <CardTitle>Offer settings</CardTitle>
          <CardDescription>
            This offer appears in the top bar and is applied to quotes automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Offer status</p>
              <p className="text-xs text-muted-foreground">
                Enable to show on the website.
              </p>
            </div>
            <Switch
              checked={offer.enabled}
              onCheckedChange={(value) =>
                setOffer((prev) => ({ ...prev, enabled: value }))
              }
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Offer title</Label>
              <Input
                value={offer.title}
                onChange={(event) =>
                  setOffer((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Spring refresh offer"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Discount type</Label>
              <Select
                value={offer.discount_type}
                onValueChange={(value) =>
                  setOffer((prev) => ({
                    ...prev,
                    discount_type: value as OfferRecord["discount_type"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="percent">Percent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Discount value</Label>
              <Input
                type="number"
                value={offer.discount_value}
                onChange={(event) =>
                  setOffer((prev) => ({
                    ...prev,
                    discount_value: Number(event.target.value) || 0,
                  }))
                }
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label>Preview label</Label>
              <Input value={previewLabel} readOnly />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start date/time</Label>
              <Input
                type="datetime-local"
                value={offer.start_at ?? ""}
                onChange={(event) =>
                  setOffer((prev) => ({
                    ...prev,
                    start_at: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End date/time</Label>
              <Input
                type="datetime-local"
                value={offer.end_at ?? ""}
                onChange={(event) =>
                  setOffer((prev) => ({
                    ...prev,
                    end_at: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>CTA label</Label>
              <Input
                value={offer.cta_label ?? ""}
                onChange={(event) =>
                  setOffer((prev) => ({ ...prev, cta_label: event.target.value }))
                }
                placeholder="Arrange a FREE clean"
              />
            </div>
            <div className="space-y-2">
              <Label>CTA link</Label>
              <Input
                value={offer.cta_href ?? ""}
                onChange={(event) =>
                  setOffer((prev) => ({ ...prev, cta_href: event.target.value }))
                }
                placeholder="/get-a-quote"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Offer description</Label>
            <Textarea
              value={offer.message ?? ""}
              onChange={(event) =>
                setOffer((prev) => ({ ...prev, message: event.target.value }))
              }
              placeholder="Short message shown in the top bar."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/90">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How the offer bar will appear on the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-border/60 bg-primary/10 px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {previewLabel}
              </span>
              <span className="font-semibold text-foreground">
                {offer.title || "Offer title"}
              </span>
              <span className="text-muted-foreground">
                {offer.message || "Offer message goes here."}
              </span>
            </div>
          </div>
          {isLoading && (
            <p className="mt-2 text-xs text-muted-foreground">Loading offers...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOffers;
