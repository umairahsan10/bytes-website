'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/sections/Navbar";
import HeroSection from "@/sections/Hero";
import { ByteBotsSection } from "@/sections/ByteBot";
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

  return (
    <main className="text-black min-h-screen">
      {isLoading && <LoadingPage onLoadComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <>
          <Header />
          {[
            <HeroSection key="hero" />,
            <ByteBotsSection key="bytebots" />,
            <ProjectsSection key="projects" />,
            // <TapeSection key="tape" />,
            <BrandsSection key="brands" />,
            <LineAnimationSection key="line" />,
            <CardsSection key="cards" />,
            <BookSection key="book" />,
            // <TestimonialsSection key="testimonials" />,
            <ContactSection key="contact" />,
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