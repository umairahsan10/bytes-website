"use client";

import Image from 'next/image';
import { Header } from '@/sections/Navbar';
import { ContactSection } from '@/sections/Contact';

export default function ContactPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden text-center bg-gray-800">
        <Image
          src="/assets/contactbg.png"
          alt="Contact background"
          fill
          priority
          quality={100}
          className="object-cover object-center absolute inset-0 z-0"
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-blue-700/60 to-blue-800/60 z-0" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto px-2">
            We&apos;d love to hear from you. Reach out with any questions, feedback, or collaboration ideas—our team will respond promptly.
          </p>
        </div>
      </section>

      {/* Reusable contact form section */}
      <ContactSection />
    </>
  );
}