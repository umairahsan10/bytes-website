'use client';

import React, { useState } from 'react';
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { AboutSection } from "@/sections/About";
import { Footer } from "@/sections/Footer";
import { ContactSection } from "@/sections/Contact";
import LoadingPage from "@/components/LoadingPage"; // Adjust path based on where you place the component

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && (
        <LoadingPage 
          onLoadingComplete={handleLoadingComplete}
          loadingDuration={1500} // 5 seconds (adjust as needed)
          minLoadingTime={1500}  // Minimum 2 seconds
        />
      )}
      
      {!isLoading && (
        <>
          <Header />
          <HeroSection />
          <ProjectsSection />
          <TapeSection />
          <TestimonialsSection />
          <AboutSection />
          <ContactSection />
          <Footer />
        </>
      )}
    </div>
  );
}