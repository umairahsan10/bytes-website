"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import LoadingPage from "@/sections/LoadingPage";

interface PageLoaderProps {
  children: React.ReactNode;
}

const PageLoader: React.FC<PageLoaderProps> = ({ children }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);

  // Force each page (initial load or route change) to start at the very top
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Prevent browser from attempting to restore the previous scroll position
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Immediately jump to the top of the document
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      // If Lenis smooth-scroll is active, also reset its internal position
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname]);

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

  // Trigger the loader every time the route changes
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