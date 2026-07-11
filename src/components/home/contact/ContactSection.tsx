'use client';

import React, { useRef, useState } from 'react';
import { MonoLabel, Hairline } from '../ui';
import { contact, faqs } from '@/data/home';

/** Shape of the EmailJS SDK loaded via CDN in the root layout <head>. */
type EmailJsGlobal = {
  sendForm: (serviceId: string, templateId: string, form: HTMLFormElement) => Promise<unknown>;
};

function getEmailJs(): EmailJsGlobal | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { emailjs?: EmailJsGlobal }).emailjs;
}

/* Validation — ported 1:1 from src/sections/Contact.tsx */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accept 10-digit US numbers with optional formatting
const phoneRegex = /^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})$/;

const inputClass =
  'w-full rounded-lg border border-bytes-line bg-bytes-navy/40 px-4 py-3 text-sm text-bytes-ice placeholder:text-bytes-steel/40 transition-colors duration-200 focus:border-bytes-signal focus:outline-none focus-visible:ring-2 focus-visible:ring-bytes-signal';

function SocialIcon({ name }: { name: string }) {
  // Minimal inline glyphs — accessible name lives on the parent link.
  const paths: Record<string, string> = {
    Facebook:
      'M13.5 9H15V6.5h-1.9C10.9 6.5 10 8 10 9.7V11H8v2.5h2V20h2.6v-6.5h2.1L15 11h-2.4V9.9c0-.6.3-.9.9-.9Z',
    Instagram:
      'M12 8.7A3.3 3.3 0 1 0 12 15.3 3.3 3.3 0 0 0 12 8.7Zm0 5.1a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM16.5 8.4a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0ZM8.8 6.2h6.4A2.6 2.6 0 0 1 17.8 8.8v6.4a2.6 2.6 0 0 1-2.6 2.6H8.8a2.6 2.6 0 0 1-2.6-2.6V8.8a2.6 2.6 0 0 1 2.6-2.6Zm6.4 1.5H8.8c-.6 0-1.1.5-1.1 1.1v6.4c0 .6.5 1.1 1.1 1.1h6.4c.6 0 1.1-.5 1.1-1.1V8.8c0-.6-.5-1.1-1.1-1.1Z',
    LinkedIn:
      'M8.9 9.9H6.6V17h2.3V9.9ZM7.7 6.7a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7ZM13 9.9h-2.2V17H13v-3.7c0-1 .5-1.6 1.4-1.6.8 0 1.2.5 1.2 1.6V17H18v-4.1c0-2-1.1-3.1-2.7-3.1-1.2 0-1.8.6-2.2 1.2h-.1v-1Z',
  };
  const d = paths[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/**
 * SYS.10 // CONTACT — redesigned presentation, identical behavior.
 * EmailJS submit logic, validation regexes, live-validation flow and
 * success/error states are ported 1:1 from src/sections/Contact.tsx.
 */
export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    // live validation
    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: emailRegex.test(value) ? '' : 'Invalid email address' }));
    }
    if (name === 'phone') {
      // Allow only digits and limited formatting characters while typing
      const cleaned = value.replace(/[^0-9\s().+-]/g, '');
      const digitsOnly = cleaned.replace(/\D/g, '');
      if (digitsOnly.length > 10) {
        // prevent input beyond 10 significant digits (ignoring +1 which we strip)
        return;
      }
      setFormData((prevState) => ({ ...prevState, phone: cleaned }));
      setErrors((prev) => ({ ...prev, phone: phoneRegex.test(cleaned) ? '' : 'Enter a valid 10-digit phone number' }));
      return;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // final validation check
    const emailError = emailRegex.test(formData.email) ? '' : 'Invalid email address';
    const phoneError = phoneRegex.test(formData.phone) ? '' : 'Enter a valid 10-digit phone number';
    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Use EmailJS to send the form (SDK injected in root layout <head>)
    const emailjs = getEmailJs();
    if (emailjs && formRef.current) {
      emailjs
        .sendForm('service_9hdv3nu', 'template_3k5amts', formRef.current)
        .then(() => {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', phone: '', message: '' });
          if (formRef.current) {
            formRef.current.reset();
          }
        })
        .catch((error: unknown) => {
          console.error('FAILED...', error);
          setSubmitStatus('error');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setIsSubmitting(false);
      setSubmitStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="relative bg-bytes-midnight"
      data-nav-theme="dark"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-36">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: heading + contact info */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-bytes-signal/60" aria-hidden="true" />
              <MonoLabel tone="signal">SYS.10 // CONTACT</MonoLabel>
            </div>
            <h2
              id="contact-heading"
              className="font-bytes-display font-semibold tracking-[-0.02em] leading-[1.04] text-bytes-ice text-[clamp(2rem,5vw,3.75rem)]"
            >
              Let&apos;s get in touch
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-bytes-steel">
              We&apos;d love to hear from you! Whether you have a question or feedback, feel free
              to reach out — through the form or via our social channels.
            </p>

            <address className="mt-10 space-y-5 not-italic">
              <p>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-3 text-sm text-bytes-steel transition-colors hover:text-bytes-ice focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal"
                >
                  <MonoLabel tone="signal" className="pt-0.5">LOC</MonoLabel>
                  <span>
                    {contact.company}, {contact.addressLines.join(', ')}
                  </span>
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="group inline-flex items-center gap-3 text-sm text-bytes-steel transition-colors hover:text-bytes-ice focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal"
                >
                  <MonoLabel tone="signal">EML</MonoLabel>
                  <span>{contact.email}</span>
                </a>
              </p>
              <p>
                <a
                  href={contact.phoneHref}
                  className="group inline-flex items-center gap-3 text-sm text-bytes-steel transition-colors hover:text-bytes-ice focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal"
                >
                  <MonoLabel tone="signal">TEL</MonoLabel>
                  <span>{contact.phoneDisplay}</span>
                </a>
              </p>
            </address>

            <div className="mt-10">
              <MonoLabel>Connect with us</MonoLabel>
              <ul className="mt-4 flex items-center gap-3">
                {contact.socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Bytes Platform on ${social.name}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bytes-line text-bytes-steel transition-colors duration-300 hover:border-bytes-signal/60 hover:text-bytes-ice focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal"
                    >
                      <SocialIcon name={social.name} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-bytes-line bg-bytes-navy/25 p-7 md:p-10">
            <form ref={formRef} autoComplete="off" onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block font-bytes-mono text-[11px] tracking-[0.22em] uppercase text-bytes-steel/70">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    className={inputClass}
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-2 block font-bytes-mono text-[11px] tracking-[0.22em] uppercase text-bytes-steel/70">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className={inputClass}
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-2 text-xs text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-2 block font-bytes-mono text-[11px] tracking-[0.22em] uppercase text-bytes-steel/70">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    className={inputClass}
                    placeholder="(555) 555-5555"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="contact-phone-error" className="mt-2 text-xs text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block font-bytes-mono text-[11px] tracking-[0.22em] uppercase text-bytes-steel/70">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    className={`${inputClass} resize-y`}
                    placeholder="Tell us about your project"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {/* Status messages — announced to AT */}
                {submitStatus === 'success' && (
                  <p role="status" className="text-sm text-bytes-cyan">
                    Message sent successfully!
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p role="alert" className="text-sm text-red-400">
                    Failed to send message. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  data-cta="true"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-bytes-blue px-7 py-3.5 text-sm font-semibold font-bytes-display text-white transition-colors duration-300 hover:bg-bytes-signal disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bytes-signal sm:w-auto"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Compact FAQ — visible content backing the FAQPage JSON-LD */}
        <div className="mt-24 md:mt-32">
          <MonoLabel tone="signal">COMMON QUESTIONS</MonoLabel>
          <Hairline className="mt-4" />
          <div className="divide-y divide-bytes-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-sm font-medium text-bytes-ice transition-colors hover:text-white md:text-base [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-bytes-mono text-bytes-signal transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 text-sm leading-relaxed text-bytes-steel">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
