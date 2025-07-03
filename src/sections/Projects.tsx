import darkSaasLandingPage from "@/assets/images/dark-saas-landing-page.png";
import lightSaasLandingPage from "@/assets/images/light-saas-landing-page.png";
import aiStartupLandingPage from "@/assets/images/ai-startup-landing-page.png";
import Image from "next/image";
import CheckIcon from "@/assets/icons/check-circle.svg"
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg"
import { SectionHeader } from "@/components/SectionHeader"
import { Card } from "@/components/Card"
import { useAutoScroll } from "@/hooks/useAutoScroll";

const portfolioProjects = [
  {
    company: "Acme Corp",
    year: "2022",
    title: "Dark Saas Landing Page",
    results: [
      { title: "Enhanced user experience by 40%" },
      { title: "Improved site speed by 50%" },
      { title: "Increased mobile traffic by 35%" },
    ],
    link: "https://youtu.be/4k7IdSLxh6w",
    image: darkSaasLandingPage,
  },
  {
    company: "Innovative Co",
    year: "2021",
    title: "Light Saas Landing Page",
    results: [
      { title: "Boosted sales by 20%" },
      { title: "Expanded customer reach by 35%" },
      { title: "Increased brand awareness by 15%" },
    ],
    link: "https://youtu.be/7hi5zwO75yc",
    image: lightSaasLandingPage,
  },
  {
    company: "Quantum Dynamics",
    year: "2023",
    title: "AI Startup Landing Page",
    results: [
      { title: "Enhanced user experience by 40%" },
      { title: "Improved site speed by 50%" },
      { title: "Increased mobile traffic by 35%" },
    ],
    link: "https://youtu.be/Z7I5uSRHMHg",
    image: aiStartupLandingPage,
  },
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
          className="mt-10 lg:mt-20 overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4 -my-4 cursor-grab select-none"
        >
          <div className="flex gap-8 pr-8 flex-none">
            {[...new Array(2)].fill(0).map((_, copyIdx) => (
              portfolioProjects.map((project) => (
                <Card
                  key={`${copyIdx}-${project.title}`}
                  className="w-80 md:w-96 lg:w-[30rem] xl:w-[34rem] px-6 pt-6 pb-0 md:pt-8 md:px-8 lg:px-10 lg:pt-10 bg-gray-900 flex-shrink-0 transition-transform active:scale-105"
                >
                  <div className="flex flex-col">
                    <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex gap-2 font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text">
                      <span>{project.company}</span>
                      <span>&bull;</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl mt-2 text-white">{project.title}</h3>
                    <hr className="border-t-2 border-white/5 mt-3" />
                    <ul className="flex flex-col gap-3 mt-3">
                      {project.results.map((result) => (
                        <li key={result.title} className="flex gap-2 text-sm text-white/60">
                          <CheckIcon className="size-4 text-emerald-300" />
                          <span>{result.title}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-6">
                      <button className="bg-white text-gray-950 h-10 w-full rounded-xl font-semibold inline-flex items-center justify-center gap-2">
                        <span>Visit Live Site</span>
                        <ArrowUpRightIcon className="size-4" />
                      </button>
                    </a>
                  </div>
                  <div className="relative mt-6 flex justify-center">
                    <Image src={project.image} alt={project.title} className="h-40 lg:h-48 w-auto object-cover rounded-xl mx-auto" />
                  </div>
                </Card>
              ))
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};