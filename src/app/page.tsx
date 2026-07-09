'use client';

import { Header } from "@/sections/Navbar";
import HeroSection from "@/sections/Hero";
import { useEffect, lazy, Suspense } from "react";
import PerformanceMonitor from "@/components/PerformanceMonitor";

// Organization / LocalBusiness structured data (JSON-LD) for the homepage
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Bytes Platform",
  legalName: "Bytes Platform LLC",
  url: "https://bytesplatform.com",
  logo: "https://bytesplatform.com/assets/bytes-logo.png",
  email: "info@bytesplatform.com",
  telephone: "+1-833-323-0371",
  description:
    "Bytes Platform is a Denton, TX digital agency building custom websites, apps, SEO, and AI solutions that grow your business. Get a free consultation today.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2809 Joshua Street",
    addressLocality: "Denton",
    addressRegion: "TX",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.facebook.com/share/1Kc3xtzhqa/",
    "https://www.instagram.com/bytesplatform",
    "https://www.linkedin.com/company/bytebloom-solutionss/",
  ],
};

// FAQ structured data (JSON-LD). NOTE: for Google compliance, these questions and
// answers must also be visibly rendered on this page.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a custom website cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cost depends on scope, complexity, and features. A brochure site differs greatly from a custom web app or e-commerce build. Bytes Platform scopes every project individually and provides a fixed quote after a free consultation.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build a website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most standard websites take four to eight weeks from kickoff to launch, while larger custom applications take longer. Timelines depend on scope, content readiness, and revision rounds, which we confirm before starting.",
      },
    },
    {
      "@type": "Question",
      name: "How long does SEO take to show results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SEO is a long-term investment. Early movement often appears within three months, with more significant gains typically between six and twelve months, depending on competition, your site's current authority, and content velocity.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work with clients outside of Texas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Bytes Platform is based in Denton, Texas, and works with clients across the United States and remotely. All projects are managed online with regular check-ins regardless of location.",
      },
    },
    {
      "@type": "Question",
      name: "What industries do you work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bytes Platform serves businesses across many industries, from startups to established companies. Our web, app, SEO, marketing, and automation services adapt to each client's specific market and goals.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Byte Bots and a regular chatbot?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Byte Bots are custom AI chatbots built and trained on your business's own data, so they answer accurately in your brand's voice, qualify leads, and automate support, rather than relying on generic scripted replies.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer ongoing support and maintenance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Beyond launch, Bytes Platform offers ongoing maintenance, updates, security monitoring, and optimization so your website, app, or marketing continues to perform over time.",
      },
    },
  ],
};

// Lazy load non-critical sections for better initial load performance
const ByteBotsSection = lazy(() => import("@/sections/ByteBot"));
const ServiceHead = lazy(() => import("@/sections/serviceHead"));
const ProjectsSection = lazy(() => import("@/sections/Projects").then(mod => ({ default: mod.ProjectsSection })));
// const BookSection = lazy(() => import("@/sections/BookSection").then(mod => ({ default: mod.BookSection })));
const ContactSection = lazy(() => import("@/sections/Contact").then(mod => ({ default: mod.ContactSection })));
const CardsSection = lazy(() => import("@/sections/CardsSection"));
const LineAnimationSection = lazy(() => import("@/sections/LineAnimationSection").then(mod => ({ default: mod.LineAnimationSection })));
const BrandsSection = lazy(() => import("@/sections/brands").then(mod => ({ default: mod.BrandsSection })));
const NumbersSection = lazy(() => import("@/sections/numbers").then(mod => ({ default: mod.NumbersSection })));

export default function Home() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('home-scrollbars');
    return () => {
      html.classList.remove('home-scrollbars');
    };
  }, []);

  return (
    <main className="text-black min-h-screen">
      {/* Organization / LocalBusiness structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* FAQ structured data — see note: requires matching visible FAQ content on this page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Performance monitoring for development */}
      <PerformanceMonitor />
      
      <Header transparentNav={true} />
      {/* Hero section loads immediately with priority */}
      <HeroSection />
      
      {/* Other sections load lazily with Suspense fallback */}
      <Suspense fallback={<div className="w-full min-h-screen" />}>
        <div className="w-full">
          <ByteBotsSection />
        </div>
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <div className="w-full">
          <ServiceHead />
        </div>
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <div className="w-full">
          <CardsSection />
        </div>
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <div className="w-full">
          <LineAnimationSection />
        </div>
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <div className="w-full">
          <NumbersSection />
        </div>
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-screen" />}>
        <div className="w-full">
          <ProjectsSection />
        </div>
      </Suspense>
      
      {/* <Suspense fallback={<div className="w-full min-h-screen" />}>
        <div className="w-full">
          <BookSection />
        </div>
      </Suspense> */}
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <div className="w-full">
          <BrandsSection />
        </div>
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <div className="w-full">
          <ContactSection />
        </div>
      </Suspense>
      {/* Footer is now included globally in the RootLayout */}
    </main>
  );
}