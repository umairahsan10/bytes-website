import { RefObject, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { pageAtom, pages } from "./state";
import { playPageFlipSound } from "./sound";

/**
 * Hook that binds a global wheel listener.
 * While the supplied element is fully within the viewport (or no element supplied),
 * the wheel will flip the 3-D book pages instead of scrolling the document.
 * – Scroll down advances, scroll up goes back.
 * – At the front cover (page 0) scrolling up is ignored so the website can scroll.
 * – At the back cover (page = pages.length) scrolling down is ignored likewise.
 */
export const useBookScroll = (containerRef?: RefObject<HTMLElement | null>) => {
  const [page, setPage] = useAtom(pageAtom);
  const pageRef = useRef(page);
  const lastFlipTime = useRef(0);
  const engaged = useRef(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    const isTouchDevice = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    const isElementInViewport = (): boolean => {
      const rect = containerRef?.current?.getBoundingClientRect();
      if (!rect) return false;
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const isElementCentered = (): boolean => {
      const rect = containerRef?.current?.getBoundingClientRect();
      if (!rect) return true;
      const elemCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      return Math.abs(elemCenter - viewportCenter) < window.innerHeight * 0.1;
    };

    const handleWheel = (e: WheelEvent) => {
      const inViewport = isElementInViewport();
      const centered = isElementCentered();
      const rect = containerRef?.current?.getBoundingClientRect();
      const elemCenter = rect ? rect.top + rect.height / 2 : 0;
      const viewportCenter = window.innerHeight / 2;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      const currentPage = pageRef.current;
      const atHardBoundary = (scrollingUp && currentPage === 0) || (scrollingDown && currentPage === pages.length);

      // If not engaged and user is scrolling AWAY from book while at boundary, let page scroll.
      if (!engaged.current && atHardBoundary) {
        return;
      }

      const partiallyVisible = inViewport && !centered;
      const scrollingTowardBook = (scrollingDown && elemCenter > viewportCenter) || (scrollingUp && elemCenter < viewportCenter);

      // Allow normal scroll if outside viewport and not already engaged
      if (!inViewport && !engaged.current) return;

      // Engage only when element is centered AND user isn't at boundary scrolling away.
      if (centered && !atHardBoundary) {
        engaged.current = true;
      }

      // If partially visible, intercept scroll and snap into center
      if (partiallyVisible && !engaged.current && scrollingTowardBook) {
        e.preventDefault();
        e.stopPropagation();
        containerRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Determine if we reached boundaries to release engagement
      if (engaged.current && atHardBoundary) {
        engaged.current = false;
        return; // allow normal scroll afterwards
      }

      if (!engaged.current) return; // not engaged yet

      // Consume event and flip pages
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastFlipTime.current < 400) return;

      if (scrollingDown && currentPage < pages.length) {
        setPage(currentPage + 1);
        playPageFlipSound();
        lastFlipTime.current = now;
      } else if (scrollingUp && currentPage > 0) {
        setPage(currentPage - 1);
        playPageFlipSound();
        lastFlipTime.current = now;
      }
    };

    // --- Touch handlers for mobile ---
    const handleTouchStart = (e: TouchEvent) => {
      if (!isTouchDevice()) return;

      const inViewport = isElementInViewport();
      if (!inViewport && !engaged.current) return; // allow normal scroll

      const centered = isElementCentered();
      const currentPage = pageRef.current;
      const atEdge = (currentPage === 0 || currentPage === pages.length);

      // If already engaged or element centered (but NOT at edge), block default scroll immediately
      if (engaged.current || (centered && !atEdge)) {
        e.preventDefault();
        e.stopPropagation();
      }

      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchDevice()) return;

      if (touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.touches[0].clientY; // positive when moving up (scroll down)

      // small movement threshold
      if (Math.abs(deltaY) < 40) return;

      // We'll call a helper function inline replicating critical section

      const inViewport = isElementInViewport();
      const centered = isElementCentered();

      const rect = containerRef?.current?.getBoundingClientRect();
      const elemCenter = rect ? rect.top + rect.height / 2 : 0;
      const viewportCenter = window.innerHeight / 2;

      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;

      const currentPage = pageRef.current;
      const atEdge = (currentPage === 0 || currentPage === pages.length);

      // If not engaged and user is scrolling AWAY from book while at boundary, let page scroll.
      if (!engaged.current && atEdge) {
        return;
      }

      const partiallyVisible = inViewport && !centered;
      const scrollingTowardBook = (scrollingDown && elemCenter > viewportCenter) || (scrollingUp && elemCenter < viewportCenter);

      if (!inViewport && !engaged.current) {
        touchStartY.current = e.touches[0].clientY;
        return;
      }

      if (centered && !atEdge) engaged.current = true;

      if (partiallyVisible && !engaged.current && scrollingTowardBook) {
        e.preventDefault();
        e.stopPropagation();
        containerRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        touchStartY.current = e.touches[0].clientY;
        return;
      }

      const atEdgeTouch = (currentPage === 0 || currentPage === pages.length);

      if (engaged.current && atEdgeTouch) {
        engaged.current = false;
        touchStartY.current = null;
        return;
      }

      if (!engaged.current) {
        touchStartY.current = null;
        return;
      }

      // consume event and prevent site scroll
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastFlipTime.current < 400) {
        return;
      }

      if (scrollingDown && pageRef.current < pages.length) {
        setPage(pageRef.current + 1);
        playPageFlipSound();
        lastFlipTime.current = now;
      } else if (scrollingUp && pageRef.current > 0) {
        setPage(pageRef.current - 1);
        playPageFlipSound();
        lastFlipTime.current = now;
      }

      // reset start reference to current finger position for next delta
      touchStartY.current = e.touches[0].clientY;
    };

    const touchOptions = { passive: false, capture: true } as AddEventListenerOptions;

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, touchOptions);
    window.addEventListener('touchmove', handleTouchMove, touchOptions);
    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true } as any);
      window.removeEventListener('touchstart', handleTouchStart, touchOptions);
      window.removeEventListener('touchmove', handleTouchMove, touchOptions);
    };
  }, [containerRef, setPage]);
}; 