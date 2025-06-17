'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface NavigationMenuProps {
  logoSrc: string;
  heroImageSrc: string;
  onNavigate: (section: string) => void;
}

const links = [
  'Home',
  'About',
  'Services',
  'Technologies',
  'Careers',
  'Portfolio',
  'Contact',
];

const NavigationMenu: React.FC<NavigationMenuProps> = ({ logoSrc, heroImageSrc, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Load GSAP dynamically to avoid SSR issues
  useEffect(() => {
    let ctx: gsap.Context | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.set('.menu-overlay', {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        });
      });

      if (isOpen) {
        gsap.to('.menu-overlay', {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.1,
          ease: 'power4.inOut',
        });
        gsap.fromTo(
          '.menu-link',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, delay: 0.6, duration: 0.8, ease: 'power3.out' }
        );
      } else {
        gsap.to('.menu-overlay', {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          duration: 1.1,
          ease: 'power4.inOut',
        });
      }
    })();

    return () => ctx?.revert();
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4">
        <Image src={logoSrc} alt="logo" width={120} height={40} />
        <button
          className="text-white uppercase tracking-widest text-sm menu-open hover:opacity-75 transition-opacity"
          onClick={() => setIsOpen(true)}
        >
          Menu
        </button>
      </nav>

      {/* Overlay Menu */}
      <div
        className={`menu-overlay fixed inset-0 bg-[#101010] ${isOpen ? 'z-[60] pointer-events-auto' : 'z-[-1] pointer-events-none'} flex flex-col md:flex-row`}
      >
        {/* Close */}
        <div className="absolute top-0 right-0 p-6">
          <button
            className="text-white uppercase tracking-widest text-sm menu-close hover:opacity-75 transition-opacity"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        {/* Images (desktop only) */}
        <div className="relative flex-1 hidden md:block menu-img overflow-hidden">
          {/* Four stacked images for subtle parallax */}
          {[1, 2, 3, 4].map((i) => (
            <Image
              key={i}
              src={heroImageSrc} 
              alt="hero"
              fill
              className={`object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-${i === 1 ? '90' : i === 2 ? '70' : i === 3 ? '50' : '30'}`}
            />
          ))}
        </div>

        {/* Links */}
        <ul className="flex-1 flex flex-col justify-center items-start px-10 gap-3 menu-items">
          {links.map((label) => (
            <li
              key={label}
              className="menu-link text-white text-3xl md:text-4xl font-semibold cursor-pointer hover:opacity-75 transition-opacity"
              onClick={() => {
                onNavigate(label);
                handleClose();
              }}
            >
              {label}
            </li>
          ))}

          <div className="mt-8 space-y-2 text-xs text-gray-300 font-mono menu-footer">
            <p className="uppercase tracking-widest">Contact Us</p>
            <p>+1 (214) 937-4683</p>
            <p>info@bytesplatform.com</p>
          </div>
        </ul>
      </div>
      <style jsx>{`
        .menu-overlay {
          clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
        }
      `}</style>
    </>
  );
};

export default NavigationMenu;