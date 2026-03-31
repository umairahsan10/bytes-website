"use client";

const testimonials = [
  {
    quote:
      "Bytes completely transformed our client management. The CRM they built is lightyears ahead of anything off the shelf.",
    name: "James Carter",
    company: "Quantiva",
    initials: "JC",
    stars: 5,
  },
  {
    quote:
      "From day one, the team treated our project like their own. The results speak louder than any testimonial could.",
    name: "Sarah Kim",
    company: "Intelaimant",
    initials: "SK",
    stars: 5,
  },
  {
    quote:
      "Our SEO traffic tripled in six months. These guys don't just promise growth — they deliver it.",
    name: "David Okafor",
    company: "SPS Vertical",
    initials: "DO",
    stars: 5,
  },
  {
    quote:
      "The SaaS platform they built for us handles 10,000+ users without breaking a sweat. Truly world-class engineering.",
    name: "Elena Torres",
    company: "BytesReach",
    initials: "ET",
    stars: 5,
  },
  {
    quote:
      "Communication was flawless throughout. Weekly updates, clean code, and zero surprises. This is how agencies should work.",
    name: "Michael Chen",
    company: "NovaTech",
    initials: "MC",
    stars: 5,
  },
  {
    quote:
      "We went from zero online presence to 47 first-page keywords in under a year. Bytes is the real deal.",
    name: "Amara Osei",
    company: "GreenPulse",
    initials: "AO",
    stars: 5,
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <div className="flex-shrink-0 w-[340px] p-6 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 mx-3">
      {/* Quote mark */}
      <span className="font-heading text-5xl font-bold text-accent leading-none block mb-2">
        &ldquo;
      </span>
      <p className="text-white text-[15px] leading-relaxed mb-4">
        {testimonial.quote}
      </p>
      <div className="flex items-center gap-3 mt-auto">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-heading text-sm font-semibold">
          {testimonial.initials}
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-white">
            {testimonial.name}
          </p>
          <p className="font-mono text-xs text-cyan">{testimonial.company}</p>
        </div>
      </div>
      {/* Stars */}
      <div className="flex gap-1 mt-3">
        {Array.from({ length: testimonial.stars }).map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-cta"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const row1 = testimonials.slice(0, 3);
  const row2 = testimonials.slice(3, 6);

  return (
    <section id="testimonials" className="relative min-h-screen py-[120px] overflow-hidden">
      <div className="max-w-content mx-auto px-6 md:px-20 mb-16">
        <div className="text-center">
          <span className="font-mono text-sm text-accent block mb-3">
            Client Feedback
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold">
            Heard From the People We Built For
          </h2>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="overflow-hidden mb-6 group">
        <div className="flex animate-marquee-left group-hover:[animation-play-state:paused]">
          {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} testimonial={t} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="overflow-hidden group">
        <div className="flex animate-marquee-right group-hover:[animation-play-state:paused]">
          {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
