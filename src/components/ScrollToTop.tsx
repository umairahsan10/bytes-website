"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prevent browser from restoring previous scroll position
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      // Small delay to ensure Lenis is ready
      const timeoutId = setTimeout(() => {
        // Get the global Lenis instance
        const lenis = (window as any).lenis;
        
        if (lenis && typeof lenis.scrollTo === 'function') {
          // Use Lenis to scroll to top with immediate behavior
          lenis.scrollTo(0, { immediate: true });
        } else {
          // Fallback to native scroll if Lenis is not available
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}; 