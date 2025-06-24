import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../components/Header.css';

interface HeaderProps {
  heroImage?: string;
  logoImage?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  heroImage = '/assets/hero.jpg',
  logoImage = '/assets/bytes-logo.png',
  className = 'bytes-header'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [buttonText, setButtonText] = useState('Menu');
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  
  // Refs for DOM elements
  const menuRef = useRef<HTMLDivElement>(null);
  const menuImgContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  
  // Mouse tracking for tilt effect
  const mouse = useRef({ x: 0, y: 0 });
  const center = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Animation settings
  const defaultEase = "power4.inOut";
  const scales = [0.81, 0.84, 0.87, 0.9];

  // Breakpoint for mobile/tablet detection
  const MOBILE_BREAKPOINT = 768;

  // Check if screen size is mobile/tablet
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
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
    };

    // Add event listeners
    document.body.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    // Cleanup event listeners
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
      delay: 1.1,
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
    console.log('closeMenu function called');
    // Close Services dropdown if open
    setIsServicesDropdownOpen(false);
    
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
        console.log('Menu close animation completed');
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

  // Handle logo click - scroll to hero section
  const handleLogoClick = () => {
    // Don't scroll if menu is open
    if (isOpen) return;
    
    const heroElement = document.querySelector('#home') || document.querySelector('.hero') || document.querySelector('main');
    if (heroElement) {
      const lenisInstance = (window as any).lenis;
      if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
        lenisInstance.scrollTo(heroElement, {
          duration: 3.5,
          easing: (t: number) => 1 - Math.pow(1 - t, 3)
        });
      } else {
        heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Handle Services dropdown toggle
  const handleServicesDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };

  // Handle Services dropdown item click
  const handleServicesDropdownClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;

    // Close dropdown
    setIsServicesDropdownOpen(false);

    // Always initiate menu close animation
    closeMenu();

    // Scroll after the close animation duration
    setTimeout(() => {
      // Handle different service categories
      if (href === '#services') {
        // Scroll to main services section
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const lenisInstance = (window as any).lenis;
          if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
            lenisInstance.scrollTo(targetElement, {
              duration: 3.5,
              easing: (t: number) => 1 - Math.pow(1 - t, 3)
            });
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      } else {
        // For other service categories, show a placeholder message
        // You can replace this with actual section navigation when sections are created
        const serviceName = href.replace('#', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        alert(`${serviceName} services coming soon! For now, please check our main Services section.`);
        
        // Optionally scroll to services section as fallback
        const servicesElement = document.querySelector('#services');
        if (servicesElement) {
          const lenisInstance = (window as any).lenis;
          if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
            lenisInstance.scrollTo(servicesElement, {
              duration: 3.5,
              easing: (t: number) => 1 - Math.pow(1 - t, 3)
            });
          } else {
            servicesElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    }, 1300);
  };

  // Handle menu link clicks - close menu and scroll to section
  const handleMenuLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;

    // Always initiate menu close animation
    closeMenu();

    // Scroll after the close animation duration (matches closeMenu timeline ~1.25s)
    setTimeout(() => {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        const isServices = href === '#services';

        if (isServices) {
          // Immediate jump for Services section (per earlier requirement)
          targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          // Use Lenis for a controlled, smooth scroll so the cards section has
          // enough time to fully animate before leaving the viewport.
          const lenisInstance = (window as any).lenis;
          if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
            // Make the scroll a bit slower for a calmer transition
            lenisInstance.scrollTo(targetElement, {
              duration: 3.5, // slower than previous 2s
              easing: (t: number) => 1 - Math.pow(1 - t, 3) // ease-out cubic
            });
          } else {
            // Fallback to native smooth scroll if Lenis isn't available yet.
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // Ensure ScrollTrigger timelines stay in sync in edge-cases
          setTimeout(() => completeCardAnimations(), 2200);
        }
      }
    }, 1300); // slightly longer than closeMenu duration
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
      <nav className="bytes-nav">
        <div className="logo" onClick={handleLogoClick}>
          <img src={logoImage} alt="Bytes Platform Logo" />
        </div>
        <p className="menu-toggle" onClick={isOpen ? handleMenuClose : handleMenuOpen}>
          {buttonText}
        </p>
      </nav>

      {/* Full-screen menu overlay */}
      <div className="menu" ref={menuRef}>
        {/* Image container with layered images and 3D tilt effect */}
        <div className="menu-col menu-img" ref={menuImgContainerRef}>
          {/* Main hero image - always visible */}
          <img
            id="img-1"
            src={heroImage}
            alt=""
            ref={setImageRef(0)}
          />
          {/* Additional layered images that animate in */}
          <img
            id="img-2"
            src={heroImage}
            alt=""
            ref={setImageRef(1)}
          />
          <img
            id="img-3"
            src={heroImage}
            alt=""
            ref={setImageRef(2)}
          />
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
            <img src={logoImage} alt="Bytes Platform Logo" />
          </div>

          {/* Main navigation links */}
          <div className="menu-links">
            <div className="menu-link">
              <p><a href="#home" onClick={handleMenuLinkClick}>Home</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#about" onClick={handleMenuLinkClick}>About</a></p>
            </div>
            <div className="menu-link services-dropdown">
              <p>
                <a href="#services" onClick={handleServicesDropdownToggle}>
                  Services
                  <span className={`dropdown-arrow ${isServicesDropdownOpen ? 'open' : ''}`}>▼</span>
                </a>
              </p>
              <div className={`dropdown-menu ${isServicesDropdownOpen ? 'open' : ''}`}>
                <div className="dropdown-item">
                  <a href="#services" onClick={handleServicesDropdownClick}>All Services</a>
                </div>
                <div className="dropdown-item">
                  <a href="#cloud" onClick={handleServicesDropdownClick}>Cloud</a>
                </div>
                <div className="dropdown-item">
                  <a href="#digital-marketing" onClick={handleServicesDropdownClick}>Digital Marketing</a>
                </div>
                <div className="dropdown-item">
                  <a href="#digital-consultancy" onClick={handleServicesDropdownClick}>Digital Consultancy</a>
                </div>
                <div className="dropdown-item">
                  <a href="#advanced-services" onClick={handleServicesDropdownClick}>Advanced Services</a>
                </div>
              </div>
            </div>
            <div className="menu-link">
              <p><a href="#technologies" onClick={handleMenuLinkClick}>Technologies</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#careers" onClick={handleMenuLinkClick}>Careers</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#portfolio" onClick={handleMenuLinkClick}>Portfolio</a></p>
            </div>
            <div className="menu-link">
              <p><a href="/byte-bot">Byte Bot</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#contact" onClick={handleMenuLinkClick}>Contact Us</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Header };