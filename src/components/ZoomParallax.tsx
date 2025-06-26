"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface PictureConfig {
  src: string;
  scaleEnd: number;
  /** inline styles for the inner image container */
  style: React.CSSProperties;
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
    <div ref={container} className="relative h-[250vh]">
      {/* sticky viewport */}
      <div className="sticky top-24 h-screen overflow-hidden">
        {pictures.map(({ src, scaleEnd, style }, index) => {
          const scale = useTransform(scrollYProgress, [0, 1], [1, scaleEnd]);
          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                style={style}
                className="relative"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="object-cover"
                  fill
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 