import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogs } from "@/lib/getBlogs";

export const dynamicParams = false; // pre-render all blog pages

export async function generateStaticParams() {
  const blogs = getBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const blog = getBlogs().find((b) => b.slug === slug);

  if (!blog) return notFound();

  return (
    <main className="min-h-screen bg-white text-[#010a14] font-['PPNeueMontreal'] px-4 py-20">
      <article className="max-w-3xl mx-auto">
        <Image
          src={blog.image}
          alt={blog.title}
          width={1200}
          height={600}
          className="w-full h-60 object-cover rounded"
          priority
        />

        <h1 className="text-3xl md:text-4xl font-bold mt-8">{blog.title}</h1>
        <p className="text-sm opacity-60 mt-2">
          {new Date(blog.date).toLocaleDateString()}
        </p>

        <div className="prose md:prose-lg mt-6 max-w-none">
          <p>{blog.content}</p>
        </div>
      </article>
    </main>
  );
} 