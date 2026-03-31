"use client";

import dynamic from "next/dynamic";

const Loader = dynamic(() => import("@/components/portfolio/Loader"), { ssr: false });
const Navbar = dynamic(() => import("@/components/portfolio/Navbar"), { ssr: false });
const Hero = dynamic(() => import("@/components/portfolio/Hero"), { ssr: false });
const About = dynamic(() => import("@/components/portfolio/About"), { ssr: false });
const Services = dynamic(() => import("@/components/portfolio/Services"), { ssr: false });
const ClientProjects = dynamic(() => import("@/components/portfolio/ClientProjects"), {
  ssr: false,
});
const Products = dynamic(() => import("@/components/portfolio/Products"), { ssr: false });
const Portfolio = dynamic(() => import("@/components/portfolio/Portfolio"), {
  ssr: false,
});
const SeoResults = dynamic(() => import("@/components/portfolio/SeoResults"), {
  ssr: false,
});
const WhyChoose = dynamic(() => import("@/components/portfolio/WhyChoose"), {
  ssr: false,
});
const Testimonials = dynamic(() => import("@/components/portfolio/Testimonials"), {
  ssr: false,
});
const FinalCTA = dynamic(() => import("@/components/portfolio/FinalCTA"), { ssr: false });
const Footer = dynamic(() => import("@/components/portfolio/Footer"), { ssr: false });

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <ClientProjects />
        <Products />
        <Portfolio />
        <SeoResults />
        <WhyChoose />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
