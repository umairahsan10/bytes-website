"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header transparentNav={false} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="leading-7">
          This Refund Policy describes the conditions under which refunds may be provided for purchases made through Bytes Platform. By making a purchase on our site, you acknowledge and agree to the terms outlined here.
        </p>
        {/* Add more detailed refund policy content here as needed */}
      </main>

      <Footer />
    </div>
  );
} 