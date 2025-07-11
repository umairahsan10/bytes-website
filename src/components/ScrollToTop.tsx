"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const ScrollToTop = () => {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prevent browser from restoring previous scroll position
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      // Handle both route changes and page reloads
      const isRouteChange = prevPathname.current !== pathname;
      const isPageReload = isInitialMount.current;

      if (isRouteChange || isPageReload) {
        // Small delay to ensure Lenis is ready
        const timeoutId = setTimeout(() => {
          // Get the global Lenis instance
          const lenis = (window as any).lenis;
          
          if (lenis && typeof lenis.scrollTo === 'function') {
            // Use Lenis to scroll to top with immediate behavior
            lenis.scrollTo(0, { immediate: true });
            
            // Force a refresh of Lenis to ensure proper state
            if (typeof lenis.start === 'function') {
              lenis.start();
            }
          } else {
            // Fallback to native scroll if Lenis is not available
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          }

          // Force a re-render of components by dispatching a custom event
          window.dispatchEvent(new CustomEvent('pageReloaded', { 
            detail: { pathname, isRouteChange, isPageReload } 
          }));
        }, isPageReload ? 100 : 50);

        return () => clearTimeout(timeoutId);
      }

      // Update previous pathname
      prevPathname.current = pathname;
      isInitialMount.current = false;
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}; 