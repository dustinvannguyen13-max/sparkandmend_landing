import { Metadata } from "next";

export const generateMetadata = ({
    title,
    description,
    image = "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w",
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
    const resolvedDescription = description ?? `${appName} provides reliable home, office, and end-of-tenancy cleaning in Plymouth, UK. Get an instant quote in about 60 seconds and enjoy a spotless space without the stress.`;

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
