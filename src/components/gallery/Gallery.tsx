"use client";

import { useState } from "react";
import type { Artwork } from "@/content/art";
import { ArtCard } from "./ArtCard";
import { Lightbox } from "./Lightbox";

// Grid of artworks. Clicking one opens it in the Lightbox.
// `open` is the index of the piece being viewed; null = viewer closed.
export function Gallery({ artworks }: { artworks: Artwork[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((art, i) => (
          <li key={art.src}>
            <ArtCard art={art} index={i} onOpen={() => setOpen(i)} />
          </li>
        ))}
      </ul>
      <Lightbox items={artworks} index={open} onChange={setOpen} />
    </>
  );
}