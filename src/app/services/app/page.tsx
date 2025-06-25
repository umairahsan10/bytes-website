'use client';
import Image from "next/image";   // put this at the top with the other imports

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Helper component for word-by-word reveal
const AnimatedParagraph = ({ text, className = "" }: { text: string; className?: string }) => {
  const wordContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const wordItem = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%", opacity: 1,
      transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const }
    }
  };

  return (
    <motion.p
      className={className}
      variants={wordContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
      style={{ overflow: "hidden", display: "inline-block" }}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={wordItem}
          style={{ display: "inline-block", marginRight: "0.25rem" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

const AppDevelopmentPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ y, opacity }}
        className="relative h-screen flex items-center justify-start bg-[#E1E1E1] pl-3 md:pl-15"
      >
        {/* Decorative overlay removed for flat color */}
        
        {/* Background Image Placeholder */}
        {/* <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-purple-100/50 to-purple-200/50 flex items-center justify-center">
            <span className="text-gray-500 text-xl">Hero Background Image</span>
          </div>
        </div> */}

        <Image
          src="/assets/app-hero.png"   // path inside the /public directory
          alt="Team brainstorming on mobile-app UI"
          fill                     // makes it cover the whole parent
          className="object-cover opacity-100 absolute inset-0"
        />

        <div className="relative z-10 text-left px-0 w-full md:w-2/5">
          <motion.h1 
            ref={titleRef}
            className="text-8xl md:text-9xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <span className="bg-gradient-to-r from-[#E1E3E2] to-purple-700 bg-clip-text text-transparent">
              MOBILE
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#E1E3E2] to-purple-700 bg-clip-text text-transparent">
              APPS
            </span>
          </motion.h1>
          
          <AnimatedParagraph
            text="When innovation meets functionality, Bytes Platform delivers cutting-edge mobile applications that transform ideas into powerful digital experiences, building on years of development expertise."
            className="text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed"
          />
        </div>
      </motion.section>

      {/* App Development Science Section */}
      <section className="py-32 px-6 bg-[#D6C3DF]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-6xl md:text-7xl font-bold mb-6 animate-section"
            >
              MOBILE APP
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                DEVELOPMENT
              </span>
            </motion.h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="animate-section">
                <h3 className="text-3xl font-bold mb-6 text-purple-600">How do we build mobile apps?</h3>
                <AnimatedParagraph
                  text="Bytes Platform crafts native and cross-platform mobile applications using cutting-edge technologies like React Native, Flutter, and Swift/Kotlin. From concept to deployment, we create apps that deliver exceptional user experiences across iOS and Android platforms, ensuring seamless performance and intuitive design."
                  className="text-gray-600 text-lg leading-relaxed"
                />
              </motion.div>

              {/* App Development Process Image */}
              <motion.div 
                variants={itemVariants}
                className="relative rounded-2xl w-full aspect-[3/2] overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/app-img-1.png"
                  alt="Mobile app development workflow"
                  fill
                  className="object-cover absolute inset-0"
                />
              </motion.div>
            </motion.div>

            {/* Right Content - App Launch Visual */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-0 w-80 md:w-96 aspect-[2/3] flex items-center justify-center border border-purple-300/30 overflow-hidden">
                <Image
                  src="/assets/app-img-2.png"
                  alt="Mobile app launch illustration"
                  width={1024}
                  height={1536}
                  className="object-contain w-full h-full"
                />
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-purple-300/30 rounded-full border border-purple-300/40"
              />
              
              <motion.div
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -3, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-200/40 rounded-full border border-purple-300/40"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-32 px-6 bg-[#E1E1E1]">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-center mb-20 animate-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            Development Services
          </motion.h2>

          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Native iOS Development",
                description: "Swift and SwiftUI applications optimized for Apple's ecosystem with seamless integration and performance.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Native Android Development", 
                description: "Kotlin and Java applications leveraging Android's full capabilities for optimal user experience.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                title: "Cross-Platform Solutions",
                description: "React Native and Flutter apps that run efficiently on both iOS and Android with shared codebase.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "UI/UX Design",
                description: "Intuitive and engaging mobile interfaces designed with user-centered approach and modern aesthetics.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                title: "Backend Integration",
                description: "Robust API development and third-party service integration for seamless data synchronization.",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                title: "App Store Deployment",
                description: "Complete deployment process including store optimization, testing, and post-launch support.",
                gradient: "from-teal-500 to-green-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card group relative bg-white rounded-2xl p-8 border border-purple-100 hover:border-purple-300 transition-all duration-500 shadow-sm"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl mb-6 flex items-center justify-center`}>
                    <div className="w-8 h-8 bg-white/20 rounded-lg" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-purple-800 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <AnimatedParagraph
                    text={feature.description}
                    className="text-gray-600 leading-relaxed"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-32 px-6 bg-[#D6C3DF]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20 animate-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Technology
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                STACK
              </span>
            </h2>
            <AnimatedParagraph
              text="We leverage the latest technologies and frameworks to build robust, scalable, and high-performance mobile applications."
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "React Native", category: "Cross-Platform", icon: "/assets/react-native-icon.png" },
              { name: "Flutter", category: "Cross-Platform", icon: "/assets/flutter-icon.png" },
              { name: "Swift/SwiftUI", category: "iOS Native", icon: "/assets/swift-icon.png" },
              { name: "Kotlin/Java", category: "Android Native", icon: "/assets/kotlin-icon.png" },
              { name: "Node.js", category: "Backend", icon: "/assets/nodejs-icon.png" },
              { name: "Firebase", category: "Backend", icon: "/assets/firebase-icon.png" },
              { name: "MongoDB", category: "Database", icon: "/assets/mongodb-icon.png" },
              { name: "AWS/Azure", category: "Cloud", icon: "/assets/aws-icon.png" }
            ].map((tech, index) => (
              <motion.div
                key={index}
                className="bg-purple-50 rounded-xl p-6 border border-purple-100 hover:border-purple-300 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-12 h-12 rounded-lg mb-4 mx-auto overflow-hidden flex items-center justify-center bg-white shadow">
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-400 text-center">{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 bg-[#E1E1E1] overflow-hidden">
        {/* Background image */}
        <Image
          src="/assets/app-img-3.png"
          alt="Mobile app showcase"
          fill
          className="object-cover absolute inset-0"
          priority
        />
        {/* Optional white overlay for readability */}
        <div className="absolute inset-0 bg-white/40" />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center animate-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Ready to Build Your
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Next App?
            </span>
          </h2>
          <AnimatedParagraph
            text="Transform your ideas into powerful mobile experiences. Let's discuss your project and bring your vision to life."
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          />
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-12 py-4 rounded-full text-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default AppDevelopmentPage;