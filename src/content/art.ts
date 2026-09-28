export type Artwork = {
  /** Path of the image inside /public, e.g. "/art/sunset.jpg". */
  src: string;
  title: string;
  year?: string;
  /** Shown under the picture in the viewer. Your story: what, when, why. */
  description?: string;
  /** Describes the picture for screen readers and when the image can't load. */
  alt: string;
};

// How to add a piece:
// 1. Put the image file in public/art/ (e.g. public/art/sunset.jpg).
// 2. Add an entry below. Newest first.
// While this list is empty, the gallery page shows a "coming soon" message.
// The descriptions below are drafts based on what's in each picture: rewrite them in your own words.
export const artworks: Artwork[] = [
  {
    src: "/art/sky-whale.jpg",
    title: "Sky Whale",
    description: "I made this on 2019 it was an experiment with sea colour reflection style, still has it flops but i am quite proud with it.",
    alt: "I made this on 2019 it was an experiment with sea colour reflection style, still has it flops but i am quite proud with it",
  },
  {
    src: "/art/mt-fuji.jpg",
    title: "Fuji",
    description: "ive never been to japan before, but when i have the chance, mount fuji will be on my top list.",
    alt: "ive never been to japan before, but when i have the chance to mount fuji will be on my top list",
  },
  {
    src: "/art/sunset.jpg",
    title: "Sunset",
    description: "sunset and me has a special kind of personal attachment.",
    alt: "sunset and me has a special kind of personal attachment",
  },
  {
    src: "/art/flower.jpg",
    title: "Petal Brush",
    description: "fun fact this was actualy my first digital drawing :D",
    alt: "fun fact this was actualy my first digital drawing :D",
  },
];