import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
// Spline runtime is dynamically imported to avoid SSR issues and to keep bundle size low

const SPLINE_URL = "https://prod.spline.design/9PHyBBLVfpx0pW9E/scene.splinecode";

export const ByteBotsSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // --- GSAP intro animation ---
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".bytebots-heading", { y: 60, opacity: 0, duration: 1 });
      tl.from(".bytebots-subheading", { y: 60, opacity: 0, duration: 0.8 }, "-=0.8");
      tl.from(".bytebots-text", { y: 60, opacity: 0, duration: 0.8 }, "-=0.8");
      tl.from(".bytebots-button", { y: 60, opacity: 0, duration: 0.8 }, "-=0.8");
      tl.from(canvasRef.current, { scale: 0.5, opacity: 0, duration: 1 }, "-=1");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Dynamically import Spline runtime to run only in the browser
    if (typeof window === "undefined") return;

    let splineApp: any; // store reference to dispose on unmount

    (async () => {
      const { Application } = await import("@splinetool/runtime");
      if (canvasRef.current) {
        splineApp = new Application(canvasRef.current);
        try {
          await splineApp.load(SPLINE_URL);
          // Hide Spline watermark if present
          const badge = document.querySelector('a[aria-label="Built with Spline"]') as HTMLElement | null;
          if (badge) badge.style.display = 'none';
        } catch (err) {
          // Silently ignore missing-property warnings from the Spline runtime
          console.warn("Spline load warning:", err);
        }
      }
    })();

    // Clean up when component unmounts to prevent duplicate apps / errors
    return () => {
      if (splineApp) {
        try {
          splineApp.dispose?.();
        } catch {}
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bytebots-section relative bg-white text-gray-900 py-1 md:py-0 overflow-hidden"
    >
      {/* Centered purple flower background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Image
          src="/purple%20flower.jpg"
          alt="Purple flower background"
          fill
          className="object-contain w-full h-full max-w-[600px] opacity-30"
        />
      </div>
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-4 md:px-6 lg:px-8">
        {/* Left – Text */}
        <div className="flex-1 max-w-xl">
          <h2 className="bytebots-heading text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500">Byte&nbsp;Bot</span>
          </h2>
          <h3 className="bytebots-subheading text-2xl md:text-3xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            Your personal AI powerhouse
          </h3>
          <p className="bytebots-text text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
            Byte&nbsp;Bot is our innovative AI solution ready to super-charge your
            business. From intelligent chat support to content generation and
            data insights, Byte&nbsp;Bot adapts to your needs and learns with
            every interaction.
          </p>
          <a
            href="#contact"
            className="bytebots-button inline-block bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
          >
            Discover More
          </a>
        </div>

        {/* Right – 3-D Bot */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-3xl h-[550px] md:h-[750px]">
          <canvas
            ref={canvasRef}
            id="bytebots-canvas"
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}; 