import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogs } from "@/lib/getBlogs";

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
  params: { page: string };
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
    <main className="min-h-screen bg-white text-[#010a14] font-['PPNeueMontreal'] px-4 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blogs</h1>
        <p className="text-lg md:text-xl mb-12 max-w-3xl opacity-80 mx-auto">
          Insights, stories and updates from the Bytes Platform team.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {visiblePosts.map((post) => (
            <div key={post.id} className="bg-[#dcdfe5] rounded-xl overflow-hidden flex flex-col h-80 shadow">
              <div className="relative flex-1 min-h-0">
                <Image src={post.image} alt={post.title} fill sizes="(max-width:1024px) 100vw,25vw" className="object-cover" priority={pageNumber === 1} />
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <h2 className="text-base md:text-lg font-semibold mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm opacity-80 line-clamp-3 flex-1">{post.excerpt}</p>
                <Link href={`/blogs/${post.slug}`} className="mt-2 text-[#010a14] text-sm font-medium hover:underline">
                  Read More &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

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
  );
} 