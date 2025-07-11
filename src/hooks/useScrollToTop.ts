"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prevent browser from restoring previous scroll position
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      // Scroll to top immediately
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      // If Lenis smooth-scroll is active, also reset its internal position
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname]);
}; 