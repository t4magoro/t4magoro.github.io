import type { Metadata } from "next";
import { EmptyGallery } from "@/components/gallery/EmptyGallery";
import { Gallery } from "@/components/gallery/Gallery";
import { Nav } from "@/components/sections/Nav";
import { PixelButton } from "@/components/ui/PixelButton";
import { artworks } from "@/content/art";

// The layout's title template turns this into "Art gallery · Muhammad Iqbal".
export const metadata: Metadata = {
  title: "Art gallery",
  description: "Drawings and pixel art by Muhammad Iqbal.",
  alternates: { canonical: "/art" },
  // Setting openGraph here replaces the layout's, so the share image is repeated.
  openGraph: {
    url: "/art",
    title: "Art gallery · Muhammad Iqbal",
    description: "Drawings and pixel art by Muhammad Iqbal.",
    images: "/opengraph-image.png",
  },
  twitter: { card: "summary_large_image", images: "/opengraph-image.png" },
};

// The /art page. Artworks come from src/content/art.ts.
// No background of its own: the landscape from Scenery shows through.
export default function ArtPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl">
      <Nav />

      <div className="px-4 pb-20 pt-10 sm:px-10">
        <PixelButton href="/#art">Back</PixelButton>

        <h1 className="h2 title-outline mt-10">Art gallery</h1>
        <p className="mt-6 max-w-md">
          <mark className="box-decoration-clone bg-lemon px-1 leading-7 text-ink">
            Things I drew before circuits took over my free time. Click a piece to see it bigger.
          </mark>
        </p>

        {artworks.length > 0 ? <Gallery artworks={artworks} /> : <EmptyGallery />}
      </div>
    </main>
  );
}