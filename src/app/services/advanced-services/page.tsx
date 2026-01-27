'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Header } from '../../../sections/Navbar';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import FAQ from '@/components/FAQ-Advanced';

// Types for external libraries
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

const AdvancedServicesPage: React.FC = () => {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable GSAP-based starter animations
    const initializeAnimations = async () => {
      /* Starter animations have been removed */

      // Intersection Observer for fade-in effects
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              // Trigger transition via inline styles to avoid missing Tailwind classes in production build
              el.style.opacity = '1';
              el.style.transform = 'translateX(0)';
              obs.unobserve(el);
            }
          });
        },
        {
          threshold: 0.2,
        }
      );

      document.querySelectorAll('[data-fade]').forEach((el) => observer.observe(el));
    };

    initializeAnimations();
  }, []);

  const subServices = [
    {
      title: 'Data Modernization',
      description: 'Transform legacy systems into modern, scalable data architectures that drive business growth and operational efficiency.'
    },
    {
      title: 'Advanced Analytics',
      description: 'Leverage machine learning and AI to extract actionable insights from complex datasets and predict future trends.'
    },
    {
      title: 'Connected Intelligence',
      description: 'Integrate IoT devices and sensors to create intelligent ecosystems that respond to real-time data streams.'
    },
    {
      title: 'Generative AI',
      description: 'Harness the power of generative artificial intelligence to automate content creation and enhance decision-making processes.'
    }
  ];

  // Animation variants
  const wordContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const wordVariant = {
    hidden: { opacity: 0, y: `0.5em` },
    visible: { opacity: 1, y: 0 }
  };

  const AnimatedWords: React.FC<{ text: string; className?: string; as?: React.ElementType }> = ({ text, className = "", as = "span" }) => {
    return (
      <motion.span
        className={className + " inline-block"}
        variants={wordContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        {React.createElement(
          as,
          null,
          text.split(" ").map((word, i) => (
            <motion.span key={i} variants={wordVariant} className="inline-block mr-1">
              {word}
            </motion.span>
          ))
        )}
      </motion.span>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation Bar */}
      <Header  />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#010a14]"
        aria-label="Hero section"
      >
        {/* Background Image */}
        <Image
          src="/assets/servicebg.png"
          alt="Advanced Services Background"
          fill
          priority
          className="object-cover object-center absolute inset-0 z-0"
        />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <AnimatedWords text="Advanced Services" className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#010a14] mb-4 sm:mb-6" as="h1" />
          
          <AnimatedWords text="Transforming businesses through cutting-edge technology solutions and data-driven innovation" className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-black font-light max-w-4xl mx-auto leading-relaxed px-2" as="p" />
        </div>
      </section>

      {/* Data & Analytics Section - Optimized */}
      <section className="relative py-20 bg-[#010a14] text-white animate-section overflow-hidden" aria-labelledby="data-analytics-heading">
        {/* Background Circle */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-100/40 rounded-full blur-2xl -z-10"></div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* First Subsection - Overview */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-20">
            <motion.div 
              className="animate-content text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Data &amp; Analytics
              </h2>
              <p className="text-base sm:text-lg text-gray-200 mb-4 sm:mb-6 leading-relaxed">
                Unlock the full potential of your data with comprehensive analytics solutions. We help organizations transform raw data into strategic insights that drive informed decision-making and competitive advantage.
              </p>
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                Our data-driven approach combines advanced statistical methods, machine learning algorithms, and visualization techniques to reveal hidden patterns and predict future outcomes with unprecedented accuracy.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg shadow-xl overflow-hidden bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900"
            >
              <Image
                src="/assets/newimages/binary_loop.webp"
                alt="Data Analytics Visualization"
                fill
                className="object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Second Subsection - Sub-services Cards */}
          <motion.div 
            ref={cardsRef}
            className="bg-gradient-to-br from-white to-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-inner"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#010a14] mb-8 sm:mb-12 text-center">
              Our Data &amp; Analytics Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {subServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="service-card bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.08,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  role="article"
                  tabIndex={0}
                  aria-label={`${service.title} service details`}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-[#010a14] mb-3 sm:mb-4 group-hover:text-[#0d3b60] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section 
        className="relative py-20 bg-white text-black animate-section overflow-hidden"
        aria-labelledby="security-heading"
      >
        {/* Background Circles */}
        <div className="absolute top-16 left-16 w-80 h-80 bg-blue-200/25 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-2xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Image on the left */}
            <div className="animate-content order-2 lg:order-1" data-fade="left">
              <motion.div 
                initial={{ opacity: 0, y: 60, scale: 0.85, rotate: -6 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 70, damping: 15, duration: 0.9 }}
                viewport={{ once: false }}
                whileHover={{ scale: 1.04 }}
              >
                <Image
                  src="/assets/Cybersecurity.jpg"
                  alt="Cybersecurity shield and lock protection"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </motion.div>
            </div>
            {/* Text on the right */}
            <div className="animate-content text-center lg:text-left order-1 lg:order-2" data-fade="right">
              <AnimatedWords text="Cybersecurity Solutions" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#010a14] mb-4 sm:mb-6 leading-tight" as="h2" />
              <AnimatedWords text="Protect your digital assets with comprehensive cybersecurity solutions designed for the modern threat landscape. Our multi-layered security approach ensures your business remains resilient against evolving cyber threats." className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed" as="p" />
              <AnimatedWords text="From threat detection and incident response to compliance management and security awareness training, we provide end-to-end protection that scales with your business needs." className="text-base sm:text-lg text-gray-700 leading-relaxed" as="p" />
            </div>
          </div>
        </div>
      </section>

      {/* Emerging Technologies Section */}
      <section 
        className="relative py-20 bg-[#010a14] text-white animate-section overflow-hidden"
        aria-labelledby="emerging-tech-heading"
      >
        {/* Background Circles */}
        <div className="absolute top-24 right-24 w-88 h-88 bg-blue-100/35 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-16 left-12 w-60 h-60 bg-slate-200/40 rounded-full blur-2xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="animate-content text-center lg:text-left" data-fade="left">
              <AnimatedWords text="Emerging Technologies" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight" as="h2" />
              <AnimatedWords text="Stay ahead of the curve with cutting-edge technologies that reshape industries. We specialize in implementing AI, IoT, blockchain, and other transformative technologies that create new opportunities for growth and innovation." className="text-base sm:text-lg text-gray-200 mb-4 sm:mb-6 leading-relaxed" as="p" />
              <AnimatedWords text="Our expert team helps you navigate the complex landscape of emerging technologies, ensuring strategic adoption that delivers measurable business value and competitive differentiation." className="text-base sm:text-lg text-gray-200 leading-relaxed" as="p" />
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 60, scale: 0.85, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 70, damping: 15, duration: 0.9 }}
              viewport={{ once: false }}
              whileHover={{ scale: 1.04 }}
            >
              <Image
                src="/assets/Emerging_tech.png"
                alt="Futuristic technology and AI visualization"
                width={600}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full flex flex-col items-center justify-center py-0">
        <FAQ />
      </section>

      {/* Call to Action Section */}
      <section className="relative py-16 pb-24 overflow-hidden bg-[#09122C] text-white">
        {/* Background Wallpaper */}
        <Image
          src="/assets/wallpaper.jpg"
          alt="Transform business background wallpaper"
          fill
          priority
          className="object-cover object-center fixed inset-0 z-0"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-[#09122C]/70 z-0" />
        
        {/* Background Circles */}
        <div className="absolute top-8 left-8 w-72 h-72 bg-[#09122C]/20 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-8 right-8 w-64 h-64 bg-cyan-200/25 rounded-full blur-2xl z-0"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedWords text="Ready to Transform Your Business?" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6" as="h2" />
          <AnimatedWords text="Let's discuss how our advanced services can accelerate your digital transformation journey." className="text-lg sm:text-xl text-white mb-6 sm:mb-8 leading-relaxed" as="p" />
          <button
            data-cta="true"
            className="bg-[#09122C] hover:bg-[#0C1A40] text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#19274D] text-sm sm:text-base"
            aria-label="Get started with advanced services"
            onClick={() => router.push('/contact')}
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdvancedServicesPage;