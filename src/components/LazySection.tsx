'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

/**
 * LazySection - Optimizes mobile performance by loading sections only when they enter viewport
 * Uses Intersection Observer API for efficient lazy loading
 * Optimized for faster component display with eager loading
 */
export default function LazySection({
  children,
  fallback = <div className="w-full min-h-[50vh]" />,
  threshold = 0.01,
  rootMargin = '100px',
  className = '',
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aggressive optimization: if rootMargin > 500px, load immediately on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const isAggressive = parseInt(rootMargin) >= 500;
    
    if (isMobile && isAggressive) {
      // On mobile with aggressive settings, load after a tiny delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
    
    // Create observer with reduced threshold for faster triggering
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use RAF to avoid blocking main thread
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
          // Once visible, stop observing to save resources
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin, // Aggressive preloading distance
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}
