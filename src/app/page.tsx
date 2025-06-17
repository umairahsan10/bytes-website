'use client';

<<<<<<< Updated upstream
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> Stashed changes
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { AboutSection } from "@/sections/About";
import { Footer } from "@/sections/Footer";
import { ContactSection } from "@/sections/Contact";
<<<<<<< Updated upstream
import LoadingPage from "@/components/LoadingPage"; // Adjust path based on where you place the component

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
=======
import LoadingPage from "@/components/LoadingPage";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Load GSAP dynamically
  useEffect(() => {
    const loadGSAP = async () => {
      try {
        const { gsap } = await import('gsap');
        // Make gsap available globally if needed
        (window as any).gsap = gsap;
        setGsapLoaded(true);
      } catch (error) {
        console.error('Failed to load GSAP:', error);
        // Fallback: proceed without GSAP after a delay
        setTimeout(() => {
          setGsapLoaded(true);
          setIsLoading(false);
        }, 3000);
      }
    };

    loadGSAP();
  }, []);
>>>>>>> Stashed changes

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Don't render anything until GSAP is loaded
  if (!gsapLoaded) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to right, #2c5364, #203a43, #0f2027)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        zIndex: 10000
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      {isLoading && (
        <LoadingPage 
          onLoadingComplete={handleLoadingComplete}
<<<<<<< Updated upstream
          loadingDuration={1500} // 5 seconds (adjust as needed)
          minLoadingTime={1500}  // Minimum 2 seconds
=======
          loadingDuration={7000}
          minLoadingTime={2000}
>>>>>>> Stashed changes
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