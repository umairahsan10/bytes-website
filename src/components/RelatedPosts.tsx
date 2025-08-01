import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/getBlogs';
import { getRelatedPosts } from '@/lib/internalLinking';

interface RelatedPostsProps {
  currentSlug: string;
  allPosts: BlogPost[];
  limit?: number;
}

export default function RelatedPosts({ currentSlug, allPosts, limit = 3 }: RelatedPostsProps) {
  const relatedPosts = getRelatedPosts(currentSlug, allPosts, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-[#010a14]">
        Related Articles
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blogs/${post.slug}`} className="block">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-medium text-[#010a14] group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-3 text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
} 