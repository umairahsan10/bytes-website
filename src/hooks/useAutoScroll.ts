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

    let speed = baseSpeed; // px / frame
    // Current scroll velocity (px per frame). Will increase during a drag
    // then gradually ease back to the baseline `baseSpeed`.
    let targetSpeed = baseSpeed;
    let isDragging = false; // active pointer down & move gesture
    let isHovering = false; // pointer is over the container (mouse) or finger touching (touch)
    let startX = 0;
    let startScrollLeft = 0;
    let lastX = 0;
    let lastTs = 0;

    /* -------------------------- Autoplay --------------------------- */
    const step = () => {
      if (!isDragging && !isHovering) {
        // Ease speed back toward the base speed (inertia / friction)
        speed += (baseSpeed - speed) * 0.05; // 0.05 smoothing factor
        el.scrollLeft += speed;
      }
      const singleLoop = el.scrollWidth / 2; // since content is duplicated
      if (el.scrollLeft >= singleLoop) {
        el.scrollLeft -= singleLoop;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += singleLoop;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    /* --------------------------- Dragging -------------------------- */
    const getPageX = (e: PointerEvent) => e.pageX;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      speed = 0; // immediately halt ongoing auto-scroll while holding
      startX = getPageX(e);
      startScrollLeft = el.scrollLeft;
      lastX = startX;
      lastTs = performance.now();
      el.setPointerCapture(e.pointerId);
      el.classList.add("cursor-grabbing");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const currentX = getPageX(e);
      const delta = currentX - startX;

      if (delta < 0) {
        el.scrollLeft = startScrollLeft - delta;
      }

      // velocity-based speed update
      const now = performance.now();
      const dt = now - lastTs;
      if (dt > 0) {
        const vx = (lastX - currentX) / dt; // px per ms (positive for forward drags)

        // Convert instantaneous velocity into scroll/frame speed and apply it directly.
        const flingSpeed = baseSpeed + vx * 50; // tune factor 50 for sensitivity
        speed = Math.max(baseSpeed, flingSpeed);
      }
      lastX = currentX;
      lastTs = now;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      el.releasePointerCapture(e.pointerId);
      // If no significant fling occurred, resume baseline speed.
      if (speed === 0) {
        speed = baseSpeed;
      }
      el.classList.remove("cursor-grabbing");
    };

    /* --------------------------- Hover / Press pause --------------------------- */
    const onPointerEnter = () => {
      isHovering = true;
    };
    const onPointerLeave = () => {
      isHovering = false;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [baseSpeed]);

  return ref;
}; 