'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ServiceHead: React.FC = () => (
  <section className="h-[20vh] bg-white flex flex-col items-center justify-center px-4 text-center">
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#010a14] to-[#020b72] bg-clip-text text-transparent">Our Services</h1>
    <motion.div
      className="mt-2 h-1 bg-gradient-to-r from-[#010a14] to-[#010a14] rounded-full"
      initial={{ width: 0 }}
      whileInView={{ width: "35%" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  </section>
);

export default ServiceHead;