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
      <HeroSection />
      <ByteBotsSection />
      <ServiceHead />
      <CardsSection />
      <LineAnimationSection />
      <NumbersSection />
      <ProjectsSection />
      <BookSection />
      <BrandsSection />
      <ContactSection />
      {/* Footer is now included globally in the RootLayout */}
    </main>
  );
}