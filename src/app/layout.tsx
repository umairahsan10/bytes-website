// Abdullah Zindabad
import type { Metadata } from "next";
import { Inter, Calistoga, Poppins, Bebas_Neue, League_Spartan } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import "../sections/cards.css";
import { Footer } from "@/sections/Footer";
import GTM, { GTMNoScript } from "@/components/GTM";
import PageLoader from "@/components/PageLoader";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LenisProvider } from "@/components/LenisProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: ["400"],
  display: "swap",
});
const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-spartan",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Marketing Agency | Bytes Platform",
  description: "Bytes Platform is a full-service digital marketing agency. We provide SEO, PPC, social media, web design, and more.",
  icons: {
    icon: "/favicon.png",
  },
  metadataBase: new URL("https://bytesplatform.com/"),
  alternates: {
    canonical: "/", // This will apply to homepage and any page without its own canonical
  },
};

// Global page reload handler component
function PageReloadHandler() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Handle page reload to ensure proper component re-initialization
          if (typeof window !== 'undefined') {
            // Force scroll to top on page reload
            window.addEventListener('beforeunload', function() {
              if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                window.lenis.scrollTo(0, { immediate: true });
              }
            });

            // Reset any cached states on page load
            window.addEventListener('load', function() {
              // Dispatch custom event to notify components
              window.dispatchEvent(new CustomEvent('pageReloaded', {
                detail: { 
                  pathname: window.location.pathname,
                  isRouteChange: false,
                  isPageReload: true 
                }
              }));
            });
          }
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Resource Hints - Load these first */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Critical CSS - Inline for instant render */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
            html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
            body{margin:0;line-height:inherit;min-height:100vh;display:flex;flex-direction:column}
            h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
            a{color:inherit;text-decoration:inherit}
            img,svg,video{display:block;max-width:100%}
            button,input,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}
            .container{width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
            @media(min-width:1024px){.container{max-width:80rem}}
            /* Prevent flash of unstyled content */
            .nav-item{transition:all 0.3s ease}
            /* Loading state */
            main{opacity:1;transition:opacity 0.3s ease}
          `
        }} />
        
        {/* Preload cards.css as it's needed early */}
        <link rel="preload" href="/_next/static/css/cards.css" as="style" />
        
        {/* Google Tag Manager */}
        <GTM id="GTM-MNW4L2XD" />
        {/* Page reload handler */}
        <PageReloadHandler />
        {/* EmailJS */}
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                emailjs.init("dvKSuSLEjskV-yjTk");
              })();
            `,
          }}
        />
      </head>
      <body
        className={twMerge(
          inter.variable,
          calistoga.variable,
          poppins.variable,
          bebasNeue.variable,
          leagueSpartan.variable,
          "text-black antialiased font-sans min-h-screen flex flex-col"
        )}
      >
        {/* GTM noscript fallback */}
        <GTMNoScript id="GTM-MNW4L2XD" />
        {/* Lenis Provider for smooth scrolling */}
        <LenisProvider>
          {/* Scroll to top component - handles scroll reset on route changes */}
          <ScrollToTop />
          <PageLoader>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </PageLoader>
        </LenisProvider>
      </body>
    </html>
  );
}