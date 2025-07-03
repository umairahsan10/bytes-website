'use client';
import { useEffect, useRef, useState } from "react";
import Card from "./Card.jsx";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Custom hook to initialize Lenis
const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Expose Lenis instance globally so other components (e.g., Header)
    // can programmatically initiate smooth scroll animations.
    if (typeof window !== 'undefined') {
      window.lenis = lenis;
    }

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
};

// Helper function to detect mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export default function Home() {
  const container = useRef(null);
  const cardRefs = useRef([]);
  const [focusedCard, setFocusedCard] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Initialize Lenis
  useLenis();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(isMobile());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardData = [
    {
      category: "DEVELOPMENT",
      title: "Web & App Development",
      icon: "D",
      services: [
        "React & Next.js Development",
        "Mobile App Development", 
        "E-commerce Solutions",
        "Progressive Web Apps",
        "API Integration"
      ]
    },
    {
      category: "UI/UX DESIGN", 
      title: "User Experience Design",
      icon: "U",
      services: [
        "User Interface Design",
        "User Experience Research",
        "Wireframing & Prototyping", 
        "Design Systems",
        "Usability Testing"
      ]
    },
    {
      category: "TECH",
      title: "Development",
      icon: "T", 
      services: [
        "WebGL Development",
        "Web Development",
        "Unity/Unreal",
        "Interactive Installations",
        "VR/AR"
      ]
    },
    {
      category: "PRODUCTION",
      title: "3D & Animation",
      icon: "P",
      services: [
        "Procedural Modeling",
        "3D Asset Creation",
        "3D Asset Optimization", 
        "Animation",
        "3D Pipeline"
      ]
    }
  ];

  const handleCardClick = (index) => {
    if (focusedCard === index) {
      setFocusedCard(null);
    } else {
      setFocusedCard(index);
    }
  };

  const handleOverlayClick = () => {
    setFocusedCard(null);
  };

  useGSAP(() => {
    if (typeof window === "undefined") return;

    const cards = cardRefs.current;
    
    // Clear ONLY the ScrollTriggers that belong to this component.
    // Strategy: if the trigger element (vars.trigger) is inside our container,
    // we assume it was created here. This safely removes duplicates when the
    // hook re-runs (e.g., on mobile ↔ desktop resize) without touching
    // ScrollTriggers from other sections (like TextAnimation).
    ScrollTrigger.getAll().forEach((trigger) => {
      const trg = trigger.vars?.trigger;
      if (trg && container.current && container.current.contains(trg)) {
        trigger.kill();
      }
    });

    if (isMobileDevice) {
      // Mobile Animation: Simple sequential reveal without pinning
      const section = container.current.querySelector(".cards");
      
      // Set initial states for mobile cards
      cards.forEach((card, index) => {
        gsap.set(card, {
          // Start fully visible (remove fade-in)
          opacity: 1,
          y: 60,
          scale: 0.9,
          rotation: 0,
          position: "relative",
          left: "auto",
          top: "auto",
          transform: "none",
          zIndex: 1
        });
      });

      // Create simple reveal animations for each card
      cards.forEach((card, index) => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 40%",
            end: "bottom 40%",
            toggleActions: "play none none reverse",
            markers: false
          }
        });

        // Simple flip animation when card comes into view
        const frontEl = card.querySelector(".flip-card-front");
        const backEl = card.querySelector(".flip-card-back");
        
        // Use scrubbed progress so rotation reverses visibly as it crosses 50vh
        gsap.fromTo(
          frontEl,
          { rotateY: 0 },
          {
            rotateY: -180,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 40%",
              end: "bottom 40%",
              scrub: true,
              markers: false,
            },
          }
        );

        gsap.fromTo(
          backEl,
          { rotateY: 180 },
          {
            rotateY: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 40%",
              end: "bottom 40%",
              scrub: true,
              markers: false,
            },
          }
        );
      });

    } else {
      // Desktop Animation: Original spread animation
      const position = [14, 38, 62, 86];
      const rotation = [-15, -7.5, 7.5, 15];
      const totalScrollHeight = window.innerHeight * 3;

      // Pin cards section
      ScrollTrigger.create({
        trigger: container.current.querySelector(".cards"),
        start: "top top",
        end: () => `+=${totalScrollHeight}`,
        pin: true,
        pinSpacing: true,
      });

      // Initially set all cards visible and properly positioned
      cards.forEach((card, index) => {
        gsap.set(card, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
          left: "50%",
          top: "50%",
          zIndex: 4 - index
        });
      });

      // Spread Cards section
      cards.forEach((card, index) => {
        gsap.to(card, {
          left: `${position[index]}%`,
          rotation: rotation[index],
          ease: "none",
          scrollTrigger: {
            trigger: container.current.querySelector(".cards"),
            start: "top top",
            end: () => `+=${window.innerHeight}`,
            scrub: 0.5,
            id: `spread-${index}`,
          },
        });
      });

      // Flip cards and reset rotation with stagger
      cards.forEach((card, index) => {
        const frontEl = card.querySelector(".flip-card-front");
        const backEl = card.querySelector(".flip-card-back");

        const staggerOffset = index * 0.05;
        const startOffset = 1 / 3 + staggerOffset;
        const endOffset = 1 / 3 + staggerOffset;

        ScrollTrigger.create({
          trigger: container.current.querySelector(".cards"),
          start: "top top",
          end: () => `+=${totalScrollHeight}`,
          scrub: 1,
          id: `rotate-flip-${index}`,
          onUpdate: (self) => {
            const progress = self.progress;

            if (progress >= startOffset && progress <= endOffset) {
              const animationProgress = (progress - startOffset) / (1 / 3);
              const frontRotation = -180 * animationProgress;
              const backRotation = 180 - 180 * animationProgress;
              const cardRotation = rotation[index] * (1 - animationProgress);

              gsap.to(frontEl, { rotateY: frontRotation, ease: "power1.out" });
              gsap.to(backEl, { rotateY: backRotation, ease: "power1.out" });

              gsap.to(card, {
                xPercent: -50,
                yPercent: -50,
                rotate: cardRotation,
                ease: "power1.out",
              });
            }
          },
        });
      });
    }
  }, { scope: container, dependencies: [isMobileDevice] });

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const trg = trigger.vars?.trigger;
        if (trg && container.current && container.current.contains(trg)) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div className={`cards-container bg-white ${isMobileDevice ? 'mobile' : 'desktop'}`} ref={container}>
      <section id="services" className="cards">
        <div 
          className={`overlay ${focusedCard !== null ? 'active' : ''}`} 
          onClick={handleOverlayClick}
        />
        {cardData.map((card, index) => (
          <Card
            key={index}
            id={`card-${index + 1}`}
            frontSrc="/assets/card-front.png"
            frontAlt={`${card.category} service card`}
            category={card.category}
            title={card.title}
            services={card.services}
            icon={card.icon}
            ref={(el) => (cardRefs.current[index] = el)}
            className={focusedCard === index ? 'focused' : ''}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </section>
    </div>
  );
}