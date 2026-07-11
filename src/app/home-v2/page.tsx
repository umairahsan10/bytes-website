import type { Metadata } from 'next';
import { getHybridBlogs } from '@/lib/hybridBlogs';
import { faqs } from '@/data/home';

import { SystemLoader } from '@/components/home/loader';
import { PremiumNavigation } from '@/components/home/nav';
import { Hero } from '@/components/home/hero';
import { BytesSignature } from '@/components/home/signature';
import { CapabilityStory } from '@/components/home/capabilities';
import { ProductSystems } from '@/components/home/products';
import { ProjectRail } from '@/components/home/work';
import { IndustryStage } from '@/components/home/industries';
import { ProcessNetwork } from '@/components/home/process';
import { AboutProof } from '@/components/home/about';
import { ClientNetwork } from '@/components/home/clients';
import { EditorialInsights, type Post } from '@/components/home/insights';
import { FinalCTA } from '@/components/home/cta';
import { ContactSection } from '@/components/home/contact';
import { PremiumFooter } from '@/components/home/footer';

// Dev-only preview route for the homepage revamp. Removed at cutover.
export const metadata: Metadata = {
  title: 'Homepage Revamp Preview | Bytes Platform',
  robots: { index: false, follow: false },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: 'Bytes Platform',
  legalName: 'Bytes Platform LLC',
  url: 'https://bytesplatform.com',
  logo: 'https://bytesplatform.com/assets/bytes-logo.png',
  email: 'info@bytesplatform.com',
  telephone: '+1-833-323-0371',
  description:
    'Bytes Platform is a Denton, TX digital agency building custom websites, apps, SEO, and AI solutions that grow your business. Get a free consultation today.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2809 Joshua Street',
    addressLocality: 'Denton',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  sameAs: [
    'https://www.facebook.com/share/1Kc3xtzhqa/',
    'https://www.instagram.com/bytesplatform',
    'https://www.linkedin.com/company/bytebloom-solutionss/',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

function formatPostDate(raw?: string): string | undefined {
  if (!raw) return undefined;
  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return raw; // static blogs already ship display strings
  return new Date(parsed)
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    .toUpperCase();
}

export default async function HomeV2() {
  let posts: Post[] = [];
  try {
    const blogs = await getHybridBlogs();
    posts = blogs.slice(0, 4).map((b) => ({
      title: b.title,
      slug: b.slug,
      date: formatPostDate(b.date),
      excerpt: b.excerpt,
      image: b.image,
      category: b.category,
    }));
  } catch {
    // Field Notes section renders nothing without posts; never block the page.
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-bytes-blue focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div data-bytes-home>
        <SystemLoader />
        <PremiumNavigation />

        <main id="main" className="bg-bytes-ink">
        <Hero />
        <BytesSignature />
        <CapabilityStory />
        <ProductSystems />
        <ProjectRail />
        <IndustryStage />
        <ProcessNetwork />
        <AboutProof />
        <ClientNetwork />
        <EditorialInsights posts={posts} />
        <FinalCTA />
        <ContactSection />
        <PremiumFooter />
      </main>
      </div>
    </>
  );
}
