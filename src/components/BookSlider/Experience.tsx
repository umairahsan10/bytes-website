import { Environment, Float } from "@react-three/drei";
import { Book } from "./Book";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
// import { useBookScroll } from "./useBookScroll";

export const Experience = () => {
  const { camera } = useThree();

  // Enable wheel-to-page-flip globally (full-screen so no container needed) — disabled
  // useBookScroll();

  useEffect(() => {
    // Lock camera position
    camera.position.set(0, 0, 2.5);
    camera.updateProjectionMatrix();
  }, [camera]);

  return (
    <>
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
      <Environment preset="studio" />
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
}; 