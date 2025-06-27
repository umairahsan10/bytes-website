/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { Header } from '@/sections/Navbar';

export const metadata = {
  title: 'Bytes Platform',
  description: 'Read the terms and conditions governing the use of Bytes Platform website and services.'
};

export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      {/* Hero */}
      <section className="relative bg-[#0b1e3a] py-20 text-center text-white">
        <FadeIn
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Terms &amp; Conditions</h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Understand the rules and guidelines for using our website and services.
          </p>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="flex-1 bg-white py-12 md:py-16">
        <FadeIn
          className="prose md:prose-lg prose-gray max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 leading-relaxed space-y-8"
        >
          <h1>Bytes Platform — Terms and Conditions</h1>
          <p>
            These Terms and Conditions ("Agreement") govern your use of <strong>www.bytesplatform.com</strong>
            ("Website") and any products, digital content, or services ("Services") provided by Bytes Platform
            ("Bytes Platform," "we," "us," or "our"). By accessing this Website or using our Services, you agree to
            these Terms. If you do not agree, you must not use the Website or our Services.
          </p>

          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Use of Website</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>You are granted a limited, non-exclusive, non-transferable license to access and use the Website solely for lawful purposes in accordance with this Agreement.</li>
                <li>You agree not to reproduce, distribute, or commercially exploit Website materials without prior written consent.</li>
                <li>You agree not to interfere with the operation of the Website or disrupt others' use of it.</li>
                <li>You agree not to use the Website in violation of any applicable laws or regulations.</li>
                <li>You agree not to introduce malicious software or engage in unauthorized data-collection activities.</li>
              </ul>
            </li>

            <li>
              <strong>Eligibility</strong>
              <p className="mt-2">By using the Website, you represent that you are at least 16 years old. Users under 18 require the consent of a parent or legal guardian.</p>
            </li>

            <li>
              <strong>Intellectual Property</strong>
              <p className="mt-2">All intellectual property rights related to the Website and Services are owned by Bytes Platform or its licensors. No rights or licenses are granted except as expressly stated in these Terms.</p>
            </li>

            <li>
              <strong>Services and Deliverables</strong>
              <p className="mt-2">Bytes Platform provides web development, SEO, digital marketing, and software solutions. Specific deliverables, timelines, and conditions will be detailed in client contracts or proposals. Deliverables remain the property of Bytes Platform until full payment is received.</p>
            </li>

            <li>
              <strong>Payment Terms</strong>
              <p className="mt-2">Payments are due in accordance with the agreed schedule outlined in your contract. Delayed payments may result in service suspension or legal recovery of outstanding amounts. Prices are quoted in USD and exclude taxes unless otherwise specified.</p>
            </li>

            <li>
              <strong>Privacy</strong>
              <p className="mt-2">Your use of the Website is subject to our Privacy Policy, which explains how we collect, use, and protect your information.</p>
            </li>

            <li>
              <strong>Third-Party Links</strong>
              <p className="mt-2">Links to third-party sites are provided for convenience. Bytes Platform does not endorse or control these sites and assumes no responsibility for their content or practices.</p>
            </li>

            <li>
              <strong>Limitation of Liability</strong>
              <p className="mt-2">Bytes Platform is not liable for indirect, incidental, or consequential damages arising from your use of the Website or Services. Our total liability will not exceed amounts you paid in the 30 days prior to the claim.</p>
            </li>

            <li>
              <strong>Indemnification</strong>
              <p className="mt-2">You agree to indemnify Bytes Platform, its officers, employees, and affiliates against claims or damages arising from your breach of these Terms or misuse of the Website.</p>
            </li>

            <li>
              <strong>Termination</strong>
              <p className="mt-2">We may suspend or terminate access to the Website or Services at our discretion without prior notice if these Terms are violated.</p>
            </li>

            <li>
              <strong>Disclaimer</strong>
              <p className="mt-2">The Website and Services are provided "as is." Bytes Platform disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.</p>
            </li>

            <li>
              <strong>Force Majeure</strong>
              <p className="mt-2">Bytes Platform is not responsible for delays or failures caused by events beyond our control, including natural disasters, pandemics, or interruptions in essential services.</p>
            </li>

            <li>
              <strong>Changes to Terms</strong>
              <p className="mt-2">Bytes Platform may modify these Terms at any time. Updates will be posted on the Website, and continued use of the Website or Services constitutes acceptance of those changes.</p>
            </li>

            <li>
              <strong>Governing Law</strong>
              <p className="mt-2">These Terms are governed by the laws of the State of Texas, United States. Any disputes shall be handled exclusively in Texas courts.</p>
            </li>

            <li>
              <strong>Contact Information</strong>
              <p className="mt-2">
                For any inquiries about these Terms or our Services, please contact:<br />
                <strong>Bytes Platform</strong><br />
                Email: <a href="mailto:info@bytesplatform.com">info@bytesplatform.com</a><br />
                Website: <a href="https://www.bytesplatform.com" target="_blank" rel="noopener noreferrer">www.bytesplatform.com</a>
              </p>
            </li>
          </ol>
        </FadeIn>

        {/* CTA */}
        <div className="mt-12 flex justify-center gap-4">
          <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-[#0b1e3a] hover:bg-[#072047] text-white font-semibold px-6 py-3 shadow-md transition-all duration-200">
            Contact Us
          </Link>
          <Link href="/" className="inline-flex items-center justify-center rounded-lg border border-[#0b1e3a] text-[#0b1e3a] hover:bg-[#0b1e3a] hover:text-white font-semibold px-6 py-3 transition-all duration-200">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
} 