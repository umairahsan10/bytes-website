'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Header } from "@/sections/Navbar";

const ByteSuitePage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* -------------------- Animation Variants -------------------- */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  } as const;

  const textReveal = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  } as const;

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1 } },
  } as const;

  const floatingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    },
  } as const;

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  } as const;

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  } as const;

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  } as const;

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  } as const;

  const fadeInDown = {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  } as const;

  const bounceIn = {
    hidden: { opacity: 0, scale: 0.3, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        type: "spring",
        stiffness: 200
      } 
    },
  } as const;

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  } as const;

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  } as const;

  const rotateIn = {
    hidden: { opacity: 0, rotate: -180, scale: 0.5 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1, 
      transition: { 
        duration: 1,
        type: "spring",
        stiffness: 100
      } 
    },
  } as const;

  /* -------------------------- Markup -------------------------- */
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 111, 0, 0.1) 0%, transparent 50%)`,
          }}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500 rounded-full opacity-40"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 2, 1] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="min-h-screen flex items-center py-20 px-8"
        >
          <div className="max-w-7xl mx-auto w-full">
            <motion.h1
              className="text-5xl lg:text-9xl font-black leading-tight tracking-tight"
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
            >
              BYTESUITE CRM
            </motion.h1>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <motion.div variants={slideInFromLeft} className="space-y-8">
                
                
                <motion.h2
                  className="text-3xl lg:text-5xl font-bold text-orange-500"
                  variants={bounceIn}
                >
                  Finally, a CRM that works for you, not against you
                </motion.h2>

                <motion.p
                  className="text-2xl lg:text-3xl text-gray-300 leading-relaxed"
                  variants={fadeInUp}
                >
                  AI-powered customer relationship management that transforms how you handle leads, 
                  nurture relationships, and close deals. Built for modern businesses that demand more.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#ff6f00', boxShadow: '0 20px 60px rgba(255, 111, 0, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-500 text-black px-12 py-4 font-black tracking-wide text-lg"
                  >
                    START FREE TRIAL
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, borderColor: '#ff6f00', color: '#ff6f00' }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white px-12 py-4 font-black tracking-wide text-lg"
                  >
                    SCHEDULE DEMO
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Hero Image */}
              <motion.div variants={slideInFromRight} className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative z-10"
                >
                  <img
                    src="/assets/bytesuite-hero.jpg"
                    alt="ByteSuite CRM Dashboard"
                    className="w-full h-auto rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x400/1f2937/ffffff?text=ByteSuite+CRM+Dashboard';
                    }}
                  />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-orange-500 transform rotate-45"
                />
                <motion.div
                  animate={{ rotate: [0, -10, 0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-6 -left-6 w-6 h-6 border-2 border-orange-500 transform rotate-45"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Value Proposition Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="py-32 px-8"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-20">
              <motion.h2 
                className="text-5xl lg:text-7xl font-black mb-8"
                variants={fadeInDown}
              >
                Why ByteSuite CRM is Different
              </motion.h2>
              <motion.div 
                className="w-16 h-1 bg-orange-500 mx-auto mb-8"
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  title: "AI-Powered Intelligence",
                  description: "ByteBot assistant handles customer queries, provides insights, and automates follow-ups 24/7",
                  icon: "🤖",
                  image: "/assets/ai-intelligence.jpg"
                },
                {
                  title: "Built-in Revenue Tools",
                  description: "Native billing, scheduling, and analytics - no third-party integrations needed",
                  icon: "💰",
                  image: "/assets/revenue-tools.jpg"
                },
                {
                  title: "Conversion-Focused Design",
                  description: "Every feature designed to move prospects through your pipeline faster",
                  icon: "🎯",
                  image: "/assets/conversion-design.jpg"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-gray-900 p-8 rounded-lg border border-gray-800 group"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x200/374151/ffffff?text=${benefit.title}`;
                      }}
                    />
                  </motion.div>
                  <motion.div 
                    className="text-5xl mb-4"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  >
                    {benefit.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-300 leading-relaxed text-lg"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                  >
                    {benefit.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Deep Dive */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="py-32 px-8 bg-gray-900"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-20">
              <motion.h2 
                className="text-5xl lg:text-7xl font-black mb-8"
                variants={fadeInDown}
              >
                Features Deep Dive
              </motion.h2>
              <motion.div 
                className="w-16 h-1 bg-orange-500 mx-auto"
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="space-y-32">
              {[
                {
                  title: "Smart Lead Management",
                  features: [
                    "Intelligent Lead Capture - Webforms with automatic lead scoring and source tracking",
                    "AI-Powered Lead Qualification - ByteBot pre-qualifies leads based on your criteria",
                    "Custom Pipelines - Build pipelines that match your exact sales process",
                    "Automated Nurturing - Email sequences, task reminders, and follow-up automation"
                  ],
                  image: "/assets/lead-management.jpg"
                },
                {
                  title: "ByteBot AI Assistant",
                  features: [
                    "24/7 Customer Support - Answers FAQs, schedules appointments, captures leads",
                    "Sales Intelligence - Provides real-time insights on deals and customer behavior",
                    "Smart Recommendations - Suggests next best actions for each prospect",
                    "CRM Integration - Reads your entire customer database to provide contextual responses"
                  ],
                  image: "/assets/bytebot-ai.jpg"
                },
                {
                  title: "Communication Hub",
                  features: [
                    "Unified Inbox - Email, WhatsApp, SMS, and chat in one interface",
                    "Calendar Sync - Automatic appointment scheduling and reminders",
                    "Team Collaboration - Internal notes, task assignments, and team tagging",
                    "Communication History - Complete interaction timeline for every contact"
                  ],
                  image: "/assets/communication-hub.jpg"
                },
                {
                  title: "Sales Automation & Analytics",
                  features: [
                    "Deal Flow Automation - Automatic stage progression and notifications",
                    "Sales Forecasting - AI-driven revenue predictions and trend analysis",
                    "Custom Dashboards - Real-time KPIs and performance metrics",
                    "Advanced Reporting - Sales performance, conversion rates, and ROI tracking"
                  ],
                  image: "/assets/sales-analytics.jpg"
                },
                {
                  title: "Built-in Business Tools",
                  features: [
                    "Branded Invoicing - Professional invoices with automated billing",
                    "Appointment Scheduler - Online booking with calendar sync and reminders",
                    "Inventory Integration - Track products, SKUs, and stock levels",
                    "Financial Reporting - Revenue tracking with tax/GST support"
                  ],
                  image: "/assets/business-tools.jpg"
                }
              ].map((section, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="grid lg:grid-cols-2 gap-16 items-center"
                >
                  <motion.div 
                    variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                    className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                  >
                    <motion.h3 
                      className="text-4xl lg:text-5xl font-bold"
                      variants={bounceIn}
                    >
                      {section.title}
                    </motion.h3>
                    <ul className="space-y-4">
                      {section.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                        >
                          <motion.span 
                            className="text-orange-500 text-2xl"
                            variants={bounceIn}
                          >
                            ✓
                          </motion.span>
                          <span className="text-gray-300 leading-relaxed text-lg">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div 
                    variants={index % 2 === 0 ? slideInFromRight : slideInFromLeft}
                    className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 1 }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="relative overflow-hidden rounded-lg shadow-2xl"
                    >
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-96 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/600x400/374151/ffffff?text=${section.title}`;
                        }}
                      />
                      <motion.div 
                        className="absolute inset-0 bg-orange-500 mix-blend-multiply opacity-0"
                        whileHover={{ opacity: 0.2 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Target Audience Benefits */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="py-32 px-8"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-20">
              <motion.h2 
                className="text-5xl lg:text-7xl font-black mb-8"
                variants={fadeInDown}
              >
                Target Audience Benefits
              </motion.h2>
              <motion.div 
                className="w-16 h-1 bg-orange-500 mx-auto"
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: "For Consultants & Service Providers",
                  benefits: [
                    "Replace 5+ disconnected tools with one integrated system",
                    "Automated client communication and project management",
                    "Professional invoicing and recurring billing",
                    "Client portal for transparent communication"
                  ],
                  image: "/assets/consultants.jpg"
                },
                {
                  title: "For Sales Teams & Agencies",
                  benefits: [
                    "AI assistant that never sleeps or misses a follow-up",
                    "Team performance tracking and goal management",
                    "Lead scoring and qualification automation",
                    "Collaborative deal management"
                  ],
                  image: "/assets/sales-teams.jpg"
                },
                {
                  title: "For Small-Medium Businesses",
                  benefits: [
                    "Enterprise-level features without enterprise complexity",
                    "Scales from startup to growing business",
                    "Beautiful, intuitive interface that teams actually use",
                    "Affordable pricing that grows with you"
                  ],
                  image: "/assets/smb.jpg"
                },
                {
                  title: "For E-commerce & Retail",
                  benefits: [
                    "Customer lifecycle management from prospect to repeat buyer",
                    "Inventory integration with sales tracking",
                    "Automated customer support and order management",
                    "Purchase behavior analytics and recommendations"
                  ],
                  image: "/assets/ecommerce.jpg"
                }
              ].map((audience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900 p-8 rounded-lg border border-gray-800 group"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src={audience.image}
                      alt={audience.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x200/374151/ffffff?text=${audience.title}`;
                      }}
                    />
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold mb-6 text-orange-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  >
                    {audience.title}
                  </motion.h3>
                  <ul className="space-y-3">
                    {audience.benefits.map((benefit, benefitIndex) => (
                      <motion.li 
                        key={benefitIndex} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ delay: index * 0.1 + benefitIndex * 0.1 + 0.4 }}
                      >
                        <motion.span 
                          className="text-orange-500 text-xl"
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: '-100px' }}
                          transition={{ duration: 0.4, delay: index * 0.1 + benefitIndex * 0.1 + 0.5 }}
                        >
                          •
                        </motion.span>
                        <span className="text-gray-300 text-lg">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Technical Advantages */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="py-32 px-8 bg-gray-900"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-20">
              <motion.h2 
                className="text-5xl lg:text-7xl font-black mb-8"
                variants={fadeInDown}
              >
                Technical Advantages
              </motion.h2>
              <motion.div 
                className="w-16 h-1 bg-orange-500 mx-auto"
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  title: "API-First Architecture",
                  description: "Seamlessly integrates with existing tools and websites. Custom integrations and workflow automation. Embeddable forms, chat widgets, and booking calendars. Future-proof with open API access.",
                  image: "/assets/api-architecture.jpg"
                },
                {
                  title: "Security & Reliability",
                  description: "Enterprise-grade security and data protection. Role-based access control and permissions. Regular backups and 99.9% uptime guarantee. GDPR compliant data handling.",
                  image: "/assets/security.jpg"
                },
                {
                  title: "User Experience",
                  description: "Clean, modern interface designed for daily use. Mobile-responsive for on-the-go access. Minimal learning curve with intuitive navigation. Built by Apple & Google-listed developers.",
                  image: "/assets/user-experience.jpg"
                }
              ].map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 80, rotateY: index % 2 === 0 ? -15 : 15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-gray-800 p-8 rounded-lg group"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src={advantage.image}
                      alt={advantage.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x200/4b5563/ffffff?text=${advantage.title}`;
                      }}
                    />
                  </motion.div>
                  <motion.h3 
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  >
                    {advantage.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-300 leading-relaxed text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  >
                    {advantage.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Customer Success Stories */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="py-32 px-8"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-20">
              <motion.h2 
                className="text-5xl lg:text-7xl font-black mb-8"
                variants={fadeInDown}
              >
                Customer Success Stories
              </motion.h2>
              <motion.div 
                className="w-16 h-1 bg-orange-500 mx-auto"
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  quote: "ByteSuite CRM transformed how we handle leads. The AI assistant captures and qualifies prospects even when we're sleeping. Our follow-up game is now flawless.",
                  author: "Sarah Chen",
                  title: "CEO at TechFlow Consulting",
                  metric: "Increased conversion rate by 40% in 3 months",
                  image: "/assets/testimonial-1.png"
                },
                {
                  quote: "We were drowning in subscriptions - CRM, billing, scheduling, chat support. ByteSuite replaced everything with better functionality and saved us $800/month.",
                  author: "Marcus Rodriguez",
                  title: "Sales Director at GrowthLab",
                  metric: "Consolidated 6 tools into one powerful system",
                  image: "/assets/testimonial-2.png"
                },
                {
                  quote: "Previous CRMs felt like punishment. ByteSuite is intuitive and beautiful. Our sales team adoption went from 30% to 98% overnight.",
                  author: "Lisa Park",
                  title: "Agency Owner",
                  metric: "Our team actually enjoys using it",
                  image: "/assets/testimonial-3.png"
                }
              ].map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-900 p-8 rounded-lg border border-gray-800 group"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.1 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src={story.image}
                      alt={story.author}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x200/374151/ffffff?text=${story.author}`;
                      }}
                    />
                  </motion.div>
                  <motion.div 
                    className="text-orange-500 text-3xl mb-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
                  >
                    "{story.metric}"
                  </motion.div>
                  <motion.p 
                    className="text-gray-300 mb-6 leading-relaxed text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                  >
                    "{story.quote}"
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                  >
                    <div className="font-bold text-white text-xl">{story.author}</div>
                    <div className="text-gray-500 text-lg">{story.title}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Implementation & Support */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="py-32 px-8 bg-gray-900"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-20">
              <motion.h2 
                className="text-5xl lg:text-7xl font-black mb-8"
                variants={fadeInDown}
              >
                Implementation & Support
              </motion.h2>
              <motion.div 
                className="w-16 h-1 bg-orange-500 mx-auto"
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-20">
              <motion.div variants={slideInFromLeft}>
                <motion.h3 
                  className="text-4xl font-bold mb-8"
                  variants={bounceIn}
                >
                  Getting Started
                </motion.h3>
                <div className="space-y-6">
                  {[
                    "Quick Setup - Import existing data in minutes",
                    "Free Migration - Our team handles data transfer from any CRM",
                    "Onboarding Call - Personal walkthrough and customization",
                    "Training Resources - Video tutorials and documentation"
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.span 
                        className="text-orange-500 text-2xl"
                        variants={bounceIn}
                      >
                        ✓
                      </motion.span>
                      <span className="text-gray-300 text-lg">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={slideInFromRight}>
                <motion.h3 
                  className="text-4xl font-bold mb-8"
                  variants={bounceIn}
                >
                  Ongoing Support
                </motion.h3>
                <div className="space-y-6">
                  {[
                    "24/7 Help Center - Comprehensive knowledge base",
                    "Live Chat Support - Real human assistance when needed",
                    "Regular Updates - New features released monthly",
                    "Customer Success - Dedicated support for growth planning"
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.span 
                        className="text-orange-500 text-2xl"
                        variants={bounceIn}
                      >
                        ✓
                      </motion.span>
                      <span className="text-gray-300 text-lg">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Call-to-Action Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-32 px-8 text-center relative"
        >
          <motion.div variants={bounceIn} className="max-w-4xl mx-auto space-y-12">
            <motion.h2 
              className="text-6xl lg:text-8xl font-black" 
              initial={{ scale: 0.5, opacity: 0 }} 
              whileInView={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
            >
              Ready to Transform Your
              <span className="text-orange-500 block">Customer Relationships?</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-2xl text-gray-300 max-w-2xl mx-auto">
              Join 10,000+ businesses already growing with ByteSuite CRM
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#ff6f00', boxShadow: '0 20px 60px rgba(255, 111, 0, 0.4)' }} 
                whileTap={{ scale: 0.95 }} 
                className="bg-orange-500 text-black px-12 py-4 font-black tracking-wide text-xl"
              >
                START FREE TRIAL
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05, borderColor: '#ff6f00', color: '#ff6f00' }} 
                whileTap={{ scale: 0.95 }} 
                className="border-2 border-white text-white px-12 py-4 font-black tracking-wide text-xl"
              >
                SCHEDULE DEMO
              </motion.button>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-sm text-gray-500 space-y-2">
              <p className="text-lg">No credit card required • Full access to all features</p>
              <p className="text-lg">Free data migration included • Cancel anytime</p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ERP Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-32 px-8 bg-gray-900"
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div variants={bounceIn} className="space-y-12">
              <motion.h2 
                className="text-5xl lg:text-7xl font-black"
                variants={fadeInDown}
              >
                Need More Than CRM?
              </motion.h2>
              <motion.h3 
                className="text-3xl lg:text-4xl font-bold text-orange-500"
                variants={bounceIn}
              >
                Looking for Complete Business Management?
              </motion.h3>
              
              <motion.p 
                className="text-2xl text-gray-300 max-w-3xl mx-auto"
                variants={fadeInUp}
              >
                While ByteSuite CRM handles all your customer relationship needs, some businesses require 
                comprehensive enterprise resource planning (ERP) systems that manage every aspect of operations.
              </motion.p>

              <div className="grid lg:grid-cols-2 gap-12 mt-16">
                <motion.div variants={slideInFromLeft} className="bg-gray-800 p-8 rounded-lg group">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src="/assets/erp-solutions.png"
                      alt="Custom ERP Solutions"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x200/4b5563/ffffff?text=Custom+ERP+Solutions';
                      }}
                    />
                  </motion.div>
                  <motion.h4 
                    className="text-3xl font-bold mb-6"
                    variants={bounceIn}
                  >
                    Custom ERP Solutions Available
                  </motion.h4>
                  <ul className="space-y-3 text-left">
                    {[
                      "Full Business Integration - HR, finance, supply chain, and operations",
                      "Tailored Workflows - Built specifically for your industry and processes",
                      "Scalable Architecture - Grows from department-level to enterprise-wide",
                      "CRM Integration - Your ByteSuite CRM becomes the customer-facing hub of a larger system"
                    ].map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.span 
                          className="text-orange-500 text-xl"
                          variants={bounceIn}
                        >
                          •
                        </motion.span>
                        <span className="text-gray-300 text-lg">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={slideInFromRight} className="bg-gray-800 p-8 rounded-lg group">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src="/assets/erp-needs.png"
                      alt="When You Need ERP"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x200/4b5563/ffffff?text=When+You+Need+ERP';
                      }}
                    />
                  </motion.div>
                  <motion.h4 
                    className="text-3xl font-bold mb-6"
                    variants={bounceIn}
                  >
                    When You Need ERP:
                  </motion.h4>
                  <ul className="space-y-3 text-left">
                    {[
                      "Managing complex multi-department operations",
                      "Require advanced financial and accounting features",
                      "Need supply chain and inventory management",
                      "Want unified reporting across all business functions"
                    ].map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.span 
                          className="text-orange-500 text-xl"
                          variants={bounceIn}
                        >
                          •
                        </motion.span>
                        <span className="text-gray-300 text-lg">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <motion.div variants={fadeInUp} className="mt-12">
                <motion.h4 
                  className="text-3xl font-bold mb-4"
                  variants={bounceIn}
                >
                  Ready to Explore ERP?
                </motion.h4>
                <motion.p 
                  className="text-gray-300 mb-6 text-lg"
                  variants={fadeInUp}
                >
                  Contact our enterprise team for a consultation on custom ERP systems that integrate seamlessly with ByteSuite CRM.
                </motion.p>
                <motion.div 
                  className="space-y-2 text-orange-500 text-lg"
                  variants={fadeInUp}
                >
                  <p>Enterprise Contact: enterprise@bytesuite.com</p>
                  <p>Schedule ERP Consultation</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 1 }} 
        className="border-t border-gray-800 py-12 px-8 text-center"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} className="text-4xl font-black mb-4">
            BYTESUITE CRM
          </motion.div>
          <p className="text-gray-500 text-sm tracking-wide mb-4">
            The Smart Choice for Growing Businesses
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Built by Bytes Platform | Apple & Google-listed developers
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Enterprise-grade security | 99.9% uptime | GDPR compliant
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Contact: hello@bytesuite.com | 1-800-BYTESUITE
          </p>
          <p className="text-gray-500 text-sm">
            Support: 24/7 live chat | help.bytesuite.com
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default ByteSuitePage;
