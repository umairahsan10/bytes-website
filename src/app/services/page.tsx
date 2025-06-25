"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold">Our Services</h1>
        <p className="mt-6 max-w-xl text-lg text-gray-300">
          Explore our wide range of digital services, from cloud solutions to marketing strategy.
        </p>
      </main>
      <Footer />
    </>
  );
} 