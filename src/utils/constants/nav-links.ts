import { HelpCircleIcon, LineChartIcon, Link2Icon, LockIcon, NewspaperIcon, QrCodeIcon } from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Services",
        href: "/features",
        menu: [
            {
                title: "Basic Clean",
                tagline: "Weekly or bi-weekly upkeep for homes and small offices.",
                href: "/features/link-shortening",
                icon: Link2Icon,
            },
            {
                title: "Intermediate Clean",
                tagline: "A deeper, more detailed clean each visit.",
                href: "/features/password-protection",
                icon: LockIcon,
            },
            {
                title: "Advanced Clean",
                tagline: "End-of-tenancy, seasonal, or full reset cleans.",
                href: "/features/analytics",
                icon: LineChartIcon,
            },
            {
                title: "Commercial Cleaning",
                tagline: "Reliable cleans for offices and workspaces.",
                href: "/features/qr-codes",
                icon: QrCodeIcon,
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
