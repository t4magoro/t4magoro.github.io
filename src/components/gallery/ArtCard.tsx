import Image from "next/image";
import { Reveal } from "@/components/interactive/Reveal";
import { Window } from "@/components/ui/Window";
import type { Artwork } from "@/content/art";

// Matches the gallery grid: 1 column on phones, 2 on tablets, 3 on desktop.
const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

// One framed artwork. Clicking it calls onOpen (the Gallery opens the Lightbox).
export function ArtCard({ art, index, onOpen }: { art: Artwork; index: number; onOpen: () => void }) {
  const { src, title, year, alt } = art;

  return (
    <Reveal delay={index * 0.05} className="h-full bg-ink">
      <Window title={year ? `${title} · ${year}` : title} className="lift h-full">
        {/* object-contain + paper background = the whole piece is visible, never cropped */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View ${title}`}
          className="relative block aspect-video w-full cursor-zoom-in bg-paper"
        >
          <Image src={src} alt={alt} fill sizes={SIZES} className="object-contain p-3" />
        </button>
      </Window>
    </Reveal>
  );
}