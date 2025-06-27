'use client';

import { motion, Variants } from 'framer-motion';
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg"
import grainImage from "@/assets/images/grain.jpg"
import { SectionHeader } from "@/components/SectionHeader";
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const ContactSection = () => {
  return (
    <motion.div
      id="contact"
      className="py-16 pt-12 lg:py-24 lg:pt-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className="container mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-900 py-8 px-10 rounded-3xl text-center md:text-left relative z-0"
        >
          <div className="absolute inset-0 opacity-5 -z-10" style={{ backgroundImage: `url(${grainImage.src})` }}></div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl">Let&apos;s create something amazing together</h2>
              <p className=" text-sm md:text-base mt-2">Ready to bring your next project to life? Let&apos;s connect and discuss how I can help you achieve your goals</p>
            </div>
            <div className="ml-auto">
              <Link href="/contact" passHref>
                <button className="text-white bg-gray-900 inline-flex items-center px-8 md:px-10 h-14 md:h-16 rounded-2xl gap-3 w-max border-2 border-gray-900 text-base md:text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <span className="font-semibold">Contact me</span>
                  <ArrowUpRightIcon className="size-5" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
