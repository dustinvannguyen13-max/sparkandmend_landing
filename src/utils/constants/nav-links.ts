import {
    Building2Icon,
    ClipboardCheckIcon,
    HelpCircleIcon,
    HomeIcon,
    InfoIcon,
    ImageIcon,
    NewspaperIcon,
    SprayCanIcon,
    UsersIcon,
} from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Services",
        href: "/basic-clean",
        menu: [
            {
                title: "Basic Clean",
                tagline: "Weekly or bi-weekly upkeep for homes and small offices.",
                href: "/basic-clean",
                icon: HomeIcon,
            },
            {
                title: "Intermediate Clean",
                tagline: "A deeper, more detailed clean each visit.",
                href: "/intermediate-clean",
                icon: SprayCanIcon,
            },
            {
                title: "Advanced Clean",
                tagline: "End-of-tenancy, seasonal, or full reset cleans.",
                href: "/advanced-clean",
                icon: ClipboardCheckIcon,
            },
            {
                title: "Commercial Cleaning",
                tagline: "Reliable cleans for offices and workspaces.",
                href: "/commercial-cleaning",
                icon: Building2Icon,
            },
        ],
    },
    {
        title: "About",
        href: "/about/why-us",
        menu: [
            {
                title: "Why Us",
                tagline: "What makes Spark & Mend calm, clear, and consistent.",
                href: "/about/why-us",
                icon: InfoIcon,
            },
            {
                title: "Team",
                tagline: "Meet the people behind every clean.",
                href: "/about/team",
                icon: UsersIcon,
            },
        ],
    },
    {
        title: "Contact",
        href: "/get-a-quote",
    },
    {
        title: "My Booking",
        href: "/my-booking",
    },
    {
        title: "Resources",
        href: "/resources",
        menu: [
            {
                title: "Blog",
                tagline: "Cleaning tips, checklists, and local updates.",
                href: "/resources/blog",
                icon: NewspaperIcon,
            },
            {
                title: "Gallery",
                tagline: "See recent cleans and service highlights.",
                href: "/cleaning-results-plymouth",
                icon: ImageIcon,
            },
            {
                title: "FAQs",
                tagline: "Answers for tenants, landlords, and homeowners.",
                href: "/faq-plymouth",
                icon: HelpCircleIcon,
            },
        ]
    },
];
