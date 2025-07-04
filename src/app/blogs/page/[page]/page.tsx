import { notFound } from "next/navigation";
import { getBlogs } from "@/lib/getBlogs";
import { Header } from "@/sections/Navbar";
import BlogGrid from "@/components/BlogGrid";
import Link from "next/link";
import BlogListingIntro from "@/components/BlogListingIntro";

const POSTS_PER_PAGE = 8;

export const dynamicParams = false;

export async function generateStaticParams() {
  const totalPosts = getBlogs().length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  return Array.from({ length: totalPages }, (_, idx) => ({ page: (idx + 1).toString() }));
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);
  const posts = getBlogs();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  if (!pageNumber || pageNumber < 1 || pageNumber > totalPages) {
    return notFound();
  }

  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-[#010a14] font-['PPNeueMontreal'] px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <BlogListingIntro />

          <BlogGrid posts={visiblePosts} />

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
            {pageNumber > 1 ? (
              <Link href={`/blogs/page/${pageNumber - 1}`} className="px-3 py-1 rounded text-[#010a14] hover:bg-[#010a14] hover:text-white transition-colors border border-[#010a14]">
                Prev
              </Link>
            ) : (
              <span className="px-3 py-1 rounded border border-gray-300 text-gray-400 select-none">Prev</span>
            )}

            {Array.from({ length: totalPages }, (_, idx) => {
              const p = idx + 1;
              const isActive = p === pageNumber;
              return isActive ? (
                <span key={p} className="px-3 py-1 rounded bg-[#010a14] text-white font-semibold">
                  {p}
                </span>
              ) : (
                <Link key={p} href={`/blogs/page/${p}`} className="px-3 py-1 rounded text-[#010a14] hover:bg-[#010a14] hover:text-white transition-colors border border-[#010a14]">
                  {p}
                </Link>
              );
            })}

            {pageNumber < totalPages ? (
              <Link href={`/blogs/page/${pageNumber + 1}`} className="px-3 py-1 rounded text-[#010a14] hover:bg-[#010a14] hover:text-white transition-colors border border-[#010a14]">
                Next
              </Link>
            ) : (
              <span className="px-3 py-1 rounded border border-gray-300 text-gray-400 select-none">Next</span>
            )}
          </div>
        </div>
      </main>
    </>
  );
} 