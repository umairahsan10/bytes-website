'use client';

import darkSaasLandingPage from "@/assets/images/dark-saas-landing-page.png";
import lightSaasLandingPage from "@/assets/images/light-saas-landing-page.png";
import aiStartupLandingPage from "@/assets/images/ai-startup-landing-page.png";
import Image from "next/image";
import CheckIcon from "@/assets/icons/check-circle.svg"
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg"
import { SectionHeader } from "@/components/SectionHeader"
import { Card } from "@/components/Card"
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const portfolioProjects = [
  {
    company: "Acme Corp",
    year: "2022",
    title: "Dark Saas Landing Page",
    results: [
      { title: "Enhanced user experience by 40%" },
      { title: "Improved site speed by 50%" },
      { title: "Increased mobile traffic by 35%" },
    ],
    link: "https://youtu.be/4k7IdSLxh6w",
    image: darkSaasLandingPage,
  },
  {
    company: "Innovative Co",
    year: "2021",
    title: "Light Saas Landing Page",
    results: [
      { title: "Boosted sales by 20%" },
      { title: "Expanded customer reach by 35%" },
      { title: "Increased brand awareness by 15%" },
    ],
    link: "https://youtu.be/7hi5zwO75yc",
    image: lightSaasLandingPage,
  },
  {
    company: "Quantum Dynamics",
    year: "2023",
    title: "AI Startup Landing Page",
    results: [
      { title: "Enhanced user experience by 40%" },
      { title: "Improved site speed by 50%" },
      { title: "Increased mobile traffic by 35%" },
    ],
    link: "https://youtu.be/Z7I5uSRHMHg",
    image: aiStartupLandingPage,
  },
];

export const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imagesContainer = imagesContainerRef.current;
    if (!imagesContainer) return;
    
    const imageElements = imagesContainer.querySelectorAll('.project-image');
    
    // Check if mobile
    const isMobile = window.innerWidth <= 1024;
    
    // Set initial position for all images (off-screen to the left on desktop, top on mobile)
    gsap.set(imageElements, { 
      x: isMobile ? '0%' : '-100%', 
      y: isMobile ? '-100%' : '0%',
      opacity: 0 
    });
    
    // Create scroll trigger for the images container
    ScrollTrigger.create({
      trigger: imagesContainer,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        // Animate images with different directions based on screen size
        gsap.to(imageElements, {
          x: isMobile ? '0%' : '0%',
          y: isMobile ? '0%' : '0%',
          opacity: 1,
          duration: 3.0,
          ease: 'power2.out',
          stagger: isMobile ? 0.3 : 0.5
        });
      },
      onLeave: () => {
        gsap.to(imageElements, {
          x: isMobile ? '0%' : '100%',
          y: isMobile ? '100%' : '0%',
          opacity: 0,
          duration: 2.5,
          ease: 'power2.in'
        });
      },
      onEnterBack: () => {
        gsap.to(imageElements, {
          x: isMobile ? '0%' : '0%',
          y: isMobile ? '0%' : '0%',
          opacity: 1,
          duration: 3.0,
          ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        gsap.to(imageElements, {
          x: isMobile ? '0%' : '-100%',
          y: isMobile ? '-100%' : '0%',
          opacity: 0,
          duration: 2.5,
          ease: 'power2.in'
        });
      }
    });

    // Handle window resize
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 1024;
      if (newIsMobile !== isMobile) {
        // Recreate scroll triggers on resize
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // Re-run the effect
        setTimeout(() => {
          const newImageElements = imagesContainer.querySelectorAll('.project-image');
          gsap.set(newImageElements, { 
            x: newIsMobile ? '0%' : '-100%', 
            y: newIsMobile ? '-100%' : '0%',
            opacity: 0 
          });
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section 
      id="portfolio" 
      className="pb-16 lg:py-24 relative overflow-hidden"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Real-world Results"
          title="Featured Projects"
          description="See how I transformed concepts into engaging digital experiences"
        />
        
        {/* Projects container with new layout */}
        <div className="mt-10 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left side - All project titles */}
          <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 order-2 lg:order-1">
            {portfolioProjects.map((project, projectIndex) => (
              <div key={project.title} className="flex items-center min-h-[120px] md:min-h-[160px] lg:min-h-[200px]">
                <div className="w-full">
                  <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex gap-2 font-bold uppercase tracking-widest text-xs md:text-sm text-transparent bg-clip-text">
                    <span>{project.company}</span>
                    <span>&bull;</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl lg:text-4xl mt-2 md:mt-4 text-white">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right side - Stacked animated project images */}
          <div className="flex justify-center lg:justify-end relative order-1 lg:order-2" ref={imagesContainerRef}>
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl h-[300px] md:h-[400px] lg:h-[600px]">
              {portfolioProjects.map((project, projectIndex) => (
                <Image 
                  key={project.title}
                  src={project.image} 
                  alt={project.title} 
                  className="project-image absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl md:shadow-2xl" 
                  priority={projectIndex === 0}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Add sufficient bottom spacing */}
        <div className="h-96" />
      </div>
    </section>
  );
};