import { atom } from "jotai";

interface Page {
  front: string;
  back: string;
}

const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
];

// Initialize page state to 0 (closed book)
export const pageAtom = atom(0);

// Track whether the user has interacted (clicked/tapped) with the book once.
export const userInteractedAtom = atom(false);

// Indicates that a page flip animation is currently in progress. Used to throttle rapid clicks.
export const flipInProgressAtom = atom(false);

// Create pages array with proper ordering
export const pages: Page[] = [
  // Front cover
  {
    front: "book-cover",
    back: pictures[0], // First content image on the back of cover
  }
];

// Add content pages
for (let i = 0; i < pictures.length - 2; i += 2) {
  pages.push({
    front: pictures[i + 1],
    back: pictures[i + 2],
  });
}

// Add back cover
pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
}); 