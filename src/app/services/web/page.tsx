"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { Header } from "@/sections/Navbar";
import Link from "next/link";
import SimplifiedMERNOrbital from "@/components/SimplifiedMERNOrbital";
import AnimatedBeam from "@/components/AnimatedBeam";
import FAQ from "@/components/FAQ";
// @ts-ignore – lucide-react icons (ensure dependency installed in runtime)
import { ChevronDown, Menu, X, Code, Zap, Users, Award, ArrowRight, Star, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Play, Smartphone, Monitor, Database, Cloud, Globe, Layers, BarChart, TrendingUp, LayoutDashboard, CreditCard, Plug, ShoppingCart } from 'lucide-react';

const WebDevelopmentLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [counters, setCounters] = useState({
    website: 0,
    clients: 0,
    lines: 0,
    years: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [selectedService, setSelectedService] = useState<(typeof webDevServices)[number] | null>(null);
  const [serviceClosing, setServiceClosing] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<(typeof developmentProcess)[number] | null>(null);
  const [processClosing, setProcessClosing] = useState(false);

  // Tech stack animation
  const stackRef = useRef<HTMLDivElement | null>(null);
  const [stackVisible, setStackVisible] = useState(false);

  // Visibility for 'Why Choose Us' section
  const chooseRef = useRef<HTMLDivElement | null>(null);
  const [chooseVisible, setChooseVisible] = useState(false);

  // Visibility for Web Development Services section
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [servicesVisible, setServicesVisible] = useState(false);

  // Visibility for Development Process section
  const processRef = useRef<HTMLDivElement | null>(null);
  const [processVisible, setProcessVisible] = useState(false);

  // Visibility for Add-ons section
  const addOnsRef = useRef<HTMLDivElement | null>(null);
  const [addOnsVisible, setAddOnsVisible] = useState(false);

  // Visibility for individual CMS subsections
  const shopifyRef = useRef<HTMLDivElement | null>(null);
  const wpRef = useRef<HTMLDivElement | null>(null);
  const mernRef = useRef<HTMLDivElement | null>(null);
  const [shopifyVisible, setShopifyVisible] = useState(false);
  const [mernVisible, setMernVisible] = useState(false);
  const [wpVisible, setWpVisible] = useState(false);

  // Ensure page starts at top when refreshed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Disable automatic scroll restoration so the page always starts at the top
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!stackRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStackVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(stackRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!chooseRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setChooseVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(chooseRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer for Services section
  useEffect(() => {
    if (!servicesRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setServicesVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(servicesRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer for Development Process section
  useEffect(() => {
    if (!processRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setProcessVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(processRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer for Add-ons section
  useEffect(() => {
    if (!addOnsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAddOnsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(addOnsRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer for Shopify subsection
  useEffect(() => {
    if (!shopifyRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShopifyVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(shopifyRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer for WordPress subsection
  useEffect(() => {
    if (!wpRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setWpVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    observer.observe(wpRef.current);
    return () => observer.disconnect();
  }, []);

  // Observer for MERN subsection (trigger once)
  useEffect(() => {
    if (!mernRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMernVisible(true);       // show animation once
          observer.unobserve(entry.target); // stop observing so it won't reset
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(mernRef.current);
    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const duration = 2000;
    const targets = { website: 150, clients: 300, lines: 20000, years: 2 } as const;
    type TargetKey = keyof typeof targets;

    (Object.keys(targets) as TargetKey[]).forEach((key) => {
      let start = 0;
      const end = targets[key];
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
      }, 16);
    });
  };


  const webDevServices = [
    {
      icon: Globe,
      title: "Frontend Development",
      desc: "Utilizing modern frameworks like React, Vue.js, and Angular to create responsive and user-friendly interfaces.",
      technologies: ["React", "Vue.js", "Angular", "TypeScript"]
    },
    {
      icon: Database,
      title: "Backend Development",
      desc: "Implementing scalable server-side solutions with robust APIs, databases, and cloud integration.",
      technologies: ["Node.js", "Python", "PHP", "MongoDB"]
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      desc: "Ensuring responsive web applications that work flawlessly across all devices and screen sizes",
      technologies: ["PWA", "Responsive", "Mobile UI", "Cross-platform"]
    },
    {
      icon: Cloud,
      title: "Full-Stack Solutions",
      desc: "Providing end-to-end web development from concept to deployment with modern DevOps practices.",
      technologies: ["MEAN", "MERN", "JAMstack", "Serverless"]
    }
  ] as const;

  const techStack = [
    { name: "React", category: "Frontend", level: 92 },
    { name: "JavaScript", category: "Language", level: 93 },
    { name: "Next.js", category: "Framework", level: 90 },
    { name: "WordPress", category: "CMS", level: 88 },
    { name: "Webflow", category: "No-Code", level: 85 },
    { name: "Shopify", category: "E-commerce", level: 85 },
    { name: "Laravel", category: "Backend", level: 83 },
    { name: "TailwindCSS", category: "Style", level: 92 },
    { name: "Node.js", category: "Backend", level: 90 }
  ];

  const addOns = [
    { icon: Users, title: "CRM Integration" },
    { icon: Zap, title: "Chatbots", link: "/products/byte-bots" },
    { icon: BarChart, title: "Sales Analytics" },
    { icon: TrendingUp, title: "Sales Tracking" },
    { icon: LayoutDashboard, title: "Admin Panel" },
    { icon: CreditCard, title: "Payment Gateways" },
    { icon: Mail, title: "Newsletter Systems" },
    { icon: Plug, title: "API Integration" },
    { icon: Plug, title: "Third-party Software Integration" }
  ];

  const developmentProcess = [
    { step: "01", title: "Discovery & Planning", desc: "We analyze your requirements and create a detailed project roadmap", details: ["Stakeholder interviews & workshops", "Competitive analysis", "Technical feasibility study"] },
    { step: "02", title: "Design & Prototyping", desc: "Creating wireframes and interactive prototypes for user validation", details: ["User-flow mapping", "High-fidelity UI mock-ups", "Interactive prototypes"] },
    { step: "03", title: "Development", desc: "Building your application with clean, maintainable, and scalable code", details: ["Agile sprints", "Code reviews", "Continuous integration"] },
    { step: "04", title: "Testing & Quality Assurance", desc: "Comprehensive testing to ensure bug-free, performant applications", details: ["Unit & integration tests", "Performance benchmarking", "Security audits"] },
    { step: "05", title: "Deployment & Launch", desc: "Seamless deployment with monitoring and performance optimization", details: ["Automated CI/CD pipelines", "Cloud environment setup", "Zero-downtime rollouts"] },
    { step: "06", title: "Maintenance & Support", desc: "Ongoing support, updates, and feature enhancements", details: ["24/7 monitoring", "Regular updates", "Feature iterations based on user feedback"] }
  ];

  const cmsSolutions = [
    {
      icon: Globe,
      title: "We build WordPress sites",
      desc: "Custom themes, plugins, and scalable WordPress solutions optimised for performance and SEO.",
      points: [
        "Pixel-perfect custom themes",
        "WooCommerce storefronts",
        "Headless WordPress integrations",
        "On-page SEO & performance tuning"
      ]
    },
    {
      icon: ShoppingCart,
      title: "We build Shopify stores",
      desc: "High-conversion Shopify storefronts with custom apps, payment gateways and ERP integrations.",
      points: [
        "Custom Liquid templates & sections",
        "App & payment-gateway integrations",
        "Optimised checkout flows",
        "Analytics & sales automation"
      ]
    }
  ] as const;

  // Handlers for modal close with animation
  const closeServiceModal = () => {
    setServiceClosing(true);
    setTimeout(() => {
      setSelectedService(null);
      setServiceClosing(false);
    }, 300); // duration must match zoomOut animation
  };

  const closeProcessModal = () => {
    setProcessClosing(true);
    setTimeout(() => {
      setSelectedProcess(null);
      setProcessClosing(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Header />
      {/* Hero Section */}
      <section id="home" className="min-h-screen bg-blue-200 flex items-center relative overflow-hidden pt-16 lg:pt-24">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Side - Text */}
          <div className="space-y-6 animate-fade-in-up text-center lg:text-left flex flex-col justify-center h-full min-h-[350px]">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight break-words">
              <span className="text-gray-900 lg:text-5xl">Professional Web Development Services</span>
              <br />
              <span className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent lg:text-4xl">That Drive Business Growth</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
            At Bytes Platform, we specialize in delivering professional web development services tailored to meet the unique needs of each client.Combinig creativity with cutting edge technology to build custom solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4"> 
              <Link href="/contact" data-cta="true" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-center">
                Start Your Project
              </Link>
            </div>
          </div>
          {/* Right Side - Background Image */}
          <div
            className="relative flex items-center justify-center h-full min-h-[350px] bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/assets/newimages/laptop.png')" }}
          >
            {/* Right-side fade overlay */}
            <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none"
              style={{ background: "linear-gradient(to right, transparent 0%, #bfdbfe 100%)" }}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-blue-600" />
        </div>
      </section>
      {/* Web Development Services Section */}
      <section id="services" className="py-20 bg-gradient-to-r from-blue-50 to-white" ref={servicesRef}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Comprehensive Web Development <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a full spectrum of web development services, including:
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {webDevServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2 cursor-pointer ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{service.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">{counters.website}+</div>
              <div className="text-blue-200">Websites</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">{counters.clients}+</div>
              <div className="text-blue-200">Happy Clients</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">{(counters.lines / 1000).toFixed(0)}K+</div>
              <div className="text-blue-200">Lines of Code</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">{counters.years}+</div>
              <div className="text-blue-200">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20" ref={stackRef}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Our <span className="text-blue-600">Technology Stack</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We leverage the latest technologies and frameworks to build robust, scalable web applications that meet modern standards:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{tech.name}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {tech.category}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: stackVisible ? `${tech.level}%` : '0%' }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600">{tech.level}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CMS Solutions Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-white" ref={shopifyRef}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              CMS & E-commerce <span className="text-blue-600">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From content-driven websites to thriving online stores, we craft WordPress and Shopify experiences that grow with your business.
            </p>
          </div>

          <div className="space-y-20">
            {/* Shopify Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" ref={shopifyRef}>
              <div className={`transition-all duration-700 ${shopifyVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10'}`}>
                <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-6 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold leading-snug mt-4">We build Shopify stores</h3>
                  </div>
                  <p className="text-gray-600 mb-4">High-conversion Shopify storefronts with custom apps, payment gateways and ERP integrations.</p>
                  <ul className="list-disc ml-6 space-y-2 text-gray-600">
                    <li>Custom Liquid templates & sections</li>
                    <li>App & payment-gateway integrations</li>
                    <li>Optimised checkout flows</li>
                    <li>Analytics & sales automation</li>
                  </ul>
                </div>
              </div>
              <div className={`flex items-center justify-center transition-all duration-700 ${shopifyVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-10'}`}>
                <img
                  src="\assets\newimages\shopify-nobg.png"
                  alt="Shopify store preview"
                  className="object-contain animate-float"
                  style={{ maxWidth: '100%', maxHeight: '320px' }}
                />
              </div>
            </div>

            {/* WordPress Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" ref={wpRef}>
              <div className={`flex items-center justify-center transition-all duration-700 order-2 lg:order-1 ${wpVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '300ms' }}>
                <div className="w-full h-80 rounded-2xl overflow-hidden">
                  <AnimatedBeam>
                    <div className="flex min-h-80 w-full flex-col items-center justify-center text-xl text-white md:text-3xl">
                      <div className="max-w-lg rounded-xl bg-opacity-10 p-4 text-center font-light backdrop-blur-sm">
                        Look at the{' '}
                        <span className="line-through">
                          themes
                        </span>
                        {' '}
                        <strong>
                          plugins
                        </strong>
                        ! Look how they{' '}
                        <span className="line-through">
                          work
                        </span>
                        {' '}
                        <strong>
                         transform 
                        </strong>
                        
                        {' '}just
                      
                        {' '}for you!
                      </div>
                    </div>
                  </AnimatedBeam>
                </div>
              </div>
              <div className={`transition-all duration-700 order-1 lg:order-2 ${wpVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '300ms' }}>
                <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-6 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Globe className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold leading-snug mt-4">We build WordPress sites</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Custom themes, plugins, and scalable WordPress solutions optimised for performance and SEO.</p>
                  <ul className="list-disc ml-6 space-y-2 text-gray-600">
                    <li>Pixel-perfect custom themes</li>
                    <li>WooCommerce storefronts</li>
                    <li>Headless WordPress integrations</li>
                    <li>On-page SEO & performance tuning</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* MERN Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center" ref={mernRef}>
              <div className={`transition-all duration-700 ${mernVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '150ms' }}>
                <div className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-6 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Code className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold leading-snug mt-4">We build MERN Stack sites</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Robust full-stack JavaScript applications built with MongoDB, Express, React and Node.js.</p>
                  <ul className="list-disc ml-6 space-y-2 text-gray-600">
                    <li>REST & GraphQL API development</li>
                    <li>Scalable microservices architecture</li>
                    <li>Real-time features with WebSockets</li>
                    <li>Cloud deployment & CI/CD pipelines</li>
                  </ul>
                </div>
              </div>
              <div className={`flex items-center justify-center transition-all duration-700 ${mernVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '150ms' }}>
                <SimplifiedMERNOrbital />
              </div>
            </div>
          </div>
        </div >
      </section >

      {/* Add-ons Section */}
      <section className="py-20" ref={addOnsRef} >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Website <span className="text-blue-600">Add-ons</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your site with powerful integrations and features tailored to your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {addOns.map((add, index) => {
              const Icon = add.icon;
              const content = (
                <div
                  className={`p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${addOnsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Icon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <h3 className="text-xl font-bold">{add.title}</h3>
                  </div>
                </div>
              );

              return add.link ? (
                <Link key={index} href={add.link} className="block">
                  {content}
                </Link>
              ) : (
                <div key={index}>{content}</div>
              );
            })}
          </div>
        </div>
      </section >

      {/* Development Process Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-white" ref={processRef} >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gray-900">Our</span> <span className="text-blue-600">Development&nbsp;Process</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a proven development methodology that ensures quality, transparency, and timely delivery of your web project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developmentProcess.map((process, index) => (
              <div
                key={index}
                className={`relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2 cursor-pointer ${processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setSelectedProcess(process)}
              >
                <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                  <span className="font-bold text-blue-600 text-lg">{process.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{process.title}</h3>
                <p className="text-gray-600 line-clamp-1">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Why Choose Us Section */}
      <section className="py-20" ref={chooseRef}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Image */}
            <div
              className={`relative w-full aspect-square max-w-sm lg:max-w-md lg:-mt-8 xl:-mt-8 lg:scale-[1.1] xl:scale-[1.2] rounded-3xl overflow-hidden shadow-3xl transition-all duration-700 transform origin-center ${chooseVisible ? 'opacity-100 animate-float' : 'opacity-0 translate-y-8'}`}
            >
              <Image
                src="/assets/newimages/whychoseus.png"
                alt="Why choose our web development services"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                style={{
                  maskImage: 'linear-gradient(to bottom, white 75%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to bottom, white 75%, transparent)'
                }}
              />
            </div>

            {/* Right Side - Text */}
            <div className={`space-y-6 transition-all duration-700 ${chooseVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Why Choose Our <span className="text-blue-600">Web Development</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We combine technical expertise with creative problem-solving to deliver web solutions that not only meet your requirements but exceed your expectations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">Expertise Across Technologies</h4>
                    <p className="text-gray-600 text-sm">From React and Node.js to WordPress and Shopify, we leverage the latest technologies to build scalable and secure solutions.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">Tailored Solutions</h4>
                    <p className="text-gray-600 text-sm">We understand that every business is unique. Our solutions are customized to meet your specific needs and goals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">End-to-End Services:</h4>
                    <p className="text-gray-600 text-sm">Robust security measures and best practices to protect your application and user data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* FAQ Section */}
      <FAQ />

      {/* Call To Action Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-70 pointer-events-none"
          style={{ backgroundImage: "url('/assets/WebDev/buildwithus.png')" }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-2">
            Ready to <span className="text-white">Transform Your Digital Presence?</span>
          </h2>
          <p className="text-lg text-white-600 leading-relaxed mb-4">
          We don't just build websites; we create professional websites that empower your business to thrive in the digital age. If you're looking for web development services in the USA, our team is here to bring your vision to life.
          </p>
          <Link
            href="/contact"
            data-cta="true"
            className="inline-block px-10 py-4 bg-white text-blue-700 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Build With Us
          </Link>
        </div>
      </section >

      {/* Modal Overlay */}
      {
        selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={closeServiceModal}>
            <div
              className={`w-[70vw] max-w-[70vw] bg-white rounded-3xl shadow-2xl p-10 relative overflow-y-auto max-h-[80vh] transform transition-all duration-300 ${serviceClosing ? 'animate-zoom-out' : 'animate-zoom-in'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={closeServiceModal}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-start space-x-6 mb-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                  <selectedService.icon className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">{selectedService.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{selectedService.desc}</p>
                </div>
              </div>
              <h4 className="font-semibold text-lg mb-3">Key Technologies</h4>
              <div className="flex flex-wrap gap-3 mb-6">
                {selectedService.technologies.map((tech, idx) => (
                  <span key={idx} className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full font-medium text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-gray-600">Get in touch to learn how our {selectedService.title.toLowerCase()} expertise can accelerate your project.</p>
            </div>
          </div>
        )
      }

      {/* Process Modal */}
      {
        selectedProcess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={closeProcessModal}>
            <div className={`w-[60vw] max-w-[60vw] bg-white rounded-3xl shadow-2xl p-10 relative transform transition-all duration-300 ${processClosing ? 'animate-zoom-out' : 'animate-zoom-in'}`} onClick={e => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={closeProcessModal}>
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center font-bold text-blue-600 text-xl">
                  {selectedProcess.step}
                </div>
                <h3 className="text-3xl font-bold">{selectedProcess.title}</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">{selectedProcess.desc}</p>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                {selectedProcess.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      }

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes zoomOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.8);
          }
        }
        
        .animate-zoom-in {
          animation: zoomIn 0.3s ease-out forwards;
        }
        
        .animate-zoom-out {
          animation: zoomOut 0.3s ease-in forwards;
        }
        
        @media (max-width: 768px) {
          .animate-slide-in-left,
          .animate-slide-in-right {
            animation: fadeInUp 0.8s ease-out;
          }
        }
      `}</style>
    </div >
  );
};

export default WebDevelopmentLanding;