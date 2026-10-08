import { PaintBox } from "@/components/interactive/PaintBox";
import { Reveal } from "@/components/interactive/Reveal";
import { PixelArt } from "@/components/pixel/PixelArt";
import { SPRITES } from "@/components/pixel/sprites";
import { PixelButton } from "@/components/ui/PixelButton";
import { Section } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";

const highlight = "box-decoration-clone bg-pink px-1 text-white";

export function Art() {
  return (
    <Section id="art" className="bg-pink text-white">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <p className="font-pixel text-sm text-lemon">Side quest unlocked</p>
          <h2 className="h2 mt-2">Art corner</h2>
          <p className="mt-6 max-w-md leading-relaxed">
            <mark className={highlight}>
            Before circuits there were sketchbooks. I haven&apos;t drawn in a while, so here&apos;s a canvas. Your turn:
            draw something.
            </mark>
          </p>
          <div className="mt-8 flex items-center gap-6">
            <PixelArt art={SPRITES.palette} className="w-20" />
            <PixelButton href="/art" play>
              Open gallery
            </PixelButton>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto w-full max-w-sm">
          <Window title="paint.exe" className="shadow-px">
            <PaintBox />
          </Window>
        </Reveal>
      </div>
    </Section>
  );
}