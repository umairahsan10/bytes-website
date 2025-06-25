"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function IndustriesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Industries We Serve</h1>
          <p className="text-lg text-gray-300 mb-6">
            We deliver tailored digital solutions across diverse industries, helping businesses thrive in the digital age.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Healthcare</h3>
              <p className="text-gray-300">
                Digital health solutions and patient care management systems.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Finance</h3>
              <p className="text-gray-300">
                Fintech solutions and digital banking platforms.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Education</h3>
              <p className="text-gray-300">
                EdTech platforms and learning management systems.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Retail</h3>
              <p className="text-gray-300">
                E-commerce solutions and retail management systems.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Manufacturing</h3>
              <p className="text-gray-300">
                Industry 4.0 solutions and smart manufacturing platforms.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 