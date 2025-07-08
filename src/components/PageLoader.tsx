"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LoadingPage from "@/sections/LoadingPage";

interface PageLoaderProps {
  children: React.ReactNode;
}

const PageLoader: React.FC<PageLoaderProps> = ({ children }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);

  // Trigger the loader every time the route changes
  useEffect(() => {
    setLoading(true);
  }, [pathname]);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingPage onLoadComplete={handleLoadComplete} />}
      {children}
    </>
  );
};

export default PageLoader; 