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
    (async () => {
      if (typeof window === "undefined") return;
      const { Application } = await import("@splinetool/runtime");
      if (canvasRef.current) {
        const app = new Application(canvasRef.current);
        app.load(SPLINE_URL);
      }
    })();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bytebots-section relative bg-white text-gray-900 py-20 md:py-28 overflow-hidden"
    >
      {/* Decorative flower background */}
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[250px] md:w-[350px] lg:w-[450px]">
        <Image src="/flower.png" alt="Decorative flower" width={550} height={550} className="w-full h-full object-contain" />
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
        <div className="flex-1 w-full max-w-xl h-[450px] md:h-[600px]">
          <canvas
            ref={canvasRef}
            id="bytebots-canvas"
            className="w-full h-full rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
}; 