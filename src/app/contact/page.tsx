"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold">Contact Us</h1>
        <p className="mt-6 max-w-xl text-lg text-gray-300">
          We'd love to hear from you! Reach out and let's start a conversation.
        </p>
      </main>
      <Footer />
    </>
  );
} 