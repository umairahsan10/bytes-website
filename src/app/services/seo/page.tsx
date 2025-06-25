"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function SEOPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Search Engine Optimization (SEO)</h1>
          <p className="text-lg text-gray-300 mb-6">
            We help businesses improve their online visibility and drive organic traffic through comprehensive SEO strategies.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Technical SEO</h3>
              <p className="text-gray-300">
                Website optimization, performance improvements, and technical audits to enhance search engine rankings.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Content SEO</h3>
              <p className="text-gray-300">
                Keyword research, content strategy, and on-page optimization to improve search visibility.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 