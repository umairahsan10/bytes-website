'use client';

import memojiImage from "@/assets/images/memoji-computer.png";
import Image from "next/image";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import StarIcon from "@/assets/icons/star.svg";
import SparkleIcon from "@/assets/icons/sparkle.svg";
import { HeroOrbit } from "@/components/HeroOrbit";
// import { Scene3D } from "@/components/Scene3D";

export const HeroSection = () => {
  return (
    <div id="home" className="relative overflow-hidden min-h-screen">
      {/* Video and 3D Scene */}
      {/* <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
          onError={(e) => console.error('Video error:', e)}
        >
          <source src="/hong-kong.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Scene3D />
      </div> */}

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]" />

      {/* Main Content */}
      <div className="relative z-20 py-32 md:py-48 lg:py-60 container">
        <div className="flex flex-col items-center">
          {/* <Image src={memojiImage} className="size-[100px]" alt="Person peeking from behind laptop" /> */}
          <div className="px-4 py-1.5 inline-flex gap-4 rounded-lg items-center">
            {/* <div className="text-sm font-medium">Available for new Projects</div> */}
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <p className="text-center text-white-60 mt-4 md:text-lg">
            {/* Hero description text here */}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
          {/* Buttons here if needed */}
        </div>
      </div>
    </div>
  );
};
