"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function MarketingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Digital Marketing</h1>
          <p className="text-lg text-gray-300 mb-6">
            We create comprehensive digital marketing strategies that drive brand awareness, engagement, and conversions.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Social Media Marketing</h3>
              <p className="text-gray-300">
                Strategic social media campaigns across all platforms to build brand presence and engage audiences.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Content Marketing</h3>
              <p className="text-gray-300">
                Engaging content creation, email marketing, and lead generation strategies for business growth.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 