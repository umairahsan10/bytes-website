/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { Header } from '@/sections/Navbar';

export const metadata = {
  title: 'Bytes Platform',
  description: 'Learn about our refund and return policy terms and conditions.'
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      {/* Hero */}
      <section className="relative bg-[#0b1e3a] py-20 text-center text-white">
        <FadeIn
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Refund Policy</h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Understand our return and refund terms for all services.
          </p>
        </FadeIn>
      </section>

      {/* Content */}
      <section className="flex-1 bg-white py-12 md:py-16">
        <FadeIn
          className="prose md:prose-lg prose-gray text-black max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 leading-relaxed space-y-8"
        >
          <h1>Refund &amp; Return Policy – Bytes Platform</h1>
          
          <p>
            Bytes Platform is committed to delivering high-quality digital services through structured processes and transparent agreements. 
            This refund and return policy outlines the conditions under which refunds or cancellations may be considered.
          </p>

          <div className="border-t border-gray-200 my-8"></div>

          <h2>1. Contract-Specific Terms</h2>
          <p>
            Refunds, returns, and cancellations are primarily governed by the individual agreements or contracts signed with each client. 
            Any request for refunds must follow the conditions outlined in your specific service contract.
          </p>
          <p>
            Bytes Platform reserves the right to deny refunds where contractual terms are not met, or where substantial progress or delivery has been made.
          </p>

          <div className="border-t border-gray-200 my-8"></div>

          <h2>2. Milestone-Based Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We follow a milestone-based billing system across our service offerings.</li>
            <li>Milestone payments are strictly non-refundable once a milestone has been crossed and approved, either through direct approval or by proceeding to the next phase of work.</li>
          </ul>

          <div className="border-t border-gray-200 my-8"></div>

          <h2>3. Initial Payments &amp; SEO Services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Initial milestone payments are non-refundable, as they cover discovery, planning, and resource allocation.</li>
            <li>For SEO services, the 50% advance for the first month is non-refundable once the work has commenced.</li>
            <li>The remaining 50% is due upon completion of the month's deliverables, and becomes non-refundable once delivered.</li>
          </ul>

          <div className="border-t border-gray-200 my-8"></div>

          <h2>4. App Development Projects</h2>
          <p>Refunds will not be issued for app development projects once:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The design phase is approved and development has begun.</li>
            <li>The client fails to provide app store credentials, assets, or required content.</li>
            <li>The codebase or builds have been shared for review or deployment.</li>
          </ul>

          <div className="border-t border-gray-200 my-8"></div>

          <h2>5. ByteBot &amp; ByteSuite Subscriptions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>ByteBot and ByteSuite are subscription-based services.</li>
            <li>You may cancel your subscription anytime, effective from the next billing cycle.</li>
            <li>No refunds are issued for the current billing period once payment has been processed.</li>
          </ul>

          <div className="border-t border-gray-200 my-8"></div>

          <h2>6. Non-Refundable Scenarios</h2>
          <p>Refunds will not be provided in the following cases:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Delays caused by the client (e.g., missing feedback, logins, content, or prolonged unresponsiveness beyond 14 business days).</li>
            <li>Requests for project cancellation due to change of mind, internal disagreements, or business redirection.</li>
            <li>Revision requests beyond the original creative brief or scope of work.</li>
            <li>Any deliverables (e.g., websites, apps, logos) that have been approved or final files shared.</li>
            <li>Services such as Social Media Management, Domain Registration, Hosting, Trademark, SEO (after initiation), and use of third-party tools.</li>
            <li>If work has been shared with or reassigned to another agency or service provider during execution.</li>
          </ul>

          <div className="border-t border-gray-200 my-8"></div>

          <h2>7. Refund Request Procedure</h2>
          <p>
            To initiate a refund request, email us at <a href="mailto:support@bytesplatform.com">support@bytesplatform.com</a> with project details and your reason for the request. 
            We may request supporting documentation. A detailed review will be completed within 15 business days.
          </p>

          <div className="border-t border-gray-200 my-8"></div>

          <h2>8. Ownership Clause</h2>
          <p>
            If a refund is approved or a dispute is filed, all intellectual property created (designs, code, content, strategy) remains the exclusive property of Bytes Platform and may not be used by the client in any form.
          </p>

          <div className="border-t border-gray-200 my-8"></div>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <p className="text-sm text-gray-600 mb-0">
              <strong>Note:</strong> This policy is a binding extension of our official Service Agreement and is enforceable under applicable law.
            </p>
          </div>
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