import { Providers } from "@/components";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { aeonik, cn, generateMetadata, inter } from "@/utils";
import OfferBar from "@/components/marketing/offer-bar";

export const metadata = {
  ...generateMetadata(),
  metadataBase: new URL("https://sparkandmend.co.uk"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scrollbar">
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased !font-default overflow-x-hidden",
          aeonik.variable,
          inter.variable
        )}
      >
        <Providers>
          <OfferBar />
          <Toaster richColors theme="light" position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
