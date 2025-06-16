'use client';

import memojiImage from "@/assets/images/memoji-computer.png";
import Image from "next/image";
import ArrowDown from "@/assets/icons/arrow-down.svg";
// import grainImage from "@/assets/images/grain.jpg";
import StarIcon from "@/assets/icons/star.svg";
import SparkleIcon from "@/assets/icons/sparkle.svg";
import { HeroOrbit } from "@/components/HeroOrbit";
import { Scene3D } from "@/components/Scene3D";

export const HeroSection = () => {
  return (
    <div id="home" className="py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip">
      <div className="absolute inset-0 -z-10">
        <Scene3D />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="fixed top-0 left-0 w-full h-screen object-cover opacity-50 z-[-1]" 
          onError={(e) => console.error('Video error:', e)}
        >
          <source src="/hong-kong.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
        {/* <div className="absolute inset-0 -z-30 opacity-5" style={{ backgroundImage: `url(${grainImage.src})` }}> */}
        {/* </div> */}
        {/* 
        <div className="size-[620px] hero-ring"></div>
        <div className="size-[820px] hero-ring"></div>
        <div className="size-[1020px] hero-ring"></div>
        <div className="size-[1220px] hero-ring"></div> */}

        {/* <HeroOrbit size={430} rotation={-14}shouldOrbit orbitDuration="30s" shouldSpin spinDuration="4s">
          <SparkleIcon className="size-8 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={440} rotation={79}shouldOrbit orbitDuration="32s" shouldSpin spinDuration="4s">
          <SparkleIcon className="size-5 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={520} rotation={-41}shouldOrbit orbitDuration="34s" shouldSpin spinDuration="4s">
          <div className="size-2 rounded-full  bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={530} rotation={178}shouldOrbit orbitDuration="36s" shouldSpin spinDuration="4s">
          <SparkleIcon className="size-10 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={550} rotation={20}shouldOrbit orbitDuration="38s" shouldSpin spinDuration="4s">
          <StarIcon className="size-12 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit size={590} rotation={98}shouldOrbit orbitDuration="40s" shouldSpin spinDuration="6s">
          <StarIcon className="size-8 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit size={650} rotation={-5}shouldOrbit orbitDuration="42s">
          <div className="size-2 rounded-full  bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={710} rotation={150}shouldOrbit orbitDuration="44s" shouldSpin spinDuration="6s">
          <SparkleIcon className="size-14 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={720} rotation={85}shouldOrbit orbitDuration="46s">
          <div className="size-3 rounded-full  bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={800} rotation={-72}shouldOrbit orbitDuration="48s" shouldSpin spinDuration="6s">
          <StarIcon className="size-28 text-emerald-300" />
        </HeroOrbit> */}
      </div>
      <div className="container ">
        <div className="flex flex-col items-center">

          {/* <Image src={memojiImage} className="size-[100px]" alt="Person peeking from behind laptop" /> */}
          <div className=" px-4 py-1.5 inline-flex gap-4 rounded-lg items-center">
            <div className="">

              {/* <div className="absolute bg-green-500 inset-0 animate-ping-large rounded-full"></div> */}
            </div>
            {/* ping */}
            {/* <div className="text-sm font-medium">Available for new Projects</div> */}
          </div>
        </div>

        <div className="max-w-lg mx-auto">

          <p className="text-center text-white-60 mt-4 md:text-lg">
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
          {/* <button className="inline-flex items-center gap-2 border border-white/15 px-6 h-12 rounded-xl mt-4">
            <span className="font-semibold">Explore Services</span>
            <ArrowDown className="size-4" />
          </button> */}
          {/* <button className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 px-6 h-12 rounded-xl mt-4">
            <span>👋</span>
            <span className="font-semibold">Lets Connect</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};
