"use client";
import { SectionHeader } from "@/components/SectionHeader";
import { Canvas } from "@react-three/fiber";
import { Book } from "@/components/BookSlider/Book";
import { initializeAudio } from "@/components/BookSlider/sound";
import { useEffect, useRef, useState } from "react";
import { Suspense } from "react";
import { OrbitControls, Float } from "@react-three/drei";
import { useAtom } from "jotai";
import { pageAtom } from "@/components/BookSlider/state";
import { useBookScroll } from "@/components/BookSlider/useBookScroll";

export const BookSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [, setPage] = useAtom(pageAtom);

  useEffect(() => {
    initializeAudio();
  }, []);

  // Bind wheel-to-page-flip only while the book area is fully visible
  useBookScroll(bookAreaRef);

  // Observe when the book section enters the viewport and trigger first-page flip
  useEffect(() => {
    if (!sectionRef.current || hasTriggered) return;

    let timer: NodeJS.Timeout | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setHasTriggered(true);
          // Delay a bit so the user sees the book before flipping
          timer = setTimeout(() => setPage(1), 2500);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    // Clean up
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [hasTriggered, setPage]);

  // Fallback scroll listener in case IntersectionObserver misses
  useEffect(() => {
    if (hasTriggered) return;
    const onScroll = () => {
      if (hasTriggered || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      if (visible) {
        setHasTriggered(true);
        setTimeout(() => setPage(1), 2500);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll);
    // run once on mount
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasTriggered, setPage]);

  return (
    <div id="book" className="py-20 lg:py-28" ref={sectionRef}>
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
              {/* Float gives a gentle idle motion */}
              <Float
                position={[0, 0, 0.9]}
                rotation-x={-0.5}
                rotation-y={0}
                rotation-z={0}
                floatIntensity={0.5}
                speed={1}
                rotationIntensity={1}
              >
                <Book />
              </Float>
              <OrbitControls
                enableZoom={false}
                enablePan={true}
                minDistance={3}
                maxDistance={6}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI * 3/4}
                target={[0, 0, 0]}
                enableDamping={true}
                dampingFactor={0.05}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}; 