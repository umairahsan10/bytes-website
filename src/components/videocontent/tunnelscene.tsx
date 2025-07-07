import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

interface TunnelSceneProps {
  scrollContainer: React.RefObject<HTMLDivElement>;
}

const TunnelScene: React.FC<TunnelSceneProps> = ({ scrollContainer }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    particles: THREE.Points;
    tunnelRings: THREE.Group;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    scene.fog = new THREE.Fog(0x000510, 50, 200);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, 1);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1;
    mountRef.current.appendChild(renderer.domElement);

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    // Create tunnel rings
    const tunnelRings = new THREE.Group();
    const ringGeometry = new THREE.RingGeometry(8, 12, 32);
    
    for (let i = 0; i < 100; i++) {
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.5 + Math.sin(i * 0.1) * 0.3, 0.8, 0.5),
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = i * 5;
      ring.rotation.x = Math.PI / 2;
      
      // Add glow effect
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.5 + Math.sin(i * 0.1) * 0.3, 1, 0.8),
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      const glowRing = new THREE.Mesh(
        new THREE.RingGeometry(6, 14, 32),
        glowMaterial
      );
      glowRing.position.z = i * 5;
      glowRing.rotation.x = Math.PI / 2;
      
      tunnelRings.add(glowRing);
      tunnelRings.add(ring);
    }
    
    scene.add(tunnelRings);

    // Create particle system with circular particles flowing outward from center
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Start particles from center and give them random directions
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2; // Start near center
      const z = Math.random() * 500;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = z;
      
      // Set velocity for outward motion
      const speed = 0.005 + Math.random() * 0.01; // Reduced speed for slower animation
      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = Math.sin(angle) * speed;
      velocities[i3 + 2] = -0.15; // Slower backward movement through tunnel
      
      const color = new THREE.Color().setHSL(0.5 + Math.random() * 0.4, 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 3 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create circular particle material using a canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    // Draw a circular gradient
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Animate particles flowing outward from center
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Move particles outward
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
        
        // Reset particles that have moved too far out or back
        const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2);
        if (distance > 15 || positions[i3 + 2] < -50) {
          // Reset to center with new random direction
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 1;
          
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = Math.sin(angle) * radius;
          positions[i3 + 2] = Math.random() * 500;
          
          // Update velocity
          const speed = 0.005 + Math.random() * 0.01; // Reduced speed for slower animation
          velocities[i3] = Math.cos(angle) * speed;
          velocities[i3 + 1] = Math.sin(angle) * speed;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Animate tunnel rings
      tunnelRings.children.forEach((ring, index) => {
        ring.rotation.z += 0.003 * (1 + index * 0.005); // Reduced rotation speed
      });
      
      composer.render();
      
      sceneRef.current = {
        scene,
        camera,
        renderer,
        composer,
        particles,
        tunnelRings,
        animationId
      };
    };
    
    animate();

    // Scroll animations
    const setupScrollAnimations = () => {
      if (!scrollContainer.current) return;

      // Camera position and rotation timeline
      const tl = gsap.timeline();
      
      ScrollTrigger.create({
        trigger: scrollContainer.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 2, // Increased scrub value for smoother, slower animation
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Camera movement forward into tunnel
          camera.position.z = progress * 200; // Reduced movement distance for slower effect
          
          // Camera rotation - tilt down then rotate around Z-axis
          if (progress < 0.3) {
            // First 30% - tilt down
            camera.rotation.x = -progress * Math.PI * 0.5;
          } else if (progress < 0.7) {
            // 30-70% - maintain horizontal view
            camera.rotation.x = -Math.PI * 0.15;
          } else {
            // 70-100% - rotate around Z-axis
            const rotationProgress = (progress - 0.7) / 0.3;
            camera.rotation.x = -Math.PI * 0.15;
            camera.rotation.z = rotationProgress * Math.PI * 2;
          }
          
          // Adjust bloom intensity based on progress
          bloomPass.strength = 1.5 + progress * 2;
        }
      });
    };

    setupScrollAnimations();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        mountRef.current?.removeChild(sceneRef.current.renderer.domElement);
      }
    };
  }, [scrollContainer]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default TunnelScene;