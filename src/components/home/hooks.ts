'use client';

import { useEffect, useState } from 'react';

/** SSR-safe media query hook. Returns `false` until mounted. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Single source of truth for reduced-motion across the homepage. */
export function useReducedMotionPref(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** True on devices with a fine pointer (mouse/trackpad) — gates hover/cursor effects. */
export function usePointerFine(): boolean {
  return useMediaQuery('(pointer: fine)');
}

export const BREAKPOINTS = {
  desktop: '(min-width: 1200px)',
  tablet: '(min-width: 768px) and (max-width: 1199px)',
  mobile: '(max-width: 767px)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;
