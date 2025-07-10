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
        className="relative py-20 sm:py-12 md:py-16 lg:py-8 items-center bg-[#010a14] bg-[url('/assets/portfolio_bg.png')] bg-cover bg-center bg-no-repeat"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-6 text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-serif text-center mb-3 sm:mb-4 md:mb-6 lg:mb-4">The Staging Room</h2>
          <div className="flex justify-center text-center mt-2 mb-3 sm:mb-4 md:mb-6 lg:mb-3">
              <p className={`text-lg sm:text-xl md:text-xl lg:text-lg uppercase font-bold tracking-widest bg-clip-text text-transparent text-center bg-gradient-to-r from-[#0476b5] to-[#ffffff] px-4 sm:mb-2 md:mb-4 lg:mb-2`}>
                  Real Projects in Progress
              </p>
          </div>
          <p className="text-center text-sm sm:text-base md:text-lg lg:text-base text-white-500 mb-1 sm:mb-8 md:mb-10 lg:mb-6 px-4 sm:px-8 md:px-12 lg:px-8">
            Our portfolio isn't static — it's active, evolving, and built in the open. Every link you see here points to a real website in development, hosted on a test domain for client review.
          </p>

        <div className="lg:mt-2 flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-6 scale-90 sm:scale-95 lg:scale-90">
            {/* Slider Row */}
            {/* Use column layout on small screens, switch to row on md and above */}
            <div className="relative w-full flex flex-col md:flex-row items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-3xl shadow-lg mx-2 sm:mx-4 md:mx-6 lg:mx-2">

            {/* Prev Button */}
            <button
              aria-label="Previous slide"
              onClick={prevSlide}
              className="flex absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-gray-900/40 hover:bg-gray-900/70 backdrop-blur rounded-full p-2 sm:p-3 md:p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
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
                  <div key={idx} className="min-w-full flex flex-col items-center lg:items-start justify-center p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-4">
                    <h3 className="text-3xl lg:text-4xl font-bold text-white text-center lg:text-left">
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
            <p className="text-center text-sm sm:text-base md:text-lg lg:text-base text-white-500 sm:px-6 md:px-8 lg:px-6 mt-4 md:mt-6 lg:mt-4">
            Some domain links may point to a different project than the preview image, thats because our domains are under constant change.
            </p>
          </div>

          {/* CTA to full portfolio */}
          <div className="mt-2 sm:mt-8 md:mt-12 lg:mt-8 flex flex-col items-center text-center gap-3 sm:gap-4 lg:gap-3 px-4 sm:px-6 lg:px-6">
            <h4 className="text-xl sm:text-xl md:text-2xl lg:text-xl font-semibold">
              Want to see our full portfolio of completed projects?
            </h4>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-2 md:py-3 lg:py-2 mt-4 md:mt-4 lg:mt-2 rounded-full font-semibold shadow-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white hover:from-purple-600 hover:via-fuchsia-500 hover:to-pink-500 hover:scale-110 transition-all duration-300"
            >
              Reach Out&nbsp;&raquo;
            </a>
          </div>
      </div>
    </section>
  );
};