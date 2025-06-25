"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function AppDevelopmentPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">App Development</h1>
          <p className="text-lg text-gray-300 mb-6">
            We specialize in creating cutting-edge mobile and web applications that drive business growth and user engagement.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Mobile App Development</h3>
              <p className="text-gray-300">
                Native iOS and Android applications built with the latest technologies and best practices.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Web App Development</h3>
              <p className="text-gray-300">
                Progressive Web Apps (PWAs) and responsive web applications for modern businesses.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 