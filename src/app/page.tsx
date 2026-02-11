'use client';

import { Header } from "@/sections/Navbar";
import HeroSection from "@/sections/Hero";
import { useEffect, lazy, Suspense } from "react";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import LazySection from "@/components/LazySection";

// Lazy load non-critical sections for better initial load performance
const ByteBotsSection = lazy(() => import("@/sections/ByteBot"));
const ServiceHead = lazy(() => import("@/sections/serviceHead"));
const ProjectsSection = lazy(() => import("@/sections/Projects").then(mod => ({ default: mod.ProjectsSection })));
const BookSection = lazy(() => import("@/sections/BookSection").then(mod => ({ default: mod.BookSection })));
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
      
      {/* Sections lazy load only when entering viewport - optimized for mobile */}
      <LazySection rootMargin="200px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-screen" />}>
          <ByteBotsSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="150px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
          <ServiceHead />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="150px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
          <CardsSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
          <LineAnimationSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
          <NumbersSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-screen" />}>
          <ProjectsSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-screen" />}>
          <BookSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="50px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
          <BrandsSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="50px" className="w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
          <ContactSection />
        </Suspense>
      </LazySection>
      {/* Footer is now included globally in the RootLayout */}
    </main>
  );
}