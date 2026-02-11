export type GallerySlide = {
  src: string;
  alt: string;
  label?: string;
};

export type GallerySection = {
  title: string;
  description: string;
  slides: GallerySlide[];
};

export type BeforeAfterPair = {
  before: GallerySlide;
  after: GallerySlide;
  caption: string;
};

export type BeforeAfterGroup = {
  title: string;
  description: string;
  pairs: BeforeAfterPair[];
};

export const BASIC_SLIDES: GallerySlide[] = [
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-before.jpg",
    alt: "Sofa before a routine clean in a Plymouth home",
    label: "Sofa before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-clean.jpg",
    alt: "Sofa after a routine clean with refreshed fabric",
    label: "Sofa after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sink-component-clean.jpg",
    alt: "Clean bathroom sink and fixtures",
    label: "Bathroom sink",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/kitchen-sink-component-clean.jpg",
    alt: "Clean kitchen sink and fittings",
    label: "Kitchen sink",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-shed-clean.jpg",
    alt: "Cleaned home shed interior",
    label: "Shed clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/garden-shed-clean.jpg",
    alt: "Garden shed cleaned and organised",
    label: "Garden shed",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/clean-sink.jpg",
    alt: "Clean sink after a routine visit",
    label: "Clean sink",
  },
];

export const INTERMEDIATE_SLIDES: GallerySlide[] = [
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-stain.jpg",
    alt: "Sofa stain before a deeper clean",
    label: "Stain before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-stain-cleaned.jpg",
    alt: "Sofa stain removed after a deeper clean",
    label: "Stain after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-dirt.jpg",
    alt: "Sofa showing build-up before detailed cleaning",
    label: "Build-up",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-carpet-stain.jpg",
    alt: "Carpet stain before cleaning",
    label: "Carpet stain",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-sink-dirty.jpg",
    alt: "Home sink before cleaning",
    label: "Sink before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-shower-dirty.jpg",
    alt: "Home shower before cleaning",
    label: "Shower before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/bathroom-drain-dirty.jpg",
    alt: "Bathroom drain before cleaning",
    label: "Drain before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/mattress-clean.jpg",
    alt: "Mattress after cleaning",
    label: "Mattress clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/mattress-clean-2.jpg",
    alt: "Mattress refreshed after cleaning",
    label: "Mattress clean 2",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/foot-stool-dirty.jpg",
    alt: "Foot stool before cleaning",
    label: "Foot stool before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/foot-stool-clean.jpg",
    alt: "Foot stool after cleaning",
    label: "Foot stool after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/carpet-stain-removed-clean.jpg",
    alt: "Carpet stain removed after cleaning",
    label: "Carpet stain removed",
  },
];

export const ADVANCED_SLIDES: GallerySlide[] = [
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-dirty-before.jpg",
    alt: "Oven before a full reset clean",
    label: "Oven before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-dirty-4.jpg",
    alt: "Oven detail clean in progress",
    label: "Oven detail",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-dirty.jpg",
    alt: "Oven build-up before a deep clean",
    label: "Oven build-up",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-clean-2.jpg",
    alt: "Cleaned oven interior",
    label: "Oven clean 2",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-clean-3.jpg",
    alt: "Oven interior after detailing",
    label: "Oven clean 3",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-cleaned.jpg",
    alt: "Oven after a deep clean",
    label: "Oven after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-extractor-dirty.jpg",
    alt: "Extractor hood before cleaning",
    label: "Extractor before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-extractor-clean.jpg",
    alt: "Extractor hood after cleaning",
    label: "Extractor after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-vent-clean.jpg",
    alt: "Cleaned home vent cover",
    label: "Vent clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-drain-dirty.jpg",
    alt: "Drain before cleaning",
    label: "Drain before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-grill-clean.jpg",
    alt: "Cleaned home grill surface",
    label: "Grill clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/fence-moss-vs-clean.jpg",
    alt: "Fence cleaned with moss removed",
    label: "Fence clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/end-of-tenancy-clean.jpg",
    alt: "End of tenancy clean finish",
    label: "End of tenancy",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/dtc.png",
    alt: "Deep clean detail close-up",
    label: "Deep clean detail",
  },
];

export const COMMERCIAL_SLIDES: GallerySlide[] = [
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-1.jpg",
    alt: "Commercial kitchen cleaned surfaces",
    label: "Kitchen clean 1",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-2.jpg",
    alt: "Restaurant kitchen worktops cleaned",
    label: "Kitchen clean 2",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-3.jpg",
    alt: "Commercial kitchen prep area cleaned",
    label: "Kitchen clean 3",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-4.jpg",
    alt: "Cleaned restaurant kitchen service area",
    label: "Kitchen clean 4",
  },
];

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    title: "Basic Clean",
    description: "Regular upkeep for already tidy homes and busy weeks.",
    slides: BASIC_SLIDES,
  },
  {
    title: "Intermediate Clean",
    description: "A deeper clean for when it is getting on top of you.",
    slides: INTERMEDIATE_SLIDES,
  },
  {
    title: "Advanced Clean",
    description: "Full reset detail work for seasonal and end-of-tenancy cleans.",
    slides: ADVANCED_SLIDES,
  },
  {
    title: "Commercial Cleaning",
    description: "Workspaces, studios, and shared areas kept client-ready.",
    slides: COMMERCIAL_SLIDES,
  },
];

export const BEFORE_AFTER_GROUPS: BeforeAfterGroup[] = [
  {
    title: "Basic Clean",
    description: "Simple refreshes for already tidy homes.",
    pairs: [
      {
        before: BASIC_SLIDES[0],
        after: BASIC_SLIDES[1],
        caption: "Sofa refresh",
      },
      {
        before: INTERMEDIATE_SLIDES[4],
        after: BASIC_SLIDES[2],
        caption: "Bathroom sink reset",
      },
    ],
  },
  {
    title: "Intermediate Clean",
    description: "Deeper detail for build-up and touch points.",
    pairs: [
      {
        before: INTERMEDIATE_SLIDES[0],
        after: INTERMEDIATE_SLIDES[1],
        caption: "Upholstery stain lift",
      },
      {
        before: INTERMEDIATE_SLIDES[2],
        after: BASIC_SLIDES[1],
        caption: "Fabric deep clean",
      },
      {
        before: INTERMEDIATE_SLIDES[3],
        after: INTERMEDIATE_SLIDES[11],
        caption: "Carpet stain treatment",
      },
      {
        before: INTERMEDIATE_SLIDES[9],
        after: INTERMEDIATE_SLIDES[10],
        caption: "Foot stool refresh",
      },
    ],
  },
  {
    title: "Advanced Clean",
    description: "Full reset detail for kitchens and fixtures.",
    pairs: [
      {
        before: ADVANCED_SLIDES[0],
        after: ADVANCED_SLIDES[5],
        caption: "Oven interior reset",
      },
      {
        before: ADVANCED_SLIDES[2],
        after: ADVANCED_SLIDES[4],
        caption: "Oven build-up removal",
      },
      {
        before: ADVANCED_SLIDES[1],
        after: ADVANCED_SLIDES[3],
        caption: "Oven detail finish",
      },
      {
        before: ADVANCED_SLIDES[6],
        after: ADVANCED_SLIDES[7],
        caption: "Extractor hood detail",
      },
    ],
  },
  {
    title: "Commercial Cleaning",
    description: "Results for client-ready commercial spaces.",
    pairs: [],
  },
];
