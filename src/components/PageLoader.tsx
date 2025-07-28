"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import LoadingPage from "@/sections/LoadingPage";

interface PageLoaderProps {
  children: React.ReactNode;
}

const PageLoader: React.FC<PageLoaderProps> = ({ children }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use useCallback to memoize the handlers to prevent unnecessary re-renders
  const handleRouteChangeStart = useCallback(() => {
    if (isMountedRef.current) {
      // Use setTimeout to defer the state update and avoid useInsertionEffect conflicts
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setLoading(true);
        }
      }, 0);
    }
  }, []);

  const handleBeforeUnload = useCallback(() => {
    if (isMountedRef.current) {
      // Use setTimeout to defer the state update
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setLoading(true);
        }
      }, 0);
    }
  }, []);

  // Refresh ScrollTrigger positions when loader completes
  useEffect(() => {
    if (!loading) {
      // Dynamically import to avoid SSR mismatch
      (async () => {
        try {
          const gsapModule = await import("gsap/ScrollTrigger");
          const ScrollTrigger = gsapModule.default || gsapModule.ScrollTrigger;
          if (ScrollTrigger && typeof ScrollTrigger.refresh === "function") {
            ScrollTrigger.refresh();
          }
        } catch (e) {
          // Ignore if gsap not available
        }
      })();
    }
  }, [loading]);

  // Set up navigation event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Store original history methods for cleanup
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // Add event listeners for navigation events
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handleRouteChangeStart);
    
    // Override history methods
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChangeStart();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChangeStart();
    };

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleRouteChangeStart);
      
      // Restore original history methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [handleRouteChangeStart, handleBeforeUnload]);

  // Handle pathname changes
  useEffect(() => {
    if (isMountedRef.current) {
      // Use setTimeout to defer the state update
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setLoading(true);
        }
      }, 0);
    }
  }, [pathname]);

  const handleLoadComplete = useCallback(() => {
    if (isMountedRef.current) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {/* Always render the page content so that assets begin loading immediately */}
      {children}

      {/* Overlay the loading screen until the load sequence completes */}
      {loading && <LoadingPage onLoadComplete={handleLoadComplete} />}
    </>
  );
};

export default PageLoader; 