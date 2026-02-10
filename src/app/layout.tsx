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
  title: "Digital Marketing Agency | Bytes Platform",
  description: "Bytes Platform is a full-service digital marketing agency. We provide SEO, PPC, social media, web design, and more.",
  icons: {
    icon: "/favicon.png",
  },
  metadataBase: new URL("https://bytesplatform.com/"),
  alternates: {
    canonical: "/", // This will apply to homepage and any page without its own canonical
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  other: {
    'color-scheme': 'light dark',
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
        {/* Preconnect to critical domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        
        {/* Preload critical hero images for faster LCP */}
        <link 
          rel="preload" 
          as="image" 
          href="/assets/hero images/hero-4.webp"
          type="image/webp"
        />
        <link 
          rel="preload" 
          as="image" 
          href="/assets/hero images/hero-1.webp"
          type="image/webp"
        />
        <link 
          rel="preload" 
          as="image" 
          href="/assets/hero images/hero-2.webp"
          type="image/webp"
        />
        
        {/* Page reload handler */}
        <PageReloadHandler />
        {/* EmailJS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = function() {
                  if (typeof emailjs !== 'undefined') {
                    emailjs.init('dvKSuSLEjskV-yjTk');
                  }
                };
                script.onerror = function() {
                  console.error('Failed to load EmailJS');
                };
                document.head.appendChild(script);
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
        {/* Google Tag Manager */}
        <GTM id="GTM-MNW4L2XD" />
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