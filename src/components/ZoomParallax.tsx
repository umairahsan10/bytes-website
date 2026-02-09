"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

interface PictureConfig {
  src: string;
  scaleEnd: number;
  /** inline styles for the inner image container */
  style: React.CSSProperties;
}

// Separate component to properly use hooks for each picture
function PictureItem({ 
  src, 
  scaleEnd, 
  style, 
  index, 
  scrollYProgress 
}: PictureConfig & { index: number; scrollYProgress: MotionValue<number> }) {
  const scale = useTransform(scrollYProgress, [0, 1], [1, scaleEnd]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.9, 1], [1, 1, 1, 0]);
  
  return (
    <motion.div
      style={{ scale, opacity }}
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5, rotate: index % 2 === 0 ? -180 : 180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        duration: 1.2, 
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <motion.div
        style={style}
        className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2"
        whileHover={{ 
          scale: 1.05, 
          rotate: index % 2 === 0 ? 5 : -5,
          zIndex: 10
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={src}
            alt={`Gallery image ${index + 1}`}
            className="object-cover transition-transform duration-500 hover:scale-110"
            fill
          />
          {/* White border effect */}
          <div className="absolute inset-0 ring-4 ring-white rounded-xl pointer-events-none"></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const pictures: PictureConfig[] = [
  {
    src: "/bots/alex-knight-2EJCSULRwC8-unsplash.jpg",
    scaleEnd: 4,
    style: {
      width: "25vw",
      height: "25vh",
    },
  },
  {
    src: "/bots/mohamed-nohassi-2iUrK025cec-unsplash.jpg",
    scaleEnd: 5,
    style: {
      top: "-30vh",
      left: "5vw",
      width: "35vw",
      height: "30vh",
    },
  },
  {
    src: "/bots/mohamed-nohassi-9Ge8ngH6JeQ-unsplash.jpg",
    scaleEnd: 6,
    style: {
      top: "-10vh",
      left: "-25vw",
      width: "20vw",
      height: "45vh",
    },
  },
  {
    src: "/bots/yuyang-liu-dp9Jrww_BRs-unsplash.jpg",
    scaleEnd: 5,
    style: {
      left: "27.5vw",
      width: "25vw",
      height: "25vh",
    },
  },
  {
    src: "/textures/DSC01040.jpg",
    scaleEnd: 6,
    style: {
      top: "27.5vh",
      left: "5vw",
      width: "20vw",
      height: "25vh",
    },
  },
  {
    src: "/textures/DSC01420.jpg",
    scaleEnd: 8,
    style: {
      top: "27.5vh",
      left: "-22.5vw",
      width: "30vw",
      height: "25vh",
    },
  },
  {
    src: "/assets/hero.jpg",
    scaleEnd: 9,
    style: {
      top: "22.5vh",
      left: "25vw",
      width: "15vw",
      height: "15vh",
    },
  },
];

export default function ZoomParallax() {
  const container = useRef<HTMLDivElement | null>(null);

  // Track scroll progress of the entire container
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={container}
      className="relative bg-white h-[200vh]"
    >
      {/* sticky viewport with white background */}
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        {pictures.map((picture, index) => (
          <PictureItem
            key={index}
            {...picture}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}
        
        {/* Floating particles for extra animation */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-30"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}