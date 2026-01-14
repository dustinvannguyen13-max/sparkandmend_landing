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
        title: "Get a Free Quote",
        description: "Tell us about your space and the service you need. We will reply quickly with a clear quote.",
        icon: ClipboardListIcon,
    },
    {
        title: "Choose a Time",
        description: "Pick a weekly, bi-weekly, monthly, or one-off clean that fits your schedule.",
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
        name: "Sarah Bennett",
        username: "@sarahb",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        review: "Weekly cleans keep our flat spotless and the team is always on time."
    },
    {
        name: "Tom Hughes",
        username: "@tomhughes",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        rating: 5,
        review: "Booked an end-of-tenancy clean in Plymouth and the place looked brand new."
    },
    {
        name: "Leah Carter",
        username: "@leahc",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        rating: 4,
        review: "Great attention to detail and easy communication about scheduling."
    },
    {
        name: "Mark Ellis",
        username: "@marke",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 5,
        review: "Our office stays fresh and tidy without any disruption to the team."
    },
    {
        name: "Priya Patel",
        username: "@priyap",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 5,
        review: "The deep clean was thorough, especially the kitchen and bathrooms."
    },
    {
        name: "Ben Walker",
        username: "@benw",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        rating: 4,
        review: "Consistent results and a clear checklist every visit."
    },
    {
        name: "Hannah Price",
        username: "@hannahp",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        rating: 5,
        review: "Finally found cleaners we trust. Reliable and respectful of the space."
    },
    {
        name: "Kyle Morgan",
        username: "@kylem",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        rating: 4,
        review: "Flexible booking and fast responses to questions."
    },
    {
        name: "Chloe Adams",
        username: "@chloea",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        rating: 5,
        review: "Post-renovation clean was handled with care and the finish was brilliant."
    },
] as const;
