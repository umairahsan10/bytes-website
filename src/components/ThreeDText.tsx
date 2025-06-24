'use client';

import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AnimatedText() {
  const bytesRef = useRef<THREE.Mesh>(null);
  const platformRef = useRef<THREE.Mesh>(null);

  // Responsive sizing based on screen width
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 });
  
  useEffect(() => {
    const updateSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate responsive font sizes
  const getResponsiveSizes = () => {
    const { width, height } = screenSize;
    
    if (width < 480) {
      // Phone - Both BYTES and PLATFORM moved down 50px
      return {
        bytesFontSize: 7.0, // 2x of 3.5
        platformFontSize: 3.0, // 2x of 1.5
        bytesPosition: [0, 4.0, 0] as [number, number, number], // Moved down 50px from 4.8
        platformPosition: [0, -4.3, 0] as [number, number, number], // Moved down 50px from -3.5
      };
    } else if (width < 768) {
      // Small tablet - Both BYTES and PLATFORM moved down 50px
      return {
        bytesFontSize: 7.0, // 2x of 3.5
        platformFontSize: 2.8, // 2x of 1.4
        bytesPosition: [0, 4.5, 0] as [number, number, number], // Moved down 50px from 5.3
        platformPosition: [0, -4.0, 0] as [number, number, number], // Moved down 50px from -3.2
      };
    } else if (width < 1024) {
      // Tablet/small laptop - Both BYTES and PLATFORM moved down 50px
      return {
        bytesFontSize: 9.0, // 2x of 4.5
        platformFontSize: 3.6, // 2x of 1.8
        bytesPosition: [0, 5.0, 0] as [number, number, number], // Moved down 50px from 5.8
        platformPosition: [0, -3.8, 0] as [number, number, number], // Moved down 50px from -3.0
      };
    } else {
      // Desktop and larger - Both BYTES and PLATFORM moved down 50px
      const viewportScale = Math.min(width, height) * 0.016; // 2x the scale (was 0.008)
      return {
        bytesFontSize: Math.max(viewportScale * 1.5, 16.0), // 2x minimum (was 8.0)
        platformFontSize: Math.max(viewportScale * 0.5, 5.0), // 2x minimum (was 2.5)
        bytesPosition: [0, 5.5, 0] as [number, number, number], // Moved down 50px from 6.3
        platformPosition: [0, -3.3, 0] as [number, number, number], // Moved down 50px from -2.5
      };
    }
  };

  const sizes = getResponsiveSizes();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (bytesRef.current) {
      bytesRef.current.position.y = sizes.bytesPosition[1] + Math.sin(time * 0.8) * 0.1;
      bytesRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
    }
    
    if (platformRef.current) {
      platformRef.current.position.y = sizes.platformPosition[1] + Math.cos(time * 0.6) * 0.08;
      platformRef.current.rotation.y = Math.cos(time * 0.4) * 0.03;
    }
  });

  return (
    <>
      {/* BYTES. - MASSIVE text */}
      <Text
        ref={bytesRef}
        font="/fonts/PPNeueMontreal-Bold.otf"
        fontSize={sizes.bytesFontSize}
        position={sizes.bytesPosition}
        anchorX="center"
        anchorY="middle"
        maxWidth={15}
      >
        BYTES.
        <meshStandardMaterial
          color="#FFFFFF"
          metalness={0.3}
          roughness={0.4}
          emissive="#E5E5E5"
          emissiveIntensity={0.1}
        />
      </Text>

      {/* PLATFORM - Smaller text, well below BYTES */}
      <Text
        ref={platformRef}
        font="/fonts/PPNeueMontreal-Bold.otf"
        fontSize={sizes.platformFontSize}
        position={sizes.platformPosition}
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        letterSpacing={0.05}
      >
        PLATFORM
        <meshStandardMaterial
          color="#F5F5F5"
          metalness={0.2}
          roughness={0.5}
          emissive="#D4D4D4"
          emissiveIntensity={0.05}
        />
      </Text>

      {/* Lighting */}
      <ambientLight intensity={0.6} color="#FFFFFF" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#FFFFFF"
        castShadow
      />
      <pointLight
        position={[-10, -10, -5]}
        intensity={0.8}
        color="#FFFFFF"
      />
      <spotLight
        position={[0, 10, 10]}
        intensity={1.2}
        color="#FFFFFF"
        angle={0.3}
        penumbra={0.5}
      />
    </>
  );
}

const ThreeDText: React.FC = () => {
  return (
    <div className="w-full h-full relative" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ 
          position: [0, 0, 16], // Move camera even further back to see all text
          fov: 70, // Even wider field of view to prevent cutoff
          near: 0.1,
          far: 1000
        }}
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <AnimatedText />
      </Canvas>
      
      {/* Subtitle positioned below the 3D scene - moved down 40px */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 text-center w-full px-4"
        style={{ 
          pointerEvents: 'none', 
          userSelect: 'none',
          bottom: '-24px' // Moved down 40px from bottom-4 (16px) to -24px
        }}
      >
        <p className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-white/90 tracking-[0.15em] uppercase">
          GET YOUR DIGITAL SOLUTION FROM US TODAY!
        </p>
      </div>
    </div>
  );
};

export default ThreeDText; 