import { useEffect, useRef, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface TunnelRing {
  z: number;
  radius: number;
  segments: number;
  rotation: number;
  speed: number;
  pulse: number;
}

const AdvancedFpvAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const tunnelRingsRef = useRef<TunnelRing[]>([]);
  const timeRef = useRef<number>(0);
  const speedRef = useRef<number>(1);
  const cameraZRef = useRef<number>(0);

  // Client-side only state
  const [isClient, setIsClient] = useState(false);
  
  // Ensure component only runs on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Automatic speed-up animation
  const autoSpeed = 1 + Math.sin(timeRef.current * 0.01) * 0.5 + Math.sin(timeRef.current * 0.005) * 0.3;

  // Initialize particles
  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    const colors = ['#001122', '#002244', '#003366', '#004488', '#0055aa', '#0066cc', '#0077ee', '#0088ff'];
    
    for (let i = 0; i < 300; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        z: Math.random() * 3000,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        vz: -Math.random() * 15 - 8,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    particlesRef.current = particles;
  }, []);

  // Initialize tunnel rings
  const initTunnelRings = useCallback(() => {
    const rings: TunnelRing[] = [];
    for (let i = 0; i < 80; i++) {
      rings.push({
        z: i * 80,
        radius: 400 + Math.sin(i * 0.1) * 100,
        segments: 20 + Math.floor(Math.random() * 12),
        rotation: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        pulse: Math.random() * Math.PI * 2
      });
    }
    tunnelRingsRef.current = rings;
  }, []);

  // 3D to 2D projection
  const project = useCallback((x: number, y: number, z: number, canvas: HTMLCanvasElement) => {
    const fov = 1000;
    const scale = fov / (fov + z);
    return {
      x: x * scale + canvas.width / 2,
      y: y * scale + canvas.height / 2,
      scale: scale
    };
  }, []);

  // Draw tunnel ring
  const drawTunnelRing = useCallback((ctx: CanvasRenderingContext2D, ring: TunnelRing, canvas: HTMLCanvasElement) => {
    const adjustedZ = ring.z - cameraZRef.current;
    if (adjustedZ < 0) return;

    const projected = project(0, 0, adjustedZ, canvas);
    if (projected.scale < 0.1) return;

    const radius = ring.radius * projected.scale;
    const segments = ring.segments;
    const rotation = ring.rotation + timeRef.current * ring.speed;
    const pulse = Math.sin(timeRef.current * 0.01 + ring.pulse) * 0.5 + 0.5;

    ctx.save();
    ctx.translate(projected.x, projected.y);

    // Draw ring segments
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 + rotation;
      const nextAngle = ((i + 1) / segments) * Math.PI * 2 + rotation;
      
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(nextAngle) * radius;
      const y2 = Math.sin(nextAngle) * radius;

      // Create gradient for each segment
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      const alpha = pulse * (0.4 + 0.6 * Math.sin(timeRef.current * 0.02 + i * 0.5));
      
      gradient.addColorStop(0, `rgba(0, 34, 68, ${alpha * 0.9})`);
      gradient.addColorStop(0.3, `rgba(0, 68, 136, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(0, 102, 204, ${alpha})`);
      gradient.addColorStop(1, `rgba(0, 136, 255, ${alpha * 0.8})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3 + pulse * 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Add glow effect
      ctx.shadowColor = '#004488';
      ctx.shadowBlur = 15 + pulse * 25;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }, [project]);

  // Draw all tunnel rings
  const drawTunnelRings = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    tunnelRingsRef.current.forEach(ring => {
      drawTunnelRing(ctx, ring, canvas);
    });
  }, [drawTunnelRing]);

  // Draw particles
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    particlesRef.current.forEach((particle, index) => {
      const adjustedZ = particle.z - cameraZRef.current;
      if (adjustedZ < 0) {
        // Reset particle when it goes behind camera
        particle.z += 2000;
        particle.x = (Math.random() - 0.5) * 2000;
        particle.y = (Math.random() - 0.5) * 2000;
        particle.life = particle.maxLife;
      }

      const projected = project(particle.x, particle.y, adjustedZ, canvas);
      if (projected.scale < 0.1 || projected.scale > 10) return;

      const alpha = particle.life / particle.maxLife;
      const size = particle.size * projected.scale;

      // Create radial gradient for particle glow
      const gradient = ctx.createRadialGradient(
        projected.x, projected.y, 0,
        projected.x, projected.y, size * 2
      );
      
      // Convert hex color to rgba format
      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };
      
      gradient.addColorStop(0, hexToRgba(particle.color, alpha));
      gradient.addColorStop(0.5, hexToRgba(particle.color, alpha * 0.5));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size * 2, 0, Math.PI * 2);
      ctx.fill();

              // Add motion blur trail
        if (particle.vz < -2) {
          const trailLength = Math.abs(particle.vz) * 2;
          const trailGradient = ctx.createLinearGradient(
            projected.x, projected.y,
            projected.x - particle.vx * trailLength,
            projected.y - particle.vy * trailLength
          );
          
          // Convert hex color to rgba format for trail
          const hexToRgba = (hex: string, alpha: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };
          
          trailGradient.addColorStop(0, hexToRgba(particle.color, alpha * 0.4));
          trailGradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = size * 0.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(projected.x, projected.y);
        ctx.lineTo(
          projected.x - particle.vx * trailLength,
          projected.y - particle.vy * trailLength
        );
        ctx.stroke();
      }
    });
  }, [project]);

  // Draw light streaks
  const drawLightStreaks = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const streakCount = 12;
    for (let i = 0; i < streakCount; i++) {
      const angle = (i / streakCount) * Math.PI * 2 + timeRef.current * 0.001;
      const radius = 200 + Math.sin(timeRef.current * 0.02 + i) * 100;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = 1500 + Math.sin(timeRef.current * 0.01 + i * 0.5) * 800;

      const projected = project(x, y, z - cameraZRef.current, canvas);
      if (projected.scale < 0.1) continue;

      const streakLength = 300 * projected.scale;
      const gradient = ctx.createLinearGradient(
        projected.x, projected.y,
        projected.x + Math.cos(angle) * streakLength,
        projected.y + Math.sin(angle) * streakLength
      );
      
      const alpha = Math.sin(timeRef.current * 0.05 + i) * 0.6 + 0.4;
      gradient.addColorStop(0, `rgba(0, 68, 136, ${alpha})`);
      gradient.addColorStop(0.3, `rgba(0, 102, 204, ${alpha * 0.8})`);
      gradient.addColorStop(0.7, `rgba(0, 136, 255, ${alpha * 0.6})`);
      gradient.addColorStop(1, 'transparent');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4 * projected.scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(projected.x, projected.y);
      ctx.lineTo(
        projected.x + Math.cos(angle) * streakLength,
        projected.y + Math.sin(angle) * streakLength
      );
      ctx.stroke();

      // Add glow
      ctx.shadowColor = '#004488';
      ctx.shadowBlur = 25 * projected.scale;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [project]);

  // Draw cosmic dust
  const drawCosmicDust = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 500 + Math.random() * 300;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const z = Math.random() * 1500;

      const projected = project(x, y, z - cameraZRef.current, canvas);
      if (projected.scale < 0.1) continue;

      const alpha = Math.sin(timeRef.current * 0.01 + i) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(0, 136, 255, ${alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 1.5 * projected.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [project]);

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update time and speed
    timeRef.current += 0.016 * speedRef.current;
    speedRef.current = autoSpeed;
    cameraZRef.current += speedRef.current * 10;

    // Update particles
    particlesRef.current.forEach(particle => {
      particle.x += particle.vx * speedRef.current;
      particle.y += particle.vy * speedRef.current;
      particle.z += particle.vz * speedRef.current;
      particle.life -= speedRef.current;

      // Add some wave motion
      particle.x += Math.sin(timeRef.current * 0.01 + particle.z * 0.001) * 0.5;
      particle.y += Math.cos(timeRef.current * 0.01 + particle.z * 0.001) * 0.5;
    });

    // Update tunnel rings
    tunnelRingsRef.current.forEach(ring => {
      ring.rotation += ring.speed * speedRef.current;
      ring.pulse += 0.02 * speedRef.current;
    });

    // Draw elements in order (back to front)
    drawCosmicDust(ctx, canvas);
    drawTunnelRings(ctx, canvas);
    drawLightStreaks(ctx, canvas);
    drawParticles(ctx, canvas);

    // Add camera shake based on speed
    if (speedRef.current > 2) {
      const shake = (speedRef.current - 2) * 2;
      ctx.save();
      ctx.translate(
        (Math.random() - 0.5) * shake,
        (Math.random() - 0.5) * shake
      );
    }

    // Add bloom effect
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(0, 68, 136, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';

    animationRef.current = requestAnimationFrame(animate);
  }, [autoSpeed, drawCosmicDust, drawTunnelRings, drawLightStreaks, drawParticles]);

  // Initialize and start animation
  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles and tunnel
    initParticles();
    initTunnelRings();

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient, initParticles, initTunnelRings, animate]);

  // Don't render anything on server
  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        background: 'radial-gradient(ellipse at center, #000022 0%, #000011 50%, #000000 100%)',
      }}
    />
  );
};

export default AdvancedFpvAnimation;
