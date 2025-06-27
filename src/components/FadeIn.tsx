"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

interface FadeInProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function FadeIn({ children, className = "", ...rest }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
} 