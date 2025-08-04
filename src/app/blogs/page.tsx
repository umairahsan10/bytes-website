import { getHybridBlogs, getBlogCounts } from "@/lib/hybridBlogs";
import { Header } from "@/sections/Navbar";
import BlogGrid from "@/components/BlogGrid";
import Link from "next/link";
import BlogListingIntro from "@/components/BlogListingIntro";

const POSTS_PER_PAGE = 8;

// Dynamic pagination function to get posts for specific ID ranges
function getPostsForPage(allPosts: any[], pageNumber: number) {
  const maxId = Math.max(...allPosts.map(post => post.id));
  const minId = Math.min(...allPosts.map(post => post.id));
  
  // Calculate how many pages we need
  const totalPosts = maxId - minId + 1;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Calculate the ID range for the requested page
  // Page 1 gets the highest 8 IDs, Page 2 gets the next 8, etc.
  const startId = maxId - (pageNumber - 1) * POSTS_PER_PAGE - (POSTS_PER_PAGE - 1);
  const endId = maxId - (pageNumber - 1) * POSTS_PER_PAGE;
  
  // Filter posts by ID range
  return allPosts.filter(post => post.id >= startId && post.id <= endId);
}

// Calculate total pages based on available posts
function calculateTotalPages(allPosts: any[]) {
  const maxId = Math.max(...allPosts.map(post => post.id));
  const minId = Math.min(...allPosts.map(post => post.id));
  
  const totalPosts = maxId - minId + 1;
  return Math.ceil(totalPosts / POSTS_PER_PAGE);
}

// Add ISR (Incremental Static Regeneration)
export const revalidate = 300; // Revalidate every 5 minutes

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