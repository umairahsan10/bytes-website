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
// import { useBookScroll } from "@/components/BookSlider/useBookScroll";

export const BookSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [, setPage] = useAtom(pageAtom);
  const [userInteracted] = useAtom(userInteractedAtom);
  const [isTouch, setIsTouch] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

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

  // Observe when the book section enters the viewport and trigger first-page flip
  useEffect(() => {
    if (!sectionRef.current || hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.intersectionRatio >= 0.4) {
          setHasTriggered(true);
          // Flip immediately with no delay when 40% of section is visible
          setPage(1);
          if (!userInteracted) {
            setShowRipple(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(sectionRef.current);

    // Clean up
    return () => {
      observer.disconnect();
    };
  }, [hasTriggered, setPage, userInteracted]);

  // Fallback scroll listener in case IntersectionObserver misses
  useEffect(() => {
    if (hasTriggered) return;
    const onScroll = () => {
      if (hasTriggered || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const visibleRatio = visibleHeight / rect.height;
      if (visibleRatio >= 0.4) {
        setHasTriggered(true);
        setPage(1);
        if (!userInteracted) {
          setShowRipple(true);
        }
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll);
    // run once on mount
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasTriggered, setPage, userInteracted]);

  // When user interacts, hide the ripple
  useEffect(() => {
    if (userInteracted) {
      setShowRipple(false);
    }
  }, [userInteracted]);

  return (
    <div id="technologies" className="py-20 lg:py-28" ref={sectionRef}>
      <div className="container">
        <SectionHeader
          eyebrow="Interactive Book"
          title="Explore Our Story"
          description="Click through the pages to discover our journey"
        />
        <div className="mt-20 h-[600px] relative" ref={bookAreaRef}>
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
              {/*
               * Float wrapper disabled for now to keep the book fixed.
               * Re-enable by uncommenting the block below and removing the static group.
               *
               * <Float
               *   position={[0, 0, 0.9]}
               *   rotation-x={-0.5}
               *   rotation-y={0}
               *   rotation-z={0}
               *   floatIntensity={0.5}
               *   speed={1}
               *   rotationIntensity={1}
               * >
               *   <Book />
               * </Float>
               */}
              <group
                position={[0, 0, 0.9]}
                rotation-x={-0.5}
                rotation-y={0}
                rotation-z={0}
              >
                <Book />
              </group>
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
      </div>
    </div>
  );
}; 