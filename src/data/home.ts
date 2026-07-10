/**
 * Homepage revamp — single source of truth for all section content.
 * Every fact here is sourced from existing repository content
 * (src/sections/*, src/app/industries/page.tsx, page.tsx JSON-LD).
 * Do not add claims, clients, metrics, or links that are not in the repo.
 */

export type Capability = {
  id: string;
  index: string; // "01".."06"
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
  /** which BytesCore visual state to render */
  core: 'ai' | 'software' | 'web' | 'mobile' | 'growth' | 'infra';
};

export const capabilities: Capability[] = [
  {
    id: 'ai-automation',
    index: '01',
    title: 'AI & Intelligent Automation',
    copy: 'Agents, chatbots and workflow systems that turn repetitive work into responsive digital operations.',
    href: '/products/byte-bots',
    linkLabel: 'Explore Byte Bots',
    core: 'ai',
  },
  {
    id: 'software-platforms',
    index: '02',
    title: 'Custom Software & Platforms',
    copy: 'Scalable platforms, portals, SaaS products, ERP/CRM systems and internal tools built around the way the business actually works.',
    href: '/products/byte-suites',
    linkLabel: 'Explore Byte Suites',
    core: 'software',
  },
  {
    id: 'web',
    index: '03',
    title: 'Web Experiences',
    copy: 'Fast, accessible and conversion-focused web experiences combining strong storytelling with clean engineering.',
    href: '/services/web',
    linkLabel: 'Web Development',
    core: 'web',
  },
  {
    id: 'mobile',
    index: '04',
    title: 'Mobile Products',
    copy: 'Reliable iOS and Android experiences supported by product thinking from prototype through release.',
    href: '/services/app',
    linkLabel: 'App Development',
    core: 'mobile',
  },
  {
    id: 'growth',
    index: '05',
    title: 'Search, Marketing & Growth',
    copy: 'SEO, content, performance marketing and analytics connected to measurable business goals.',
    href: '/services/seo',
    linkLabel: 'SEO & Marketing',
    core: 'growth',
  },
  {
    id: 'integrations',
    index: '06',
    title: 'Integrations & Infrastructure',
    copy: 'APIs, data flows, third-party systems, security and deployment foundations designed for long-term stability.',
    href: '/services/advanced-services',
    linkLabel: 'Advanced Services',
    core: 'infra',
  },
];

export const products = {
  byteBots: {
    name: 'Byte Bots',
    headline: ['Human conversations.', 'Automated at scale.'],
    copy: 'Intelligent conversational systems designed to support customers, qualify opportunities and automate repetitive communication without losing the human context.',
    href: '/products/byte-bots',
    cta: 'Explore Byte Bots',
  },
  byteSuites: {
    name: 'Byte Suites',
    headline: ['Connected tools for', 'modern operations.'],
    copy: 'Custom business platforms that connect teams, workflows, customers and data inside one scalable digital environment.',
    href: '/products/byte-suites',
    cta: 'Explore Byte Suites',
  },
};

export type Project = {
  title: string;
  image: string;
  url: string;
  meta: string; // mono metadata label
};

/** Real staging projects — URLs must not be changed (see Projects.tsx). */
export const projects: Project[] = [
  { title: 'Bytes Test Domain 2', image: '/portfolio/bytes-test-2.webp', url: 'https://bytes-test-2.com', meta: 'STG.02 // LIVE BUILD' },
  { title: 'Bytes Test Domain 3', image: '/portfolio/bytes-test-3.webp', url: 'https://bytes-test-3.com', meta: 'STG.03 // LIVE BUILD' },
  { title: 'Bytes Test Domain 5', image: '/portfolio/bytes-test-5.webp', url: 'https://bytes-test-5.com', meta: 'STG.05 // LIVE BUILD' },
  { title: 'Bytes Test Domain 6', image: '/portfolio/bytes-test-6.webp', url: 'https://bytes-test-6.com', meta: 'STG.06 // LIVE BUILD' },
];

export const stagingDisclaimer =
  'Every link points to a real website in development, hosted on a test domain for client review. Domains change as builds move toward launch.';

export type Industry = {
  id: string;
  name: string;
  copy: string;
  keywords: string[];
};

