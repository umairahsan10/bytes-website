import { useEffect, useRef } from "react";

/**
 * Hook that automatically scrolls a container horizontally in an infinite loop.
 * Users can drag / swipe to temporarily accelerate or decelerate the scroll speed.
 *
 * @param baseSpeed  baseline px per frame (approx) at which the container auto-scrolls.
 * @returns ref to attach to the scrolling element.
 */
export const useAutoScroll = <T extends HTMLElement>(baseSpeed = 0.5) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Current scroll velocity (px / frame). It is animated every frame and
    // gradually interpolates back to the provided `baseSpeed` when the user
    // is not interacting.
    let speed = baseSpeed;
    let isPointerDown = false; // pointer is pressed (holding or dragging)
    let isDragging = false; // became true after surpassing movement threshold (actively dragging)
    let isHovering = false; // reserved (not used but kept for future)
    let startX = 0;
    let startScrollLeft = 0;
    let lastX = 0;
    let lastTs = 0;

    const dragThreshold = 5; // pixels before we treat as an actual drag

    /* -------------------------- Autoplay --------------------------- */
    const step = () => {
      const shouldAuto = !isPointerDown && !isHovering;

      if (shouldAuto) {
        // Ease speed back toward the baseline speed.
        speed += (baseSpeed - speed) * 0.04;
        el.scrollLeft += speed;
      }

      // Only perform seamless looping when auto-scrolling (prevents jumps while holding)
      if (shouldAuto && !isDragging) {
        const singleLoop = el.scrollWidth / 2;
        if (el.scrollLeft >= singleLoop) {
          el.scrollLeft -= singleLoop;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += singleLoop;
        }
      }

      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    /* --------------------------- Dragging -------------------------- */
    const getPageX = (e: PointerEvent) => e.pageX;

    const onPointerDown = (e: PointerEvent) => {
      // Prevent browser-native behaviors (e.g., drag image, text selection)
      e.preventDefault();
      isPointerDown = true;
      isDragging = false; // will become true once movement exceeds threshold
      speed = 0; // halt auto-scroll while pointer is held
      startX = getPageX(e);
      startScrollLeft = el.scrollLeft;
      lastX = startX;
      lastTs = performance.now();
      el.setPointerCapture(e.pointerId);
      el.classList.add("cursor-grabbing");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;

      const currentX = getPageX(e);
      const delta = currentX - startX;

      // Only start actual dragging after surpassing threshold *and* moving left (delta negative)
      if (!isDragging && delta <= -dragThreshold) {
        isDragging = true;
      }

      if (isDragging) {
        if (delta < 0) {
          // Apply scroll only for leftward movement
          el.scrollLeft = startScrollLeft - delta;

          // --- Determine velocity (px/ms) for inertia ---
          const now = performance.now();
          const dt = now - lastTs;
          if (dt > 0) {
            const vx = (lastX - currentX) / dt; // positive when dragging left
            speed = vx * 1000 / 60; // px/frame
          }

          lastX = currentX;
          lastTs = performance.now();
        } else {
          // Prevent rightward drag influence
          el.scrollLeft = startScrollLeft;
          speed = 0;
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasDragging = isDragging;
      isPointerDown = false;
      isDragging = false;
      el.releasePointerCapture(e.pointerId);
      if (!wasDragging) {
        // For a simple tap/hold (no drag), immediately resume baseline speed
        speed = baseSpeed;
      } else {
        // If it was a fling/drag, keep the inertia (speed already set)
        if (Math.abs(speed) < 0.1) {
          speed = baseSpeed;
        }
      }
      el.classList.remove("cursor-grabbing");
    };

    /* --------------------------- Wheel Guard --------------------------- */
    const onWheel = (e: WheelEvent) => {
      // If the gesture contains a horizontal component greater than the vertical one,
      // treat it as an attempt to horizontally scroll the gallery. Prevent it from
      // affecting layout so page position stays intact.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    el.addEventListener("pointerdown", onPointerDown, { passive: false, capture: true });
    el.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [baseSpeed]);

  return ref;
}; 