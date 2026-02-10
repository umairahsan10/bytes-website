'use client';

import { useEffect } from 'react';
import { 
  prefetchCriticalResources, 
  measurePageLoad 
} from '@/lib/performance';

/**
 * PerformanceMonitor component
 * Handles performance tracking and optimization for the home page
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Prefetch critical resources after initial load
    prefetchCriticalResources();
    
    // Measure page load performance
    measurePageLoad();
    
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (process.env.NODE_ENV === 'development') {
            console.log('[LCP]', Math.round(lastEntry.startTime), 'ms');
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[FID]', Math.round(entry.processingStart - entry.startTime), 'ms');
            }
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
          if (process.env.NODE_ENV === 'development') {
            console.log('[CLS]', clsScore.toFixed(3));
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
