'use client';

import { Header } from "@/sections/Navbar";
import HeroSection from "@/sections/Hero";
import { useEffect, lazy, Suspense } from "react";
import PerformanceMonitor from "@/components/PerformanceMonitor";

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
      {/* Performance monitoring for development */}
      <PerformanceMonitor />
      
      <Header transparentNav={true} />
      {/* Hero section loads immediately with priority */}
      <HeroSection />
      
      {/* Other sections load lazily with Suspense fallback */}
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
      
      <Suspense fallback={<div className="w-full min-h-screen" />}>
        <div className="w-full">
          <ByteBotsSection />
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