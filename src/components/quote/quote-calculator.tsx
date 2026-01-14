"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
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

const SERVICE_IMAGES: Record<
  CleaningService,
  { src: string; alt: string }
> = {
  basic: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w",
    alt: "Basic clean placeholder image",
  },
  intermediate: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w",
    alt: "Intermediate clean placeholder image",
  },
  advanced: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w",
    alt: "Advanced clean placeholder image",
  },
  commercial: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w",
    alt: "Commercial cleaning placeholder image",
  },
};

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

const PROPERTY_TYPE_IMAGES: Record<
  PropertyType,
  { src: string; alt: string }
> = {
  house: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w",
    alt: "House cleaning placeholder image",
  },
  flat: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w",
    alt: "Flat cleaning placeholder image",
  },
  office: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w",
    alt: "Office cleaning placeholder image",
  },
  restaurant: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w",
    alt: "Restaurant cleaning placeholder image",
  },
  kitchen: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w",
    alt: "Commercial kitchen cleaning placeholder image",
  },
  retail: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w",
    alt: "Retail cleaning placeholder image",
  },
  clinic: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w",
    alt: "Clinic cleaning placeholder image",
  },
  other: {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w",
    alt: "Workspace cleaning placeholder image",
  },
};

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
  const shouldReduceMotion = useReducedMotion();

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
    <Card className="w-full border-border/70 bg-card/90">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          Instant Quote Calculator
        </CardTitle>
        <CardDescription>
          Answer a few quick questions and we will show your instant estimate at the end.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {SERVICE_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => {
                      handleServiceSelect(option.id);
                      handleNext();
                    }}
                    aria-pressed={form.service === option.id}
                    className={cn(
                      "group flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all hover:-translate-y-[1px] hover:shadow-[0_24px_60px_-44px_hsl(var(--primary)/0.35)]",
                      form.service === option.id
                        ? "border-primary/70 bg-primary/10"
                        : "border-border/60 bg-card/80"
                    )}
                  >
                    <div className="overflow-hidden rounded-xl border border-border/60 bg-background/70">
                      <Image
                        src={SERVICE_IMAGES[option.id].src}
                        alt={SERVICE_IMAGES[option.id].alt}
                        width={800}
                        height={520}
                        className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-32"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {option.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
              }
            >
              <div className="space-y-6">
                {isResidential ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Property type
                      </Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {["house", "flat"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                propertyType: type as QuoteInput["propertyType"],
                              }))
                            }
                            className={cn(
                              "group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all hover:-translate-y-[1px]",
                              form.propertyType === type
                                ? "border-primary/70 bg-primary/10"
                                : "border-border/60 bg-card/80"
                            )}
                          >
                            <div className="absolute inset-0">
                              <Image
                                src={PROPERTY_TYPE_IMAGES[type as PropertyType].src}
                                alt={PROPERTY_TYPE_IMAGES[type as PropertyType].alt}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            </div>
                            <div className="relative z-10 flex items-center justify-between">
                              <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                                {type}
                              </span>
                              <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Residential
                              </span>
                            </div>
                            <div className="relative z-10 mt-6">
                              <span className="text-xs text-muted-foreground">
                                Most popular for {type === "house" ? "family homes" : "flats & apartments"}.
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                      <Label htmlFor="bedrooms-menu" className="text-sm font-medium text-foreground">
                        Bedrooms
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            id="bedrooms-menu"
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl border bg-background/70 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
                              errors.bedrooms ? "border-destructive/70" : "border-input",
                            )}
                          >
                            <span>
                              {form.bedrooms} {form.bedrooms === 1 ? "bed" : "beds"}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl border-border/60 bg-card/95 p-1.5"
                        >
                          <DropdownMenuRadioGroup
                            value={String(form.bedrooms)}
                            onValueChange={(value) =>
                              setForm((prev) => ({
                                ...prev,
                                bedrooms: Number(value),
                              }))
                            }
                          >
                            {[1, 2, 3, 4, 5, 6].map((count) => (
                              <DropdownMenuRadioItem
                                key={count}
                                value={String(count)}
                                textValue={`${count} ${count === 1 ? "bed" : "beds"}`}
                              >
                                {count} {count === 1 ? "bed" : "beds"}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {errors.bedrooms && (
                        <p className="text-xs text-destructive">{errors.bedrooms}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms-menu" className="text-sm font-medium text-foreground">
                        Bathrooms
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            id="bathrooms-menu"
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl border bg-background/70 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
                              errors.bathrooms ? "border-destructive/70" : "border-input",
                            )}
                          >
                            <span>
                              {form.bathrooms} {form.bathrooms === 1 ? "bath" : "baths"}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl border-border/60 bg-card/95 p-1.5"
                        >
                          <DropdownMenuRadioGroup
                            value={String(form.bathrooms)}
                            onValueChange={(value) =>
                              setForm((prev) => ({
                                ...prev,
                                bathrooms: Number(value),
                              }))
                            }
                          >
                            {[1, 2, 3, 4].map((count) => (
                              <DropdownMenuRadioItem
                                key={count}
                                value={String(count)}
                                textValue={`${count} ${count === 1 ? "bath" : "baths"}`}
                              >
                                {count} {count === 1 ? "bath" : "baths"}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {errors.bathrooms && (
                        <p className="text-xs text-destructive">{errors.bathrooms}</p>
                      )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Property type
                      </Label>
                      <div className="grid gap-3 md:grid-cols-2">
                        {COMMERCIAL_PROPERTY_OPTIONS.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, propertyType: option.id }))
                            }
                            className={cn(
                              "group flex items-center gap-4 rounded-2xl border p-4 text-left text-sm transition-all hover:-translate-y-[1px]",
                              form.propertyType === option.id
                                ? "border-primary/70 bg-primary/10"
                                : "border-border/60 bg-card/80"
                            )}
                          >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background/70">
                              <Image
                                src={PROPERTY_TYPE_IMAGES[option.id].src}
                                alt={PROPERTY_TYPE_IMAGES[option.id].alt}
                                fill
                                sizes="64px"
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                              />
                            </div>
                            <div>
                              <span className="block text-sm font-semibold text-foreground">
                                {option.label}
                              </span>
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {option.hint}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.propertyType && (
                        <p className="text-xs text-destructive">{errors.propertyType}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Number of rooms/areas
                      </Label>
                      <Input
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
                      />
                      {errors.rooms && (
                        <p className="text-xs text-destructive">{errors.rooms}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
              }
            >
              <div className="grid gap-3 md:grid-cols-2">
                {(form.service === "advanced"
                  ? FREQUENCY_OPTIONS.filter((option) => option.id === "one-time")
                  : FREQUENCY_OPTIONS
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        frequency: option.id,
                      }));
                      handleNext();
                    }}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all",
                      form.frequency === option.id
                        ? "border-primary/70 bg-primary/10"
                        : "border-border/60 bg-card/80"
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
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
              }
            >
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
                          "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all",
                          form.oven === option.id
                            ? "border-primary/70 bg-primary/10"
                            : "border-border/60 bg-card/80"
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
                    {EXTRA_OPTIONS.map((option) => {
                      const id = `extra-${option.id}`;
                      const checked = form.extras.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-start gap-3 rounded-2xl border p-4 transition-all",
                            checked
                              ? "border-primary/70 bg-primary/10"
                              : "border-border/60 bg-card/80"
                          )}
                        >
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={() => toggleExtra(option.id)}
                          />
                          <Label htmlFor={id} className="flex-1 space-y-2 cursor-pointer">
                            <span className="block text-sm font-semibold text-foreground">
                              {option.label}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {option.description}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              +{formatCurrency(option.price)}
                            </span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Full name</Label>
                  <Input
                    value={contact.name}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Jane Doe"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="you@email.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Phone</Label>
                  <Input
                    type="tel"
                    value={contact.phone}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="07..."
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Preferred contact method
                  </Label>
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
                          "rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all",
                          contact.preferredContact === option.id
                            ? "border-primary/70 bg-primary/10 text-foreground"
                            : "border-border/60 bg-card/80 text-muted-foreground"
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
                  <Label className="text-sm font-medium text-foreground">Postcode</Label>
                  <Input
                    value={contact.postcode}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, postcode: event.target.value }))
                    }
                    placeholder="PL..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-foreground">
                    Preferred start date
                  </Label>
                  <Input
                    type="date"
                    value={contact.preferredDate}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, preferredDate: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-foreground">
                    Notes or special requests
                  </Label>
                  <Textarea
                    value={contact.notes}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, notes: event.target.value }))
                    }
                    placeholder="Let us know about pets, access notes, or priorities."
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <Button variant="outline" disabled={step === 0} onClick={handleBack}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <PrimaryButton onClick={handleNext} size="sm">
            Continue
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={handleSubmit} disabled={isSubmitting} size="sm">
            {isSubmitting ? "Submitting..." : "See my quote"}
          </PrimaryButton>
        )}
      </CardFooter>
      {submitError && (
        <p className="px-6 pb-6 text-sm text-destructive">{submitError}</p>
      )}
    </Card>
  );
};

export default QuoteCalculator;
