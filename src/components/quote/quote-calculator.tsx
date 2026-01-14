"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/utils";
import {
  COMMERCIAL_PROPERTY_TYPES,
  DEFAULT_QUOTE_INPUT,
  EXTRA_OPTIONS,
  OVEN_PRICING,
  RESIDENTIAL_PROPERTY_TYPES,
  SERVICE_DESCRIPTIONS,
  formatCurrency,
  type CleaningService,
  type ExtraOption,
  type Frequency,
  type OvenOption,
  type PropertyType,
  type QuoteInput,
} from "@/utils/quote";

const STEPS = ["Service", "Property", "Schedule", "Extras", "Details"];

const SERVICE_OPTIONS: Array<{
  id: CleaningService;
  title: string;
  description: string;
}> = [
  { id: "basic", title: "Basic Clean", description: SERVICE_DESCRIPTIONS.basic },
  {
    id: "intermediate",
    title: "Intermediate Clean",
    description: SERVICE_DESCRIPTIONS.intermediate,
  },
  {
    id: "advanced",
    title: "Advanced Clean",
    description: SERVICE_DESCRIPTIONS.advanced,
  },
  {
    id: "commercial",
    title: "Commercial Cleaning",
    description: SERVICE_DESCRIPTIONS.commercial,
  },
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

const COMMERCIAL_PROPERTY_OPTIONS: Array<{
  id: PropertyType;
  label: string;
  hint: string;
}> = [
  {
    id: "office",
    label: "Office",
    hint: "Workspaces and meeting rooms.",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    hint: "Dining areas and back of house.",
  },
  {
    id: "kitchen",
    label: "Commercial kitchen",
    hint: "Prep and cooking spaces.",
  },
  {
    id: "retail",
    label: "Retail shop",
    hint: "Showrooms and stock rooms.",
  },
  {
    id: "clinic",
    label: "Clinic",
    hint: "Medical or wellness spaces.",
  },
  {
    id: "other",
    label: "Other workspace",
    hint: "Tell us about the space.",
  },
];

const CONTACT_METHOD_OPTIONS = [
  { id: "text", label: "Text message" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "call", label: "Phone call" },
  { id: "email", label: "Email" },
];

interface QuoteCalculatorProps {
  redirectUrl?: string;
}

const QuoteCalculator = ({ redirectUrl = "/your-cleaning-quote" }: QuoteCalculatorProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<QuoteInput>(DEFAULT_QUOTE_INPUT);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    preferredDate: "",
    preferredContact: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isResidential = form.service !== "commercial";

  const handleServiceSelect = (service: CleaningService) => {
    setForm((prev) => {
      const next = { ...prev, service };
      if (service === "commercial" && RESIDENTIAL_PROPERTY_TYPES.includes(prev.propertyType)) {
        next.propertyType = "office";
      }
      if (service !== "commercial" && !RESIDENTIAL_PROPERTY_TYPES.includes(prev.propertyType)) {
        next.propertyType = "house";
      }
      if (service === "advanced") {
        next.frequency = "one-time";
      }
      return next;
    });
  };

  useEffect(() => {
    if (form.service === "advanced" && form.frequency !== "one-time") {
      setForm((prev) => ({ ...prev, frequency: "one-time" }));
    }
  }, [form.service, form.frequency]);

  const toggleExtra = (extraId: ExtraOption) => {
    setForm((prev) => {
      const extras = prev.extras.includes(extraId)
        ? prev.extras.filter((item) => item !== extraId)
        : [...prev.extras, extraId];
      return { ...prev, extras };
    });
  };

  const handleNext = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (isResidential) {
        if (!form.bedrooms) {
          nextErrors.bedrooms = "Select bedrooms.";
        }
        if (!form.bathrooms) {
          nextErrors.bathrooms = "Select bathrooms.";
        }
      } else {
        if (!COMMERCIAL_PROPERTY_TYPES.includes(form.propertyType)) {
          nextErrors.propertyType = "Select a property type.";
        }
        if (!form.rooms) {
          nextErrors.rooms = "Enter the number of rooms.";
        }
      }
    }

    if (step === 4) {
      if (!contact.name.trim()) nextErrors.name = "Add your name.";
      if (!contact.email.trim()) nextErrors.email = "Add your email.";
      if (!contact.phone.trim()) nextErrors.phone = "Add your phone.";
      if (!contact.preferredContact.trim())
        nextErrors.preferredContact = "Choose a contact method.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!contact.name.trim()) nextErrors.name = "Add your name.";
    if (!contact.email.trim()) nextErrors.email = "Add your email.";
    if (!contact.phone.trim()) nextErrors.phone = "Add your phone.";
    if (!contact.preferredContact.trim())
      nextErrors.preferredContact = "Choose a contact method.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    let submissionFailed = false;

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: form,
          contact,
          source: { path: window.location.pathname },
        }),
      });

      if (!response.ok) {
        submissionFailed = true;
        setSubmitError("We could not send your details. Please call us to confirm.");
      }
    } catch (error) {
      submissionFailed = true;
      setSubmitError("We could not send your details. Please call us to confirm.");
    }

    const params = new URLSearchParams({
      service: form.service,
      propertyType: form.propertyType,
      bedrooms: String(form.bedrooms),
      bathrooms: String(form.bathrooms),
      rooms: String(form.rooms),
      frequency: form.service === "advanced" ? "one-time" : form.frequency,
      oven: form.oven,
      submitted: submissionFailed ? "0" : "1",
    });
    if (form.extras.length > 0) {
      params.set("extras", form.extras.join(","));
    }
    if (contact.preferredDate) {
      params.set("preferredDate", contact.preferredDate);
    }
    if (contact.preferredContact) {
      params.set("contactMethod", contact.preferredContact);
    }

    router.push(`${redirectUrl}?${params.toString()}`);
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            Instant Quote Calculator
          </CardTitle>
          <CardDescription>
            Answer a few quick questions and we will show your instant estimate at the end.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {SERVICE_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => handleServiceSelect(option.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all hover:border-primary/60 hover:bg-accent",
                    form.service === option.id
                      ? "border-primary bg-accent"
                      : "border-border"
                  )}
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {option.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {isResidential ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Property type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["house", "flat"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, propertyType: type as QuoteInput["propertyType"] }))
                          }
                          className={cn(
                            "rounded-xl border px-4 py-2 text-sm font-medium capitalize",
                            form.propertyType === type
                              ? "border-primary bg-accent"
                              : "border-border"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Bedrooms
                      </label>
                      <select
                        value={form.bedrooms}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            bedrooms: Number(event.target.value),
                          }))
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6].map((count) => (
                          <option key={count} value={count}>
                            {count} {count === 1 ? "bed" : "beds"}
                          </option>
                        ))}
                      </select>
                      {errors.bedrooms && (
                        <p className="text-xs text-destructive">{errors.bedrooms}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Bathrooms
                      </label>
                      <select
                        value={form.bathrooms}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            bathrooms: Number(event.target.value),
                          }))
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {[1, 2, 3, 4].map((count) => (
                          <option key={count} value={count}>
                            {count} {count === 1 ? "bath" : "baths"}
                          </option>
                        ))}
                      </select>
                      {errors.bathrooms && (
                        <p className="text-xs text-destructive">{errors.bathrooms}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Property type
                    </label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {COMMERCIAL_PROPERTY_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, propertyType: option.id }))
                          }
                          className={cn(
                            "rounded-xl border p-4 text-left text-sm",
                            form.propertyType === option.id
                              ? "border-primary bg-accent"
                              : "border-border"
                          )}
                        >
                          <span className="block text-sm font-medium text-foreground">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {option.hint}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.propertyType && (
                      <p className="text-xs text-destructive">{errors.propertyType}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Number of rooms/areas
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={form.rooms}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          rooms: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    {errors.rooms && (
                      <p className="text-xs text-destructive">{errors.rooms}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 md:grid-cols-2">
              {(form.service === "advanced"
                ? FREQUENCY_OPTIONS.filter((option) => option.id === "one-time")
                : FREQUENCY_OPTIONS
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      frequency: option.id,
                    }))
                  }
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left text-sm font-medium",
                    form.frequency === option.id
                      ? "border-primary bg-accent"
                      : "border-border"
                  )}
                >
                  {option.label}
                </button>
              ))}
              {form.service === "advanced" && (
                <p className="text-xs text-muted-foreground md:col-span-2">
                  Advanced cleans are quoted as one-time visits.
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Oven clean</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {OVEN_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          oven: option.id,
                        }))
                      }
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left text-sm font-medium",
                        form.oven === option.id
                          ? "border-primary bg-accent"
                          : "border-border"
                      )}
                    >
                      <span className="block">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.price ? `+${formatCurrency(option.price)}` : "Included"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Extra add-ons</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {EXTRA_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleExtra(option.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left text-sm",
                        form.extras.includes(option.id)
                          ? "border-primary bg-accent"
                          : "border-border"
                      )}
                    >
                      <span className="block text-sm font-medium text-foreground">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {option.description}
                      </span>
                      <span className="mt-2 block text-xs text-muted-foreground">
                        +{formatCurrency(option.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full name</label>
                <input
                  value={contact.name}
                  onChange={(event) =>
                    setContact((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Jane Doe"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(event) =>
                    setContact((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="you@email.com"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(event) =>
                    setContact((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="07..."
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Preferred contact method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTACT_METHOD_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setContact((prev) => ({
                          ...prev,
                          preferredContact: option.id,
                        }))
                      }
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-medium uppercase tracking-wide",
                        contact.preferredContact === option.id
                          ? "border-primary bg-accent text-foreground"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.preferredContact && (
                  <p className="text-xs text-destructive">{errors.preferredContact}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Postcode</label>
                <input
                  value={contact.postcode}
                  onChange={(event) =>
                    setContact((prev) => ({ ...prev, postcode: event.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="PL..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Preferred start date
                </label>
                <input
                  type="date"
                  value={contact.preferredDate}
                  onChange={(event) =>
                    setContact((prev) => ({ ...prev, preferredDate: event.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Notes or special requests
                </label>
                <textarea
                  value={contact.notes}
                  onChange={(event) =>
                    setContact((prev) => ({ ...prev, notes: event.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[110px]"
                  placeholder="Let us know about pets, access notes, or priorities."
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="outline" disabled={step === 0} onClick={handleBack}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "See my quote"}
            </Button>
          )}
        </CardFooter>
        {submitError && (
          <p className="px-6 pb-6 text-sm text-destructive">{submitError}</p>
        )}
    </Card>
  );
};

export default QuoteCalculator;
