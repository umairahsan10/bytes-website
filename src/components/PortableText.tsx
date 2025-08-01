'use client';

import { PortableText as PortableTextComponent } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';
import { useEffect, useRef } from 'react';
import { addInternalLinks } from '@/lib/internalLinking';

const components = {
  types: {
    image: ({ value }: any) => {
      return (
        <div className="my-8">
          <img
            src={urlFor(value).url()}
            alt={value.alt || 'Blog image'}
            className="w-full h-auto rounded-lg"
          />
          {value.alt && (
            <p className="text-sm text-gray-600 mt-2 text-center">{value.alt}</p>
          )}
        </div>
      );
    },
    code: ({ value }: any) => {
      return (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
          <code className="text-sm">{value.code}</code>
        </pre>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg md:text-xl font-semibold mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc ml-6 pl-4 space-y-2 mb-4">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal ml-6 pl-4 space-y-2 mb-4">{children}</ol>
    ),
  },
  listItem: ({ children }: any) => (
    <li className="mb-2">{children}</li>
  ),
  marks: {
    link: ({ children, value }: any) => {
      const { href } = value;
      const isInternalLink = href?.startsWith('/blogs/');
      
      return (
        <a
          href={href}
          className={`${isInternalLink ? 'internal-link text-blue-600 hover:text-blue-800 underline' : 'text-blue-600 hover:text-blue-800 underline'}`}
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
  },
};

interface PortableTextProps {
  value: any;
  currentSlug?: string;
}

export default function PortableText({ value, currentSlug }: PortableTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Add internal links after the component mounts
  useEffect(() => {
    if (!containerRef.current) return;

    // Use the existing addInternalLinks function to process the rendered content
    const container = containerRef.current;
    const html = container.innerHTML;
    const processedHTML = addInternalLinks(html, currentSlug);
    
    if (processedHTML !== html) {
      container.innerHTML = processedHTML;
    }
  }, [value, currentSlug]);

  return (
    <div ref={containerRef} className="prose md:prose-lg max-w-none font-light prose-p:font-light">
      <PortableTextComponent value={value} components={components} />
    </div>
  );
} 