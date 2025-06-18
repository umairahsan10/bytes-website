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

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    const isElementInViewport = (): boolean => {
      if (!containerRef?.current) return false;
      const rect = containerRef.current.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const isElementCentered = (): boolean => {
      if (!containerRef?.current) return true;
      const rect = containerRef.current.getBoundingClientRect();
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

      const partiallyVisible = inViewport && !centered;

      const scrollingTowardBook = (scrollingDown && elemCenter > viewportCenter) || (scrollingUp && elemCenter < viewportCenter);

      // Allow normal scroll if outside viewport and not already engaged
      if (!inViewport && !engaged.current) return;

      // Engage only when element is centered
      if (centered) {
        engaged.current = true;
      }

      const currentPage = pageRef.current;

      // If partially visible, intercept scroll and snap into center
      if (partiallyVisible && !engaged.current && scrollingTowardBook) {
        e.preventDefault();
        e.stopPropagation();
        containerRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Determine if we reached boundaries to release engagement
      const atBoundary =
        (scrollingUp && currentPage === 0) ||
        (scrollingDown && currentPage === pages.length);

      if (engaged.current && atBoundary) {
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

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", handleWheel, { capture: true } as any);
  }, [containerRef, setPage]);
}; 