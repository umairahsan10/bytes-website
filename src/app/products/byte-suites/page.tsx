'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Header } from "@/sections/Navbar";
import * as THREE from 'three';

const ByteSuitePage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create animated particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: '#1E56A0',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create connecting lines between nearby particles
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    
    for (let i = 0; i < particlesCount; i += 10) {
      const x1 = posArray[i * 3];
      const y1 = posArray[i * 3 + 1];
      const z1 = posArray[i * 3 + 2];
      
      for (let j = i + 10; j < particlesCount; j += 10) {
        const x2 = posArray[j * 3];
        const y2 = posArray[j * 3 + 1];
        const z2 = posArray[j * 3 + 2];
        
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
        
        if (distance < 3) {
          linePositions.push(x1, y1, z1, x2, y2, z2);
        }
      }
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#1E56A0',
      transparent: true,
      opacity: 0.2
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Create floating orbs
    const orbGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: '#1E56A0',
      transparent: true,
      opacity: 0.5
    });

    const orbs: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      orbs.push(orb);
      scene.add(orb);
    }

    // Add some larger background orbs
    const largeOrbGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const largeOrbMaterial = new THREE.MeshBasicMaterial({
      color: '#D6E4F0',
      transparent: true,
      opacity: 0.15
    });

    for (let i = 0; i < 4; i++) {
      const largeOrb = new THREE.Mesh(largeOrbGeometry, largeOrbMaterial);
      largeOrb.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      );
      scene.add(largeOrb);
    }

    camera.position.z = 6;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.001;

      // Animate orbs
      orbs.forEach((orb, index) => {
        orb.position.y += Math.sin(Date.now() * 0.0008 + index) * 0.008;
        orb.position.x += Math.cos(Date.now() * 0.0008 + index) * 0.008;
        orb.rotation.x += 0.005;
        orb.rotation.y += 0.005;
        (orb.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(Date.now() * 0.001 + index) * 0.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  /* -------------------- Animation Variants -------------------- */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  } as const;

  const textReveal = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  } as const;

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5 } },
  } as const;

  const floatingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    },
  } as const;

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  } as const;

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  } as const;

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  } as const;

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  } as const;

  const fadeInDown = {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  } as const;

  const bounceIn = {
    hidden: { opacity: 0, scale: 0.3, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 300
      } 
    },
  } as const;

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  } as const;

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  } as const;

  const rotateIn = {
    hidden: { opacity: 0, rotate: -180, scale: 0.5 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 200
      } 
    },
  } as const;

  /* -------------------------- Markup -------------------------- */
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Dynamic Background */}
      {/* <div className="fixed inset-0 pointer-events-none">
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
      </div> */}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '-100px' }}
          variants={containerVariants}
          className="min-h-screen flex items-center justify-center px-4 sm:px-8 relative overflow-hidden pt-24 sm:pt-20 lg:pt-0"
          style={{ backgroundColor: '#F6F6F6' }}
        >
          {/* Three.js Background Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          />

          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
              style={{ backgroundColor: 'rgba(30, 86, 160, 0.1)' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl"
              style={{ backgroundColor: 'rgba(214, 228, 240, 0.3)' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
                x: [0, -40, 0],
                y: [0, 60, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>

          <div className="max-w-7xl mx-auto relative z-10" style={{ zIndex: 3 }}>
            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-5rem)] lg:min-h-full py-8 lg:py-0">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center lg:text-left pt-8 lg:pt-0"
              >
                {/* Main Title with Side-by-Side Layout */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
                  className="mb-12"
                >
                  <motion.div
                    className="flex items-center justify-center lg:justify-start space-x-4 lg:space-x-6 xl:space-x-8"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.h1
                      className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tighter bg-gradient-to-r from-[#1E56A0] to-[#163172] bg-clip-text text-transparent"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      BYTE
                    </motion.h1>
                    <motion.h1
                      className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tighter bg-gradient-to-r from-[#163172] to-[#1E56A0] bg-clip-text text-transparent"
                      animate={{
                        scale: [1, 1.1, 1],
                        filter: [
                          "drop-shadow(0 0 5px rgba(30, 86, 160, 0.2))",
                          "drop-shadow(0 0 10px rgba(30, 86, 160, 0.3))",
                          "drop-shadow(0 0 5px rgba(30, 86, 160, 0.2))",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      SUITE
                    </motion.h1>
                  </motion.div>
                </motion.div>

                {/* Subtitle */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={containerVariants}
                  className="mb-12"
                >
                  <motion.h2
                    className="text-2xl lg:text-4xl xl:text-5xl font-bold mb-6"
                    style={{ color: '#163172' }}
                    variants={fadeInUp}
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    The Future of
                    <motion.span
                      className="ml-3 lg:ml-4 bg-gradient-to-r from-[#1E56A0] to-[#163172] bg-clip-text text-transparent"
                      animate={{
                        filter: [
                          "drop-shadow(0 0 10px rgba(30, 86, 160, 0.4))",
                          "drop-shadow(0 0 20px rgba(30, 86, 160, 0.6))",
                          "drop-shadow(0 0 10px rgba(30, 86, 160, 0.4))",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      CRM
                    </motion.span>
                  </motion.h2>

                  <motion.p
                    className="text-lg lg:text-xl xl:text-2xl leading-relaxed"
                    style={{ color: '#1E56A0' }}
                    variants={fadeInUp}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    AI-powered customer relationships that transform how you handle leads
                  </motion.p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={fadeInUp}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: '#1E56A0', 
                      boxShadow: '0 20px 60px rgba(30, 86, 160, 0.4)',
                      textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 font-black tracking-wider text-base lg:text-lg rounded-lg relative overflow-hidden group"
                    style={{ 
                      background: 'linear-gradient(to bottom, #1E56A0 0%, #163172 100%)',
                      color: '#F6F6F6'
                    }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">START FREE TRIAL</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ 
                      scale: 1.1, 
                      borderColor: '#1E56A0', 
                      color: '#1E56A0',
                      boxShadow: '0 20px 60px rgba(30, 86, 160, 0.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 px-8 py-3 font-black tracking-wider text-base lg:text-lg rounded-lg relative overflow-hidden group"
                    style={{ 
                      borderColor: '#1E56A0',
                      color: '#1E56A0'
                    }}
                  >
                    <motion.span
                      className="absolute inset-0"
                      style={{ backgroundColor: 'rgba(30, 86, 160, 0.1)' }}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">SCHEDULE DEMO</span>
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right Column - Image */}
              <motion.div
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <motion.div
                  className="relative z-10"
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 1, 0, -1, 0]
                  }}
                  transition={{ 
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <img
                    src="/assets/bytesuite-hero.png"
                    alt="ByteSuite CRM Dashboard"
                    className="w-full h-auto max-w-2xl mx-auto rounded-2xl shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x600/1f2937/ffffff?text=ByteSuite+CRM+Dashboard';
                    }}
                  />
                </motion.div>
                
                {/* Floating decorative elements around image */}
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -top-8 -right-8 w-16 h-16 transform rotate-45 rounded-lg"
                  style={{ backgroundColor: '#1E56A0' }}
                />
                <motion.div
                  animate={{ rotate: [0, -10, 0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-10 -left-10 w-12 h-12 border-2 transform rotate-45"
                  style={{ borderColor: '#1E56A0' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  className="absolute top-1/2 -left-6 w-4 h-4 rounded-full"
                  style={{ backgroundColor: '#1E56A0' }}
                />
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-8 h-12 border-2 rounded-full flex justify-center"
                style={{ borderColor: '#1E56A0' }}
                whileHover={{ scale: 1.2 }}
              >
                <motion.div
                  className="w-2 h-4 rounded-full mt-2"
                  style={{ backgroundColor: '#1E56A0' }}
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Value Proposition Section (Dark Blue) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '-100px' }}
          variants={containerVariants}
          className="py-20 px-8"
          style={{ backgroundColor: '#163172' }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-12">
              <motion.h2 
                className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-[#D6E4F0] to-[#F6F6F6] bg-clip-text text-transparent"
                variants={fadeInDown}
              >
                Why ByteSuite CRM is Different
              </motion.h2>
              <motion.div 
                className="w-16 h-1 mx-auto mb-6"
                style={{ background: 'linear-gradient(to bottom, #D6E4F0, #1E56A0)' }}
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  title: "AI-Powered Intelligence",
                  description: "ByteBot assistant handles customer queries and automates follow-ups 24/7",
                  icon: (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        d="M19 3V5C19 6.1 18.1 7 17 7H16L15 10H9L8 7H7C5.9 7 5 6.1 5 5V3C5 1.9 5.9 1 7 1H17C18.1 1 19 1.9 19 3Z"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        d="M12 10V22"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        d="M8 22H16"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.7, type: "spring" }}
                        cx="12"
                        cy="14"
                        r="2"
                        fill="#D6E4F0"
                      />
                    </svg>
                  ),
                  image: "/assets/ai-intelligence.jpg"
                },
                {
                  title: "Built-in Revenue Tools",
                  description: "Native billing, scheduling, and analytics - no third-party integrations needed",
                  icon: (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.rect
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.9, type: "spring" }}
                        x="7"
                        y="7"
                        width="10"
                        height="10"
                        rx="2"
                        fill="#D6E4F0"
                        opacity="0.3"
                      />
                    </svg>
                  ),
                  image: "/assets/revenue-tools.jpg"
                },
                {
                  title: "Conversion-Focused Design",
                  description: "Every feature designed to move prospects through your pipeline faster",
                  icon: (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.0, delay: 0.5, type: "spring" }}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        d="M12 6V12L16 14"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.9 }}
                        d="M9 12L15 12"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.1 }}
                        d="M12 9L12 15"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                  image: "/assets/conversion-design.jpg"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ margin: '-100px' }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="p-8 rounded-lg border group"
                  style={{ 
                    background: 'linear-gradient(to bottom, #D6E4F0 0%,rgb(43, 61, 153) 100%)',
                    borderColor: '#D6E4F0'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/500x350/1E56A0/ffffff?text=${benefit.title}`;
                      }}
                    />
                  </motion.div>
                  <div className="flex items-center space-x-3 mb-3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ margin: '-100px' }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <motion.h3 
                      className="text-xl font-bold"
                      style={{ color: '#F6F6F6' }}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ margin: '-100px' }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                  >
                    {benefit.title}
                  </motion.h3>
                  </div>
                  <motion.p 
                    className="leading-relaxed text-sm"
                    style={{ color: '#D6E4F0' }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
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
          viewport={{ margin: '-100px' }}
          variants={containerVariants}
          className="py-20 px-8"
          style={{ backgroundColor: '#F6F6F6' }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-12">
              <motion.h2 
                className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-[#1E56A0] to-[#163172] bg-clip-text text-transparent"
                variants={fadeInDown}
              >
                Features Deep Dive
              </motion.h2>
              <motion.div 
                className="w-16 h-1 mx-auto"
                style={{ background: 'linear-gradient(to bottom, #1E56A0, #163172)' }}
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="space-y-20">
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
                    className={`space-y-4 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                  >
                    <motion.h3 
                      className="text-3xl lg:text-4xl font-bold"
                      style={{ color: '#163172' }}
                      variants={bounceIn}
                    >
                      {section.title}
                    </motion.h3>
                    <ul className="space-y-3">
                      {section.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                        >
                          <motion.span 
                            className="text-xl"
                            style={{ color: '#1E56A0' }}
                            variants={bounceIn}
                          >
                            ✓
                          </motion.span>
                          <span className="leading-relaxed text-base" style={{ color: '#1E56A0' }}>{feature}</span>
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
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="relative overflow-hidden rounded-lg shadow-2xl"
                      style={{ backgroundColor: '#D6E4F0' }}
                    >
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-80 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/700x500/1E56A0/ffffff?text=${section.title}`;
                        }}
                      />
                      <motion.div 
                        className="absolute inset-0 opacity-0"
                        style={{ backgroundColor: '#1E56A0' }}
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
          viewport={{ margin: '-100px' }}
          variants={containerVariants}
          className="py-20 px-8"
          style={{ backgroundColor: '#163172' }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-12">
              <motion.h2 
                className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-[#D6E4F0] to-[#F6F6F6] bg-clip-text text-transparent"
                variants={fadeInDown}
              >
                Target Audience Benefits
              </motion.h2>
              <motion.div 
                className="w-16 h-1 mx-auto mb-6"
                style={{ background: 'linear-gradient(to bottom, #D6E4F0, #1E56A0)' }}
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
                  image: "/assets/consultants.jpg",
                  icon: (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.9 }}
                        d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.1 }}
                        d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.3, type: "spring" }}
                        cx="9"
                        cy="7"
                        r="2"
                        fill="#D6E4F0"
                      />
                    </svg>
                  )
                },
                {
                  title: "For Sales Teams & Agencies",
                  benefits: [
                    "AI assistant that never sleeps or misses a follow-up",
                    "Team performance tracking and goal management",
                    "Lead scoring and qualification automation",
                    "Collaborative deal management"
                  ],
                  image: "/assets/sales-teams.jpg",
                  icon: (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.9 }}
                        d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.1 }}
                        d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.rect
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.3, type: "spring" }}
                        x="7"
                        y="7"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#D6E4F0"
                        opacity="0.3"
                      />
                    </svg>
                  )
                },
                {
                  title: "For Small-Medium Businesses",
                  benefits: [
                    "Enterprise-level features without enterprise complexity",
                    "Scales from startup to growing business",
                    "Beautiful, intuitive interface that teams actually use",
                    "Affordable pricing that grows with you"
                  ],
                  image: "/assets/smb.jpg",
                  icon: (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        d="M9 22V12H15V22"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.9 }}
                        d="M12 6L12 12"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.1, type: "spring" }}
                        cx="12"
                        cy="8"
                        r="1"
                        fill="#D6E4F0"
                      />
                    </svg>
                  )
                },
                {
                  title: "For E-commerce & Retail",
                  benefits: [
                    "Customer lifecycle management from prospect to repeat buyer",
                    "Inventory integration with sales tracking",
                    "Automated customer support and order management",
                    "Purchase behavior analytics and recommendations"
                  ],
                  image: "/assets/ecommerce.jpg",
                  icon: (
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        d="M3 6H21"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.9 }}
                        d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.1, type: "spring" }}
                        cx="12"
                        cy="10"
                        r="1"
                        fill="#D6E4F0"
                      />
                    </svg>
                  )
                }
              ].map((audience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ margin: '-100px' }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="p-8 rounded-lg border group"
                  style={{ 
                    background: 'linear-gradient(to bottom, #D6E4F0 0%,rgb(43, 61, 153) 100%)',
                    borderColor: '#D6E4F0'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src={audience.image}
                      alt={audience.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/500x350/1E56A0/ffffff?text=${audience.title}`;
                      }}
                    />
                  </motion.div>
                  <div className="flex items-center space-x-3 mb-3">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ margin: '-100px' }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {audience.icon}
                  </motion.div>
                  <motion.h3 
                      className="text-xl font-bold"
                      style={{ color: '#F6F6F6' }}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ margin: '-100px' }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                  >
                    {audience.title}
                  </motion.h3>
                  </div>
                  <ul className="space-y-2">
                    {audience.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                      <motion.li 
                        key={benefitIndex} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ delay: index * 0.1 + benefitIndex * 0.1 + 0.4 }}
                      >
                        <motion.span 
                          className="text-lg"
                          style={{ color: '#D6E4F0' }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: '-100px' }}
                          transition={{ duration: 0.4, delay: index * 0.1 + benefitIndex * 0.1 + 0.5 }}
                        >
                          •
                        </motion.span>
                        <span className="text-sm leading-relaxed" style={{ color: '#D6E4F0' }}>{benefit}</span>
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
          viewport={{ margin: '-100px' }}
          variants={containerVariants}
          className="py-20 px-8"
          style={{ backgroundColor: '#F6F6F6' }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-12">
              <motion.h2 
                className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-[#1E56A0] to-[#163172] bg-clip-text text-transparent"
                variants={fadeInDown}
              >
                Technical Advantages
              </motion.h2>
              <motion.div 
                className="w-16 h-1 mx-auto"
                style={{ background: 'linear-gradient(to bottom, #1E56A0, #163172)' }}
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  title: "API-First Architecture",
                  description: "Seamlessly integrates with existing tools and websites. Custom integrations and workflow automation.",
                  image: "/assets/api-architecture.jpg"
                },
                {
                  title: "Security & Reliability",
                  description: "Enterprise-grade security and data protection. Role-based access control and 99.9% uptime guarantee.",
                  image: "/assets/security.jpg"
                },
                {
                  title: "User Experience",
                  description: "Clean, modern interface designed for daily use. Mobile-responsive with minimal learning curve.",
                  image: "/assets/user-experience.jpg"
                }
              ].map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 80, rotateY: index % 2 === 0 ? -15 : 15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ margin: '-100px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="p-8 rounded-lg group"
                  style={{ 
                    background: 'linear-gradient(to bottom, #D6E4F0 0%, #F6F6F6 100%)',
                    borderColor: '#1E56A0'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                    className="mb-6 overflow-hidden rounded-lg"
                  >
                    <img
                      src={advantage.image}
                      alt={advantage.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/500x350/1E56A0/ffffff?text=${advantage.title}`;
                      }}
                    />
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-bold mb-3"
                    style={{ color: '#163172' }}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    {advantage.title}
                  </motion.h3>
                  <motion.p 
                    className="leading-relaxed text-sm"
                    style={{ color: '#1E56A0' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  >
                    {advantage.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Implementation & Support */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '-100px' }}
          variants={containerVariants}
          className="py-20 px-8"
          style={{ backgroundColor: '#F6F6F6' }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-12">
              <motion.h2 
                className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-[#1E56A0] to-[#163172] bg-clip-text text-transparent"
                variants={fadeInDown}
              >
                Implementation & Support
              </motion.h2>
              <motion.div 
                className="w-16 h-1 mx-auto"
                style={{ background: 'linear-gradient(to bottom, #1E56A0, #163172)' }}
                variants={slideInFromLeft}
              />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div variants={slideInFromLeft}>
                <motion.h3 
                  className="text-3xl font-bold mb-6"
                  style={{ color: '#163172' }}
                  variants={bounceIn}
                >
                  Getting Started
                </motion.h3>
                <div className="space-y-4">
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
                        className="text-xl"
                        style={{ color: '#1E56A0' }}
                        variants={bounceIn}
                      >
                        ✓
                      </motion.span>
                      <span className="text-base" style={{ color: '#1E56A0' }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={slideInFromRight}>
                <motion.h3 
                  className="text-3xl font-bold mb-6"
                  style={{ color: '#163172' }}
                  variants={bounceIn}
                >
                  Ongoing Support
                </motion.h3>
                <div className="space-y-4">
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
                        className="text-xl"
                        style={{ color: '#1E56A0' }}
                        variants={bounceIn}
                      >
                        ✓
                      </motion.span>
                      <span className="text-base" style={{ color: '#1E56A0' }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '-100px' }}
          variants={containerVariants}
          className="py-20 px-8 text-center"
          style={{ backgroundColor: '#163172' }}
        >
          <motion.div variants={bounceIn} className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-5xl lg:text-7xl font-black" 
              initial={{ scale: 0.5, opacity: 0 }} 
              whileInView={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              style={{ color: '#F6F6F6' }}
            >
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-[#D6E4F0] to-[#1E56A0] bg-clip-text text-transparent">Customer Relationships?</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl max-w-2xl mx-auto mt-6" style={{ color: '#D6E4F0' }}>
              Join 10,000+ businesses already growing with ByteSuite CRM
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#1E56A0', boxShadow: '0 20px 60px rgba(30, 86, 160, 0.4)' }} 
                whileTap={{ scale: 0.95 }} 
                className="px-8 py-3 font-black tracking-wide text-lg"
                style={{ 
                  background: 'linear-gradient(to bottom, #1E56A0 0%, #163172 100%)',
                  color: '#F6F6F6'
                }}
              >
                START FREE TRIAL
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05, borderColor: '#D6E4F0', color: '#D6E4F0' }} 
                whileTap={{ scale: 0.95 }} 
                className="border-2 px-8 py-3 font-black tracking-wide text-lg"
                style={{ 
                  borderColor: '#D6E4F0',
                  color: '#D6E4F0'
                }}
              >
                SCHEDULE DEMO
              </motion.button>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-sm space-y-2 mt-6" style={{ color: '#D6E4F0' }}>
              <p className="text-base">No credit card required • Full access to all features</p>
              <p className="text-base">Free data migration included • Cancel anytime</p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ERP Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '-100px' }}
          variants={containerVariants}
          className="py-20 px-8"
          style={{ backgroundColor: '#F6F6F6' }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={bounceIn} className="text-center mb-12">
              <motion.h2 
                className="text-4xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-[#1E56A0] to-[#163172] bg-clip-text text-transparent"
                variants={fadeInDown}
              >
                Need More Than CRM?
              </motion.h2>
              <motion.h3 
                className="text-xl lg:text-2xl font-bold mb-6 bg-gradient-to-r from-[#1E56A0] to-[#163172] bg-clip-text text-transparent"
                variants={bounceIn}
              >
                Looking for Complete Business Management?
              </motion.h3>
                  <motion.div
                className="w-16 h-1 mx-auto"
                style={{ background: 'linear-gradient(to bottom, #1E56A0, #163172)' }}
                variants={slideInFromLeft}
                    />
                  </motion.div>

            <div className="space-y-20">
              {[
                {
                  title: "Custom ERP Solutions Available",
                  features: [
                      "Full Business Integration - HR, finance, supply chain, and operations",
                      "Tailored Workflows - Built specifically for your industry and processes",
                      "Scalable Architecture - Grows from department-level to enterprise-wide",
                      "CRM Integration - Your ByteSuite CRM becomes the customer-facing hub of a larger system"
                  ],
                  image: "/assets/erp-solutions.png"
                },
                {
                  title: "When You Need ERP",
                  features: [
                    "Managing complex multi-department operations",
                    "Require advanced financial and accounting features",
                    "Need supply chain and inventory management",
                    "Want unified reporting across all business functions"
                  ],
                  image: "/assets/erp-needs.png"
                }
              ].map((section, index) => (
                <motion.div
                        key={index} 
                  variants={itemVariants}
                  className="grid lg:grid-cols-2 gap-16 items-center"
                >
                  <motion.div 
                    variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                    className={`space-y-4 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                  >
                    <motion.h3 
                      className="text-3xl lg:text-4xl font-bold"
                      style={{ color: '#163172' }}
                      variants={bounceIn}
                    >
                      {section.title}
                    </motion.h3>
                    <ul className="space-y-3">
                      {section.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                      >
                        <motion.span 
                            className="text-xl"
                            style={{ color: '#1E56A0' }}
                          variants={bounceIn}
                        >
                            ✓
                        </motion.span>
                          <span className="leading-relaxed text-base" style={{ color: '#1E56A0' }}>{feature}</span>
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
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="relative overflow-hidden rounded-lg shadow-2xl"
                      style={{ backgroundColor: '#D6E4F0' }}
                    >
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-80 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/700x500/1E56A0/ffffff?text=${section.title}`;
                        }}
                      />
                      <motion.div 
                        className="absolute inset-0 opacity-0"
                        style={{ backgroundColor: '#1E56A0' }}
                        whileHover={{ opacity: 0.2 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                </motion.div>
                </motion.div>
              ))}
              </div>

            <motion.div variants={fadeInUp} className="text-center mt-12">
                <motion.h4 
                className="text-2xl font-bold mb-4"
                style={{ color: '#163172' }}
                  variants={bounceIn}
                >
                  Ready to Explore ERP?
                </motion.h4>
                <motion.div 
                className="space-y-2"
                style={{ color: '#1E56A0' }}
                  variants={fadeInUp}
                >
                <p className="text-lg">Enterprise Contact: enterprise@bytesuite.com</p>
                <p className="text-lg">Schedule ERP Consultation</p>
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
        className="py-12 px-8 text-center"
        style={{ backgroundColor: '#163172' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} className="text-4xl font-black mb-4" style={{ color: '#F6F6F6' }}>
            BYTESUITE CRM
          </motion.div>
          <p className="text-sm tracking-wide mb-4" style={{ color: '#D6E4F0' }}>
            The Smart Choice for Growing Businesses
          </p>
          <p className="text-sm mb-8" style={{ color: '#D6E4F0' }}>
            Built by Bytes Platform | Apple & Google-listed developers
          </p>
          <p className="text-sm mb-4" style={{ color: '#D6E4F0' }}>
            Enterprise-grade security | 99.9% uptime | GDPR compliant
          </p>
          <p className="text-sm mb-8" style={{ color: '#D6E4F0' }}>
            Contact: hello@bytesuite.com | 1-800-BYTESUITE
          </p>
          <p className="text-sm" style={{ color: '#D6E4F0' }}>
            Support: 24/7 live chat | help.bytesuite.com
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default ByteSuitePage;
