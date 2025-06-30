import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import { PerspectiveCamera, Sky, Cloud, Clouds, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

// Advanced terrain generation using noise
const generateTerrain = (width: number, height: number, segments: number) => {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const normals = new Float32Array(position.count * 3);
  
  // Multiple noise layers for realistic terrain
  const noise1 = (x: number, y: number) => Math.sin(x * 0.02) * Math.cos(y * 0.02) * 20;
  const noise2 = (x: number, y: number) => Math.sin(x * 0.05 + 1.2) * Math.cos(y * 0.05 - 0.8) * 12;
  const noise3 = (x: number, y: number) => Math.sin(x * 0.1 - 0.5) * Math.cos(y * 0.1 + 1.1) * 8;
  const noise4 = (x: number, y: number) => Math.sin(x * 0.15 + 0.3) * Math.cos(y * 0.15 - 0.2) * 6;
  
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    
    // Combine multiple noise layers for realistic mountains
    const height = Math.max(0, 
      noise1(x, y) + noise2(x, y) + noise3(x, y) + noise4(x, y) +
      35 * Math.exp(-0.00015 * (x * x + y * y)) // Base mountain shape
    );
    
    position.setZ(i, height);
    
    // Calculate normal for better lighting
    const nx = Math.cos(x * 0.1) * 0.5;
    const ny = Math.cos(y * 0.1) * 0.5;
    const nz = 1.0;
    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    
    normals[i * 3] = nx / length;
    normals[i * 3 + 1] = ny / length;
    normals[i * 3 + 2] = nz / length;
    
    // Advanced color mapping based on height and position
    const colorIndex = i * 3;
    if (height > 30) {
      // Snow peaks with variation
      const snowVar = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.1;
      colors[colorIndex] = 1.0 + snowVar;     // R
      colors[colorIndex + 1] = 1.0 + snowVar; // G
      colors[colorIndex + 2] = 1.0 + snowVar; // B
    } else if (height > 20) {
      // Rocky peaks with texture
      const rockVar = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 0.2;
      colors[colorIndex] = 0.6 + rockVar;     // R
      colors[colorIndex + 1] = 0.6 + rockVar; // G
      colors[colorIndex + 2] = 0.6 + rockVar; // B
    } else if (height > 12) {
      // Alpine meadows
      colors[colorIndex] = 0.3;     // R
      colors[colorIndex + 1] = 0.5; // G
      colors[colorIndex + 2] = 0.2; // B
    } else if (height > 6) {
      // Lower slopes
      colors[colorIndex] = 0.4;     // R
      colors[colorIndex + 1] = 0.6; // G
      colors[colorIndex + 2] = 0.3; // B
    } else {
      // Base forest
      colors[colorIndex] = 0.2;     // R
      colors[colorIndex + 1] = 0.3; // G
      colors[colorIndex + 2] = 0.1; // B
    }
  }
  
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.computeVertexNormals();
  
  return geometry;
};

// Cinematic camera path with multiple waypoints
const createCinematicPath = () => {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-100, 25, 120),
    new THREE.Vector3(-70, 40, 80),
    new THREE.Vector3(-40, 55, 40),
    new THREE.Vector3(-10, 50, 10),
    new THREE.Vector3(20, 45, -20),
    new THREE.Vector3(40, 40, -50),
    new THREE.Vector3(30, 35, -80),
    new THREE.Vector3(10, 30, -100),
    new THREE.Vector3(-10, 25, -110),
    new THREE.Vector3(-30, 20, -120),
    new THREE.Vector3(-50, 18, -130),
  ]);
};

