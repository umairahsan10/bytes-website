import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { PerspectiveCamera, Environment, Sky, Cloud, Clouds } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

// Enhanced camera path for dramatic FPV drone flight
const createCameraPath = () => {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-80, 20, 100),
    new THREE.Vector3(-50, 35, 60),
    new THREE.Vector3(-20, 45, 30),
    new THREE.Vector3(10, 40, 0),
    new THREE.Vector3(30, 35, -30),
    new THREE.Vector3(20, 30, -60),
    new THREE.Vector3(0, 25, -80),
    new THREE.Vector3(-20, 20, -90),
    new THREE.Vector3(-40, 18, -100),
  ]);
};

function DroneCamera({ scroll }: { scroll: MotionValue<number> }) {
  const ref = useRef<THREE.PerspectiveCamera>(null!);
  const path = useMemo(() => createCameraPath(), []);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.get(), 0, 1);
    const pos = path.getPoint(t);
    const lookAhead = Math.min(t + 0.08, 1);
    const look = path.getPoint(lookAhead);
    
    // Smooth camera movement with more realistic FPV feel
    ref.current.position.lerp(pos, 0.08);
    ref.current.lookAt(look);
    
    // Enhanced camera shake for realistic FPV drone movement
    const time = Date.now() * 0.001;
    const shake = 0.015;
    const windShake = Math.sin(time * 10) * 0.005;
    
    ref.current.position.x += (Math.random() - 0.5) * shake + windShake;
    ref.current.position.y += (Math.random() - 0.5) * shake + windShake;
    ref.current.position.z += (Math.random() - 0.5) * shake;
    
    // Add slight tilt for more dynamic movement
    ref.current.rotation.z = Math.sin(time * 5) * 0.02;
  });

  return <PerspectiveCamera ref={ref} makeDefault fov={75} near={0.1} far={1000} />;
}

