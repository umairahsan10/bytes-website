'use client';

import { useEffect } from 'react';
import Lenis from "lenis";
import { Header } from "@/sections/Navbar";
import HeroSection from "@/sections/Hero";
import ByteBotsSection from "@/sections/ByteBot";
import ServiceHead from "@/sections/serviceHead";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { AboutSection } from "@/sections/About";
import { BookSection } from "@/sections/BookSection";
import { ContactSection } from "@/sections/Contact";
import CardsSection from "@/sections/CardsSection";
import { LineAnimationSection } from "@/sections/LineAnimationSection";
import { BrandsSection } from "@/sections/brands";
import { NumbersSection } from "@/sections/numbers";

export default function Home() {
  // Global Lenis configuration with mobile-specific values
  useEffect(() => {
    // Detect mobile device
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: isMobile ? 0.5 : 0.3, // Lower for mobile, higher for desktop
      touchMultiplier: isMobile ? 1 : 0.8, // Lower for mobile, higher for desktop
      infinite: false,
    });

    // Expose Lenis instance globally so other components can access it
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Ensure page always starts at the very top on initial load / refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prevent browser from restoring previous scroll position
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  return (
    <main className="text-black min-h-screen">
      <Header transparentNav={true} />
      {[
        <HeroSection key="hero" />,
        <ByteBotsSection key="bytebots" />,
        <ServiceHead key="servicehead" />,
        <CardsSection key="cards" />,
        <LineAnimationSection key="line" />,
        <NumbersSection key="numbers" />,
        <ProjectsSection key="projects" />,
        <BookSection key="book" />,
        <BrandsSection key="brands" />,
        <ContactSection key="contact" />,
        // <TapeSection key="tape" />, // Uncomment if needed
        // <TestimonialsSection key="testimonials" />,
      ].map((Section, idx) => (
        <div key={idx} className="w-full">
          {Section}
        </div>
      ))}
      {/* Footer is now included globally in the RootLayout */}
    </main>
  );
}