// Abdullah Zindabad
import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import "../sections/cards.css";
import { Footer } from "@/sections/Footer";
import GTM, { GTMNoScript } from "@/components/GTM";
import PageLoader from "@/components/PageLoader";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LenisProvider } from "@/components/LenisProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Bytes Platform",
  description: "Testing the portfolio",
  icons: {
    icon: "/favicon.png",
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