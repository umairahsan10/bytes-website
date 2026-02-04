'use client';
import { useEffect, useRef, useState } from "react";
import Card from "./Card.jsx";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

// Lenis is now initialized globally in the main page

// Helper function to detect mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export default function CardsSection() {
  const container = useRef(null);
  const cardRefs = useRef([]);
  const [focusedCard, setFocusedCard] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const router = useRouter();

  // Lenis is now initialized globally in the main page

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
      category: "Web DEVELOPMENT",
      // title: "Web Development Highlights",
      icon: "B",
      services: [
        "Lightning-Fast Load Times",
        "Pixel-Perfect Design",
        "Fully Responsive",
        "Secure & Stable",
        "Easy Maintenance"
      ],
      link: "/services/web"
    },
    {
      category: "SEO", 
      // title: "SEO Highlights",
      icon: "Y",
      services: [
        "Top Search Rankings",
        "Smart Keyword Targeting",
        "Strong Backlink Profile",
        "In-Depth SEO Audits",
        "Real-Time Analytics"
      ],
      link: "/services/seo"
    },
    {
      category: "App DEVELOPMENT",
      // title: "Mobile App Development",
      icon: "T", 
      services: [
        "IOS & Android Ready",
        "Fast & Fluid Performance",
        "Custom Features",
        "Seamless Integrations",
        "End-to-End Support"
      ],
      link: "/services/app"
    },
    {
      category: "Marketing",
      // title: "Social Media Marketing Highlights",
      icon: "E",
      services: [
        "Brand-Centric Strategies",
        "ROI-Focused Campaigns",
        "Omnichannel Reach",
        "Creative Ad Design",
        "A/B Testing & Optimization"
      ],
      link: "/services/marketing"
    }
  ];

  const handleCardClick = (index) => {
    router.push(cardData[index].link);
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

      const isShortScreen = window.innerHeight < 700;

      // Adjust timings again – users reported the previous change fired *too* early.
      // "top 40%" means the element’s top must get closer to the viewport top
      // (scroll a bit more) before the animations begin – producing a **later**
      // opening compared with the 80 % variant but still earlier than the old
      // 20 % setting.
      const revealStart = "top 80%"; // was 40%
      const revealEnd   = "bottom 80%"; // was 20%

      // Flip timings: keep very-short screens special-cased, but for normal
      // mobiles start when card is partially visible and finish at center.
      const flipStart = isShortScreen ? "bottom 100%" : "top 70%";
      const flipEnd   = isShortScreen ? "bottom 80%" : "center center";
      
      // Set initial states for mobile cards
      cards.forEach((card) => {
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
          zIndex: 1,
        });
      });

      // Create simple reveal animations for each card
      cards.forEach((card) => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.8, // was 0.8
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: revealStart,
            end: revealEnd,
            toggleActions: "play none none reverse",
            markers: false,
          },
        });

        // Simple flip animation when card comes into view
        const frontEl = card.querySelector(".flip-card-front");
        const backEl = card.querySelector(".flip-card-back");

        // Use scrubbed progress so rotation reverses visibly as it crosses 50vh
        // Front side rotates to back
        gsap.fromTo(
          frontEl,
          { rotateY: 0 },
          {
            rotateY: -180,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: flipStart,
              end: flipEnd,
              scrub: true,
              markers: false,
              // Disable clicks when the card is showing its back side
              onUpdate: (self) => {
                // Always keep front face non-interactive
                frontEl.style.pointerEvents = "none";
              },
            },
          },
        );

        gsap.fromTo(
          backEl,
          { rotateY: 180 },
          {
            rotateY: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: flipStart,
              end: flipEnd,
              scrub: true,
              markers: false,
            },
          },
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
        const endOffset = 2 / 3 + staggerOffset;

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

              // Rotate the faces
              gsap.to(frontEl, { rotateY: frontRotation, ease: "power1.out" });
              gsap.to(backEl, { rotateY: backRotation, ease: "power1.out" });

              // Toggle pointer events based on which side is visible
              frontEl.style.pointerEvents = "none";

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