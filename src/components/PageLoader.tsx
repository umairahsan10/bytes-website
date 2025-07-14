"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import LoadingPage from "@/sections/LoadingPage";

interface PageLoaderProps {
  children: React.ReactNode;
}

const PageLoader: React.FC<PageLoaderProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const isMountedRef = useRef(true);

  // Refresh ScrollTrigger positions when loader completes to fix animations that rely on layout (especially on mobile)
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

  // Router event interception to show loading immediately on navigation start
  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setLoading(true);
      }
    };

    const handleBeforeUnload = () => {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setLoading(true);
      }
    };

    // Store original history methods for cleanup
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // Add event listeners for navigation events
    if (typeof window !== 'undefined') {
      // Listen for beforeunload to catch page unloads
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Listen for popstate to catch browser back/forward
      window.addEventListener('popstate', handleRouteChangeStart);
      
      // Listen for pushstate/replacestate to catch programmatic navigation
      history.pushState = function(...args) {
        originalPushState.apply(history, args);
        handleRouteChangeStart();
      };
      
      history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        handleRouteChangeStart();
      };
    }

    // Cleanup event listeners
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
      
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handleRouteChangeStart);
        
        // Restore original history methods
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      }
    };
  }, []);

  // Keep the existing pathname-based loading trigger as fallback
  useEffect(() => {
    setLoading(true);
  }, [pathname]);

  const handleLoadComplete = () => {
    setLoading(false);
  };

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