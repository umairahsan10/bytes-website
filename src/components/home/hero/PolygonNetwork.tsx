'use client';

import { useEffect, useRef } from 'react';

/**
 * PolygonNetwork — the hero's pointer-responsive data field.
 *
 * Canvas 2D: ~52 nodes, each connected to its ≤3 nearest neighbours within
 * 140px. IO-gated rAF (only runs while the hero is on screen), DPR capped at
 * 1.5, no pointer response on touch, one static frame under reduced motion.
 */

const NODE_COUNT = 52;
const LINK_DIST = 140;
const MAX_LINKS = 3;
const POINTER_RADIUS = 120;
const MAX_DISPLACE = 12;

const seeded = (i: number): number => {
  const x = Math.sin(i * 91.7 + 47.3) * 43758.5453123;
  return x - Math.floor(x);
};

type PNode = {
  fx: number; // base position as fraction of width
  fy: number; // base position as fraction of height
  ox: number; // current pointer displacement (lerped)
  oy: number;
};

export function PolygonNetwork({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = false;
    const pointer = { x: -1e4, y: -1e4 };

    const nodes: PNode[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
      fx: 0.03 + seeded(i * 2 + 1) * 0.94,
      fy: 0.05 + seeded(i * 2 + 2) * 0.9,
      ox: 0,
      oy: 0,
    }));
    let links: [number, number][] = [];

    const computeLinks = () => {
      links = [];
      const seen = new Set<number>();
      for (let i = 0; i < nodes.length; i++) {
        const candidates: { j: number; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const d = Math.hypot((nodes[i].fx - nodes[j].fx) * w, (nodes[i].fy - nodes[j].fy) * h);
          if (d <= LINK_DIST) candidates.push({ j, d });
        }
        candidates.sort((a, b) => a.d - b.d);
        for (const { j } of candidates.slice(0, MAX_LINKS)) {
          const key = i < j ? i * NODE_COUNT + j : j * NODE_COUNT + i;
          if (!seen.has(key)) {
            seen.add(key);
            links.push(i < j ? [i, j] : [j, i]);
          }
        }
      }
    };

    const xs = new Float32Array(NODE_COUNT);
    const ys = new Float32Array(NODE_COUNT);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // slow idle drift (off under reduced motion — that frame is static)
        const bx = n.fx * w + (reduced ? 0 : Math.sin(t * 0.00035 + i * 1.7) * 3);
        const by = n.fy * h + (reduced ? 0 : Math.cos(t * 0.0003 + i * 2.3) * 3);

        // pointer displacement, ≤12px, lerping back when the pointer leaves
        let tx = 0;
        let ty = 0;
        if (pointerFine && !reduced) {
          const dx = bx - pointer.x;
          const dy = by - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d > 0.001 && d < POINTER_RADIUS) {
            const push = (1 - d / POINTER_RADIUS) * MAX_DISPLACE;
            tx = (dx / d) * push;
            ty = (dy / d) * push;
          }
        }
        n.ox += (tx - n.ox) * 0.1;
        n.oy += (ty - n.oy) * 0.1;
        xs[i] = bx + n.ox;
        ys[i] = by + n.oy;
      }

      ctx.lineWidth = 1;
      for (const [i, j] of links) {
        const d = Math.hypot(xs[i] - xs[j], ys[i] - ys[j]);
        const alpha = Math.max(0, 0.18 * (1 - d / (LINK_DIST * 1.2)));
        if (alpha <= 0.005) continue;
        ctx.strokeStyle = `rgba(111,167,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(xs[i], ys[i]);
        ctx.lineTo(xs[j], ys[j]);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(76,146,255,0.5)';
      for (let i = 0; i < NODE_COUNT; i++) {
        ctx.beginPath();
        ctx.arc(xs[i], ys[i], 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      if (visible && !document.hidden) start();
      else stop();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeLinks();
      if (!running) draw(performance.now()); // static frame (reduced motion / paused)
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      sync();
    });
    io.observe(canvas);
    document.addEventListener('visibilitychange', sync);

    // Pointer listens on window (canvas is pointer-events-none) but only
    // applies while the section is visible. Touch devices never attach.
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    if (pointerFine && !reduced) window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      if (pointerFine && !reduced) window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
