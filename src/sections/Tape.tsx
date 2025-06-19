import StarIcon from "@/assets/icons/star.svg";
import { Fragment } from "react";

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
  return (
    <div className="py-16 lg:py-24 overflow-x-clip">
      <div className="bg-gradient-to-r from-emerald-300 to-sky-400  -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent)]">
          <div className="flex flex-none gap-4 py-3 pr-4 animate-move-left" style={{ animationDuration: '30s' }}>
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
