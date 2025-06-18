import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Experience } from "./Experience";
import { initializeAudio } from "./sound";

function App() {
  useEffect(() => {
    // Initialize audio system on app load (but don't enable it)
    initializeAudio();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Loader />
      <Canvas
        shadows
        camera={{
          position: [0, 0, 2.5],
          fov: 45,
        }}
        className="h-full w-full"
      >
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}

export default App; 