/** Sourced from src/app/industries/page.tsx — the authority. */
export const industries: Industry[] = [
  {
    id: 'finance',
    name: 'Banking & Financial Sector',
    copy: 'Secure, scalable digital solutions for modern banking and financial institutions — intelligent automation, seamless customer experiences, and robust compliance architectures.',
    keywords: ['SECURE SYSTEMS', 'AUTOMATION', 'DATA FLOW', 'INTELLIGENCE'],
  },
  {
    id: 'health',
    name: 'Health Sector',
    copy: 'Digital health solutions that enhance patient care and streamline medical operations — HIPAA-compliant systems, data interoperability, and patient engagement portals.',
    keywords: ['OPERATIONS', 'SECURE SYSTEMS', 'MOBILE', 'DATA FLOW'],
  },
  {
    id: 'retail',
    name: 'Retail Solutions',
    copy: 'Comprehensive retail solutions that boost sales and elevate customer experience — omnichannel strategies, data-driven personalization, and fast e-commerce platforms.',
    keywords: ['CONVERSION', 'CUSTOMER EXPERIENCE', 'SCALE', 'INTEGRATION'],
  },
  {
    id: 'federal',
    name: 'Federal Government Contractors',
    copy: 'Innovative digital solutions tailored for federal and state government contractors — digital modernization, workflow automation, and mission-critical cloud infrastructure.',
    keywords: ['SECURE SYSTEMS', 'OPERATIONS', 'AUTOMATION', 'INTEGRATION'],
  },
];

export type ProcessStep = {
  index: string;
  name: string;
  copy: string;
};

export const processSteps: ProcessStep[] = [
  { index: '01', name: 'DECODE', copy: 'Understand the business, audience, workflow and opportunity.' },
  { index: '02', name: 'ARCHITECT', copy: 'Define the product, technology, experience and delivery system.' },
  { index: '03', name: 'PROTOTYPE', copy: 'Turn strategy into interactive structures that can be tested early.' },
  { index: '04', name: 'BUILD', copy: 'Engineer the platform, interfaces, integrations and automation.' },
  { index: '05', name: 'LAUNCH & COMPOUND', copy: 'Deploy, measure, optimize and expand.' },
];

export type Metric = { value: number; suffix: string; label: string };

/** Values verified against src/sections/numbers.tsx */
export const metrics: Metric[] = [
  { value: 2, suffix: '+', label: 'Years of Continual Excellence' },
  { value: 300, suffix: '+', label: 'Successful Projects Deployed' },
  { value: 90, suffix: '+', label: 'Employees' },
];

export type ClientBrand = { name: string; logo: string; url: string };

/** All 19 logos + outbound links preserved from src/sections/brands.tsx */
export const clients: ClientBrand[] = [
  { name: 'A Ayobami', logo: '/assets/brands/brand1.png', url: 'https://aayobami.com/' },
  { name: 'Efatab Global', logo: '/assets/brands/brand2.png', url: 'https://efatabglobal.com/' },
  { name: 'CAD Plus LLC', logo: '/assets/brands/brand3.jpg', url: 'https://cadplusllc.com/' },
  { name: '5D Cloud Contact Solutions', logo: '/assets/brands/brand4.png', url: 'https://5dccs.com/' },
  { name: 'Fairpath Consultants', logo: '/assets/brands/brand5.png', url: 'https://www.fairpathconsultants.com/' },
  { name: 'Oxypam', logo: '/assets/brands/brand6.jpg', url: 'https://oxypam.com/' },
  { name: 'Jobco Supply', logo: '/assets/brands/brand7.png', url: 'https://jobcosupply.com/' },
  { name: 'GEBI Online', logo: '/assets/brands/brand8.png', url: 'https://www.gebionline.com/' },
  { name: 'ECS Wealth', logo: '/assets/brands/brand9.jpeg', url: 'https://ecswealth.com/' },
  { name: 'Lampados Financial', logo: '/assets/brands/brand10.webp', url: 'https://lampadosfinancial.com/' },
  { name: 'Feverdots', logo: '/assets/brands/brand11.webp', url: 'https://feverdots.com/' },
  { name: 'Ontop Home Services', logo: '/assets/brands/brand12.jpg', url: 'https://ontophomeservices.com/' },
  { name: 'Keltek Tool', logo: '/assets/brands/brand13.png', url: 'https://keltektool.com/' },
  { name: 'Paradise Copters', logo: '/assets/brands/brand14.png', url: 'https://paradisecopters.com/' },
  { name: 'Safe Travel Charters', logo: '/assets/brands/brand15.png', url: 'https://safetravelcharters.com/' },
  { name: 'Bytes Test 2', logo: '/assets/brands/brand16.png', url: 'https://bytes-test-2.com/' },
  { name: 'Regal Arms', logo: '/assets/brands/brand17.png', url: 'https://regal-arms.com/' },
  { name: 'Exfoleez', logo: '/assets/brands/brand18.jpg', url: 'https://exfoleez.net/' },
  { name: 'The Lab Co', logo: '/assets/brands/brand19.png', url: 'https://www.thelabco.net/' },
];

