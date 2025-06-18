import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";
import { AboutSection } from "@/sections/About";
import { BookSection } from "@/sections/BookSection";
import { Footer } from "@/sections/Footer";
import { ContactSection } from "@/sections/Contact";
import CardsSection from "@/sections/CardsSection";
import { LineAnimationSection } from "@/sections/LineAnimationSection";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <ProjectsSection />
      <TapeSection />
      <TestimonialsSection />
      <LineAnimationSection />
      {/* <AboutSection /> */}
      <CardsSection />
      <BookSection />
      <ContactSection />
      <Footer />
    </div>
  );
}