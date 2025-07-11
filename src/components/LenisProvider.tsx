"use client";

import { useEffect } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Only initialize Lenis on the client side
    if (typeof window === 'undefined') return;

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

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
} 