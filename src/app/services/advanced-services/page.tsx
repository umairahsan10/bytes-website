'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Header } from '../../../sections/Navbar';

// Types for external libraries
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

const AdvancedServicesPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Header  />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-[#010a14]"
        aria-label="Hero section"
      >
        {/* Background Image */}
        <Image
          src="/assets/servicebg.jpg"
          alt="Advanced Services Background"
          fill
          priority
          className="object-cover object-center absolute inset-0 z-0"
        />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-700 to-violet-800 bg-clip-text text-transparent mb-6 animate-[pulse_1.5s_ease-in-out_1] hover:scale-105 transition-all duration-700 ease-in-out">
            Advanced Services
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-light max-w-4xl mx-auto leading-relaxed">
            Transforming businesses through cutting-edge technology solutions and data-driven innovation
          </p>
        </div>
      </section>

      {/* Data & Analytics Section */}
      <section className="relative min-h-screen pt-32 pb-32 bg-white animate-section overflow-hidden" aria-labelledby="data-analytics-heading">
        {/* Background Circle */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-100/40 rounded-full blur-2xl -z-10"></div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* First Subsection - Overview */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div className="animate-content" data-fade="left">
              <h2 
                id="data-analytics-heading"
                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Data & Analytics
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Unlock the full potential of your data with comprehensive analytics solutions. 
                We help organizations transform raw data into strategic insights that drive 
                informed decision-making and competitive advantage.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our data-driven approach combines advanced statistical methods, machine learning 
                algorithms, and visualization techniques to reveal hidden patterns and predict 
                future outcomes with unprecedented accuracy.
              </p>
            </div>
            <div className="animate-content" data-fade="right">
              <Image
                src="/assets/data&analytics.jpg"
                alt="Data analytics dashboard visualization"
                width={600}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>

          {/* Second Subsection - Sub-services Cards */}
          <div 
            ref={cardsRef}
            className="bg-[#09122C] text-white rounded-2xl p-8 lg:p-12"
          >
            <h3 className="text-3xl font-bold mb-12 text-center">
              Our Data & Analytics Services
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {subServices.map((service, index) => (
                <div
                  key={index}
                  className="service-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  role="article"
                  tabIndex={0}
                  aria-label={`${service.title} service details`}
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-[#09122C] transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed dark:text-blue-100">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section 
        className="relative min-h-screen py-20 bg-[#09122C] text-white animate-section overflow-hidden"
        aria-labelledby="security-heading"
      >
        {/* Background Circles */}
        <div className="absolute top-16 left-16 w-80 h-80 bg-blue-200/25 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-2xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image on the left */}
            <div className="animate-content" data-fade="left">
              <Image
                src="/assets/Cybersecurity.jpg"
                alt="Cybersecurity shield and lock protection"
                width={600}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            {/* Text on the right */}
            <div className="animate-content" data-fade="right">
              <h2 
                id="security-heading"
                className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Cybersecurity Solutions
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Protect your digital assets with comprehensive cybersecurity solutions designed 
                for the modern threat landscape. Our multi-layered security approach ensures 
                your business remains resilient against evolving cyber threats.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                From threat detection and incident response to compliance management and 
                security awareness training, we provide end-to-end protection that scales 
                with your business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emerging Technologies Section */}
      <section 
        className="relative py-20 bg-gradient-to-br from-gray-50 to-slate-100 animate-section overflow-hidden"
        aria-labelledby="emerging-tech-heading"
      >
        {/* Background Circles */}
        <div className="absolute top-24 right-24 w-88 h-88 bg-blue-100/35 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-16 left-12 w-60 h-60 bg-slate-200/40 rounded-full blur-2xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-content" data-fade="left">
              <h2 
                id="emerging-tech-heading"
                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Emerging Technologies
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Stay ahead of the curve with cutting-edge technologies that reshape industries. 
                We specialize in implementing AI, IoT, blockchain, and other transformative 
                technologies that create new opportunities for growth and innovation.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our expert team helps you navigate the complex landscape of emerging technologies, 
                ensuring strategic adoption that delivers measurable business value and 
                competitive differentiation.
              </p>
            </div>
            <div className="animate-content" data-fade="right">
              <Image
                src="/assets/Emerging_tech.png"
                alt="Futuristic technology and AI visualization"
                width={600}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
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
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Let's discuss how our advanced services can accelerate your digital transformation journey.
          </p>
          <button
            className="bg-[#09122C] hover:bg-[#0C1A40] text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#19274D]"
            aria-label="Get started with advanced services"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdvancedServicesPage;