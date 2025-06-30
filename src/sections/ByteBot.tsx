import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
// Replaced interactive Spline model with a pre-rendered animated GIF to lighten the bundle

export const ByteBotsSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // --- GSAP intro animation ---
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".bytebots-heading", { y: 60, opacity: 0, duration: 1 });
      tl.from(".bytebots-subheading", { y: 60, opacity: 0, duration: 0.8 }, "-=0.8");
      tl.from(".bytebots-text", { y: 60, opacity: 0, duration: 0.8 }, "-=0.8");
      tl.from(".bytebots-button", { y: 60, opacity: 0, duration: 0.8 }, "-=0.8");
      tl.from(".bytebots-video", { scale: 0.5, opacity: 0, duration: 1 }, "-=1");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bytebots-section relative text-black bg-white py-[50px] md:py-0 overflow-hidden"
    >
      {/* Centered purple flower background */}
      <div className="pointer-events-none absolute inset-x-0 X sm:inset-0 flex items-center justify-center">
        <Image
          src="/purple%20flower.jpg"
          alt="Purple flower background"
          fill
          className="object-contain w-full h-full max-w-[600px] opacity-30"
        />
      </div>
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-y-12 md:gap-x-10 px-4 sm:px-6 lg:px-8">
        {/* Left – Text */}
        <div className="flex-1 max-w-xl text-center md:text-left">
          <h2 className="bytebots-heading text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500">Byte&nbsp;Bot</span>
          </h2>
          <h3 className="bytebots-subheading text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            Your personal AI powerhouse
          </h3>
          <p className="bytebots-text text-base sm:text-lg leading-relaxed mb-6 text-gray-900 dark:text-gray-500">
            Byte&nbsp;Bot is our innovative AI solution ready to super-charge your
            business. From intelligent chat support to content generation and
            data insights, Byte&nbsp;Bot adapts to your needs and learns with
            every interaction.
          </p>
          <Link
            href="/products/byte-bots"
            className="bytebots-button inline-block bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
          >
            Discover More
          </Link>
        </div>

        {/* Right – 3-D Bot */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-3xl h-64 sm:h-72 md:h-[550px] lg:h-[700px]">
          <video
            src="/assets/bytes-bot/bytes-vid.webm"
            autoPlay
            loop
            muted
            playsInline
            className="bytebots-video w-[85%] h-[85%] mx-auto sm:w-full sm:h-full rounded-lg object-contain"
          />
        </div>
      </div>
    </section>
  );
}; 