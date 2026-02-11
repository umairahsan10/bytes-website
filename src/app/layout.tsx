// Abdullah Zindabad
import type { Metadata, Viewport } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import "./critical.css"; // Critical above-the-fold CSS
import { twMerge } from "tailwind-merge";
import "../sections/cards.css";
import { Footer } from "@/sections/Footer";
import GTM, { GTMNoScript } from "@/components/GTM";
import PageLoader from "@/components/PageLoader";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LenisProvider } from "@/components/LenisProvider";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: 'swap', // Optimize font loading
});

const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  display: 'swap', // Optimize font loading
});

export const metadata: Metadata = {
  title: "Digital Marketing Agency | Bytes Platform",
  description: "Bytes Platform is a full-service digital marketing agency. We provide SEO, PPC, social media, web design, and more.",
  icons: {
    icon: "/favicon.png",
  },
  metadataBase: new URL("https://bytesplatform.com/"),
  alternates: {
    canonical: "https://bytesplatform.com/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'color-scheme': 'light dark',
  },
};

// Export viewport separately as per Next.js 14+ requirements
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#010a14' },
  ],
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
        <link rel="dns-prefetch" href="https://fonts.cdnfonts.com" />
        
        {/* Async load fonts to prevent render blocking - mobile optimized */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var poppinsLink = document.createElement('link');
                poppinsLink.rel = 'stylesheet';
                poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap';
                poppinsLink.media = 'print';
                poppinsLink.onload = function() { this.media = 'all'; };
                document.head.appendChild(poppinsLink);
                
                // Load remaining fonts after initial render
                if ('requestIdleCallback' in window) {
                  requestIdleCallback(function() {
                    var fonts = [
                      'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
                      'https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap',
                      'https://fonts.cdnfonts.com/css/discrdive-3d',
                      'https://fonts.cdnfonts.com/css/goldrops-personal-use'
                    ];
                    fonts.forEach(function(url) {
                      var link = document.createElement('link');
                      link.rel = 'stylesheet';
                      link.href = url;
                      document.head.appendChild(link);
                    });
                  });
                } else {
                  setTimeout(function() {
                    var fonts = [
                      'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
                      'https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap',
                      'https://fonts.cdnfonts.com/css/discrdive-3d',
                      'https://fonts.cdnfonts.com/css/goldrops-personal-use'
                    ];
                    fonts.forEach(function(url) {
                      var link = document.createElement('link');
                      link.rel = 'stylesheet';
                      link.href = url;
                      document.head.appendChild(link);
                    });
                  }, 1000);
                }
              })();
            `,
          }}
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" />
        </noscript>
        
        {/* Preload critical hero images for faster LCP - mobile optimized */}
        <link 
          rel="preload" 
          as="image" 
          href="/assets/hero images/hero-4.webp"
          type="image/webp"
          // @ts-ignore
          imageSrcSet="/assets/hero images/hero-4.webp 1x"
          media="(max-width: 768px)"
        />
        <link 
          rel="preload" 
          as="image" 
          href="/assets/hero images/hero-1.webp"
          type="image/webp"
          media="(min-width: 769px)"
        />
        <link 
          rel="preload" 
          as="image" 
          href="/assets/hero images/hero-2.webp"
          type="image/webp"
          media="(min-width: 769px)"
        />
        
        {/* Page reload handler */}
        <PageReloadHandler />
        {/* EmailJS - Deferred loading for better performance */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
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
              });
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