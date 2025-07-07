import bytesTest2 from "../../public/portfolio/bytes-test-2.png";
import bytesTest3 from "../../public/portfolio/bytes-test-3.png";
import bytesTest5 from "../../public/portfolio/bytes-test-5.png";
import bytesTest6 from "../../public/portfolio/bytes-test-6.png";
import Image from "next/image";
import CheckIcon from "@/assets/icons/check-circle.svg"
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg"
import { SectionHeader } from "@/components/SectionHeader"
import { Card } from "@/components/Card"
import { useAutoScroll } from "@/hooks/useAutoScroll";

const portfolioProjects = [
  { img: bytesTest2, url: "https://bytes-test-2.com" },
  { img: bytesTest3, url: "https://bytes-test-3.com" },
  { img: bytesTest5, url: "https://bytes-test-5.com" },
  { img: bytesTest6, url: "https://bytes-test-6.com" },
];

export const ProjectsSection = () => {
  const scrollRef = useAutoScroll<HTMLDivElement>(0.5);
  return (
    <section id="projects" className="pb-16 lg:py-24 items-center bg-[#010a14]">
      <div className="container text-white">
        <SectionHeader
          eyebrow="Real-world Results"
          title="Featured Projects"
          description="See how i transformed concepts into engaging digital experience"
        />
        {/* Draggable / swipeable horizontal slider */}
        <div
          ref={scrollRef}
          className="mt-10 lg:mt-20 overflow-x-hidden overscroll-x-none touch-pan-y [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4 -my-4 cursor-grab select-none"
        >
          <div className="flex gap-4 sm:gap-6 lg:gap-8 pr-8 flex-none">
            {[...new Array(2)].fill(0).map((_, copyIdx) => (
              portfolioProjects.map((item, idx) => (
                <div key={`${copyIdx}-${idx}`} className="relative flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-auto">
                  <Image
                    src={item.img}
                    alt={`Project ${idx + 1}`}
                    className="h-48 sm:h-56 md:h-64 lg:h-[28rem] w-full object-cover rounded-3xl"
                  />
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2"
                  >
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold shadow-md whitespace-nowrap">
                      Visit Live Site
                    </button>
                  </a>
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};