import { notFound, redirect } from "next/navigation";
import { getBlogs } from "@/lib/getBlogs";
import { Header } from "@/sections/Navbar";
import BlogGrid from "@/components/BlogGrid";
import Link from "next/link";
import BlogListingIntro from "@/components/BlogListingIntro";
import ReactMarkdown from "react-markdown";
import BlogDetailIntro from "@/components/BlogDetailIntro";
import Image from "next/image";
import { Metadata } from "next";
import { blogMetaData } from "../layout";

const POSTS_PER_PAGE = 8;

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join('/');
  
  // Check if this is a pagination URL
  if (path.startsWith('page-')) {
    return {
      title: 'Digital Marketing Insight Blogs | Bytes Platform',
      description: 'Blog from Bytes Platform, a source with digital marketing techniques, CMS tips, SEO, PPC, and Social media.',
      alternates: {
        canonical: `/blogs/${path}`,
      },
    };
  }
  
  // Handle individual blog post metadata
  const blog = getBlogs().find((b) => b.slug === path);
  
  if (!blog) {
    return {
      title: 'Blog Not Found | Bytes Platform',
      description: 'The requested blog post could not be found.',
    };
  }
  
  // Get meta data for this specific blog
  const metaData = blogMetaData[path];
  
  if (metaData) {
    return {
      title: metaData.title,
      description: metaData.description,
      alternates: {
        canonical: `https://bytesplatform.com/blogs/${path}`,
      },
    };
  }
  
  // Fallback metadata if not found in blogMetaData
  return {
    title: `${blog.title} | Bytes Platform`,
    description: blog.title,
    alternates: {
      canonical: `https://bytesplatform.com/blogs/${path}`,
    },
  };
}

export async function generateStaticParams() {
  const blogs = getBlogs();
  const totalPosts = blogs.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Generate params for blog posts
  const blogParams = blogs.map((b) => ({ slug: [b.slug] }));
  
  // Generate params for pagination (skip page-1 since it redirects to /blogs)
  const pageParams = Array.from({ length: totalPages - 1 }, (_, idx) => ({ 
    slug: [`page-${idx + 2}`] 
  }));
  
  return [...blogParams, ...pageParams];
}

const markdownComponents = {
  h2: ({ node, ...props }: any) => (
    <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-lg md:text-xl font-semibold mt-6 mb-3" {...props} />
  ),
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join('/');
  
  // Check if this is a pagination URL (e.g., page-1, page-2)
  if (path.startsWith('page-')) {
    const pageNumber = parseInt(path.replace('page-', ''), 10);
    const posts = getBlogs();
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    if (!pageNumber || pageNumber < 1 || pageNumber > totalPages) {
      return notFound();
    }

    // Redirect page-1 to /blogs since that's now the first page
    if (pageNumber === 1) {
      redirect('/blogs');
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
              <Link href={pageNumber - 1 === 1 ? '/blogs' : `/blogs/page-${pageNumber - 1}`} className="px-3 py-1 rounded text-[#010a14] hover:bg-[#010a14] hover:text-white transition-colors border border-[#010a14]">
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
                  <Link key={p} href={p === 1 ? '/blogs' : `/blogs/page-${p}`} className="px-3 py-1 rounded text-[#010a14] hover:bg-[#010a14] hover:text-white transition-colors border border-[#010a14]">
                    {p}
                  </Link>
                );
              })}

              {pageNumber < totalPages ? (
                <Link href={`/blogs/page-${pageNumber + 1}`} className="px-3 py-1 rounded text-[#010a14] hover:bg-[#010a14] hover:text-white transition-colors border border-[#010a14]">
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
  
  // Handle individual blog post
  const blog = getBlogs().find((b) => b.slug === path);
  
  if (!blog) {
    return notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-[#010a14] font-['PPNeueMontreal'] px-4 py-20">
        <article className="max-w-3xl mx-auto">
          <Image
            src={blog.detailImage}
            alt={blog.title}
            width={1200}
            height={700}
            className="w-full aspect-video object-cover rounded"
            priority
          />

          <BlogDetailIntro
            title={blog.title}
            date={new Date(blog.date).toLocaleDateString()}
          />

          <div className="prose md:prose-lg mt-6 max-w-none font-light prose-p:font-light">
            <ReactMarkdown components={markdownComponents}>{blog.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </>
  );
} 