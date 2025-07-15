'use client';

import { Header } from "@/sections/Navbar";
import HeroSection from "@/sections/Hero";
import ByteBotsSection from "@/sections/ByteBot";
import ServiceHead from "@/sections/serviceHead";
import { ProjectsSection } from "@/sections/Projects";
import { BookSection } from "@/sections/BookSection";
import { ContactSection } from "@/sections/Contact";
import CardsSection from "@/sections/CardsSection";
import { LineAnimationSection } from "@/sections/LineAnimationSection";
import { BrandsSection } from "@/sections/brands";
import { NumbersSection } from "@/sections/numbers";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('home-scrollbars');
    return () => {
      html.classList.remove('home-scrollbars');
    };
  }, []);

  return (
    <main className="text-black min-h-screen">
      <Header transparentNav={true} />
      {[
        <HeroSection key="hero" />,
        <ByteBotsSection key="bytebots" />,
        <ServiceHead key="servicehead" />,
        <CardsSection key="cards" />,
        <LineAnimationSection key="line" />,
        <NumbersSection key="numbers" />,
        <ProjectsSection key="projects" />,
        <BookSection key="book" />,
        <BrandsSection key="brands" />,
        <ContactSection key="contact" />,
      ].map((Section, idx) => (
        <div key={idx} className="w-full">
          {Section}
        </div>
      ))}
      {/* Footer is now included globally in the RootLayout */}
    </main>
  );
}