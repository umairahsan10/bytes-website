"use client";
import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";

const particleOptions: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: { value: 50, density: { enable: true } },
    color: { value: "#ffffff" },
    opacity: { value: 0.3 },
    size: { value: { min: 1, max: 2 } },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
    links: {
      enable: true,
      distance: 120,
      color: "#ffffff",
      opacity: 0.1,
      width: 1,
    },
  },
  detectRetina: true,
};

export default function ParticleField() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("@tsparticles/slim").then(({ loadSlim }) => {
      import("@tsparticles/engine").then(({ tsParticles }) => {
        loadSlim(tsParticles).then(() => setReady(true));
      });
    });
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="hero-particles"
      options={particleOptions}
      className="absolute inset-0 z-0"
    />
  );
}