// Advanced FPV Camera with cinematic movement
function CinematicCamera({ scroll }: { scroll: MotionValue<number> }) {
  const ref = useRef<THREE.PerspectiveCamera>(null!);
  const path = useMemo(() => createCinematicPath(), []);
  const velocityRef = useRef(new THREE.Vector3());
  const targetRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = THREE.MathUtils.clamp(scroll.get(), 0, 1);
    const pos = path.getPoint(t);
    const lookAhead = Math.min(t + 0.1, 1);
    const look = path.getPoint(lookAhead);
    
    // Smooth camera movement with velocity
    ref.current.position.lerp(pos, 0.05);
    targetRef.current.lerp(look, 0.05);
    ref.current.lookAt(targetRef.current);
    
    // Advanced camera shake simulation
    const time = state.clock.elapsedTime;
    const windIntensity = Math.sin(time * 8) * 0.008;
    const turbulence = Math.sin(time * 15) * 0.005;
    const engineVibration = Math.sin(time * 50) * 0.003;
    
    ref.current.position.x += windIntensity + turbulence + engineVibration;
    ref.current.position.y += windIntensity + turbulence + engineVibration;
    ref.current.position.z += turbulence + engineVibration;
    
    // Dynamic camera tilt based on movement
    const speed = velocityRef.current.length();
    ref.current.rotation.z = Math.sin(time * 3) * 0.015 + speed * 0.01;
    ref.current.rotation.x = Math.sin(time * 2) * 0.01;
    
    // Update velocity for next frame
    velocityRef.current.subVectors(pos, ref.current.position);
  });

  return <PerspectiveCamera ref={ref} makeDefault fov={75} near={0.1} far={2000} />;
}

