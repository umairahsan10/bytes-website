import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import { Book } from "./Book";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { pageAtom } from "./state";
import { useThree } from "@react-three/fiber";

export const Experience = () => {
  const [page] = useAtom(pageAtom);
  const { camera } = useThree();

  useEffect(() => {
    // Prevent ALL wheel events
    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Lock camera position
    camera.position.set(0, 0, 2.5);
    camera.updateProjectionMatrix();

    window.addEventListener('wheel', preventWheel, { passive: false });
    return () => window.removeEventListener('wheel', preventWheel);
  }, [camera]);

  return (
    <>
      <Float
        position={[0, 0, 0]}
        rotation={[0, page === 0 ? Math.PI : 0, 0]}
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