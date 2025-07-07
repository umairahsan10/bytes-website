'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/sections/Navbar";
import HeroSection from "@/sections/Hero";
import ByteBotsSection from "@/sections/ByteBot";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { AboutSection } from "@/sections/About";
import { BookSection } from "@/sections/BookSection";
import { ContactSection } from "@/sections/Contact";
import CardsSection from "@/sections/CardsSection";
import { LoadingPage } from "@/sections/LoadingPage";
import { LineAnimationSection } from "@/sections/LineAnimationSection";
import { BrandsSection } from "@/sections/brands";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

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
      {isLoading && <LoadingPage onLoadComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <>
          <Header />
          {[
            <HeroSection key="hero" />,
            <ByteBotsSection key="bytebots" />,
            <CardsSection key="cards" />,
            <LineAnimationSection key="line" />,
            <ProjectsSection key="projects" />,
            <BrandsSection key="brands" />,
            <BookSection key="book" />,
            <ContactSection key="contact" />,
            // <TapeSection key="tape" />,
            // <TestimonialsSection key="testimonials" />,
          ].map((Section, idx) => (
            <div
              key={idx}
              className={`w-full`}
            >
              {Section}
            </div>
          ))}
          {/* Footer is now included globally in the RootLayout */}
        </>
      )}
    </main>
  );
}