import { SectionHeader } from "@/components/SectionHeader";
import Image from "next/image";
import { Fragment } from "react";

const brands = [
  { src: "/assets/brands/brand1.png", link: "https://aayobami.com/" },
  { src: "/assets/brands/brand2.png", link: "https://efatabglobal.com/" },
  { src: "/assets/brands/brand3.jpg", link: "https://cadplusllc.com/" },
  { src: "/assets/brands/brand4.png", link: "https://5dccs.com/" },
  { src: "/assets/brands/brand5.png", link: "https://www.fairpathconsultants.com/" },
  { src: "/assets/brands/brand6.jpg", link: "https://oxypam.com/" },
  { src: "/assets/brands/brand7.png", link: "https://jobcosupply.com/" },
  { src: "/assets/brands/brand8.png", link: "https://www.gebionline.com/" },
  { src: "/assets/brands/brand9.jpeg", link: "https://ecswealth.com/" },
  { src: "/assets/brands/brand10.webp", link: "https://lampadosfinancial.com/" },
  { src: "/assets/brands/brand11.webp", link: "https://feverdots.com/" },
  { src: "/assets/brands/brand12.jpg", link: "https://ontophomeservices.com/" },
  { src: "/assets/brands/brand13.png", link: "https://keltektool.com/" },
  { src: "/assets/brands/brand14.png", link: "https://paradisecopters.com/" },
  { src: "/assets/brands/brand15.png", link: "https://safetravelcharters.com/" },
  { src: "/assets/brands/brand16.png", link: "https://bytes-test-2.com/" },
  { src: "/assets/brands/brand17.png", link: "https://regal-arms.com/" },
  { src: "/assets/brands/brand18.jpg", link: "https://exfoleez.net/" },
  { src: "/assets/brands/brand19.png", link: "https://www.thelabco.net/" },
];

export const BrandsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container text-[#010a14]">
        <SectionHeader
          eyebrow="Trusted Partnerships"
          title="Our Past Clients"
          description="Innovators, visionaries, and industry leaders we've been proud to work with."
        />

        {/* Horizontal scrolling logos */}
        <div className="mt-12 lg:mt-20 flex overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4 -my-4">
          <div className="flex gap-8 pr-8 flex-none brands-scroll">
            {[...new Array(2)].fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {brands.map((brand) => (
                  <a
                    key={`${idx}-${brand.src}`}
                    href={brand.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:scale-110 transition duration-300"
                  >
                    <Image
                      src={brand.src}
                      alt="Client logo"
                      width={120}
                      height={60}
                      className="object-contain w-28 h-14"
                    />
                  </a>
                ))}
              </Fragment>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-center text-gray-500 italic">
          These logos represent brands we've worked with — our past clients — not
          our partners.
        </p>
      </div>
    </section>
  );
};
