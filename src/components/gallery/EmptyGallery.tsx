import { PixelArt } from "@/components/pixel/PixelArt";
import { SPRITES } from "@/components/pixel/sprites";
import { Window } from "@/components/ui/Window";

// Shown while src/content/art.ts has no artworks yet.
export function EmptyGallery() {
  return (
    <Window title="gallery.exe" className="shadow-px mt-12 max-w-md">
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <PixelArt art={SPRITES.palette} className="w-16" />
        <p className="font-pixel text-sm uppercase">
          Loading masterpieces<span className="blink">...</span>
        </p>
        <p className="text-sm">New pieces are on the way. Check back soon.</p>
      </div>
    </Window>
  );
}