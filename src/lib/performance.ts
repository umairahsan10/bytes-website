/**
 * Performance optimization utilities and monitoring
 * Tracks Core Web Vitals for the home page
 */

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

export const trackWebVitals = (metric: any) => {
  const { name, value, id } = metric;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, Math.round(value), 'ms', { id });
  }
  
  // You can send these to your analytics service
  // Example: gtag('event', name, { value: Math.round(value), metric_id: id });
};

/**
 * Prefetch critical resources on page idle
 */
export const prefetchCriticalResources = () => {
  if (typeof window === 'undefined') return;
  
  // Run after page is idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Prefetch WebP images for sections that will be lazy loaded
      const imagesToPrefetch = [
        '/assets/bytes-bot/bot_bg.webp',
        '/assets/Book/desktop_bg.webp',
      ];
      
      imagesToPrefetch.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = src;
        link.type = 'image/webp';
        document.head.appendChild(link);
      });
    });
  }
};

/**
 * Optimize images with Intersection Observer
 */
export const createImageObserver = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before entering viewport
      threshold: 0.01,
    }
  );
};

/**
 * Check if device supports WebP
 */
export const supportsWebP = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  // Check via canvas
  if (!window.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
};

/**
 * Measure page load time
 */
export const measurePageLoad = () => {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance]', {
        'Page Load Time': `${pageLoadTime}ms`,
        'Connect Time': `${connectTime}ms`,
        'Render Time': `${renderTime}ms`,
      });
    }
  });
};

/**
 * Debounce scroll events for better performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle scroll events for better performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
