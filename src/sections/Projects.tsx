import bytesTest2 from "../../public/portfolio/bytes-test-2.png";
import bytesTest3 from "../../public/portfolio/bytes-test-3.png";
import bytesTest5 from "../../public/portfolio/bytes-test-5.png";
import bytesTest6 from "../../public/portfolio/bytes-test-6.png";
import Image from "next/image";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg"
import { SectionHeader } from "@/components/SectionHeader"
import { useState, useEffect, useCallback } from "react";

const portfolioProjects = [
  {
    img: bytesTest2,
    url: "https://bytes-test-2.com",
    title: "Bytes Test Domain 2",
  },
  {
    img: bytesTest3,
    url: "https://bytes-test-3.com",
    title: "Bytes Test Domain 3",
  },
  {
    img: bytesTest5,
    url: "https://bytes-test-5.com",
    title: "Bytes Test Domain 5",
  },
  {
    img: bytesTest6,
    url: "https://bytes-test-6.com",
    title: "Bytes Test Domain 6",
  },
];

export const ProjectsSection = () => {
  const slides = [...portfolioProjects, portfolioProjects[0]]; 
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);

  // Advance slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // When we reach the cloned slide, jump back to real first slide without animation
  useEffect(() => {
    if (index === slides.length - 1) {
      // Wait for the ongoing transition to finish (700ms matches duration)
      const t = setTimeout(() => {
        setWithTransition(false);
        setIndex(0);
        // Re-enable transition on next tick so future moves animate
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setWithTransition(true));
        });
      }, 700);
      return () => clearTimeout(t);
    }
  }, [index, slides]);

  // Helper handlers for manual navigation
  const nextSlide = useCallback(() => {
    setIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    if (index === 0) {
      // Jump to last real slide then animate back
      setWithTransition(false);
      setIndex(slides.length - 2); // last real index
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setWithTransition(true));
      });
    } else {
      setIndex((prev) => prev - 1);
    }
  }, [index, slides]);

  return (
    <section
      id="projects"
      className="relative py-24 lg:py-32 items-center bg-[#010a14] bg-[url('/assets/portfolio_bg.png')] bg-cover bg-center bg-no-repeat"
    >
      <div className="w-full max-w-7xl mx-auto px-4 text-white">
        <SectionHeader
          eyebrow="Real Projects in Progress"
          title="The Staging Room"
          description="Our portfolio isn’t static — it’s active, evolving, and built in the open. Every link you see here points to a real website in development, hosted on a test domain for client review."
        />

        <div className="mt-8 lg:mt-12 flex flex-col gap-4 lg:gap-10">
          {/* Slider Row */}
          {/* Use column layout on small screens, switch to row on md and above */}
          <div className="relative w-full flex flex-col md:flex-row items-center justify-center overflow-hidden rounded-3xl shadow-lg">

            {/* Prev Button */}
            <button
              aria-label="Previous slide"
              onClick={prevSlide}
              className="flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-900/40 hover:bg-gray-900/70 backdrop-blur rounded-full p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M15.78 19.28a.75.75 0 0 1-1.06 0l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 1 1 1.06 1.06L9.06 12l6.72 6.72a.75.75 0 0 1 0 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              aria-label="Next slide"
              onClick={nextSlide}
              className="flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-900/40 hover:bg-gray-900/70 backdrop-blur rounded-full p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M8.22 4.72a.75.75 0 0 1 1.06 0l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06L14.94 12 8.22 5.28a.75.75 0 0 1 0-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Left Slider (Image) */}
            <div className="w-full md:w-6/10 overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${index * 100}%)`, transitionProperty: withTransition ? 'transform' : 'none' }}
              >
                {slides.map((item, idx) => (
                  <div key={idx} className="min-w-full pl-0 md:pl-6">
                    <Image
                      src={item.img}
                      alt={item.title}
                      className="w-full h-[45vh] lg:h-[60vh] object-contain rounded-3xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Slider (Text) */}
            <div className="w-full md:w-3/10 overflow-hidden -mt-16 md:mt-0">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${index * 100}%)`, transitionProperty: withTransition ? 'transform' : 'none' }}
              >
                {slides.map((item, idx) => (
                  <div key={idx} className="min-w-full flex flex-col items-center lg:items-start justify-center p-4 md:p-6 lg:p-12 space-y-4 md:space-y-6">
                    <h3 className="text-3xl lg:text-5xl font-bold text-white text-center lg:text-left">
                      {item.title}
                    </h3>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-gray-200 transition-colors"
                    >
                      Visit Live Site
                      <ArrowUpRightIcon className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info line about domain and live work */}
          <p className="text-xl text-center text-sm text-white">
            You might come across a domain that may point to a different project than the preview image. That’s because we work live, with full transparency.
          </p>
        </div>

        {/* CTA to full portfolio */}
        <div className="mt-16 flex flex-col items-center text-center gap-6">
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Want to see our full portfolio of completed projects?
          </h4>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold shadow-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white hover:from-purple-600 hover:via-fuchsia-500 hover:to-pink-500 hover:scale-110 transition-all duration-300"
          >
            Reach Out&nbsp;&raquo;
          </a>
        </div>
      </div>
    </section>
  );
};