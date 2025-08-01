import { getHybridBlogs, getBlogCounts } from "@/lib/hybridBlogs";
import { Header } from "@/sections/Navbar";
import BlogGrid from "@/components/BlogGrid";
import Link from "next/link";
import BlogListingIntro from "@/components/BlogListingIntro";

const POSTS_PER_PAGE = 8;

// Add ISR (Incremental Static Regeneration)
export const revalidate = 300; // Revalidate every 5 minutes

export default async function BlogsRoot() {
  // Fetch posts from both static and Sanity sources
  const allPosts = await getHybridBlogs();
  const blogCounts = getBlogCounts();
  
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const visiblePosts = allPosts.slice(0, POSTS_PER_PAGE);

  // Show hybrid status message
  const hasSanityConfigured = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
                             process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your-project-id';
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-[#010a14] font-sans px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <BlogListingIntro />



          <BlogGrid posts={visiblePosts} />

          {/* Pagination (if needed) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blogs/page-${page}`}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    1 === page
                      ? 'bg-[#010a14] text-white'
                      : 'bg-gray-200 text-[#010a14] hover:bg-gray-300'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
} 