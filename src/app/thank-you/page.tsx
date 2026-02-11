/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { Header } from '@/sections/Navbar';

export const metadata = {
  title: 'Thank You | Bytes Platform',
  description: 'Thank you for contacting Bytes Platform. We will get back to you soon.',
  alternates: {
    canonical: "https://bytesplatform.com/thank-you",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Hero */}
      <section className="relative bg-[#0b1e3a] py-32 text-center text-white">
        <FadeIn className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Thank You!
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Your message has been sent successfully. We'll get back to you within 24 hours.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="flex-1 bg-white py-16 md:py-24">
        <FadeIn className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-black">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-4">
                What happens next?
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#0b1e3a] rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-black mb-2">Review</h3>
                  <p className="text-black text-sm">
                    Our team will review your inquiry and requirements carefully.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#0b1e3a] rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-black mb-2">Connect</h3>
                  <p className="text-black text-sm">
                    We'll reach out to you within 24 hours to discuss your project.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#0b1e3a] rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-black mb-2">Collaborate</h3>
                  <p className="text-black text-sm">
                    Let's work together to bring your digital vision to life.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-8 mt-12">
              <h3 className="text-lg font-semibold text-black mb-4">
                Need immediate assistance?
              </h3>
              <p className="text-black mb-6">
                For urgent inquiries, feel free to reach out to us directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:info@bytesplatform.com" className="inline-flex items-center justify-center px-6 py-3 border border-[#0b1e3a] text-[#0b1e3a] hover:bg-[#0b1e3a] hover:text-white rounded-lg transition-all duration-200">
                  Email Us
                </a>
                <a href="tel:+1234567890" className="inline-flex items-center justify-center px-6 py-3 bg-[#0b1e3a] text-white hover:bg-[#072047] rounded-lg transition-all duration-200">
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* CTA */}
        <div className="mt-16 flex justify-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-[#0b1e3a] hover:bg-[#072047] text-white font-semibold px-8 py-3 shadow-md transition-all duration-200">
            Back to Home
          </Link>
          <Link href="/about" className="inline-flex items-center justify-center rounded-lg border border-[#0b1e3a] text-[#0b1e3a] hover:bg-[#0b1e3a] hover:text-white font-semibold px-8 py-3 transition-all duration-200">
            About Us
          </Link>
        </div>
      </section>
    </main>
  );
} 