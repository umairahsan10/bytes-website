"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Top navigation */}
      <Header transparentNav={false} />

      {/* Page content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Terms &amp; Conditions</h1>
        <p className="leading-7">
          These Terms &amp; Conditions govern your use of the Bytes Platform website and services. By accessing or using our site, you agree to comply with and be bound by these terms. Please read them carefully.
        </p>
        {/* Add more detailed terms and conditions information here as needed */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 