import {
    Building2Icon,
    ClipboardCheckIcon,
    HelpCircleIcon,
    HomeIcon,
    NewspaperIcon,
    SprayCanIcon,
} from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Services",
        href: "/features",
        menu: [
            {
                title: "Basic Clean",
                tagline: "Weekly or bi-weekly upkeep for homes and small offices.",
                href: "/features/link-shortening",
                icon: HomeIcon,
            },
            {
                title: "Intermediate Clean",
                tagline: "A deeper, more detailed clean each visit.",
                href: "/features/password-protection",
                icon: SprayCanIcon,
            },
            {
                title: "Advanced Clean",
                tagline: "End-of-tenancy, seasonal, or full reset cleans.",
                href: "/features/analytics",
                icon: ClipboardCheckIcon,
            },
            {
                title: "Commercial Cleaning",
                tagline: "Reliable cleans for offices and workspaces.",
                href: "/features/qr-codes",
                icon: Building2Icon,
            },
        ],
    },
    {
        title: "Pricing",
        href: "/pricing",
    },
    {
        title: "About",
        href: "/changelog",
    },
    {
        title: "Contact",
        href: "/enterprise",
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
                title: "Help",
                tagline: "FAQs, booking help, and support.",
                href: "/resources/help",
                icon: HelpCircleIcon,
            },
        ]
    },
];
