import {
    CalendarDaysIcon,
    ClipboardListIcon,
    SparklesIcon,
} from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
    {
        name: "Plymouth Homes",
    },
    {
        name: "Local Offices",
    },
    {
        name: "Rental Hosts",
    },
    {
        name: "Hospitality Spaces",
    },
    {
        name: "Property Managers",
    },
    {
        name: "Community Spaces",
    }
] as const;

export const PROCESS = [
    {
        title: "Get an Instant Quote",
        description: "Define your requirements in the quote calculator for a fixed instant quote.",
        icon: ClipboardListIcon,
    },
    {
        title: "Choose a Time",
        description: "Choose a slot and book instantly once your requirements are set.",
        icon: CalendarDaysIcon,
    },
    {
        title: "We Clean, You Relax",
        description: "Our team arrives on time with a checklist and leaves your space spotless.",
        icon: SparklesIcon,
    },
] as const;

export const FEATURES = [
    {
        title: "Regular cleaning",
        description: "Consistent upkeep for homes and small offices.",
    },
    {
        title: "Deep cleans",
        description: "A more detailed clean when your space needs extra care.",
    },
    {
        title: "End-of-tenancy resets",
        description: "Thorough cleans for moving out or preparing a rental.",
    },
    {
        title: "Commercial cleaning",
        description: "Reliable service for offices and shared workspaces.",
    },
    {
        title: "Flexible scheduling",
        description: "Choose a time that works around your routine.",
    },
    {
        title: "Checklist-based quality",
        description: "Clear standards for consistent results every visit.",
    },
] as const;

export const REVIEWS = [
     {
        name: "Lex Alexander",
        username: "@lex4ndr42",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        rating: 5,
        review: "So clean!!! Finally found cleaners we trust. Reliable and respectful of the space."
    },
    
    {
        name: "The Pink Parlour",
        username: "@xshi.louisex",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
        rating: 5,
        review: "Love it, thank you so much😍😍 Would highly recommend! 👌"
    },
    {
        name: "Tom H",
        username: "@tomhughes",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        rating: 5,
        review: "Booked an end-of-tenancy clean in Plymouth and the place looked brand spanking new."
    },
    {
        name: "Jada",
        username: "@jadan_soan",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 5,
        review:
            "Spark and Mend were professional from quote to clean. We had a full deep clean booked with a few add-ons, and the team were punctual, friendly, and really thorough. They worked fast, left everything spotless, and made the whole process easy. We’re very pleased with the results and would absolutely recommend them to anyone looking for a reliable cleaning service."
    },
    {
        name: "Priya Patel",
        username: "@priyap",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 5,
        review: "The deep clean was thorough, especially the kitchen and bathrooms."
    },
    {
        name: "Sarah B",
        username: "@sarahb",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        review: "Weekly cleans keep our flat spotless and the team is always on time."
    },
    {
        name: "Ben Walker",
        username: "@benw",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        rating: 4,
        review: "Tino is very helpful and has a good eye for details. Brings consistent results and a clear checklist every visit."
    },
    {
        name: "Hannah Price",
        username: "@hannahp",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        rating: 5,
        review: "Finally found cleaners we trust. Reliable, respectful, and always on time."
    },
    {
        name: "Mr. Williams",
        username: "@kylem",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        rating: 5,
        review: "Quick booking via the platform, confirmed a slot within 2 days and fast responses to questions. Very pleased with the results, would highly recommend."
    },
   
] as const;
