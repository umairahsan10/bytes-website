"use client";

import { useEffect, useRef } from 'react';

interface PageReloadEvent {
  pathname: string;
  isRouteChange: boolean;
  isPageReload: boolean;
}

export function usePageReload(callback?: (event: PageReloadEvent) => void) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePageReload = (event: CustomEvent<PageReloadEvent>) => {
      if (callback) {
        callback(event.detail);
      }
      
      // Force component re-initialization
      if (event.detail.isPageReload) {
        // Small delay to ensure everything is ready
        setTimeout(() => {
          // Trigger a re-render by updating a ref or state
          if (callback) {
            callback(event.detail);
          }
        }, 150);
      }
    };

    window.addEventListener('pageReloaded', handlePageReload as EventListener);

    return () => {
      window.removeEventListener('pageReloaded', handlePageReload as EventListener);
    };
  }, [callback]);

  return { isInitialMount: isInitialMount.current };
} 