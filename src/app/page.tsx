'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { AboutSection } from "@/sections/About";
import { Footer } from "@/sections/Footer";
import { ContactSection } from "@/sections/Contact";
import LoadingPage from "@/components/LoadingPage";
import NavigationMenu from "@/components/NavigationMenu";
// import NavigationMenu from "@/components/NavigationMenu";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Refs for smooth scrolling to sections
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Load GSAP dynamically
  useEffect(() => {
    const loadGSAP = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
        
        // Register ScrollToPlugin for smooth scrolling
        gsap.registerPlugin(ScrollToPlugin);
        
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

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Show navigation after loading is complete
    setTimeout(() => {
      setShowNavigation(true);
    }, 500);
  };

  // Handle navigation to different sections
  const handleNavigation = (section: string) => {
    const { gsap } = (window as any);
    
    switch (section.toLowerCase()) {
      case 'home':
        if (heroRef.current && gsap) {
          gsap.to(window, { duration: 1, scrollTo: { y: heroRef.current, offsetY: 0 } });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        break;
      case 'about':
        if (aboutRef.current && gsap) {
          gsap.to(window, { duration: 1, scrollTo: { y: aboutRef.current, offsetY: 100 } });
        } else if (aboutRef.current) {
          aboutRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'services':
      case 'portfolio':
      case 'technologies':
        if (projectsRef.current && gsap) {
          gsap.to(window, { duration: 1, scrollTo: { y: projectsRef.current, offsetY: 100 } });
        } else if (projectsRef.current) {
          projectsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'contact':
      case 'contact us':
        if (contactRef.current && gsap) {
          gsap.to(window, { duration: 1, scrollTo: { y: contactRef.current, offsetY: 100 } });
        } else if (contactRef.current) {
          contactRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'careers':
        // You can add a careers section or redirect to a careers page
        console.log('Navigate to careers');
        break;
      default:
        console.log('Unknown navigation:', section);
    }
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
    <div style={{ position: 'relative' }}>
      {/* Loading Page */}
      {isLoading && (
        <LoadingPage 
          onLoadingComplete={handleLoadingComplete}
          loadingDuration={7000}
          minLoadingTime={2000}
        />
      )}
      
      {/* Navigation Menu */}
      {showNavigation && !isLoading && (
        <NavigationMenu 
          logoSrc="/assets/bytes-logo.png"
          heroImageSrc="/assets/hero.jpg"
          onNavigate={handleNavigation}
        />
      )}
      
      {/* Main Content */}
      {!isLoading && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Hide the original Header since we have NavigationMenu */}
          {/* <Header /> */}
          
          <div ref={heroRef}>
            <HeroSection />
          </div>
          
          <div ref={projectsRef}>
            <ProjectsSection />
          </div>
          
          <TapeSection />
          <TestimonialsSection />
          
          <div ref={aboutRef}>
            <AboutSection />
          </div>
          
          <div ref={contactRef}>
            <ContactSection />
          </div>
          
          <Footer />
        </div>
      )}
    </div>
  );
}