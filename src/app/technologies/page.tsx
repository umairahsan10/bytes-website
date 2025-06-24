"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function TechnologiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold">Technologies</h1>
        <p className="mt-6 max-w-xl text-lg text-gray-300">
          A showcase of the tools and frameworks we love to use.
        </p>
      </main>
      <Footer />
    </>
  );
} 