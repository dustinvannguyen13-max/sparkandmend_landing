import Script from "next/script";
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
      <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init','1614411676350654'); fbq('track','PageView');`,
          }}
        />
        <Script
          id="google-tag"
          src="https://www.googletagmanager.com/gtag/js?id=G-1LXCKMRNPW"
          strategy="afterInteractive"
        />
        <Script
          id="google-tag-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-1LXCKMRNPW');`,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased !font-default overflow-x-hidden",
          aeonik.variable,
          inter.variable
        )}
      >
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=1614411676350654&ev=PageView&noscript=1"
          />
        </noscript>
        <Providers>
          <OfferBar />
          <Toaster richColors theme="light" position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
