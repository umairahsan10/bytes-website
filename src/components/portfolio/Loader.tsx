"use client";
import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoaded(true), 300);
          setTimeout(() => setHidden(true), 1100);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`loader-overlay ${loaded ? "loaded" : ""}`}
      aria-hidden="true"
    >
      <div className="font-heading text-3xl font-bold text-white mb-6 tracking-tight">
        <span className="gradient-text">Bytes</span>
      </div>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-cyan rounded-full transition-all duration-200"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="font-mono text-xs text-muted mt-3">
        {Math.min(Math.round(progress), 100)}%
      </p>
    </div>
  );
}
