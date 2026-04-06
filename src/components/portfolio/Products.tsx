"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Product Data ─── */
interface Product {
  name: string;
  description: string;
  builtFor: string;
  tags: string[];
  features: string[];
  color: string;
  colorRgb: string;
  image: string;
  // Spatial placement (% based)
  position: { x: number; y: number };
  depth: number; // 0.7–1.2 scale factor
  entryFrom: { x: number; y: number };
}

const products: Product[] = [
  {
    name: "ByteSuite Builder",
    description:
      "Create stunning, high-converting websites in minutes. From idea to live site — fully automated, no coding required.",
    builtFor: "Businesses & Creators",
    tags: ["AI", "Website Builder", "No-Code"],
    features: [
      "Instant website generation based on your business",
      "Fully responsive, modern designs",
      "SEO-optimized pages out of the box",
      "Secure hosting and one-click deployment",
      "Easy editing and customization anytime",
    ],
    color: "#915EFF",
    colorRgb: "145, 94, 255",
    image: "/portfolioo/products/product-1.png",
    position: { x: 4, y: 18 },
    depth: 1.05,
    entryFrom: { x: -300, y: -200 },
  },
  {
    name: "BytesCart",
    description:
      "A blazing-fast headless e-commerce engine — multi-currency support, advanced analytics, and SEO-optimized storefronts.",
    builtFor: "E-Commerce Businesses",
    tags: ["E-Commerce", "Platform", "Headless"],
    features: [
      "Customizable storefront with headless architecture",
      "Multi-currency and multi-language support",
      "Advanced analytics and conversion tracking",
      "SEO-optimized product pages out of the box",
    ],
    color: "#00D4FF",
    colorRgb: "0, 212, 255",
    image: "/portfolioo/products/product-2.png",
    position: { x: 52, y: 10 },
    depth: 0.9,
    entryFrom: { x: 350, y: -250 },
  },
  {
    name: "BytesReach AI Outreach",
    description:
      "A fully automated outbound system that handles everything from lead data to personalized emails — helping you scale outreach without manual work.",
    builtFor: "Sales & Marketing Teams",
    tags: ["AI", "Automation", "Outreach"],
    features: [
      "Smart CSV ingestion and data cleaning",
      "Deep web scraping for lead discovery",
      "AI-generated personalized emails at scale",
      "Automated sequences and follow-ups",
      "Real-time tracking and performance analytics",
    ],
    color: "#FF6B35",
    colorRgb: "255, 107, 53",
    image: "/portfolioo/products/product-3.png",
    position: { x: 8, y: 55 },
    depth: 0.95,
    entryFrom: { x: -250, y: 300 },
  },
  {
    name: "Bytes CRM",
    description:
      "A unified system that combines CRM and full business management — helping you manage leads, teams, finance, and operations from one powerful dashboard.",
    builtFor: "Teams & Enterprises",
    tags: ["AI", "CRM", "ERP"],
    features: [
      "Manage leads, deals, and customer relationships",
      "Track sales pipelines and performance",
      "Handle finance, invoices, and expenses",
      "Manage HR, employees, and payroll",
      "Admin controls with roles and permissions",
      "Real-time insights across all departments",
    ],
    color: "#EC4899",
    colorRgb: "236, 72, 153",
    image: "/portfolioo/products/product-4.png",
    position: { x: 54, y: 52 },
    depth: 1.0,
    entryFrom: { x: 300, y: 250 },
  },
];

/* ─── Neuron Field Background ─── */
interface Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
}

