'use client';

import { motion } from 'framer-motion';

interface Props {
  title: string;
  date: string;
}

export default function BlogDetailIntro({ title, date }: Props) {
  return (
    <>
      <motion.h1
        className="text-3xl md:text-4xl font-bold mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="text-sm opacity-60 mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      >
        {date}
      </motion.p>
    </>
  );
} 