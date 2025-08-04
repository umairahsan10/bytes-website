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