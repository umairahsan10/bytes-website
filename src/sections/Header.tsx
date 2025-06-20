import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
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
    gsap.set(".menu-logo img", { y: 50 });
    gsap.set(".menu-link p", { y: 40 });
    gsap.set(".menu-sub-item p", { y: 12 });
    
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

    // Add event listeners
    document.body.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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

  // Open menu animation
  const openMenu = () => {
    gsap.to(".menu", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
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
      duration: 1,
      delay: 0.75,
      ease: "power3.out",
    });

    gsap.to(".menu-link p", {
      y: 0,
      duration: 1,
      stagger: 0.075,
      delay: 1,
      ease: "power3.out",
    });

    gsap.to(".menu-sub-item p", {
      y: 0,
      duration: 0.75,
      stagger: 0.05,
      delay: 1,
      ease: "power3.out",
    });

    if (isMobile) {
      gsap.to(["#img-2, #img-3, #img-4"], {
        top: "50%",
        duration: 1.25,
        ease: defaultEase,
        stagger: 0.1,
        delay: 0.25,
        onComplete: () => {
          setIsOpen(true);
        }
      });
    } else {
      gsap.to(["#img-2, #img-3, #img-4"], {
        top: "50%",
        duration: 1.25,
        ease: defaultEase,
        stagger: 0.1,
        delay: 0.25,
        onComplete: () => {
          setIsOpen(true);
        }
      });
    }
  };

  // Close menu animation
  const closeMenu = () => {
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
      duration: 0.6,
      stagger: 0.03,
      ease: "power3.in",
    });

    gsap.to(".menu-link p", {
      y: 40,
      duration: 0.7,
      stagger: 0.05,
      ease: "power3.in",
    });

    gsap.to(".menu-logo img", {
      y: 50,
      duration: 0.8,
      ease: "power3.in",
    });

    // Animate the main menu clip path
    gsap.to(".menu", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      pointerEvents: "none",
      duration: 1.25,
      ease: defaultEase,
      delay: 0.3,
      onComplete: () => {
        setIsOpen(false);
        setButtonText('Menu');
      }
    });
  };

  // Handle menu open button click
  const handleMenuOpen = () => {
    if (isOpen) return;
    openMenu();
  };

  // Handle menu close button click
  const handleMenuClose = () => {
    if (!isOpen) return;
    closeMenu();
  };

  // Helper function to set image refs for GSAP animations
  const setImageRef = (index: number) => (el: HTMLImageElement | null) => {
    if (imagesRef.current) {
      imagesRef.current[index] = el;
    }
  };

  return (
    <div className={`bytes-menu-container ${className}`}>
      {/* Navigation bar */}
      <nav className="bytes-nav">
        <div className="logo">
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
          <div className="menu-logo">
            <img src={logoImage} alt="Bytes Platform Logo" />
          </div>

          {/* Main navigation links */}
          <div className="menu-links">
            <div className="menu-link">
              <p><a href="#home">Home</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#about">About</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#services">Services</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#technologies">Technologies</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#careers">Careers</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#portfolio">Portfolio</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#contact">Contact Us</a></p>
            </div>
          </div>

          {/* Menu footer with contact info and social links */}
          <div className="menu-footer">
            <div className="menu-sub-col">
              <div className="menu-sub-item">
                <p className="section-title">Contact Us</p>
              </div>
              <div className="menu-sub-item">
                <p>+12149374683</p>
              </div>
              <div className="menu-sub-item">
                <p>info@bytesplatform.com</p>
              </div>
              <br />
              <div className="menu-sub-item">
                <p className="section-title">Location</p>
              </div>
              <div className="menu-sub-item">
                <p>Bytes Platform Production Office</p>
              </div>
              <div className="menu-sub-item">
                <p>14-C 2nd Commercial Ln</p>
              </div>
              <div className="menu-sub-item">
                <p>Defence V</p>
              </div>
            </div>
            <div className="menu-sub-col">
              <div className="menu-sub-item">
                <p className="section-title">Follow Us</p>
              </div>
              <div className="menu-sub-item">
                <p><a href="#">LinkedIn</a></p>
              </div>
              <div className="menu-sub-item">
                <p><a href="https://www.instagram.com/bytesplatform/">Instagram</a></p>
              </div>
              <div className="menu-sub-item">
                <p><a href="#">Twitter</a></p>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Header };