"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../components/Header.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  heroImage?: string;
  logoImage?: string;
  className?: string;
  transparentNav?: boolean;
  logoOnly?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  heroImage = '/assets/hero.jpg',
  logoImage = '/assets/bytes-logo.png',
  className = 'bytes-header',
  transparentNav = false,
  logoOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [buttonText, setButtonText] = useState('Menu');
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isJourneyDropdownOpen, setIsJourneyDropdownOpen] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const router = useRouter();
  
  // Refs for DOM elements
  const menuRef = useRef<HTMLDivElement>(null);
  const menuImgContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  
  // Mouse tracking for tilt effect
  const mouse = useRef({ x: 0, y: 0 });
  const center = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });

  // Track previous scroll position for hide/show header
  const lastScrollY = useRef(0);

  // Animation settings
  const defaultEase = "power4.inOut";
  const scales = [0.81, 0.84, 0.87, 0.9];

  // Breakpoint for mobile/tablet detection
  const MOBILE_BREAKPOINT = 768;

  // Check if screen size is mobile/tablet
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
  };

  // Set initial image positions based on screen size
  const setInitialImagePositions = () => {
    if (isMobile) {
      gsap.set(["#img-2, #img-3, #img-4"], { right: "-50%", top: "50%" });
    } else {
      gsap.set(["#img-2, #img-3, #img-4"], { top: "150%", right: "auto" });
    }
  };

  // 3D tilt effect based on mouse position
  const updateTilt = () => {
    if (!menuImgContainerRef.current || !imagesRef.current) return;

    const dx = mouse.current.x - center.current.x;
    const dy = mouse.current.y - center.current.y;

    const tiltx = (dy / center.current.y) * 20;
    const tilty = (dx / center.current.x) * 20;

    gsap.to(menuImgContainerRef.current, {
      duration: 2,
      transform: `rotate3d(${tiltx}, ${tilty}, 0, 15deg)`,
      ease: "power3.out",
    });

    imagesRef.current.forEach((img, index) => {
      if (!img) return;
      const parallaxX = -(dx * (index + 1)) / 100;
      const parallaxY = -(dy * (index + 1)) / 100;
      const transformStyles = `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px)) scale(${scales[index]})`;
      gsap.to(img, {
        duration: 2,
        transform: transformStyles,
        ease: "power3.out",
      });
    });
  };

  useEffect(() => {
    // Initial screen size check
    checkScreenSize();

    // Initial GSAP setup - set starting positions for animation elements
    gsap.set(".menu-logo img", { y: 50, opacity: 0 });
    gsap.set(".menu-link p", { y: 40, opacity: 0 });
    gsap.set(".menu-sub-item p", { y: 12, opacity: 0 });
    
    // Set initial clip-path for menu (closed state - showing only top edge)
    gsap.set(".menu", { 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      pointerEvents: "none"
    });
    
    // Set initial positions for images 2, 3, 4 based on screen size
    setInitialImagePositions();

    // Mouse move handler for 3D tilt effect on images
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      updateTilt();
    };

    // Window resize handler - updates center point and checks screen size
    const handleResize = () => {
      center.current.x = window.innerWidth / 2;
      center.current.y = window.innerHeight / 2;
      checkScreenSize();
      setInitialImagePositions();
    };

    // Click outside handler for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.services-dropdown')) {
        setIsServicesDropdownOpen(false);
      }
      if (!target.closest('.products-dropdown')) {
        setIsProductsDropdownOpen(false);
      }
      if (!target.closest('.journey-dropdown')) {
        setIsJourneyDropdownOpen(false);
      }
    };

    // Scroll listener to hide/show header
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      if (!isOpen) {
        if (diff > 10 && currentY > 50) {
          // scrolling down
          setIsHeaderHidden(true);
        } else if (diff < -10) {
          // scrolling up
          setIsHeaderHidden(false);
        }
      }
      lastScrollY.current = currentY;
    };

    // Add event listeners
    document.body.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listeners
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!transparentNav) return;
    const heroElement = document.querySelector('.hero-wrapper');
    if (!heroElement) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsHeroInView(entry.isIntersecting);
      });
    }, { threshold: 0 });

    observer.observe(heroElement);

    return () => observer.disconnect();
  }, [transparentNav]);

  // Disable page scroll when the menu is open
  useEffect(() => {
    // Functions & vars used by both lock and unlock
    const preventDefault = (e: Event) => e.preventDefault();
    const preventForKeys = (e: KeyboardEvent) => {
      const keys = [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;

    if (isOpen) {
      // Save the current overflow values so we can restore them later
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      // Store them on the element dataset to retrieve on cleanup
      document.body.dataset.prevOverflow = originalBodyOverflow;
      document.documentElement.dataset.prevOverflow = originalHtmlOverflow;

      // Prevent the background from scrolling entirely
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      window.addEventListener('keydown', preventForKeys, { passive: false });

      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }
    } else {
      // Restore overflow values from dataset (if we previously saved them)
      const prevBodyOverflow = document.body.dataset.prevOverflow ?? '';
      const prevHtmlOverflow = document.documentElement.dataset.prevOverflow ?? '';

      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;

      window.removeEventListener('wheel', preventDefault as any);
      window.removeEventListener('touchmove', preventDefault as any);
      window.removeEventListener('keydown', preventForKeys as any);

      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('wheel', preventDefault as any);
      window.removeEventListener('touchmove', preventDefault as any);
      window.removeEventListener('keydown', preventForKeys as any);

      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
    };
  }, [isOpen]);

  // Open menu animation - TOP TO BOTTOM
  const openMenu = () => {
    // Menu opens from top to bottom
    gsap.to(".menu", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      pointerEvents: "all",
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to({}, {
      duration: 0.5,
      delay: 0.3,
      onComplete: () => {
        setButtonText('Close');
      }
    });

    gsap.to(".menu-logo img", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: 0.6,
      ease: "power3.out",
    });

    gsap.to(".menu-link p", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.06,
      delay: 0.8,
      ease: "power3.out",
    });

    gsap.to(".menu-sub-item p", {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.03,
      delay: 0.9,
      ease: "power3.out",
    });

    if (isMobile) {
      gsap.to(["#img-2, #img-3, #img-4"], {
        top: "50%",
        duration: 1.25,
        ease: defaultEase,
        stagger: 0.1,
        delay: 0.25,
      });
    } else {
      gsap.to(["#img-2, #img-3, #img-4"], {
        top: "50%",
        duration: 1.25,
        ease: defaultEase,
        stagger: 0.1,
        delay: 0.25,
      });
    }
  };

  // Close menu animation - BOTTOM TO TOP
  const closeMenu = () => {

    // Close all dropdowns if open
    setIsServicesDropdownOpen(false);
    setIsProductsDropdownOpen(false);
    setIsJourneyDropdownOpen(false);
    
    // Animate images out first (reverse of opening)
    if (isMobile) {
      gsap.to(["#img-2, #img-3, #img-4"], {
        right: "-50%",
        top: "50%",
        duration: 0.8,
        ease: defaultEase,
        stagger: 0.05,
      });
    } else {
      gsap.to(["#img-2, #img-3, #img-4"], {
        top: "150%",
        duration: 0.8,
        ease: defaultEase,
        stagger: 0.05,
      });
    }

    // Animate menu content out
    gsap.to(".menu-sub-item p", {
      y: 12,
      opacity: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power3.in",
    });

    gsap.to(".menu-link p", {
      y: 40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.03,
      delay: 0.1,
      ease: "power3.in",
    });

    gsap.to(".menu-logo img", {
      y: 50,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.in",
    });

    // Menu closes from bottom to top
    gsap.to(".menu", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      pointerEvents: "none",
      duration: 1.25,
      ease: defaultEase,
      delay: 0.4,
      onComplete: () => {
    
        setIsOpen(false);
        setButtonText('Menu');
      }
    });
  };

  // Handle menu open button click
  const handleMenuOpen = () => {
    if (isOpen) return;
    // Immediately set menu as open to hide logo instantly
    setIsOpen(true);
    openMenu();
  };

  // Handle menu close button click
  const handleMenuClose = () => {
    if (!isOpen) return;
    closeMenu();
  };

  // Handle logo click – always navigate to the home page
  const handleLogoClick = () => {
    if (isOpen) {
      // Close the menu first, then navigate
      closeMenu();
      setTimeout(() => router.push('/'), 1300);
    } else {
      router.push('/');
    }
  };

  // Handle Services dropdown toggle
  const handleServicesDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };

  // Handle Products dropdown toggle
  const handleProductsDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  // Handle Services dropdown item click
  const handleServicesDropdownClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    setIsServicesDropdownOpen(false);
    closeMenu();
    setTimeout(() => {
      router.push(href);
    }, 1300);
  };

  // Handle Products dropdown item click
  const handleProductsDropdownClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    setIsProductsDropdownOpen(false);
    closeMenu();
    setTimeout(() => {
      router.push(href);
    }, 1300);
  };

  // Handle menu link clicks - close menu and scroll to section
  const handleMenuLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    closeMenu();
    setTimeout(() => router.push(href), 1300);
  };

  // Handle Brand Building Flow click - navigate to brand flow page
  const handleBrandFlowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      router.push('/brand-flow');
    }, 1300);
  };

  // Handle Journey dropdown toggle
  const handleJourneyDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsJourneyDropdownOpen(!isJourneyDropdownOpen);
  };

  // Handle Journey dropdown item click
  const handleJourneyDropdownClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    setIsJourneyDropdownOpen(false);
    closeMenu();
    setTimeout(() => {
      router.push(href);
    }, 1300);
  };

  // Helper function to set image refs for GSAP animations
  const setImageRef = (index: number) => (el: HTMLImageElement | null) => {
    if (imagesRef.current) {
      imagesRef.current[index] = el;
    }
  };

  // Helper to instantly finish card animations when navigating away from the Services section
  const completeCardAnimations = () => {
    if (typeof window === 'undefined' || !(window as any).ScrollTrigger) return;

    const triggers = (window as any).ScrollTrigger.getAll();
    triggers.forEach((t: any) => {
      const id = t.vars && t.vars.id;
      if (typeof id === 'string' && (id.startsWith('spread-') || id.startsWith('rotate-flip-'))) {
        t.progress(1, false); // jump to the end of the animation
      }
    });
  };

  gsap.registerPlugin(ScrollTrigger);

  return (
    <div className={`bytes-menu-container ${className} ${isOpen ? 'menu-open' : ''}`}>
      {/* Navigation bar */}
      <nav className={`bytes-nav h-14 flex items-center py-0 px-4 z-[200] transition-transform duration-300 ${ isHeaderHidden ? '-translate-y-full' : 'translate-y-0' } ${
        isOpen || !(transparentNav && isHeroInView)
          ? 'bg-[#101010]'
          : 'bg-transparent'
      } transition-colors duration-300`}>
        <div className="logo" onClick={handleLogoClick}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoImage} alt="Bytes Platform Logo" className="h-12 w-auto" />
        </div>

        {/* Spacer to push right-side items */}
        <div className="flex-1" />

        {/* Consultation link - right side next to menu toggle */}
        <Link
          href="/contact"
          className={`text-[#F6C324] text-[10px] md:text-xs font-semibold uppercase tracking-wide no-underline font-league cursor-pointer mr-4 pointer-events-auto text-center leading-tight transition-opacity duration-200 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <span data-cta="true" className="block text-white">BOOK A</span>
          <span data-cta="true" className="block animate-pulse text-[12px] md:text-sm" style={{ animationDuration: '1.4s' }}>FREE CONSULTATION</span>
        </Link>

        {!logoOnly && (
          <button
            aria-label="Toggle menu"
            className="menu-toggle hamburger relative z-[400] w-6 h-4 pointer-events-auto"
            onClick={isOpen ? handleMenuClose : handleMenuOpen}
          >
            {/* Top bar */}
            <span
              className={`absolute left-0 w-full h-0.5 bg-white transition-all duration-500 ease-in-out ${
                isOpen
                  ? 'top-1/2 -translate-y-1/2 rotate-45'
                  : 'top-0'
              }`}
            />
            {/* Middle bar */}
            <span
              className={`absolute left-0 w-full h-0.5 bg-white transition-all duration-500 ease-in-out ${
                isOpen
                  ? 'opacity-0 top-1/2 -translate-y-1/2'
                  : 'top-1/2 -translate-y-1/2'
              }`}
            />
            {/* Bottom bar */}
            <span
              className={`absolute left-0 w-full h-0.5 bg-white transition-all duration-500 ease-in-out ${
                isOpen
                  ? 'top-1/2 -translate-y-1/2 -rotate-45'
                  : 'bottom-0'
              }`}
            />
          </button>
        )}
      </nav>

      {/* Full-screen menu overlay */}
      {!logoOnly && (
        <div className="menu bg-slate-900" ref={menuRef} style={{ zIndex: 300 }}>
        {/* Image container with layered images and 3D tilt effect */}
        <div className="menu-col menu-img" ref={menuImgContainerRef}>
          {/* Main hero image - always visible */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="img-1"
            src={heroImage}
            alt=""
            ref={setImageRef(0)}
          />
          {/* Additional layered images that animate in */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="img-2"
            src={heroImage}
            alt=""
            ref={setImageRef(1)}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="img-3"
            src={heroImage}
            alt=""
            ref={setImageRef(2)}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="img-4"
            src={heroImage}
            alt=""
            ref={setImageRef(3)}
          />
        </div>

        {/* Menu content - navigation links and footer */}
        <div className="menu-col menu-items">
          {/* Menu logo */}
          <div className="menu-logo" onClick={handleLogoClick}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoImage} alt="Bytes Platform Logo" />
          </div>

          {/* Main navigation links */}
          <div className="menu-links">
            <div className="menu-link">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <p><a href="/" onClick={handleMenuLinkClick}>Home</a></p>
            </div>
            <div className="menu-link">
              <p><a href="/about" onClick={handleMenuLinkClick}>About</a></p>
            </div>
            <div className="menu-link services-dropdown">
              <p>
                <a href="/services" onClick={handleServicesDropdownToggle}>
                  Services
                  <span className={`dropdown-arrow ${isServicesDropdownOpen ? 'open' : ''}`}>▼</span>
                </a>
              </p>
              <div className={`dropdown-menu ${isServicesDropdownOpen ? 'open' : ''}`}>
                <div className="dropdown-item">
                  <a href="/services/web" onClick={handleServicesDropdownClick}>Web Development</a>
                </div>
                <div className="dropdown-item">
                  <a href="/services/seo" onClick={handleServicesDropdownClick}>SEO</a>
                </div>
                <div className="dropdown-item">
                  <a href="/services/app" onClick={handleServicesDropdownClick}>App Development</a>
                </div>
                <div className="dropdown-item">
                  <a href="/services/marketing" onClick={handleServicesDropdownClick}>Marketing</a>
                </div>
                <div className="dropdown-item">
                  <a href="/services/advanced-services" onClick={handleServicesDropdownClick}>Advanced Services</a>
                </div>
              </div>
            </div>
            <div className="menu-link products-dropdown">
              <p>
                <a href="#" onClick={handleProductsDropdownToggle}>
                  Products
                  <span className={`dropdown-arrow ${isProductsDropdownOpen ? 'open' : ''}`}>▼</span>
                </a>
              </p>
              <div className={`dropdown-menu ${isProductsDropdownOpen ? 'open' : ''}`}>
                <div className="dropdown-item">
                  <a href="/products/byte-bots" onClick={handleProductsDropdownClick}>Byte Bots</a>
                </div>
                <div className="dropdown-item">
                  <a href="/products/byte-suites" onClick={handleProductsDropdownClick}>Byte Suites</a>
                </div>
              </div>
            </div>
            <div className="menu-link">
              <p><a href="/industries" onClick={handleMenuLinkClick}>Industries</a></p>
            </div>
            <div className="menu-link journey-dropdown">
              <p>
                <a href="#" onClick={handleJourneyDropdownToggle}>
                  Insights
                  <span className={`dropdown-arrow ${isJourneyDropdownOpen ? 'open' : ''}`}>▼</span>
                </a>
              </p>
              <div className={`dropdown-menu ${isJourneyDropdownOpen ? 'open' : ''}`}>
                <div className="dropdown-item">
                  <a href="/careers" onClick={handleJourneyDropdownClick}>Careers</a>
                </div>
                <div className="dropdown-item">
                  <a href="/blogs" onClick={handleJourneyDropdownClick}>Blogs</a>
                </div>
              </div>
            </div>
            <div className="menu-link">
              <p><a href="/contact" onClick={handleMenuLinkClick}>Contact Us</a></p>
            </div>
            {/* <div className="menu-link">
              <p><a href="#" onClick={handleBrandFlowClick}>The Brand Building Flow</a></p>
            </div> */}
          </div>
          {/* Legal links at bottom */}
          <div className="legal-links menu-link">
            <p className="text-sm flex gap-6">
              <a href="/privacy-policy" onClick={handleMenuLinkClick}>Privacy Policy</a>
              <a href="/terms-conditions" onClick={handleMenuLinkClick}>Terms &amp; Conditions</a>
              <a href="/refund-policy" onClick={handleMenuLinkClick}>Refund Policy</a>
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export { Header };