// Realistic Mountain Terrain
function RealisticMountains() {
  const geometry = useMemo(() => generateTerrain(400, 250, 400), []);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  // Custom shader for realistic mountain rendering
  const mountainShader = useMemo(() => ({
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vColor;
      varying vec2 vUv;
      
      void main() {
        vPosition = position;
        vNormal = normal;
        vColor = color;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vColor;
      varying vec2 vUv;
      
      void main() {
        float height = vPosition.z;
        float snow = smoothstep(25.0, 35.0, height);
        float rock = smoothstep(15.0, 25.0, height);
        float grass = smoothstep(8.0, 15.0, height);
        float forest = smoothstep(4.0, 8.0, height);
        
        vec3 snowColor = vec3(1.0, 1.0, 1.0);
        vec3 rockColor = vec3(0.5, 0.5, 0.5);
        vec3 grassColor = vec3(0.3, 0.5, 0.2);
        vec3 forestColor = vec3(0.2, 0.3, 0.1);
        vec3 baseColor = vec3(0.1, 0.2, 0.05);
        
        vec3 finalColor = mix(baseColor, forestColor, forest);
        finalColor = mix(finalColor, grassColor, grass);
        finalColor = mix(finalColor, rockColor, rock);
        finalColor = mix(finalColor, snowColor, snow);
        
        // Add texture variation
        float texture = sin(vUv.x * 100.0) * sin(vUv.y * 100.0) * 0.1;
        finalColor += texture;
        
        // Add snow sparkle effect
        if (snow > 0.8) {
          float sparkle = sin(time * 10.0 + vUv.x * 50.0) * sin(time * 8.0 + vUv.y * 50.0);
          finalColor += sparkle * 0.3;
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    uniforms: {
      time: { value: 0 }
    }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.05, 0, 0]} position={[0, -20, 0]} castShadow receiveShadow>
      <shaderMaterial ref={materialRef} attach="material" {...mountainShader} />
    </mesh>
  );
}

// Atmospheric Particle System
function AtmosphericParticles() {
  const particlesRef = useRef<THREE.Points>(null!);
  const count = 2000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 800;
      pos[i * 3 + 1] = Math.random() * 200 + 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        color="#87CEEB"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Cinematic Sun with Lens Flares
function CinematicSun() {
  const sunRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const lensFlareRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Sun movement
    sunRef.current.position.x = Math.sin(time * 0.03) * 60;
    sunRef.current.position.y = 100 + Math.sin(time * 0.02) * 20;
    sunRef.current.position.z = Math.cos(time * 0.04) * 40;
    
    // Sun rotation
    sunRef.current.rotation.z = time * 0.05;
    
    // Animated glow
    if (glowRef.current && glowRef.current.material) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(time * 1.5) * 0.1;
    }
    
    // Lens flare effect
    if (lensFlareRef.current && lensFlareRef.current.material) {
      (lensFlareRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group ref={sunRef} position={[0, 100, 0]}>
      {/* Main sun glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial 
          color="#ffd700" 
          transparent 
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Core sun */}
      <mesh>
        <sphereGeometry args={[12, 64, 64]} />
        <meshBasicMaterial 
          color="#ffd700"
          onBeforeCompile={(shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <dithering_fragment>',
              `
                vec3 sunColor = vec3(1.0, 0.8, 0.2);
                float intensity = 1.0 + sin(vUv.x * 30.0) * sin(vUv.y * 30.0) * 0.4;
                gl_FragColor.rgb = sunColor * intensity;
                gl_FragColor.a = 1.0;
                #include <dithering_fragment>
              `
            );
          }}
        />
      </mesh>
      
      {/* Lens flare */}
      <mesh ref={lensFlareRef} position={[30, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial 
          color="#ffd700" 
          transparent 
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Sun rays */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[0, 0, (i * Math.PI) / 6]}>
          <cylinderGeometry args={[0.2, 0.2, 30, 8]} />
          <meshBasicMaterial 
            color="#ffd700" 
            transparent 
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Enhanced Cloud System
function EnhancedClouds() {
  return (
    <Clouds>
      <Cloud opacity={0.6} speed={0.3} scale={15} segments={30} position={[-30, 60, -40]} />
      <Cloud opacity={0.4} speed={0.2} scale={20} segments={35} position={[40, 55, -30]} />
      <Cloud opacity={0.5} speed={0.4} scale={12} segments={25} position={[-20, 70, -60]} />
      <Cloud opacity={0.7} speed={0.1} scale={18} segments={32} position={[50, 45, -50]} />
      <Cloud opacity={0.3} speed={0.5} scale={10} segments={20} position={[-40, 65, -20]} />
      <Cloud opacity={0.8} speed={0.15} scale={25} segments={40} position={[20, 50, -70]} />
    </Clouds>
  );
}

export default function AdvancedFpvAnimation({ scroll }: { scroll: MotionValue<number> }) {
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
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
    >
      <CinematicCamera scroll={scroll} />
      
      {/* Advanced Lighting System */}
      <ambientLight intensity={0.3} color="#87CEEB" />
      
      {/* Main sun light */}
      <directionalLight
        position={[50, 120, 50]}
        intensity={4.0}
        castShadow
        color="#fffbe6"
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        shadow-camera-far={500}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
        shadow-bias={-0.0001}
      />
      
      {/* Fill lights for cinematic look */}
      <directionalLight position={[-40, 80, -40]} intensity={1.5} color="#e6f3ff" />
      <directionalLight position={[0, 60, -120]} intensity={1.2} color="#ffd700" />
      <directionalLight position={[80, 40, 0]} intensity={0.8} color="#ffb3d9" />
      
      {/* Cinematic Sky */}
      <Sky
        distance={450000}
        sunPosition={[0.6, 0.9, 0.4]}
        inclination={0.5}
        azimuth={0.35}
        rayleigh={1.0}
        turbidity={6}
        mieCoefficient={0.002}
        mieDirectionalG={0.95}
      />
      
      {/* Stars for depth */}
      <Stars radius={300} depth={60} count={2000} factor={4} saturation={0} fade speed={1} />
      
      {/* Cinematic Sun */}
      <CinematicSun />
      
      {/* Realistic Mountains */}
      <RealisticMountains />
      
      {/* Enhanced Clouds */}
      <EnhancedClouds />
      
      {/* Atmospheric Particles */}
      <AtmosphericParticles />
      
      {/* Enhanced Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]} receiveShadow>
        <planeGeometry args={[800, 800]} />
        <meshStandardMaterial 
          color="#2d5016" 
          transparent 
          opacity={0.95}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Cinematic Fog */}
      <fog attach="fog" args={['#87CEEB', 150, 600]} />
    </Canvas>
  );
} 