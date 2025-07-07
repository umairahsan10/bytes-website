"use client";

import React, { useEffect, useRef } from 'react';

interface AnimatedBeamProps {
  children: React.ReactNode;
}

const AnimatedBeam: React.FC<AnimatedBeamProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Meteor class
    class Meteor {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      trail: Array<{ x: number; y: number; alpha: number }>;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = -10;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 3 + 2;
        this.size = Math.random() * 2 + 1;
        this.alpha = 1;
        this.trail = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01;

        // Add trail
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > 20) {
          this.trail.shift();
        }
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        
        // Draw trail
        this.trail.forEach((point, index) => {
          const trailAlpha = (point.alpha * index) / this.trail.length;
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = `rgba(255, 255, 255, ${trailAlpha})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, this.size * (index / this.trail.length), 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw meteor
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      isDead() {
        return this.alpha <= 0 || this.y > (canvas?.height || 600);
      }
    }

    const meteors: Meteor[] = [];
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new meteors
      if (Math.random() < 0.08) {
        meteors.push(new Meteor());
      }

      // Update and draw meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].update();
        meteors[i].draw();

        if (meteors[i].isDead()) {
          meteors.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBeam; 