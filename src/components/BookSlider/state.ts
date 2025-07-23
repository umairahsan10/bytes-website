import { atom } from "jotai";

interface Page {
  front: string;
  back: string;
}

const pictures = [
  "newtitle1",
  "new1",
  "newtitle2",
  "new2",
  "newtitle3",
  "new3",
  "newtitle4",
  "new4",
  "newtitle5",
  "new5",
  "newtitle6",
  "new6",
  "newtitle7",
  "new7",
  "newtitle8",
  "new8",
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