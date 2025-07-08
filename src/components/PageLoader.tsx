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
      {loading ? (
        <LoadingPage onLoadComplete={handleLoadComplete} />
      ) : (
        children
      )}
    </>
  );
};

export default PageLoader; 