/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { Header } from '@/sections/Navbar';

export const metadata = {
  title: 'Bytes Platform',
  description: 'Learn how Bytes Platform collects, uses, and protects your data.'
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      {/* Hero */}
      <section className="relative bg-[#0b1e3a] py-20 text-center text-white">
        <FadeIn
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            See how we collect, use, and protect your personal data.
          </p>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="flex-1 bg-white py-12 md:py-16">
        <FadeIn
          className="prose md:prose-lg prose-gray max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 leading-relaxed space-y-8"
        >
          <h1>Privacy Policy</h1>

          <p>
            This Privacy Policy explains how Bytes Platform ("Bytes Platform," "we," "us," or "our") collects,
            uses, discloses, and safeguards your information when you visit <strong>www.bytesplatform.com</strong>
            ("Website") or use any of our products or services ("Services").
          </p>

          <h2>Information We Collect</h2>
          <p>When you visit our Website we may automatically collect certain information about your device and usage, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Browser and device characteristics</li>
            <li>Operating system</li>
            <li>Language preferences</li>
            <li>Referring URLs</li>
            <li>Location data (non-identifiable)</li>
            <li>Usage patterns for analytics</li>
          </ul>
          <p>This data is used for system security, performance monitoring, and service improvements.</p>

          <h2>Our Information Processing Policy</h2>
          <p>We process your data for legitimate business purposes, to fulfill contracts, comply with legal obligations, and/or based on your consent. Specifically, we use your data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Send marketing and promotional communications (you can opt out anytime)</li>
            <li>Enforce our terms and conditions</li>
            <li>Respond to legal requests</li>
            <li>Conduct analytics, improve our services, and enhance user experience</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>We share information only:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>With your consent</li>
            <li>To fulfill business obligations</li>
            <li>To comply with legal obligations</li>
            <li>To protect your rights or safety</li>
          </ul>
          <p>We do not sell or rent your personal information to third parties.</p>

          <h2>Cookies and Tracking</h2>
          <p>
            We may use cookies, web beacons, and similar technologies to collect and store information. You can
            manage cookie preferences through your browser settings. Please review our Cookie Policy for more details.
          </p>

          <p>
            This website uses Google Tag Manager and Google Analytics to understand user interactions and improve
            performance.
          </p>

          <p>
            We do not collect personally identifiable information unless explicitly provided by you (for example,
            when you voluntarily submit information through a form).
          </p>

          <p>
            Any third-party services used (such as Google Analytics) may employ cookies to gather anonymous usage
            statistics.
          </p>

          <p>
            You can choose to disable cookies via your browser settings at any time, though this may affect certain
            functionalities of the Website.
          </p>

          <h2>Google Maps Usage</h2>
          <p>
            We may use Google Maps APIs for enhanced services. Your use of Maps features is governed by Google's
            Terms of Service.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain personal information only as long as necessary for the purposes stated in this policy, unless
            longer retention is required by law. Typically, data is retained no longer than 90 days after the business
            purpose is fulfilled.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your data. However, no internet
            transmission is 100% secure, so use of our Website is at your own risk.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            We do not knowingly collect information from or market to individuals under 18 years old. If we learn that
            data from a minor has been collected, we will take appropriate action to delete it.
          </p>

          <h2>Your Privacy Rights</h2>
          <p>Depending on your location, you may have rights including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, correction, or deletion of personal data</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Withdrawal of consent</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href="mailto:info@bytesplatform.com">info@bytesplatform.com</a>.</p>

          <h2>Do-Not-Track (DNT)</h2>
          <p>
            Currently, our Website does not respond to Do-Not-Track signals as no uniform standard is in place.
          </p>

          <h2>Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy as needed to stay compliant with applicable laws. The revised policy
            will be effective immediately upon posting.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have questions or comments about this Privacy Policy, you may contact us at:<br />
            <strong>Bytes Platform LLC</strong><br />
            2809 Joshua Street<br />
            Denton, Texas, United States<br />
            Email: <a href="mailto:info@bytesplatform.com">info@bytesplatform.com</a>
          </p>
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