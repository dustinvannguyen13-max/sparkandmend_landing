"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
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
  PreviewCard,
  PreviewCardPanel,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { Sparkles } from "@/components/ui/sparkles";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
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
const STORAGE_KEY = "spark-mend-quote";

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
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/clean-sink.jpg",
    alt: "Pristine kitchen sink after cleaning",
  },
  intermediate: {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-carpet-stain.jpg",
    alt: "Carpet refresh after cleaning",
  },
  advanced: {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-cleaned.jpg",
    alt: "Detailed oven clean result",
  },
  commercial: {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-1.jpg",
    alt: "Commercial kitchen cleaned surfaces",
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
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/house.jpg",
    alt: "House exterior ready for cleaning",
  },
  flat: {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/flat.jpg",
    alt: "Apartment interior ready for cleaning",
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
    address: "",
    preferredDate: "",
    preferredTime: "",
    preferredContact: "",
    notes: "",
  });
  const [customExtrasEnabled, setCustomExtrasEnabled] = useState(false);
  const [customExtrasLoading, setCustomExtrasLoading] = useState(false);
  const [customExtrasError, setCustomExtrasError] = useState<string | null>(null);
  const [customExtrasHover, setCustomExtrasHover] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const formatFallbackReason = (reason?: string) =>
    reason
      ? reason
          .replace(/^openai_http_/, "OpenAI HTTP ")
          .replace(/_/g, " ")
      : "";

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

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    formRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [step, shouldReduceMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          form?: Partial<QuoteInput>;
          contact?: Partial<typeof contact>;
          customExtrasEnabled?: boolean;
          step?: number;
        };
        if (parsed.form) {
          setForm((prev) => ({ ...prev, ...parsed.form }));
        }
        if (parsed.contact) {
          setContact((prev) => ({ ...prev, ...parsed.contact }));
        }
        if (typeof parsed.customExtrasEnabled === "boolean") {
          setCustomExtrasEnabled(parsed.customExtrasEnabled);
        }
        if (typeof parsed.step === "number") {
          setStep(Math.min(Math.max(parsed.step, 0), STEPS.length - 1));
        }
      }
    } catch (error) {
      console.warn("Unable to restore saved quote details.");
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    const payload = {
      form,
      contact,
      customExtrasEnabled,
      step,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn("Unable to save quote details.");
    }
  }, [form, contact, customExtrasEnabled, step, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!customExtrasEnabled) {
      setCustomExtrasLoading(false);
      setCustomExtrasError(null);
      setForm((prev) => ({
        ...prev,
        customExtras: "",
        customExtrasPrice: 0,
        customExtrasSummary: "",
        customExtrasReason: "",
        customExtrasSource: undefined,
        customExtrasFallbackReason: "",
        customExtrasItems: [],
      }));
      return;
    }

    const extrasText = form.customExtras?.trim() ?? "";
    if (!extrasText) {
      setCustomExtrasLoading(false);
      setCustomExtrasError(null);
      setForm((prev) => ({
        ...prev,
        customExtrasPrice: 0,
        customExtrasSummary: "",
        customExtrasReason: "",
        customExtrasSource: undefined,
        customExtrasFallbackReason: "",
        customExtrasItems: [],
      }));
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setCustomExtrasLoading(true);
      setCustomExtrasError(null);
      try {
        const response = await fetch("/api/custom-extras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: extrasText,
            service: form.service,
            propertyType: form.propertyType,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Estimate unavailable");
        }

        const data = (await response.json()) as {
          price?: number;
          summary?: string;
          reason?: string;
          source?: "ai" | "fallback";
          fallbackReason?: string;
          items?: string[];
        };

        setForm((prev) => ({
          ...prev,
          customExtrasPrice: Number(data.price) || 0,
          customExtrasSummary: data.summary || "",
          customExtrasReason: data.reason || "",
          customExtrasSource: data.source,
          customExtrasFallbackReason: data.fallbackReason || "",
          customExtrasItems: Array.isArray(data.items) ? data.items : [],
        }));
        if (data.source) {
          const reason = data.fallbackReason
            ? ` (${data.fallbackReason})`
            : "";
          console.info(`[custom-extras] estimate source: ${data.source}${reason}`);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setCustomExtrasError(
          "We will review custom extras and confirm the price."
        );
        setForm((prev) => ({
          ...prev,
          customExtrasPrice: 0,
          customExtrasSummary: "",
          customExtrasReason: "",
          customExtrasSource: undefined,
          customExtrasFallbackReason: "",
          customExtrasItems: [],
        }));
      } finally {
        if (!controller.signal.aborted) {
          setCustomExtrasLoading(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [customExtrasEnabled, form.customExtras, form.propertyType, form.service, isHydrated]);

  const handleUseLocation = async () => {
    if (typeof window === "undefined") return;
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by this browser.");
      return;
    }
    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (apiKey) {
        const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
        url.searchParams.set("latlng", `${lat},${lng}`);
        url.searchParams.set("key", apiKey);
        const response = await fetch(url.toString());
        const data = (await response.json()) as {
          status?: string;
          results?: Array<{ formatted_address?: string }>;
        };
        const address = data.results?.[0]?.formatted_address;
        setContact((prev) => ({
          ...prev,
          address: address ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        }));
        if (!address) {
          setLocationError("We could not find a full address, so we used coordinates.");
        }
      } else {
        setContact((prev) => ({
          ...prev,
          address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        }));
        setLocationError("Add a Google Maps API key to fetch a full address.");
      }
    } catch (error) {
      setLocationError("We could not access your location. Please type it manually.");
    } finally {
      setIsLocating(false);
    }
  };

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
    if (form.customExtrasSummary) {
      params.set("customExtrasSummary", form.customExtrasSummary);
    }
    if (form.customExtras) {
      params.set("customExtras", form.customExtras);
      params.set("customExtrasText", form.customExtras);
    }
    if (form.customExtrasPrice) {
      params.set("customExtrasPrice", String(form.customExtrasPrice));
    }
    if (form.customExtrasItems && form.customExtrasItems.length > 0) {
      params.set("customExtrasItems", JSON.stringify(form.customExtrasItems));
    }
    if (form.customExtrasReason) {
      params.set("customExtrasReason", form.customExtrasReason);
    }
    if (form.customExtrasSource) {
      params.set("customExtrasSource", form.customExtrasSource);
    }
    if (form.customExtrasFallbackReason) {
      params.set("customExtrasFallbackReason", form.customExtrasFallbackReason);
    }
    if (contact.name) {
      params.set("contactName", contact.name);
    }
    if (contact.email) {
      params.set("contactEmail", contact.email);
    }
    if (contact.phone) {
      params.set("contactPhone", contact.phone);
    }
    if (contact.postcode) {
      params.set("contactPostcode", contact.postcode);
    }
    if (contact.address) {
      params.set("contactAddress", contact.address);
    }
    if (contact.notes) {
      params.set("notes", contact.notes);
    }
    if (contact.preferredDate) {
      params.set("preferredDate", contact.preferredDate);
    }
    if (contact.preferredTime) {
      params.set("preferredTime", contact.preferredTime);
    }
    if (contact.preferredContact) {
      params.set("contactMethod", contact.preferredContact);
    }

    router.push(`${redirectUrl}?${params.toString()}`);
    setIsSubmitting(false);
  };

  return (
    <Card
      ref={formRef}
      className="w-full scroll-mt-24 border-border/70 bg-card/90"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          Instant Quote Calculator form
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
                    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-background/70">
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
                            aria-pressed={form.propertyType === type}
                            className={cn(
                              "group relative min-h-[120px] overflow-hidden rounded-xl border p-4 text-left transition-all hover:-translate-y-[1px]",
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
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.04] filter brightness-75 saturate-120"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            </div>
                            <div className="relative z-10 flex items-center justify-between pr-12">
                              <span className="text-sm font-semibold uppercase tracking-wide text-white">
                                {type}
                              </span>
                              <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Residential
                              </span>
                            </div>
                            <div className="relative z-10 mt-6">
                              <span className="text-xs text-white/80">
                                Most popular for {type === "house" ? "family homes" : "flats & apartments"}.
                              </span>
                            </div>
                            <span
                              className={cn(
                                "absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-md transition-colors",
                                form.propertyType === type
                                  ? "border-white bg-white/95 text-primary"
                                  : "border-white/80 bg-black/40 text-white/70"
                              )}
                              aria-hidden="true"
                            >
                              {form.propertyType === type ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <span className="h-2.5 w-2.5 rounded-full bg-white/70 opacity-0 transition-opacity group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms-menu" className="text-sm font-medium text-foreground">
                        Rooms to clean
                      </Label>
                      <Select
                        value={String(form.bedrooms)}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            bedrooms: Number(value),
                          }))
                        }
                      >
                        <SelectTrigger
                          id="bedrooms-menu"
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl border bg-background/70 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
                            errors.bedrooms ? "border-destructive/70" : "border-input",
                          )}
                        >
                        <SelectValue
                          placeholder={`${form.bedrooms} ${form.bedrooms === 1 ? "room" : "rooms"}`}
                          className="text-foreground"
                        />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          className="rounded-xl border border-border/60 bg-card/95 p-1"
                        >
                          {[1, 2, 3, 4, 5, 6].map((count) => (
                            <SelectItem key={count} value={String(count)} className="text-sm">
                              {count} {count === 1 ? "room" : "rooms"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.bedrooms && (
                        <p className="text-xs text-destructive">{errors.bedrooms}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms-menu" className="text-sm font-medium text-foreground">
                        Bathrooms to clean
                      </Label>
                      <Select
                        value={String(form.bathrooms)}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            bathrooms: Number(value),
                          }))
                        }
                      >
                        <SelectTrigger
                          id="bathrooms-menu"
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl border bg-background/70 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
                            errors.bathrooms ? "border-destructive/70" : "border-input",
                          )}
                        >
                          <SelectValue
                            placeholder={`${form.bathrooms} ${form.bathrooms === 1 ? "bath" : "baths"}`}
                            className="text-foreground"
                          />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          className="rounded-xl border border-border/60 bg-card/95 p-1"
                        >
                          {[0, 1, 2, 3, 4].map((count) => (
                            <SelectItem key={count} value={String(count)} className="text-sm">
                              {count} {count === 1 ? "bath" : "baths"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                            aria-pressed={form.propertyType === option.id}
                            className={cn(
                              "group relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left text-sm transition-all hover:-translate-y-[1px]",
                              form.propertyType === option.id
                                ? "border-primary/70 bg-primary/10 shadow-[0_15px_40px_-20px_hsl(var(--primary)/0.8)]"
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
                            <span
                              className={cn(
                                "absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm transition-colors",
                                form.propertyType === option.id
                                  ? "border-primary bg-primary text-white"
                                  : "border-border/60 bg-background/90 text-muted-foreground"
                              )}
                              aria-hidden="true"
                            >
                              {form.propertyType === option.id ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100" />
                              )}
                            </span>
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
                    <div
                      className={cn(
                        "flex flex-col gap-3 rounded-2xl border p-4 transition-all",
                        customExtrasEnabled
                          ? "border-primary/70 bg-primary/10 md:col-span-2"
                          : "border-border/60 bg-card/80"
                      )}
                      onMouseEnter={() => setCustomExtrasHover(true)}
                      onMouseLeave={() => setCustomExtrasHover(false)}
                      onFocusCapture={() => setCustomExtrasHover(true)}
                      onBlurCapture={() => setCustomExtrasHover(false)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="extra-custom"
                          checked={customExtrasEnabled}
                          onCheckedChange={() =>
                            setCustomExtrasEnabled((prev) => !prev)
                          }
                        />
                        <Label
                          htmlFor="extra-custom"
                          className="flex-1 space-y-2 cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              Custom requests
                            </span>
                            <Sparkles
                              className="h-4 w-4 text-primary"
                              animate={customExtrasHover}
                            />
                          </div>
                          <span className="block text-xs text-muted-foreground">
                            Tell us what extra help you need and we will estimate it.
                          </span>
                        </Label>
                      </div>
                      {customExtrasEnabled && (
                        <div className="space-y-2">
                          <Textarea
                            value={form.customExtras ?? ""}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                customExtras: event.target.value,
                              }))
                            }
                            placeholder="e.g. inside fridge, balcony sweep, blinds wiped"
                          />
                          {customExtrasLoading && (
                            <p className="text-xs text-muted-foreground">
                              Estimating extra tasks and price...
                            </p>
                          )}
                          {!customExtrasLoading && customExtrasError && (
                            <p className="text-xs text-muted-foreground">
                              {customExtrasError}
                            </p>
                          )}
                          {!customExtrasLoading &&
                            !customExtrasError &&
                            (form.customExtrasSummary || form.customExtrasPrice ? (
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  <Sparkles className="h-3 w-3 text-primary" />
                                  {form.customExtrasSource
                                    ? `Estimate: ${form.customExtrasSource}`
                                    : "AI estimate"}
                                </span>
                                {form.customExtrasSource === "fallback" &&
                                  form.customExtrasFallbackReason && (
                                    <span className="text-[10px] text-muted-foreground">
                                      Fallback:{" "}
                                      {formatFallbackReason(
                                        form.customExtrasFallbackReason,
                                      )}
                                    </span>
                                  )}
                                {form.customExtrasSummary && (
                                  <span>Summary: {form.customExtrasSummary}</span>
                                )}
                                <span>
                                  Estimated add-on:{" "}
                                  {form.customExtrasPrice
                                    ? `+${formatCurrency(form.customExtrasPrice)}`
                                    : "We will confirm after review"}
                                </span>
                                {form.customExtrasReason && (
                                  <PreviewCard>
                                    <PreviewCardTrigger
                                      delay={150}
                                      closeDelay={150}
                                      className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                                    >
                                      Why this price?
                                    </PreviewCardTrigger>
                                    <PreviewCardPanel>
                                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        AI reasoning
                                      </div>
                                      <p className="mt-2 text-xs text-muted-foreground">
                                        {form.customExtrasReason}
                                      </p>
                                      {form.customExtrasSummary && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                          Summary: {form.customExtrasSummary}
                                        </p>
                                      )}
                                    </PreviewCardPanel>
                                  </PreviewCard>
                                )}
                              </div>
                            ) : null)}
                        </div>
                      )}
                    </div>
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
                  <div className="flex min-h-10 items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-foreground">
                      Address
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseLocation}
                      disabled={isLocating}
                    >
                      {isLocating ? "Locating..." : "Use my location"}
                    </Button>
                  </div>
                  <Input
                    value={contact.address}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, address: event.target.value }))
                    }
                    placeholder="Flat 2, 25 Belgrave Road, Plymouth"
                  />
                  {locationError && (
                    <p className="text-xs text-muted-foreground">{locationError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex min-h-10 items-center">
                    <Label className="text-sm font-medium text-foreground">
                      Postcode
                    </Label>
                  </div>
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
                    className="min-w-0 w-auto max-w-full md:w-full"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-foreground">
                    Preferred start time
                  </Label>
                  <Input
                    type="time"
                    value={contact.preferredTime}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, preferredTime: event.target.value }))
                    }
                    className="min-w-0 w-auto max-w-full md:w-full"
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
