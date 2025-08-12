import { getHybridBlogs, getBlogCounts } from "@/lib/hybridBlogs";
import { Header } from "@/sections/Navbar";
import BlogGrid from "@/components/BlogGrid";
import Link from "next/link";
import BlogListingIntro from "@/components/BlogListingIntro";

const POSTS_PER_PAGE = 8;

// Dynamic pagination function to get posts for specific page ranges
function getPostsForPage(allPosts: any[], pageNumber: number) {
  // Sort posts by actual publish date (newest first)
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.date || 0);
    const dateB = new Date(b.publishedAt || b.date || 0);
    return dateB.getTime() - dateA.getTime();
  });
  
  const POSTS_PER_PAGE = 8;
  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  
  return sortedPosts.slice(startIndex, endIndex);
}

// Calculate total pages based on available posts
function calculateTotalPages(allPosts: any[]) {
  const POSTS_PER_PAGE = 8;
  return Math.ceil(allPosts.length / POSTS_PER_PAGE);
}

// Add ISR (Incremental Static Regeneration)
export const revalidate = 600; // Revalidate every 5 minutes

export default async function BlogsRoot() {
  // Fetch posts from both static and Sanity sources
  const allPosts = await getHybridBlogs();
  const blogCounts = getBlogCounts();
  
  // Get posts for page 1 (highest 8 IDs)
  const visiblePosts = getPostsForPage(allPosts, 1);
  const totalPages = calculateTotalPages(allPosts);

  // Show hybrid status message
  const hasSanityConfigured = true; // Sanity is always configured with fallback values
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-[#010a14] font-sans px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <BlogListingIntro />

          <BlogGrid posts={visiblePosts} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
              {/* Prev button - disabled on page 1 */}
              <span className="px-3 py-1 rounded border border-gray-300 text-gray-400 select-none">Prev</span>

              {/* Numbered buttons */}
              {Array.from({ length: totalPages }, (_, idx) => {
                const p = idx + 1;
                const isActive = p === 1;
                return isActive ? (
                  <span key={p} className="px-3 py-1 rounded bg-[#010a14] text-white font-semibold">
                    {p}
                  </span>
                ) : (
                  <Link key={p} href={`/blogs/page-${p}`} className="px-3 py-1 rounded text-[#010a14] hover:bg-[#010a14] hover:text-white transition-colors border border-[#010a14]">
                    {p}
                  </Link>
                );
              })}

              {/* Next button - enabled on page 1 */}
              <Link href="/blogs/page-2" className="px-3 py-1 rounded text-[#010a14] hover:bg-[#010a14] hover:text-white transition-colors border border-[#010a14]">
                Next
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 