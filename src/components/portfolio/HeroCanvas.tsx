"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Mesh, Group } from "three";

function FloatingCore() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.12 + pointer.y * 0.4;
    meshRef.current.rotation.y = t * 0.18 + pointer.x * 0.4;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#915EFF"
          emissive="#915EFF"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing({ radius, speed, color, thickness }: { radius: number; speed: number; color: string; thickness: number }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.x = t * speed * 0.3;
    groupRef.current.rotation.y = t * speed;
    groupRef.current.rotation.z = Math.sin(t * speed * 0.5) * 0.3;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[radius, thickness, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

function FloatingParticle({ position, size, speed, color }: { position: [number, number, number]; size: number; speed: number; color: string }) {
  const meshRef = useRef<Mesh>(null);
  const initialPos = useRef(position);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.x = initialPos.current[0] + Math.sin(t * speed) * 0.6;
    meshRef.current.position.y = initialPos.current[1] + Math.cos(t * speed * 1.3) * 0.8;
    meshRef.current.position.z = initialPos.current[2] + Math.sin(t * speed * 0.7) * 0.4;
  });

  return (
    <Float speed={speed * 2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={size}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="w-full h-full relative">
      {/* Glow behind */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[550px] h-[550px] rounded-full bg-accent/15 blur-[140px]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-cyan/10 blur-[100px] translate-x-20 -translate-y-10" />
      </div>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#915EFF" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#00D4FF" />
        <pointLight position={[0, 5, -5]} intensity={0.3} color="#FF6B35" />

        <FloatingCore />
        <OrbitRing radius={2.4} speed={0.4} color="#915EFF" thickness={0.02} />
        <OrbitRing radius={3.0} speed={-0.25} color="#00D4FF" thickness={0.015} />
        <OrbitRing radius={2.7} speed={0.3} color="#FF6B35" thickness={0.012} />

        <FloatingParticle position={[2.2, 1.5, -1]} size={0.12} speed={0.8} color="#00D4FF" />
        <FloatingParticle position={[-2.0, -1.2, 0.5]} size={0.1} speed={1.0} color="#915EFF" />
        <FloatingParticle position={[1.5, -1.8, 1]} size={0.08} speed={1.2} color="#FF6B35" />
        <FloatingParticle position={[-1.8, 1.0, -0.5]} size={0.15} speed={0.6} color="#00D4FF" />
        <FloatingParticle position={[0.8, 2.2, 0.3]} size={0.09} speed={0.9} color="#915EFF" />
        <FloatingParticle position={[-2.5, 0.3, 0.8]} size={0.07} speed={1.1} color="#FF6B35" />
      </Canvas>
    </div>
  );
}