function NeuronField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0;
    let neurons: Neuron[] = [];
    const LINK_DIST = 140;
    const COUNT = 60;

    const resize = () => {
      w = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      if (neurons.length === 0) {
        neurons = Array.from({ length: COUNT }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 1.5,
          opacity: 0.12 + Math.random() * 0.2,
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
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / LINK_DIST) * 0.1})`;
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
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ─── Floating Product Visual ─── */
function ProductVisual({ product, isHovered }: { product: Product; isHovered: boolean }) {
  return (
    <div className="rounded-[16px] overflow-hidden bg-white/[0.03] backdrop-blur-[8px] border border-white/[0.06] w-full aspect-[16/10] relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-all duration-500"
        style={{
          filter: isHovered ? "brightness(1.1) saturate(1.15)" : "brightness(0.75)",
        }}
        loading="lazy"
        draggable={false}
      />

      {/* Glassy frost overlay */}
      <div
        className="absolute inset-0 transition-all duration-500 pointer-events-none"
        style={{
          background: isHovered
            ? `linear-gradient(135deg, rgba(${product.colorRgb}, 0.06) 0%, rgba(255,255,255,0.04) 50%, rgba(${product.colorRgb}, 0.03) 100%)`
            : "transparent",
          backdropFilter: isHovered ? "blur(2px) saturate(1.2)" : "blur(0px)",
          WebkitBackdropFilter: isHovered ? "blur(2px) saturate(1.2)" : "blur(0px)",
        }}
      />

      {/* Glass shimmer sweep */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute -top-full -left-full w-[200%] h-[200%] transition-all duration-700"
          style={{
            background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
            transform: isHovered ? "translateX(60%) translateY(60%)" : "translateX(-20%) translateY(-20%)",
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>

      {/* Inner neon glow frame */}
      <div
        className="absolute inset-0 rounded-[16px] pointer-events-none transition-all duration-500"
        style={{
          boxShadow: isHovered
            ? `inset 0 0 40px rgba(${product.colorRgb}, 0.12), inset 0 0 80px rgba(${product.colorRgb}, 0.04)`
            : "inset 0 0 0px transparent",
        }}
      />
    </div>
  );
}

/* ─── Expanded Product Detail ─── */
function ExpandedProduct({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#050816]/90 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-stretch gap-8 lg:gap-10"
        initial={{ scale: 0.7, opacity: 0, filter: "blur(12px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        exit={{ scale: 0.85, opacity: 0, filter: "blur(8px)" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-4 right-0 lg:-right-4 z-20 text-white/40 hover:text-white transition-colors font-mono text-sm flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <span>Close</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Product image — large */}
        <motion.div
          className="relative"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        >
          {/* Glow */}
          <div
            className="absolute -inset-10 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(${product.colorRgb}, 0.15) 0%, transparent 70%)`,
              filter: "blur(30px)",
            }}
          />
          <div className="rounded-[16px] overflow-hidden border border-white/[0.06] h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          className="min-w-0 flex flex-col justify-center"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: product.color }}
            />
            <span className="font-mono text-xs text-white/30 uppercase tracking-wider">
              {product.builtFor}
            </span>
          </div>

          <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {product.name}
          </h3>

          <p className="text-muted text-sm md:text-base leading-relaxed mb-5 max-w-lg">
            {product.description}
          </p>

          <div className="flex gap-2 flex-wrap mb-6">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] px-3 py-1 rounded-full border"
                style={{
                  borderColor: `rgba(${product.colorRgb}, 0.25)`,
                  color: product.color,
                  background: `rgba(${product.colorRgb}, 0.06)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <ul className="space-y-2.5">
            {product.features.map((f, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-sm text-muted"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={product.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasEntered, setHasEntered] = useState(false);

  /* Scroll-triggered entry */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Mouse parallax */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }, []);

  /* Lock scroll on expand */
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative py-[100px] md:py-[140px] overflow-hidden"
      style={{ background: "#050816", minHeight: "100vh" }}
      onMouseMove={handleMouseMove}
    >
      {/* Neuron field */}
      <NeuronField />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div className="absolute top-1/4 left-1/3 w-[700px] h-[400px] rounded-full bg-accent/[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] rounded-full bg-cyan/[0.025] blur-[100px]" />
      </div>

      {/* Heading */}
      <motion.div
        className="text-center mb-16 md:mb-8 relative z-10 px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={hasEntered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <span className="font-mono text-sm text-[#00D4FF] block mb-3 tracking-widest uppercase ">
          Product Lab
        </span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Our Products
        </h2>
        <p className="text-muted text-base md:text-lg font-light max-w-lg mx-auto">
          We don&apos;t just build solutions — we build products.
        </p>
      </motion.div>

      {/* Products grid — 2×2 sequence */}
      <div
        className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12"
        style={{ perspective: "1200px" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {products.map((product, i) => {
            const isHovered = hoveredIndex === i;
            const someoneElseHovered =
              hoveredIndex !== null && hoveredIndex !== i;

            // Subtle parallax per item based on position
            const depthFactor = 0.8 + (i % 2) * 0.4;
            const parallaxX = mousePos.x * depthFactor * 15;
            const parallaxY = mousePos.y * depthFactor * 10;

            return (
              <motion.div
                key={product.name}
                className="relative cursor-pointer"
                style={{
                  zIndex: isHovered ? 20 : 10,
                  transformStyle: "preserve-3d",
                }}
                initial={{
                  opacity: 0,
                  y: 60,
                  scale: 0.85,
                  filter: "blur(8px)",
                }}
                animate={
                  hasEntered
                    ? {
                        opacity: someoneElseHovered ? 0.45 : 1,
                        y: 0,
                        x: parallaxX,
                        scale: isHovered ? 1.04 : 1,
                        filter: someoneElseHovered
                          ? "blur(2px)"
                          : "blur(0px)",
                      }
                    : {}
                }
                transition={{
                  opacity: { duration: 0.4, ease: "easeOut" },
                  y: {
                    type: "spring",
                    damping: 22,
                    stiffness: 120,
                    delay: i * 0.1,
                  },
                  x: { type: "spring", damping: 40, stiffness: 120 },
                  scale: { type: "spring", damping: 25, stiffness: 200 },
                  filter: { duration: 0.35 },
                  default: {
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                    delay: i * 0.1,
                  },
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedProduct(product)}
              >
                {/* Idle floating */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3.5 + i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute -inset-6 rounded-2xl pointer-events-none transition-all duration-500"
                    style={{
                      background: isHovered
                        ? `radial-gradient(ellipse, rgba(${product.colorRgb}, 0.15) 0%, transparent 70%)`
                        : "transparent",
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Product panel */}
                  <div
                    className="relative overflow-hidden rounded-[16px] transition-shadow duration-500"
                    style={{
                      boxShadow: isHovered
                        ? `0 0 50px -12px rgba(${product.colorRgb}, 0.3), 0 20px 40px -10px rgba(0,0,0,0.4)`
                        : "0 8px 24px -8px rgba(0,0,0,0.3)",
                    }}
                  >
                    <ProductVisual product={product} isHovered={isHovered} />

                    {/* Bottom gradient with name + hover CTA */}
                    <div
                      className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-12 rounded-b-[16px]"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(5,8,22,0.92) 40%, transparent)",
                      }}
                    >
                      <p
                        className="font-heading text-sm md:text-base font-bold mb-0.5"
                        style={{ color: product.color }}
                      >
                        {product.name}
                      </p>
                      <motion.p
                        className="text-white/40 text-[11px] font-mono"
                        initial={false}
                        animate={{
                          opacity: isHovered ? 1 : 0,
                          y: isHovered ? 0 : 6,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        Click to explore →
                      </motion.p>
                    </div>

                    {/* Neon border + glassy edge on hover */}
                    <div
                      className="absolute inset-0 rounded-[16px] pointer-events-none transition-all duration-500"
                      style={{
                        boxShadow: isHovered
                          ? `inset 0 0 0 1px rgba(${product.colorRgb}, 0.4), inset 0 0 30px rgba(${product.colorRgb}, 0.08), 0 0 20px rgba(${product.colorRgb}, 0.06)`
                          : "inset 0 0 0 1px rgba(255,255,255,0.06)",
                        border: isHovered
                          ? `1px solid rgba(${product.colorRgb}, 0.25)`
                          : "1px solid transparent",
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Expanded detail modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ExpandedProduct
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
