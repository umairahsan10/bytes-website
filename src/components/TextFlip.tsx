"use client";

import { useEffect, useMemo, useRef } from "react";

export default function TextFlip() {
  const words = useMemo(() => ["website"," seo", "apps", "marketing", "chatbots", "crm", "AI", "website"], []);

  const tallestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tallestRef.current) {
      let maxHeight = 0;

      words.forEach((word) => {
        const span = document.createElement("span");
        span.className = "absolute opacity-0";
        span.textContent = word;
        tallestRef.current?.appendChild(span);
        const height = span.offsetHeight;
        tallestRef.current?.removeChild(span);

        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      tallestRef.current.style.height = `${maxHeight}px`;
    }
  }, [words]);

  return (
    <>
      <style jsx>{`
        .text-flip-container {
          display: flex;
          gap: 1rem;
          font-size: 2rem;
          font-weight: 600;
          align-items: center;
        }
        
        .text-flip-static {
          color: #d3d3d3;
        }
        
        .text-flip-words {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: #60a5fa;
          text-align: left;
        }
        
        .text-flip-word {
          animation: flip-words 14s infinite;
        }
        // "10%": { transform: "translateY(-112%)" },
        //   "25%": { transform: "translateY(-100%)" },
        //   "35%": { transform: "translateY(-212%)" },
        //   "50%": { transform: "translateY(-200%)" },
        //   "60%": { transform: "translateY(-312%)" },
        //   "75%": { transform: "translateY(-300%)" },
        //   "85%": { transform: "translateY(-412%)" },
        //   "100%": { transform: "translateY(-400%)" },
        @keyframes flip-words {
          6% { transform: translateY(-112%); }
          14% { transform: translateY(-100%); }
          20% { transform: translateY(-122%); }
          28% { transform: translateY(-200%); }
          34% { transform: translateY(-312%); }
          42% { transform: translateY(-300%); }
          48% { transform: translateY(-412%); }
          56% { transform: translateY(-400%); }
          63% { transform: translateY(-512%); }
          71% { transform: translateY(-500%); }
          77% { transform: translateY(-612%); }
          85% { transform: translateY(-600%); }
          92% { transform: translateY(-712%); }
          100% { transform: translateY(-700%); }
        }
        
        @media (max-width: 768px) {
          .text-flip-container {
            font-size: 1rem;
            gap: 0.5rem;
          }
          //for text flip words adjustments
          .text-flip-words {
            height: 1em !important;
            overflow: hidden;
          }
        }
        
        @media (max-width: 480px) {
          .text-flip-container {
            font-size: 0.9rem;
            gap: 0.25rem;
          }
          
          .text-flip-words {
            height: 1.1em !important;
            overflow: hidden;
          }
        }
      `}</style>
      
      <div className="text-flip-container">
        <p className="text-flip-static">Redefining</p>
        <div ref={tallestRef} className="text-flip-words">
          {words.map((word, index) => (
            <span key={index} className="text-flip-word">
              {word}
            </span>
          ))}
        </div>
      </div>
    </>
  );
} 