'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import LoadingPage from '@/sections/LoadingPage';

interface LoaderProviderProps {
  children: React.ReactNode;
}

/**
 * LoaderProvider keeps a full-screen <LoadingPage /> visible until:
 *  1) The component has mounted on the client, and
 *  2) A minimum display time has elapsed (handled in LoadingPage), and
 *  3) The consumer notifies us via `onLoadComplete` (also from LoadingPage).
 *
 * It also re-activates the loader when the route (pathname) changes so that
 * client-side navigations get the same loading experience.
 */
const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const pathname = usePathname();

  // Determines whether the LoadingPage should be mounted.
  const [showLoader, setShowLoader] = useState(true);
  // Used to fade page content while the loader is active.
  const [pageReady, setPageReady] = useState(false);
  // When this key changes, React will re-mount the page subtree, ensuring
  // animations and component state start fresh after the loader disappears.
  const [contentKey, setContentKey] = useState(0);

  /**
   * This callback is passed down to <LoadingPage />. It is triggered once the
   * loader has completed its own fade-out animation. At that moment we can
   * safely hide the loader component and reveal the page content.
   */
  const handleLoadComplete = useCallback(() => {
    // Reveal the page content first (with a CSS transition)
    setPageReady(true);

    // Always start each page from the top.
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    // Force remount so that animations restart from their initial state.
    setContentKey((k) => k + 1);

    // 🔄 Tell GSAP/ScrollTrigger to recalculate positions now that the loader is gone.
    //   We import GSAP dynamically so that this code only ever runs in the browser.
    //   `refresh()` is crucial because the fixed loader altered the initial scroll
    //   positions – without it, ScrollTrigger-based animations can appear "stuck"
    //   or trigger at the wrong time in production (especially on Vercel).
    import('gsap').then(({ gsap }) =>
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.refresh();
      })
    );

    // Unmount the loader after a short delay (matches GSAP fade-out duration)
    // to avoid cutting off the animation.
    const timeout = setTimeout(() => setShowLoader(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  /**
   * Re-enable the loader every time the pathname changes (client-side
   * navigation). This guarantees the loader appears on subsequent route
   * transitions as well.
   */
  useEffect(() => {
    // Activate loader for the next page.
    setShowLoader(true);
    setPageReady(false);
  }, [pathname]);

  return (
    <>
      {/* Loader overlay */}
      {showLoader && <LoadingPage onLoadComplete={handleLoadComplete} />}

      {/* Page content. We use opacity so that the content can start laying out
          in the background while the loader is visible, reducing perceived
          wait times. */}
      <div
        key={contentKey}
        style={{
          opacity: pageReady ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
        }}
      >
        {children}
      </div>
    </>
  );
};

export default LoaderProvider; 