import React, { useEffect, useRef, useState, useCallback } from 'react';
import TextFlip from '../components/TextFlip';
import { usePageReload } from '../hooks/usePageReload';
import OptimizedImage from '../components/OptimizedImage';
import styles from './Hero.module.css';

const HeroSection = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const landRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const moonContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [moonVisible, setMoonVisible] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Cache DOM elements for better performance
  const cachedElements = useRef<{
    moonContainer: HTMLElement | null;
    landElement: HTMLDivElement | null;
  }>({ moonContainer: null, landElement: null });

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver to pause animations when hero is not visible
  useEffect(() => {
    if (!heroSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
        // Pause/resume infinite animations based on visibility
        if (moonContainerRef.current) {
          if (entry.isIntersecting) {
            moonContainerRef.current.classList.remove(styles.paused);
          } else {
            moonContainerRef.current.classList.add(styles.paused);
          }
        }
      },
      {
        rootMargin: '100px', // Trigger slightly before/after viewport
        threshold: 0.01,
      }
    );

    observer.observe(heroSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle page reloads
  usePageReload((event) => {
    if (event.isPageReload) {
      // Reset states on page reload
      setIsLoaded(false);
      setMoonVisible(false);
      
      // Re-initialize after a short delay
      setTimeout(() => {
        setIsLoaded(true);
        setMoonVisible(true);
      }, 200);
    }
  });

  useEffect(() => {
    // Initial animation sequence - both land and moon start at same time
    setTimeout(() => {
      setIsLoaded(true);
      setMoonVisible(true); // Moon appears at same time as land
    }, 100);

    // Cache DOM elements once
    cachedElements.current.moonContainer = document.querySelector('.moon-container') as HTMLElement;
    cachedElements.current.landElement = landRef.current;

    // Optimized scroll handler using requestAnimationFrame
    let ticking = false;
    let lastScrollY = 0;

    const updateScrollAnimations = () => {
      // Only trigger scroll animations after hero is fully loaded and moon is visible
      if (!isLoaded || !moonVisible || !isHeroVisible) {
        ticking = false;
        return;
      }
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Early return if hero is scrolled past
      if (scrollY > windowHeight * 1.5) {
        ticking = false;
        return;
      }

      // Skip if scroll hasn't changed significantly (debouncing)
      if (Math.abs(scrollY - lastScrollY) < 1) {
        ticking = false;
        return;
      }
      lastScrollY = scrollY;

      const maxScroll = windowHeight * 0.8;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      // Synchronized moon zoom and land movement
      const moonContainer = cachedElements.current.moonContainer;
      const landElement = cachedElements.current.landElement;
      
      if (moonContainer && landElement) {
        // Moon zooms smoothly based on scroll progress (limited zoom)
        const scale = 1 + (scrollProgress * 1.5); // Scale from 1 to 2.5
        
        // Apply smooth zoom based on scroll position - keep centered
        moonContainer.style.setProperty('transform', `translate(50%, -50%) scale(${scale})`, 'important');
        moonContainer.style.setProperty('opacity', '1', 'important');
        
        // Land goes down more on scroll
        const landTranslateY = scrollProgress * 40; // 40% down movement
        
        landElement.style.transform = `translateY(${landTranslateY}%)`;
        landElement.style.transition = 'none';
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(updateScrollAnimations);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isLoaded, moonVisible, isHeroVisible]);

  return (
    <div className={styles.heroWrapper}>
      <div className={styles.heroSection} ref={heroSectionRef}>
        {/* Background Image - Priority loading for hero */}
        <div className={styles.backgroundImage}>
          <OptimizedImage 
            src="/assets/hero images/hero-4.png"
            alt="Hero background"
            fill
            priority
            quality={90}
            mobileQuality={75}
            objectFit="cover"
            sizes="(max-width: 768px) 100vw, 1920px"
            placeholder="empty"
          />
        </div>

        {/* Single Moon Container */}
        <div 
          ref={moonContainerRef}
          className={`moon-container ${styles.moonContainer} ${moonVisible ? styles.visible : ''}`}
        >
          <div 
            ref={moonRef}
            className={styles.moon}
          >
            <OptimizedImage 
              src="/assets/hero images/hero-2.png"
              alt="Moon"
              fill
              priority
              quality={85}
              mobileQuality={70}
              objectFit="contain"
            />
          </div>
        </div>

        {/* Land Image */}
        <div 
          ref={landRef}
          className={`${styles.landImage} ${isLoaded ? styles.loaded : ''}`}
        >
          <OptimizedImage 
            src="/assets/hero images/hero-1.png"
            alt="Landscape"
            fill
            priority
            quality={85}
            mobileQuality={75}
            objectFit="cover"
            sizes="(max-width: 768px) 100vw, 1920px"
          />
        </div>

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <h1 ref={textRef} className={`${styles.heroTitle} ${isLoaded ? styles.loaded : ''}`}>
            Full Stack Digital <span className={styles.futureWord}>Power House</span>
          </h1>
          <div className={styles.heroSubtitle}>
            <TextFlip />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;