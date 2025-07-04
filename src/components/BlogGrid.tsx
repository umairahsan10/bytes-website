'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/getBlogs';

interface BlogGridProps {
  posts: BlogPost[];
  startIndexInPage?: number; // index offset for stagger delay
}

const MotionLink = motion(Link);

/**
 * Animated grid of blog cards using Framer Motion.
 * Each card fades in & moves up slightly as it enters the viewport.
 */
export default function BlogGrid({ posts, startIndexInPage = 0 }: BlogGridProps) {
  const getCategory = (id: number) => {
    if (id <= 2) return 'SEO';
    if (id <= 4) return 'WEB';
    if (id <= 6) return 'APP';
    if (id <= 8) return 'MARKETING';
    return '';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {posts.map((post, idx) => {
        const category = getCategory(post.id);
        return (
          <MotionLink
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="bg-[#dcdfe5] rounded-xl overflow-hidden flex flex-col h-[30rem] shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010a14]"
            whileHover={{ scale: 1.08, transition: { duration: 0.12, ease: 'easeOut' } }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: (startIndexInPage + idx) * 0.025 }}
          >
            <div className="relative" style={{ flex: '0 0 70%' }}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width:1024px) 100vw,25vw"
                className="object-cover"
                priority={startIndexInPage === 0 && idx === 0}
              />
            </div>
            <div className="p-4 flex flex-col" style={{ flex: '0 0 30%' }}>
              <span className="inline-block self-start bg-[#e5e8ec] text-[#010a14] text-xs px-2 py-0.5 rounded mb-2">
                {`BLOG${category ? ' / ' + category : ''}`}
              </span>
              <h2 className="mt-auto text-base md:text-lg font-semibold line-clamp-2 text-left">
                {post.title}
              </h2>
              <span className="text-[#010a14] text-sm font-medium underline-offset-2 group-hover:underline self-start mt-1">
                Read More →
              </span>
            </div>
          </MotionLink>
        );
      })}
    </div>
  );
} 