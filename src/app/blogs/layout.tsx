import { Metadata } from 'next';

// Default meta data for blog listing pages
const defaultMetaData = {
  title: 'Digital Marketing Insight Blogs | Bytes Platform',
  description: 'Blog from Bytes Platform, a source with digital marketing techniques, CMS tips, SEO, PPC, and Social media.'
};

export const metadata: Metadata = {
  title: defaultMetaData.title,
  description: defaultMetaData.description,
  alternates: {
    canonical: '/blogs',
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