function MountainRange() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(300, 200, 300, 300);
    const position = geo.attributes.position;
    const colors = new Float32Array(position.count * 3);
    
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      
      // Create more dramatic and varied mountain peaks
      const baseHeight = 30 * Math.exp(-0.0002 * (x * x + y * y));
      const peak1 = 20 * Math.sin(0.03 * x) * Math.cos(0.03 * y);
      const peak2 = 12 * Math.sin(0.06 * x + 1.2) * Math.cos(0.06 * y - 0.8);
      const peak3 = 8 * Math.sin(0.09 * x - 0.5) * Math.cos(0.09 * y + 1.1);
      const peak4 = 6 * Math.sin(0.12 * x + 0.3) * Math.cos(0.12 * y - 0.2);
      
      const height = Math.max(0, baseHeight + peak1 + peak2 + peak3 + peak4);
      position.setZ(i, height);
      
      // Create color based on height for better visual variety
      const colorIndex = i * 3;
      if (height > 25) {
        // Snow peaks
        colors[colorIndex] = 1.0;     // R
        colors[colorIndex + 1] = 1.0; // G
        colors[colorIndex + 2] = 1.0; // B
      } else if (height > 15) {
        // Rocky peaks
        colors[colorIndex] = 0.6;     // R
        colors[colorIndex + 1] = 0.6; // G
        colors[colorIndex + 2] = 0.6; // B
      } else if (height > 8) {
        // Lower slopes
        colors[colorIndex] = 0.4;     // R
        colors[colorIndex + 1] = 0.5; // G
        colors[colorIndex + 2] = 0.3; // B
      } else {
        // Base
        colors[colorIndex] = 0.3;     // R
        colors[colorIndex + 1] = 0.4; // G
        colors[colorIndex + 2] = 0.2; // B
      }
    }
    
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.1, 0, 0]} position={[0, -15, 0]} castShadow receiveShadow>
      <meshStandardMaterial
        vertexColors={true}
        roughness={0.7}
        metalness={0.1}
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
              float height = vViewPosition.y + 15.0;
              float snow = smoothstep(20.0, 30.0, height);
              float rock = smoothstep(10.0, 20.0, height);
              float grass = smoothstep(5.0, 10.0, height);
              
              vec3 snowColor = vec3(1.0, 1.0, 1.0);
              vec3 rockColor = vec3(0.5, 0.5, 0.5);
              vec3 grassColor = vec3(0.3, 0.4, 0.2);
              vec3 baseColor = vec3(0.2, 0.3, 0.1);
              
              vec3 finalColor = mix(baseColor, grassColor, grass);
              finalColor = mix(finalColor, rockColor, rock);
              finalColor = mix(finalColor, snowColor, snow);
              
              // Add some variation based on position
              float variation = sin(vUv.x * 50.0) * sin(vUv.y * 50.0) * 0.1;
              finalColor += variation;
              
              gl_FragColor.rgb = finalColor;
              #include <dithering_fragment>
            `
          );
        }}
      />
    </mesh>
  );
}

function FloatingClouds() {
  return (
    <Clouds>
      <Cloud opacity={0.5} speed={0.4} scale={10} segments={20} position={[-20, 40, -30]} />
      <Cloud opacity={0.3} speed={0.2} scale={15} segments={25} position={[30, 35, -20]} />
      <Cloud opacity={0.4} speed={0.3} scale={12} segments={22} position={[-10, 45, -50]} />
      <Cloud opacity={0.6} speed={0.1} scale={8} segments={18} position={[40, 30, -40]} />
    </Clouds>
  );
}

function SunLight() {
  const sunRef = useRef<THREE.Group>(null!);
  const sunMeshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    sunRef.current.position.x = Math.sin(time * 0.05) * 40;
    sunRef.current.position.y = 80 + Math.sin(time * 0.03) * 15;
    sunRef.current.position.z = Math.cos(time * 0.07) * 30;
    
    // Rotate the sun
    sunRef.current.rotation.z = time * 0.1;
    
    // Animate the glow
    if (glowRef.current && glowRef.current.material) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group ref={sunRef} position={[0, 80, 0]}>
      {/* Sun glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial 
          color="#ffd700" 
          transparent 
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Main sun sphere */}
      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[8, 64, 64]} />
        <meshBasicMaterial 
          color="#ffd700"
          onBeforeCompile={(shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <dithering_fragment>',
              `
                vec3 sunColor = vec3(1.0, 0.8, 0.2);
                float intensity = 1.0 + sin(vUv.x * 20.0) * sin(vUv.y * 20.0) * 0.3;
                gl_FragColor.rgb = sunColor * intensity;
                gl_FragColor.a = 1.0;
                #include <dithering_fragment>
              `
            );
          }}
        />
      </mesh>
      
      {/* Sun rays */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[0, 0, (i * Math.PI) / 4]}>
          <cylinderGeometry args={[0.1, 0.1, 20, 8]} />
          <meshBasicMaterial 
            color="#ffd700" 
            transparent 
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function FpvMountains({ scroll }: { scroll: MotionValue<number> }) {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2,
        background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)',
      }}
      shadows
      gl={{ antialias: true, alpha: false }}
    >
      <DroneCamera scroll={scroll} />
      
      {/* Enhanced Lighting System */}
      <ambientLight intensity={0.4} color="#87CEEB" />
      
      {/* Main directional light (sun) */}
      <directionalLight
        position={[50, 100, 50]}
        intensity={3.0}
        castShadow
        color="#fffbe6"
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={300}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light for better shadows */}
      <directionalLight
        position={[-30, 60, -30]}
        intensity={1.0}
        color="#e6f3ff"
      />
      
      {/* Rim light for dramatic effect */}
      <directionalLight
        position={[0, 40, -100]}
        intensity={0.8}
        color="#ffd700"
      />
      
      {/* Enhanced Sky and Atmosphere */}
      <Sky
        distance={450000}
        sunPosition={[0.5, 0.8, 0.3]}
        inclination={0.4}
        azimuth={0.3}
        rayleigh={0.8}
        turbidity={8}
        mieCoefficient={0.003}
        mieDirectionalG={0.9}
      />
      
      {/* Sun */}
      <SunLight />
      
      {/* Mountains */}
      <MountainRange />
      
      {/* Clouds */}
      <FloatingClouds />
      
      {/* Enhanced Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -15, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial 
          color="#2d5016" 
          transparent 
          opacity={0.9}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Atmospheric fog effect */}
      <fog attach="fog" args={['#87CEEB', 100, 400]} />
    </Canvas>
  );
} 