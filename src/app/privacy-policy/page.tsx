"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Top navigation */}
      <Header transparentNav={false} />

      {/* Page content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="leading-7">
          This Privacy Policy outlines how Bytes Platform collects, uses, and safeguards your information when you interact with our website and services. We respect your privacy and are committed to protecting your personal data. By using our site, you agree to the terms outlined in this policy.
        </p>
        {/* Add more detailed privacy information here as needed */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 