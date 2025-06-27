'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SEOPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const stackAreaRef = useRef<HTMLDivElement>(null);
  const tilesSectionRef = useRef<HTMLDivElement>(null);
  const tilesInnerRef = useRef<HTMLDivElement>(null);

  const heroControls = useAnimation();
  const aboutControls = useAnimation();

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (heroInView) {
      heroControls.start("visible");
    }
  }, [heroControls, heroInView]);

  useEffect(() => {
    if (aboutInView) {
      aboutControls.start("visible");
    }
  }, [aboutControls, aboutInView]);

  useEffect(() => {
    // GSAP animations for text reveals
    const tl = gsap.timeline();
    
    tl.from(".hero-title", {
      duration: 1.2,
      y: 100,
      opacity: 0,
      ease: "power3.out",
      delay: 0.5
    })
    .from(".hero-subtitle", {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power2.out"
    }, "-=0.5");

    // Parallax effect for background elements
    gsap.to(".floating-element", {
      y: -50,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    return () => {
      tl.kill();
    };
  }, []);

  /* ------- stacked cards scroll logic with ScrollTrigger pin ------- */
  useEffect(() => {
    const stackArea = stackAreaRef.current;
    if (!stackArea) return;

    const cards = Array.from(
      stackArea.querySelectorAll<HTMLDivElement>(".card")
    );

    const rotateCards = () => {
      let angle = 0;
      cards.forEach((card, index) => {
        if (card.classList.contains("away")) {
          card.style.transform = `translateY(-120vh) rotate(-48deg)`;
        } else {
          card.style.transform = `rotate(${angle}deg)`;
          angle -= 10;
          card.style.zIndex = `${cards.length - index}`;
        }
      });
    };

    rotateCards();

    // Pin the stack section until all cards are "away"
    const trigger = ScrollTrigger.create({
      trigger: stackArea,
      start: "top top",
      end: () => `+=${cards.length * window.innerHeight}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const awayCount = Math.floor(self.progress * cards.length);

        cards.forEach((card, i) => {
          if (i < awayCount) {
            card.classList.add("away");
          } else {
            card.classList.remove("away");
          }
        });

        rotateCards();
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  /* ------- Horizontal tiles scroll section --------*/
  useEffect(() => {
    const section = tilesSectionRef.current;
    const inner = tilesInnerRef.current;
    if (!section || !inner) return;

    const totalTiles = inner.children.length;

    gsap.to(inner, {
      xPercent: -(totalTiles - 1) * 100,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalTiles * window.innerHeight}`,
        scrub: true,
        pin: true,
        snap: 1 / (totalTiles - 1),
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const services = [
    {
      title: "Industry-Specific Keyword Research",
      description:
        "Deep, data-driven keyword analysis tailored to your niche and buyer intent.",
      features: [
        "Competitor & SERP analysis",
        "High-value, long-tail terms",
        "Search-volume & intent mapping",
      ],
    },
    {
      title: "Technical SEO & Performance Cleanup",
      description:
        "Eliminate crawl errors, boost Core Web Vitals and unlock site speed for higher rankings.",
      features: [
        "Site speed optimisation",
        "Mobile responsiveness",
        "Structured data & schema",
      ],
    },
    {
      title: "On-Page & Off-Page Strategy",
      description:
        "From conversion-optimised meta copy to authoritative backlinks – we cover it all.",
      features: [
        "Content planning & optimisation",
        "Authority-building backlinks",
        "Local & global targeting",
      ],
    },
  ];

  const tiles = [
    "Tailored keyword plans that bring buying intent",
    "SEO-optimised content that ranks & converts",
    "Technical site audits and full optimisation",
    "Monthly reporting with real growth metrics",
    "Ongoing SEO management & content support",
  ];

  const cardColors = ["#8B0000", "#B22222", "#DC143C", "#FF3030"];

  return (
    <div
      className="min-h-screen text-black overflow-hidden"
      style={{ background: "linear-gradient(#000000 0%, #8b0000 100%)" }}
    >
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-transparent" />
        <div className="floating-element absolute top-20 right-20 w-32 h-32 border border-red-500/20 rotate-45" />
        <div className="floating-element absolute bottom-40 left-20 w-24 h-24 border border-red-500/30 rounded-full" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-black">
          <motion.div
            className="hero-brand mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
          >
            <div className="inline-flex items-center justify-center w-32 h-32 border-2 border-white relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-white z-10">SEO</span>
              </div>
              <div className="absolute inset-0 border-t-2 border-red-500 rotate-45" />
              <div className="absolute inset-0 border-t-2 border-red-500 -rotate-45" />
            </div>
          </motion.div>

          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-4 tracking-tight bg-gradient-to-r from-red-400 to-red-700 text-transparent bg-clip-text">
            Search Engine Optimization
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-white mb-6 max-w-3xl mx-auto leading-relaxed font-semibold">
            If you're not ranking, you're bleeding revenue.
          </p>
          
          <p className="text-lg md:text-xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
            Every day, potential customers are searching for exactly what you offer — but if you're not on page&nbsp;1, you're not even in the game. At&nbsp;Bytes&nbsp;Platform, we don't just improve rankings — we drive laser-targeted traffic that turns into real business.
          </p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Stacked Cards Section (duplicate copy with scroll lock) */}
      <section ref={stackAreaRef} className="stack-area flex relative w-full text-black">
        {/* Left copy */}
        <div className="left flex flex-col items-center justify-center sticky top-0 h-screen basis-1/2 p-6">
          <h2 className="title text-5xl font-bold leading-tight text-center md:text-left">
            We Help You
            <br />
            <span className="text-red-500">Rank for What Matters</span>
          </h2>
          <div className="sub-title text-base mt-6 max-w-sm text-center md:text-left">
            Forget vanity metrics. We target the exact search terms your ideal customers are googling — and put your business front and center.
            <br />
            <button className="mt-5 px-6 py-3 bg-black text-white rounded-full">See More Details</button>
          </div>
        </div>

        {/* Right stacked cards */}
        <div className="right basis-1/2 h-screen sticky top-0">
          {services.slice(0, 4).map((service, idx) => (
            <div
              key={idx}
              className="card text-white"
              style={{
                backgroundColor: cardColors[idx % cardColors.length],
              }}
            >
              <div className="sub text-lg font-semibold mb-2">
                {service.title}
              </div>
              <div className="content text-3xl font-bold leading-snug">
                {service.description}
              </div>
            </div>
          ))}
        </div>

        {/* Inline styles to replicate original demo */}
        <style jsx global>{`
          .stack-area {
            height: 100vh;
          }
          .stack-area .left .title {
            width: 420px;
          }
          .stack-area .left .sub-title {
            width: 420px;
          }
          .stack-area .card {
            width: 350px;
            height: 350px;
            border-radius: 25px;
            margin-bottom: 10px;
            position: absolute;
            top: calc(50% - 175px);
            left: calc(50% - 175px);
            transition: 0.5s ease-in-out;
            box-sizing: border-box;
            padding: 35px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .stack-area .away {
            transform-origin: bottom left;
          }
        `}</style>
      </section>

      {/* Horizontal Tiles (pinned, horizontal scroll) */}
      <section ref={tilesSectionRef} className="tiles-section relative w-full h-screen overflow-hidden text-white">
        <div ref={tilesInnerRef} className="tiles-inner flex h-full w-full">
          {tiles.map((line, idx) => (
            <div
              key={idx}
              className="tile flex-shrink-0 w-screen h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-white px-6"
            >
              {line}
            </div>
          ))}
        </div>

        {/* styles */}
        <style jsx global>{`
          .tiles-section .tile:nth-child(even) {
            background: rgba(139,0,0,0.6);
          }
          .tiles-section .tile:nth-child(odd) {
            background: rgba(0,0,0,0.4);
          }
        `}</style>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={aboutControls}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Your Competition&nbsp;Is <span className="text-red-500">Stealing&nbsp;Your&nbsp;Customers</span>
              </h2>
              <p className="text-xl text-gray-100 leading-relaxed">
                Your competitors are showing up first — not because they're better, but because they're optimised. If your site isn't ranking for custom, high-converting keywords, you're sending leads straight to them.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Stop being invisible. Start dominating search.
              </p>
              <motion.button
                className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 font-semibold tracking-wide transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Free SEO Audit
              </motion.button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              {/* Placeholder for image */}
              <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-lg">
                [SEO Strategy Image Placeholder]
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border-2 border-red-500/30 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 border border-red-500/20 rotate-45" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Let&nbsp;Google&nbsp;Bring&nbsp;You&nbsp;Business&nbsp;— On&nbsp;Autopilot.
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Talk to Our SEO Expert
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 text-lg font-semibold tracking-wide transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                START YOUR PROJECT
              </motion.button>
              <motion.button
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-10 py-4 text-lg font-semibold tracking-wide transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                VIEW PORTFOLIO
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SEOPage;