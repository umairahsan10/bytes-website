import { SectionHeader } from "@/components/SectionHeader";

export const CareersSection = () => {
  return (
    <section id="careers" className="py-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Join Our Team"
          title="Career Opportunities"
          description="Explore exciting opportunities to grow with us"
        />
        <div className="mt-10 md:mt-20 text-center">
          <div className="bg-gray-800 rounded-3xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">
              We&apos;re Hiring!
            </h3>
            <p className="text-white/60 text-lg mb-8">
              We&apos;re always looking for talented individuals to join our team. 
              Check back soon for current openings or send us your resume.
            </p>
            <button className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Send Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}; 