"use client";
import { SectionHeader } from "@/components/SectionHeader";
import { Canvas } from "@react-three/fiber";
import { Book } from "@/components/BookSlider/Book";
import { initializeAudio } from "@/components/BookSlider/sound";
import { useEffect } from "react";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

export const BookSection = () => {
  useEffect(() => {
    initializeAudio();
  }, []);

  return (
    <div id="book" className="py-20 lg:py-28">
      <div className="container">
        <SectionHeader
          eyebrow="Interactive Book"
          title="Explore Our Story"
          description="Click through the pages to discover our journey"
        />
        <div className="mt-20 h-[600px] relative">
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
              <Book position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                minDistance={3}
                maxDistance={6}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI * 3/4}
                target={[0, 0, 0]}
                enableDamping={true}
                dampingFactor={0.05}
                initialPosition={[0, 0, 4]}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}; 