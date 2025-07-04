"use client";
import { SectionHeader } from "@/components/SectionHeader";
import { Canvas } from "@react-three/fiber";
import { Book } from "@/components/BookSlider/Book";
import { initializeAudio } from "@/components/BookSlider/sound";
import { useEffect, useRef, useState } from "react";
import { Suspense } from "react";
import { OrbitControls, Float } from "@react-three/drei";
import { useAtom } from "jotai";
import { pageAtom, userInteractedAtom } from "@/components/BookSlider/state";
import Link from "next/link";
// import { useBookScroll } from "@/components/BookSlider/useBookScroll";

export const BookSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [, setPage] = useAtom(pageAtom);
  const [page] = useAtom(pageAtom);
  const [userInteracted] = useAtom(userInteractedAtom);
  const [isTouch, setIsTouch] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [scrollFlipDone, setScrollFlipDone] = useState(false);
  const [scrollReady, setScrollReady] = useState(false);
  const [scrollLockActive, setScrollLockActive] = useState(false);
  const autoFlipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeAudio();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  // Bind wheel-to-page-flip only while the book area is fully visible — disabled for now
  // useBookScroll(bookAreaRef);

  // Helper: is the book canvas fully visible?
  const isBookFullyVisible = () => {
    if (!bookAreaRef.current) return false;
    const rect = bookAreaRef.current.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  };

  // Engage scroll lock only when the book area itself is ~fully visible (≥80%).
  // This avoids sudden auto-scrolling and lets the user arrive naturally.
  useEffect(() => {
    if (!bookAreaRef.current || scrollFlipDone) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.intersectionRatio >= 0.8 && !scrollLockActive) {
          setScrollLockActive(true);
          observer.disconnect();
        }
      },
      { threshold: Array.from({ length: 17 }, (_, i) => i * 0.05) } // 0,0.05,...0.8
    );

    observer.observe(bookAreaRef.current);

    return () => {
      observer.disconnect();
      if (autoFlipTimerRef.current) clearTimeout(autoFlipTimerRef.current);
    };
  }, [scrollLockActive, scrollFlipDone]);

  // Auto-flip once scroll lock is active (runs only once)
  const hasAutoFlipStartedRef = useRef(false);
  useEffect(() => {
    if (!scrollLockActive || hasAutoFlipStartedRef.current) return;

    hasAutoFlipStartedRef.current = true;
    autoFlipTimerRef.current = setTimeout(() => {
        setPage(1);
      if (!userInteracted) setShowRipple(true);
        setTimeout(() => setScrollReady(true), 900);
    }, 1000);

    return () => {
      if (autoFlipTimerRef.current) clearTimeout(autoFlipTimerRef.current);
    };
  }, [scrollLockActive, setPage, userInteracted]);

  // When user interacts, hide the ripple
  useEffect(() => {
    if (userInteracted) {
      setShowRipple(false);
    }
  }, [userInteracted]);

  // Global scroll lock: prevent all wheel / touchmove/ key-scroll while active
  useEffect(() => {
    if (!scrollLockActive) return;

    const preventDefault = (e: Event) => e.preventDefault();
    const preventForKeys = (e: KeyboardEvent) => {
      const keys = [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', preventForKeys, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventDefault as any);
      window.removeEventListener('touchmove', preventDefault as any);
      window.removeEventListener('keydown', preventForKeys as any);

      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [scrollLockActive]);

  // Allow a single wheel scroll to flip from page 1 ➜ 2 after auto flip
  useEffect(() => {
    if (scrollFlipDone) return;

    const handleWheel = (e: WheelEvent) => {
      // If scroll is locked, always prevent default site scrolling
      if (scrollLockActive) {
        e.preventDefault();
      }

      // We only want to flip when we're on page 1 and ready
      if (page !== 1 || scrollFlipDone || !scrollReady) return;

      // consume and flip second page
      e.preventDefault();
      setPage(2);
      setScrollFlipDone(true);
      // release scroll lock after flip animation (~900 ms)
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = setTimeout(() => {
        setScrollLockActive(false);
      }, 900);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (page !== 1 || scrollFlipDone) return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent site scroll while locked
      if (scrollLockActive) {
        e.preventDefault();
      }

      if (page !== 1 || scrollFlipDone) return;
      const startY = touchStartYRef.current;
      if (startY === null) return;

      // Prevent page scroll
      e.preventDefault();

      const deltaY = startY - e.touches[0].clientY; // positive when swiping up
      if (!scrollReady) return;
      if (Math.abs(deltaY) > 40) {
        setPage(2);
        setScrollFlipDone(true);
        if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = setTimeout(() => {
          setScrollLockActive(false);
        }, 900);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel as any);
      window.removeEventListener('touchstart', handleTouchStart as any);
      window.removeEventListener('touchmove', handleTouchMove as any);
      // Do NOT clear unlockTimerRef here; it must complete to release scroll lock
    };
  }, [page, scrollFlipDone, scrollReady, scrollLockActive, setPage]);

  // Pause Lenis smooth scrolling while the lock is active (important because Lenis bypasses overflow hidden)
  useEffect(() => {
    const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
    if (!lenis) return;

    if (scrollLockActive) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [scrollLockActive]);

  // Ensure the book area is centered after lock engages (after lenis stop)
  useEffect(() => {
    if (!scrollLockActive) return;
    // slight timeout to allow lenis.stop() to finish flush
    const id = setTimeout(() => {
      if (isTouch) {
        // On mobile, reveal the heading and avoid showing next section blank space
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Desktop: keep book nicely centred
        bookAreaRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }, 50);
    return () => clearTimeout(id);
  }, [scrollLockActive, isTouch]);

  return (
    <div id="technologies" className="py-20 lg:py-28 bg-[#010a14]" ref={sectionRef}>
      <div className="container text-white">
        <SectionHeader
          eyebrow="Interactive Book"
          title="Explore Our Blogs"
        />
        <div className="-mt-30 h-[600px] relative" ref={bookAreaRef}>
          <Canvas
            camera={{
              position: [0, 0, 4],
              fov: 45,
              near: 0.1,
              far: 1000,
            }}
            shadows
            dpr={[1, 2]}
            className="!bg-transparent"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.8} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <directionalLight
                position={[-5, 5, -5]}
                intensity={0.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              {/* Idle floating motion (no user drag) */}
              <Float
                position={[0, 0, 0.9]}
                rotation-x={-0.5}
                rotation-y={0}
                rotation-z={0}
                floatIntensity={0.5}
                rotationIntensity={0.5}
                speed={1}
              >
                <Book />
              </Float>
              {!isTouch && (
                /* Disable OrbitControls to prevent camera interaction */
                <OrbitControls enabled={false} />
              )}
            </Suspense>
          </Canvas>
          {/* Ripple cue overlay */}
          {showRipple && (
            <div className="pointer-events-none absolute inset-0">
              <div
                className="ripple-animation" 
                style={{
                  position: 'absolute',
                  // Desktop position (fine-pointer devices)
                  ...(isTouch
                    ? {
                        /* TODO: adjust these values for mobile as desired */
                        top: '45%',
                        left: '70%',
                      }
                    : {
                        top: '45%',
                        left: '63%',
                      }),
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          )}
        </div>
        {/* View more blogs button */}
        <div className="-mt-15 flex justify-center relative z-20 pointer-events-auto">
          <Link
            href="/blogs/page/1"
            className="inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010a14]"
          >
            View More Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}; 