import { Metadata } from "next";

export const generateMetadata = ({
    title,
    description,
    image = "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/spark-and-mend-banner.jpg",
    icons = {
        icon: [
            { url: "/favicon/favicon.ico" },
            { url: "/favicon/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        ],
        apple: [
            { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
        ],
        shortcut: "/favicon/favicon.ico",
    },
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string | null;
    icons?: Metadata["icons"];
    noIndex?: boolean;
} = {}): Metadata => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "Spark & Mend";
    const resolvedTitle = title ?? `${appName} Professional Cleaning in Plymouth`;
    const resolvedDescription = description ?? `${appName} provides reliable home, office, and end-of-tenancy cleaning in Plymouth, UK. Get a free quote and enjoy a spotless space without the stress.`;

    return {
        title: resolvedTitle,
        description: resolvedDescription,
        icons,
        manifest: "/favicon/site.webmanifest",
        openGraph: {
            title: resolvedTitle,
            description: resolvedDescription,
            ...(image && { images: [{ url: image }] }),
        },
        twitter: {
            title: resolvedTitle,
            description: resolvedDescription,
            ...(image && { card: "summary_large_image", images: [image] }),
            creator: "@sparkandmend",
        },
        // metadataBase: new URL(process.env.APP_DOMAIN!),
        ...(noIndex && { robots: { index: false, follow: false } }),
    };
};
