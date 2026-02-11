'use client';

import { Header } from "@/sections/Navbar";
import HeroSection from "@/sections/Hero";
import { useEffect, lazy, Suspense } from "react";
import PerformanceMonitor from "@/components/PerformanceMonitor";

// Preload first sections immediately for faster display
const ByteBotsSection = lazy(() => import("@/sections/ByteBot"));
const ServiceHead = lazy(() => import("@/sections/serviceHead"));
const CardsSection = lazy(() => import("@/sections/CardsSection"));

// Lazy load lower sections only when needed
const LineAnimationSection = lazy(() => import("@/sections/LineAnimationSection").then(mod => ({ default: mod.LineAnimationSection })));
const NumbersSection = lazy(() => import("@/sections/numbers").then(mod => ({ default: mod.NumbersSection })));
const ProjectsSection = lazy(() => import("@/sections/Projects").then(mod => ({ default: mod.ProjectsSection })));
const BookSection = lazy(() => import("@/sections/BookSection").then(mod => ({ default: mod.BookSection })));
const BrandsSection = lazy(() => import("@/sections/brands").then(mod => ({ default: mod.BrandsSection })));
const ContactSection = lazy(() => import("@/sections/Contact").then(mod => ({ default: mod.ContactSection })));

export default function Home() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('home-scrollbars');
    
    // Preload critical below-fold sections immediately
    const immediateTimer = setTimeout(() => {
      import("@/sections/ByteBot");
      import("@/sections/serviceHead");
      import("@/sections/CardsSection");
    }, 100);
    
    // Preload lower sections including Brands and Contact after a short delay
    const lowerSectionsTimer = setTimeout(() => {
      import("@/sections/brands").then(mod => mod.BrandsSection);
      import("@/sections/Contact").then(mod => mod.ContactSection);
      import("@/sections/LineAnimationSection").then(mod => mod.LineAnimationSection);
      import("@/sections/numbers").then(mod => mod.NumbersSection);
    }, 800);
    
    // Preload on scroll for even better UX - very aggressive
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      // When user scrolls past 20%, preload everything
      if (scrollPercent > 20) {
        import("@/sections/brands").then(mod => mod.BrandsSection);
        import("@/sections/Contact").then(mod => mod.ContactSection);
        import("@/sections/Projects").then(mod => mod.ProjectsSection);
        import("@/sections/BookSection").then(mod => mod.BookSection);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      html.classList.remove('home-scrollbars');
      clearTimeout(immediateTimer);
      clearTimeout(lowerSectionsTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="text-black min-h-screen">
      {/* Performance monitoring for development */}
      <PerformanceMonitor />
      
      <Header transparentNav={true} />
      {/* Hero section loads immediately with priority */}
      <HeroSection />
      
      {/* First visible sections - load immediately without LazySection wrapper */}
      <Suspense fallback={<div className="w-full min-h-screen" />}>
        <ByteBotsSection />
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <ServiceHead />
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <CardsSection />
      </Suspense>
      
      {/* Lower sections use React.lazy + Suspense for efficient lazy loading */}
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <LineAnimationSection />
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
        <NumbersSection />
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-screen" />}>
        <ProjectsSection />
      </Suspense>
      
      <Suspense fallback={<div className="w-full min-h-screen" />}>
        <BookSection />
      </Suspense>
      
      {/* Brands and Contact sections - preloaded via useEffect */}
      <Suspense fallback={
        <div className="w-full min-h-[50vh] bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-gray-400 text-lg">Loading our clients...</div>
          </div>
        </div>
      }>
        <BrandsSection />
      </Suspense>
      
      <Suspense fallback={
        <div className="w-full min-h-[50vh] bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-gray-400 text-lg">Loading contact form...</div>
          </div>
        </div>
      }>
        <ContactSection />
      </Suspense>
      {/* Footer is now included globally in the RootLayout */}
    </main>
  );
}