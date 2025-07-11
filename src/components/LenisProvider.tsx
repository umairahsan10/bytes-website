"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize Lenis on the client side
    if (typeof window === 'undefined') return;

    // Clean up any existing Lenis instance first
    const existingLenis = (window as any).lenis;
    if (existingLenis && typeof existingLenis.destroy === 'function') {
      existingLenis.destroy();
    }

    // Detect mobile device
    const isMobile = window.innerWidth <= 768;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: isMobile ? 0.4 : 0.4, 
      touchMultiplier: isMobile ? 0.9 : 0.9, 
      infinite: false,
    });

    // Expose Lenis instance globally so other components can access it
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Mark as initialized
    setIsInitialized(true);

    // Handle page reload - force scroll to top
    const handleBeforeUnload = () => {
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { immediate: true });
      }
    };

    // Handle page visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && lenis && typeof lenis.scrollTo === 'function') {
        // Small delay to ensure everything is ready
        setTimeout(() => {
          lenis.scrollTo(0, { immediate: true });
        }, 100);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      lenis.destroy();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Force scroll to top on mount and when initialized
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        // Use a small delay to ensure everything is ready
        setTimeout(() => {
          lenis.scrollTo(0, { immediate: true });
        }, 50);
      } else {
        // Fallback to native scroll
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
  }, [isInitialized]);

  return <>{children}</>;
} 