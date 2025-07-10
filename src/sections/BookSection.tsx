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
import "./bookSection.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// import { useBookScroll } from "@/components/BookSlider/useBookScroll";

gsap.registerPlugin(ScrollTrigger);

export const BookSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [, setPage] = useAtom(pageAtom);
  const [page] = useAtom(pageAtom);
  const [userInteracted] = useAtom(userInteractedAtom);
  const [isTouch, setIsTouch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
      setIsMobile(window.innerWidth < 768); // 768px is typical mobile breakpoint
      
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
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

  // Configurable intersection threshold - adjust this value to find the sweet spot
  const INTERSECTION_THRESHOLD = 0.80; // Try: 0.8, 0.85, 0.9, 0.95

  // Engage scroll lock with configurable threshold to prevent skipping
  useEffect(() => {
    if (!bookAreaRef.current || scrollFlipDone) return;

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        // Trigger when section reaches the configurable threshold
        if (entry.intersectionRatio >= INTERSECTION_THRESHOLD && !scrollLockActive && !hasTriggered) {
          hasTriggered = true;
          setScrollLockActive(true);
          observer.disconnect();
        }
      },
      { threshold: [INTERSECTION_THRESHOLD - 0.05, INTERSECTION_THRESHOLD, INTERSECTION_THRESHOLD + 0.05] }
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

  // GSAP ScrollTrigger handles smooth pinning - no need for aggressive scroll prevention

  // Allow a single wheel scroll to flip from page 1 ➜ 2 after auto flip
  useEffect(() => {
    if (scrollFlipDone) return;

    const handleWheel = (e: WheelEvent) => {
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
      if (page !== 1 || scrollFlipDone) return;
      const startY = touchStartYRef.current;
      if (startY === null) return;

      const deltaY = startY - e.touches[0].clientY; // positive when swiping up
      if (!scrollReady) return;
      if (Math.abs(deltaY) > 40) {
        e.preventDefault();
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
  }, [page, scrollFlipDone, scrollReady, setPage]);

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

  // Ensure the book area is centered when lock engages (smoother approach)
  useEffect(() => {
    if (!scrollLockActive) return;
    
    // Smooth centering with a small delay
    const id = setTimeout(() => {
      if (isTouch) {
        // On mobile, reveal the heading and avoid showing next section blank space
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Desktop: center the book smoothly
        bookAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100); // Small delay for smoother transition
    
    return () => clearTimeout(id);
  }, [scrollLockActive, isTouch]);

  return (
    <div
      id="technologies"
      className="min-h-screen py-0 sm:py-20 lg:py-28 bg-[#010a14] bg-center bg-no-repeat bg-cover book-tall-center"
      ref={sectionRef}
      style={{
        backgroundImage: isMobile 
          ? "url('/assets/Book/mobile_bg.png')"
          : "url('/assets/Book/desktop_bg.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="flex flex-col items-center justify-center w-full px-4 text-white">
        <SectionHeader
          eyebrow=""
          title="Explore Our Blogs"
        />
        <div
          className="relative flex items-center justify-center w-full h-[600px] max-w-full mx-auto sm:w-full sm:h-[600px] w-[95vw] h-[60vw] max-h-[70vh]"
          ref={bookAreaRef}
        >
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
                        left: '57%',
                      }),
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          )}
        </div>
        {/* View more blogs button */}
        <div className="flex justify-center relative z-20 pointer-events-auto w-full mt-20">
          <Link
            href="/blogs/page/1"
            className="inline-block rounded-full bg-gradient-to-r from-black to-gray-600 px-8 py-3 text-base font-semibold text-white shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-gradient-to-r hover:from-gray-600 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            View&nbsp;More&nbsp;Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};