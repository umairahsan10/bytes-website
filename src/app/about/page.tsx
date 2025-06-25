// "use client";

// import { Header } from "@/sections/Navbar";
// import { AboutSection } from "@/sections/About";
// import { Footer } from "@/sections/Footer";

// export default function AboutPage() {
//   return (
//     <main>
//       <Header />
//       <AboutSection />
//       <Footer />
//     </main>
//   );
// } 

'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Header } from "@/sections/Navbar";

interface SectionImage {
  src: string;
  alt: string;
  className: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  images: SectionImage[];
  layout: 'left' | 'right';
}

const AboutPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  // Currently unused but kept for future tweaks if needed
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1 } },
  } as const;

  const textReveal = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  } as const;

  /* --------------------------- Data --------------------------- */
  const sections: Section[] = [
    {
      id: 1,
      title: 'THE VISIONARY FOUNDERS OF BYTESPLATFORM',
      description:
        "From groundbreaking ideas to revolutionary platforms, we've built our legacy on innovation and excellence. Our founders bring decades of experience in transforming digital landscapes.",
      images: [
        {
          src: 'https://via.placeholder.com/400x300',
          alt: 'Founder 1',
          className: 'w-full h-64 object-cover',
        },
        {
          src: 'https://via.placeholder.com/200x250',
          alt: 'Founder 2',
          className: 'w-full h-32 object-cover',
        },
        {
          src: 'https://via.placeholder.com/200x250',
          alt: 'Founder 3',
          className: 'w-full h-32 object-cover',
        },
      ],
      layout: 'right',
    },
    {
      id: 2,
      title: 'THE INNOVATION WE STRIVE FOR',
      description:
        "Every line of code, every pixel, every interaction is crafted with precision and purpose. We don't just build software; we architect experiences that reshape industries.",
      images: [
        {
          src: 'https://via.placeholder.com/350x400',
          alt: 'Innovation',
          className: 'w-full h-80 object-cover',
        },
        {
          src: 'https://via.placeholder.com/200x150',
          alt: 'Tech 1',
          className: 'w-full h-24 object-cover',
        },
        {
          src: 'https://via.placeholder.com/200x200',
          alt: 'Tech 2',
          className: 'w-full h-32 object-cover',
        },
      ],
      layout: 'left',
    },
    {
      id: 3,
      title: 'HOW CREATIVITY DRIVES OUR SUCCESS',
      description:
        "Creativity isn't just our process—it's our DNA. We blend artistic vision with technical mastery to create solutions that don't just work, but inspire and delight.",
      images: [
        {
          src: 'https://via.placeholder.com/500x300',
          alt: 'Creative Process',
          className: 'w-full h-48 object-cover',
        },
        {
          src: 'https://via.placeholder.com/200x200',
          alt: 'Design 1',
          className: 'w-full h-32 object-cover',
        },
        {
          src: 'https://via.placeholder.com/200x200',
          alt: 'Design 2',
          className: 'w-full h-32 object-cover',
        },
      ],
      layout: 'right',
    },
    {
      id: 4,
      title: 'BUILDING THE FUTURE TOGETHER',
      description:
        "The future belongs to those who dare to imagine it differently. Join us as we continue to push boundaries and redefine what's possible in the digital realm.",
      images: [
        {
          src: 'https://via.placeholder.com/400x500',
          alt: 'Future Vision',
          className: 'w-full h-96 object-cover',
        },
        {
          src: 'https://via.placeholder.com/180x180',
          alt: 'Team',
          className: 'w-full h-28 object-cover',
        },
      ],
      layout: 'left',
    },
  ];

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
        {sections.map((section) => (
          <motion.section
            key={section.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="min-h-screen flex items-center py-20 px-8"
          >
            <div className="max-w-7xl mx-auto w-full">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${section.layout === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text Content */}
                <motion.div variants={itemVariants} className={`space-y-8 ${section.layout === 'right' ? 'lg:order-2' : ''}`}>
                  <motion.div variants={textReveal} className="overflow-hidden">
                    <motion.h2
                      className="text-4xl lg:text-6xl font-black leading-tight tracking-tight"
                      initial={{ y: 100 }}
                      whileInView={{ y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      {section.title.split(' ').map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          className="inline-block mr-4"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.h2>
                  </motion.div>

                  <motion.div variants={textReveal} className="w-16 h-1 bg-orange-500" />

                  <motion.p variants={textReveal} className="text-lg lg:text-xl leading-relaxed text-gray-300 max-w-2xl">
                    {section.description}
                  </motion.p>

                  <motion.button
                    variants={textReveal}
                    whileHover={{ scale: 1.05, backgroundColor: '#ff6f00', boxShadow: '0 10px 40px rgba(255, 111, 0, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white px-8 py-3 font-bold tracking-wide hover:border-orange-500 transition-all duration-300"
                  >
                    VIEW PROJECT
                  </motion.button>
                </motion.div>

                {/* Image Grid */}
                <motion.div variants={itemVariants} className={`relative ${section.layout === 'right' ? 'lg:order-1' : ''}`}>
                  <div className="grid grid-cols-2 gap-4 h-96">
                    {section.images.map((image, imgIndex) => (
                      <motion.div
                        key={imgIndex}
                        variants={imageVariants}
                        whileHover={{ scale: 1.05, rotate: imgIndex % 2 === 0 ? 2 : -2, zIndex: 10 }}
                        className={`relative overflow-hidden bg-gray-800 ${imgIndex === 0 ? 'col-span-2 row-span-2' : ''} ${imgIndex === 1 ? 'row-span-1' : ''}`}
                        style={{
                          clipPath:
                            imgIndex % 2 === 0
                              ? 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)'
                              : 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)',
                        }}
                      >
                        <motion.img
                          src={image.src}
                          alt={image.alt}
                          className={image.className}
                          initial={{ scale: 1.2 }}
                          whileInView={{ scale: 1 }}
                          transition={{ duration: 1.2 }}
                        />

                        <motion.div className="absolute inset-0 bg-orange-500 mix-blend-multiply opacity-0" whileHover={{ opacity: 0.3 }} transition={{ duration: 0.3 }} />

                        {imgIndex === 0 && (
                          <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="text-white font-bold text-lg">{image.alt}</span>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Floating Elements */}
                  <motion.div animate={{ x: [0, 20, 0], y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-4 -right-4 w-8 h-8 bg-orange-500 transform rotate-45" />

                  <motion.div animate={{ x: [0, -15, 0], y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} className="absolute -bottom-6 -left-6 w-6 h-6 border-2 border-orange-500 transform rotate-45" />
                </motion.div>
              </div>
            </div>
          </motion.section>
        ))}

        {/* Final CTA Section */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="py-32 px-8 text-center relative">
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto space-y-12">
            <motion.h2 className="text-5xl lg:text-7xl font-black" initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
              READY TO CREATE
              <span className="text-orange-500 block">SOMETHING AMAZING?</span>
            </motion.h2>

            <motion.p variants={textReveal} className="text-xl text-gray-300 max-w-2xl mx-auto">
              Let's collaborate and bring your vision to life with cutting-edge technology and creative excellence.
            </motion.p>

            <motion.div variants={textReveal} className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button whileHover={{ scale: 1.05, backgroundColor: '#ff6f00', boxShadow: '0 20px 60px rgba(255, 111, 0, 0.4)' }} whileTap={{ scale: 0.95 }} className="bg-orange-500 text-black px-12 py-4 font-black tracking-wide text-lg">
                START PROJECT
              </motion.button>

              <motion.button whileHover={{ scale: 1.05, borderColor: '#ff6f00', color: '#ff6f00' }} whileTap={{ scale: 0.95 }} className="border-2 border-white text-white px-12 py-4 font-black tracking-wide text-lg">
                VIEW PORTFOLIO
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} className="border-t border-gray-800 py-12 px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} className="text-4xl font-black mb-4">
            BYTESPLATFORM
          </motion.div>
          <p className="text-gray-500 text-sm tracking-wide">A PLATFORM FOR CREATIVE DIGITAL SOLUTIONS</p>

          <motion.div className="flex justify-center space-x-8 mt-8 text-sm font-medium" variants={containerVariants} initial="hidden" whileInView="visible">
            {['HOME', 'ABOUT', 'BLOG', 'SHOP', 'CONTACT US'].map((item) => (
              <motion.a key={item} href="#" variants={itemVariants} whileHover={{ color: '#ff6f00' }} className="hover:text-orange-500 transition-colors">
                {item}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default AboutPage;
