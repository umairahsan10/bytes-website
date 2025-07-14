import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogs } from "@/lib/getBlogs";
import ReactMarkdown from "react-markdown";
import { Header } from "@/sections/Navbar";
import BlogDetailIntro from "@/components/BlogDetailIntro";

export const dynamicParams = false; // pre-render all blog pages

export async function generateStaticParams() {
  const blogs = getBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

const markdownComponents = {
  h2: ({ node, ...props }: any) => (
    <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-lg md:text-xl font-semibold mt-6 mb-3" {...props} />
  ),
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = getBlogs().find((b) => b.slug === slug);

  if (!blog) return notFound();

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