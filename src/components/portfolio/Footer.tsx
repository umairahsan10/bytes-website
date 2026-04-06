const serviceLinks = [
  "Web Development",
  "SaaS / CRM",
  "SEO & Marketing",
  "UI/UX Design",
  "Mobile Apps",
];
import { useEffect, useRef, useState, useCallback } from "react";

interface Neuron { x: number; y: number; vx: number; vy: number; r: number; opacity: number }

function NeuronField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    let neurons: Neuron[] = [];
    const LINK_DIST = 140;
    const COUNT = 50;

    const resize = () => {
      w = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      if (neurons.length === 0) {
        neurons = Array.from({ length: COUNT }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1 + Math.random() * 1.5,
          opacity: 0.1 + Math.random() * 0.2,
        }));
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of neurons) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / LINK_DIST) * 0.08})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of neurons) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${n.opacity})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1] pointer-events-none" style={{ opacity: 0.7 }} />
  );
}


const productLinks = ["BytesReach CRM", "BytesCart", "BytesSuite"];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-16 overflow-hidden" style={{ background: "#050816" }}>
      <NeuronField />
      <div className="relative z-[2] max-w-content mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1 — Brand */}
          <div>
            <span className="font-heading text-2xl font-bold gradient-text block mb-3">
              Bytes
            </span>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Building scalable digital systems for modern businesses.
            </p>
            <div className="flex gap-4">
              {/* Social icons */}
              <a
                href="#"
                aria-label="Twitter"
                className="text-muted hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-muted hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="text-muted hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </div>
        </div>

          {/* Col 2 — Services */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#services"
                    className="text-muted text-sm hover:text-white transition-colors"
                >
                    {link}
                  </a>
              </li>
            ))}
          </ul>
        </div>

          {/* Col 3 — Products */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white mb-4">
              Products
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#products"
                    className="text-muted text-sm hover:text-white transition-colors"
                >
                    {link}
                  </a>
              </li>
            ))}
          </ul>
        </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a
                  href="mailto:hello@bytes.agency"
                  className="hover:text-white transition-colors"
                >
                  hello@bytes.agency
                </a>
            </li>
              <li>Serving clients in 3 countries</li>
              <li>Remote-first team</li>
          </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-[13px]">
            © 2025 Bytes. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-muted text-[13px] hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-muted/50">·</span>
            <a
              href="#"
              className="text-muted text-[13px] hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>

      <hr className="border-white/20 my-4" />

      <p className="text-center text-sm">Developed by Bytes Platform Inc.</p>
    </footer>
  );
}
