'use client';

import { motion } from 'framer-motion';

export default function BlogListingIntro() {
  return (
    <>
      <motion.h1
        className="relative inline-block text-5xl md:text-7xl font-extrabold mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Our Blogs
        <motion.span
          className="absolute left-0 -bottom-2 h-1 bg-[#010a14]"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        />
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl mb-12 max-w-3xl opacity-80 mx-auto font-light"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      >
        Insights, stories and updates from the Bytes Platform team.
      </motion.p>
    </>
  );
} 