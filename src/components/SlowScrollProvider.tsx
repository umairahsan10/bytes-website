'use client';

import { useEffect } from 'react';

interface SlowScrollProviderProps {
  /**
   * Multiply the browser wheel delta by this factor. 0.5 = half speed.
   * Keep between 0 and 1 for slower scroll, >1 for faster.
   */
  factor?: number;
}

/**
 * Globally reduces scroll sensitivity by intercepting wheel events and
 * translating them at a scaled rate. Uses a passive: false listener so we can
 * call preventDefault. Only attaches on the client.
 */
const SlowScrollProvider: React.FC<SlowScrollProviderProps> = ({ factor = 0.5 }) => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Ignore pinch-zoom ( ctrlKey ) or if user holds Shift (horizontal)
      if (e.ctrlKey) return;
      e.preventDefault();
      const scaledDelta = e.deltaY * factor;
      window.scrollBy({ top: scaledDelta, behavior: 'auto' });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [factor]);

  return null; // no visible output
};

export default SlowScrollProvider; 