export const contact = {
  company: 'Bytes Platform LLC',
  addressLines: ['2809 Joshua Street', 'Denton, Texas, United States'],
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Bytes+Platform+LLC%2C+2809+Joshua+Street+Denton%2C+Texas%2C+United+States',
  email: 'info@bytesplatform.com',
  phoneDisplay: '833-323-0371 (Toll Free)',
  phoneHref: 'tel:+18333230371',
  socials: [
    { name: 'Facebook', url: 'https://www.facebook.com/share/1Kc3xtzhqa/' },
    { name: 'Instagram', url: 'https://www.instagram.com/bytesplatform' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/bytebloom-solutionss' },
  ],
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

/** Route contract preserved from src/sections/Navbar.tsx */
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Web Development', href: '/services/web', description: 'Fast, conversion-focused web experiences' },
      { label: 'SEO', href: '/services/seo', description: 'Search visibility engineered to compound' },
      { label: 'App Development', href: '/services/app', description: 'iOS and Android product builds' },
      { label: 'Marketing', href: '/services/marketing', description: 'ROI-focused omnichannel campaigns' },
      { label: 'Advanced Services', href: '/services/advanced-services', description: 'Integrations, infrastructure and beyond' },
    ],
  },
  {
    label: 'Products',
    href: '/products/byte-bots',
    children: [
      { label: 'Byte Bots', href: '/products/byte-bots', description: 'AI chatbots trained on your business' },
      { label: 'Byte Suites', href: '/products/byte-suites', description: 'Connected platforms for operations' },
    ],
  },
  { label: 'Industries', href: '/industries' },
  {
    label: 'Insights',
    href: '/blogs',
    children: [
      { label: 'Blogs', href: '/blogs', description: 'Bytes Field Notes and practical thinking' },
      { label: 'Careers', href: '/careers', description: 'Join the Bytes team' },
    ],
  },
];

export const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
  { label: 'Refund Policy', href: '/refund-policy' },
];

/** Rendered visibly to keep the FAQPage JSON-LD compliant (page.tsx). */
export const faqs = [
  {
    q: 'How much does a custom website cost?',
    a: 'Cost depends on scope, complexity, and features. A brochure site differs greatly from a custom web app or e-commerce build. Bytes Platform scopes every project individually and provides a fixed quote after a free consultation.',
  },
  {
    q: 'How long does it take to build a website?',
    a: 'Most standard websites take four to eight weeks from kickoff to launch, while larger custom applications take longer. Timelines depend on scope, content readiness, and revision rounds, which we confirm before starting.',
  },
  {
    q: 'How long does SEO take to show results?',
    a: "SEO is a long-term investment. Early movement often appears within three months, with more significant gains typically between six and twelve months, depending on competition, your site's current authority, and content velocity.",
  },
  {
    q: 'Do you work with clients outside of Texas?',
    a: 'Yes. Bytes Platform is based in Denton, Texas, and works with clients across the United States and remotely. All projects are managed online with regular check-ins regardless of location.',
  },
  {
    q: 'What industries do you work with?',
    a: "Bytes Platform serves businesses across many industries, from startups to established companies. Our web, app, SEO, marketing, and automation services adapt to each client's specific market and goals.",
  },
  {
    q: 'What is the difference between Byte Bots and a regular chatbot?',
    a: "Byte Bots are custom AI chatbots built and trained on your business's own data, so they answer accurately in your brand's voice, qualify leads, and automate support, rather than relying on generic scripted replies.",
  },
  {
    q: 'Do you offer ongoing support and maintenance?',
    a: 'Yes. Beyond launch, Bytes Platform offers ongoing maintenance, updates, security monitoring, and optimization so your website, app, or marketing continues to perform over time.',
  },
];

export const hero = {
  eyebrow: 'FULL-STACK DIGITAL POWERHOUSE',
  h1: ['We build digital systems', 'that think, adapt and scale.'],
  body: 'AI products, software, automation, web experiences and growth infrastructure—designed and engineered by one connected team.',
  primaryCta: { label: 'Book a Free Consultation', href: '/contact' },
  secondaryCta: { label: 'Explore Our Work', href: '#work' },
  scrollLabel: 'SCROLL TO ENTER THE BYTES ECOSYSTEM',
};

export const about = {
  heading: ['Not another vendor.', 'An embedded digital team.'],
  copy: 'Bytes Platform combines strategy, product design, engineering, AI and growth under one roof. That means fewer handoffs, clearer ownership and digital systems designed to work together from day one — from custom websites, apps and SEO to chatbots and tailored ERP/CRM solutions.',
  statement: ['One team.', 'One system.', 'No handoff chaos.'],
  cta: { label: 'Learn More About Us', href: '/about' },
};

export const finalCta = {
  bgWord: "BUILD WHAT'S NEXT",
  heading: ['Your next system starts', 'with one conversation.'],
  copy: "Tell us where your business is today. We'll help define the digital system that moves it forward.",
  primaryCta: { label: 'Book a Free Consultation', href: '/contact' },
};
