'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { AboutSection } from "@/sections/About";
import { BookSection } from "@/sections/BookSection";
import { Footer } from "@/sections/Footer";
import { ContactSection } from "@/sections/Contact";
import CardsSection from "@/sections/CardsSection";
import { LoadingPage } from "@/sections/LoadingPage";
import { LineAnimationSection } from "@/sections/LineAnimationSection";
import { CareersSection } from "@/sections/Careers";
import { ByteBotsSection } from "@/sections/ByteBots";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main>
      {isLoading && <LoadingPage onLoadComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <>
          <Header />
          <HeroSection />
          <ByteBotsSection />
          <ProjectsSection />
          <TapeSection />
          <TestimonialsSection />
          <LineAnimationSection />
          {/* <AboutSection /> */}
          <CardsSection />
          <BookSection />
          <CareersSection />
          <ContactSection />
          <Footer />
        </>
      )}
    </main>
  );
}