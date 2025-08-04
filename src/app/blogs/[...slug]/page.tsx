import { notFound, redirect } from "next/navigation";
import { getHybridBlogs, getHybridBlogBySlug, getHybridRelatedPosts } from "@/lib/hybridBlogs";
import { getSanityBlogBySlug as getSanityBlogBySlugDirect } from "@/lib/sanityBlogs";
import { Header } from "@/sections/Navbar";
import BlogGrid from "@/components/BlogGrid";
import Link from "next/link";
import BlogListingIntro from "@/components/BlogListingIntro";
import BlogDetailIntro from "@/components/BlogDetailIntro";
import Image from "next/image";
import { Metadata } from "next";
import { addInternalLinks } from "@/lib/internalLinking";
import RelatedPosts from "@/components/RelatedPosts";
import PortableText from "@/components/PortableText";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { blogMetaData } from "../layout";

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

export const dynamicParams = true;

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
  const hybridPost = await getHybridBlogBySlug(path);
  
  if (!hybridPost) {
    return {
      title: 'Blog Not Found | Bytes Platform',
      description: 'The requested blog post could not be found.',
    };
  }
  
  // Check if this is one of the first 24 posts (static metadata)
  const staticMetadata = blogMetaData[path];
  
  if (staticMetadata) {
    // Use static metadata for the first 24 posts
    return {
      title: staticMetadata.title,
      description: staticMetadata.description,
      alternates: {
        canonical: `https://bytesplatform.com/blogs/${path}`,
      },
    };
  }
  
  // For newer posts (beyond the first 24), use dynamic metadata from Sanity
  const title = hybridPost.source === 'sanity' && hybridPost.seo?.metaTitle 
    ? hybridPost.seo.metaTitle 
    : `${hybridPost.title} | Bytes Platform`;
  const description = hybridPost.source === 'sanity' && hybridPost.seo?.metaDescription 
    ? hybridPost.seo.metaDescription 
    : hybridPost.excerpt || hybridPost.title;
  
  // Build comprehensive metadata
  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: hybridPost.source === 'sanity' && hybridPost.seo?.canonicalUrl 
        ? hybridPost.seo.canonicalUrl 
        : `https://bytesplatform.com/blogs/${path}`,
    },
  };

  // Add Open Graph metadata
  if (hybridPost.source === 'sanity' && hybridPost.seo) {
    metadata.openGraph = {
      title: hybridPost.seo.ogTitle || title,
      description: hybridPost.seo.ogDescription || description,
      images: hybridPost.seo.ogImage ? [
        {
          url: hybridPost.seo.ogImage,
          width: 1200,
          height: 630,
          alt: hybridPost.title,
        }
      ] : undefined,
      type: 'article',
      publishedTime: hybridPost.date,
    };

    // Add Twitter metadata
    const twitterCard = hybridPost.seo.twitterCard === 'summary' || hybridPost.seo.twitterCard === 'summary_large_image' 
      ? hybridPost.seo.twitterCard 
      : 'summary_large_image';
    
    metadata.twitter = {
      card: twitterCard,
      title: hybridPost.seo.ogTitle || title,
      description: hybridPost.seo.ogDescription || description,
      images: hybridPost.seo.ogImage ? [hybridPost.seo.ogImage] : undefined,
    };

    // Add robots metadata
    if (hybridPost.seo.noIndex || hybridPost.seo.noFollow) {
      metadata.robots = {
        index: !hybridPost.seo.noIndex,
        follow: !hybridPost.seo.noFollow,
      };
    }

    // Add keywords
    if (hybridPost.seo.keywords && hybridPost.seo.keywords.length > 0) {
      metadata.keywords = hybridPost.seo.keywords.join(', ');
    }
  }

  return metadata;
}

export async function generateStaticParams() {
  const allPosts = await getHybridBlogs();
  const totalPages = calculateTotalPages(allPosts);
  
  // Generate params for blog posts
  const blogParams = allPosts.map((b) => ({ slug: [b.slug] }));
  
  // Generate params for pagination (skip page-1 since it redirects to /blogs)
  const pageParams = Array.from({ length: totalPages - 1 }, (_, idx) => ({ 
    slug: [`page-${idx + 2}`] 
  }));
  
  return [...blogParams, ...pageParams];
}

// Add ISR (Incremental Static Regeneration)
export const revalidate = 300; // Revalidate every 5 minutes



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
    const allPosts = await getHybridBlogs();
    const totalPages = calculateTotalPages(allPosts);

    if (!pageNumber || pageNumber < 1 || pageNumber > totalPages) {
      return notFound();
    }

    // Redirect page-1 to /blogs since that's now the first page
    if (pageNumber === 1) {
      redirect('/blogs');
    }

    const visiblePosts = getPostsForPage(allPosts, pageNumber);

    return (
      <>
        <Header />
        <main className="min-h-screen bg-white text-[#010a14] font-sans px-4 py-20">
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
  const hybridPost = await getHybridBlogBySlug(path);
  
  if (!hybridPost) {
    return notFound();
  }

  // Get related posts
  const relatedPosts = await getHybridRelatedPosts(hybridPost.slug);

  // Markdown components for static blogs
  const markdownComponents = {
    h2: ({ node, ...props }: any) => (
      <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-lg md:text-xl font-semibold mt-6 mb-3" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc ml-6 pl-4 space-y-2" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal ml-6 pl-4 space-y-2" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="mb-2" {...props} />
    ),
    a: ({ node, href, children, ...props }: any) => (
      <a 
        href={href} 
        className={`${href?.startsWith('/blogs/') ? 'internal-link' : 'text-blue-600 hover:text-blue-800'}`}
        {...props}
      >
        {children}
      </a>
    ),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-[#010a14] font-sans px-4 py-20">
        <article className="max-w-3xl mx-auto">
          <Image
            src={hybridPost.detailImage}
            alt={hybridPost.title}
            width={1200}
            height={700}
            className="w-full aspect-video object-cover rounded"
            priority
          />

          <BlogDetailIntro
            title={hybridPost.title}
            date={new Date(hybridPost.date).toLocaleDateString()}
          />

          {/* Render content based on source */}
          {hybridPost.source === 'static' ? (
            <div className="prose md:prose-lg mt-6 max-w-none font-light prose-p:font-light">
              <ReactMarkdown 
                components={markdownComponents}
                rehypePlugins={[rehypeRaw]}
              >
                {addInternalLinks(hybridPost.content, hybridPost.slug)}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="prose md:prose-lg mt-6 max-w-none font-light prose-p:font-light">
              <PortableText value={hybridPost.content} currentSlug={hybridPost.slug} />
            </div>
          )}
          
          <RelatedPosts currentSlug={hybridPost.slug} allPosts={relatedPosts} />
        </article>
      </main>
    </>
  );
} 