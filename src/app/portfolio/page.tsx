"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold">Portfolio</h1>
        <p className="mt-6 max-w-xl text-lg text-gray-300">
          A selection of our recent projects will be showcased here.
        </p>
      </main>
      <Footer />
    </>
  );
} 