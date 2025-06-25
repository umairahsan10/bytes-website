"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function ByteSuitesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Byte Suites</h1>
          <p className="text-lg text-gray-300 mb-6">
            Comprehensive business management platforms designed for modern enterprises seeking digital transformation.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Enterprise Solutions</h3>
              <p className="text-gray-300">
                Scalable platforms that integrate all aspects of business operations into a unified system.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Analytics & Insights</h3>
              <p className="text-gray-300">
                Advanced analytics and reporting tools to drive data-informed business decisions.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 