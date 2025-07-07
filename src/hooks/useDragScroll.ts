import { useEffect, useRef } from "react";

/**
 * Simple hook that enables click-and-drag as well as touch swiping to scroll a container horizontally.
 * Usage: const ref = useDragScroll(); then <div ref={ref}>…</div>
 */
export const useDragScroll = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const start = (pageX: number) => {
      isDown = true;
      startX = pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };

    const stop = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    const onMouseDown = (e: MouseEvent) => {
      start(e.pageX);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1; // 1 = scroll-speed ratio
      el.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = stop;
    const onMouseLeave = stop;

    const onTouchStart = (e: TouchEvent) => {
      start(e.touches[0].pageX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - el.offsetLeft;
      const walk = (x - startX) * 1;
      el.scrollLeft = scrollLeft - walk;
    };

    const onTouchEnd = stop;

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return ref;
}; 