import StarIcon from "@/assets/icons/star.svg";
import { Fragment, useEffect, useRef, useState } from "react";

const words = [
  "Reliable",
  "Fast",
  "Secure",
  "Easy",
  "To",
  "Use",
  "And",
  "Affordable",
  "And",
  "Easy",
  "To",
  "Use",
  "And",
  "Affordable",
  "And",
]

export const TapeSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section has been scrolled through
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Start animation when section enters viewport, complete when it leaves
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - sectionTop) / (windowHeight + sectionHeight)
      ));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transform based on scroll progress
  const translateX = -100 + (scrollProgress * 100); // From -100% to 0%
  const opacity = scrollProgress; // From 0 to 1

  return (
    <div ref={sectionRef} className="py-16 lg:py-24 overflow-x-clip">
      <div className="bg-gradient-to-r from-emerald-300 to-sky-400  -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent)]">
          <div 
            className="flex flex-none gap-4 py-3 pr-4 transition-none"
            style={{
              transform: `translateX(${translateX}%)`,
              opacity: opacity,
            }}
          >
            {[...new Array(2)].fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {
                  words.map((word, wordIndex) => (
                    <div key={`${idx}-${wordIndex}`} className="inline-flex gap-4 items-center">
                      <span className="text-gray-900 uppercase font-extrabold text-sm">{word}</span>
                      <StarIcon className="size-6 text-gray-900" />
                    </div>
                  ))}
              </Fragment>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};
