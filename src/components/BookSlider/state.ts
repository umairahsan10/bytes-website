import { atom } from "jotai";

interface Page {
  front: string;
  back: string;
}

const pictures = [
  "title1",
  "page1",
  "title2",
  "page2",
  "title3",
  "page3",
  "title4",
  "page4",
  "title5",
  "page5",
  "title6",
  "page6",
  "title7",
  "page7",
  "title8",
  "page8",
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