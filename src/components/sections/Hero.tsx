import type { CSSProperties } from "react";
import { FollowSprite } from "@/components/interactive/FollowSprite";
import { Clouds, type Cloud } from "@/components/pixel/Clouds";
import { PixelArt } from "@/components/pixel/PixelArt";
import { SPRITES } from "@/components/pixel/sprites";
import { PixelButton } from "@/components/ui/PixelButton";
import { profile } from "@/content/profile";
import { Hop } from "@/components/interactive/Hop";

const HERO_CLOUDS: Cloud[] = [
  { top: "6%", w: "22%", duration: "70s", delay: "-12s" },
  { top: "28%", w: "13%", duration: "50s", delay: "-38s" },
  { top: "52%", w: "18%", duration: "85s", delay: "-60s" },
  { top: "16%", w: "10%", duration: "45s", delay: "-8s" },
];

// Each letter pops in after the previous one. `from` continues the delay count across lines.
function Letters({ text, from = 0 }: { text: string; from?: number }) {
  return [...text].map((ch, i) => (
    <span key={i} aria-hidden className="pop" style={{ "--i": from + i } as CSSProperties}>
      {ch}
    </span>
  ));
}

export function Hero() {
  const [firstName, lastName] = profile.name.split(" ");

  return (
    <section id="top" className="relative overflow-hidden bg-linear-to-b from-sky to-sky-soft">
      <Clouds clouds={HERO_CLOUDS} />

      <div className="relative flex flex-col items-center px-4 pb-10 pt-12 text-center sm:pt-16">
        <p className="bg-ink px-3 py-1 font-pixel text-xs tracking-widest text-lemon sm:text-sm">Player 1 ready</p>

        <h1 aria-label={profile.name} className="mt-8 font-pixel font-bold uppercase leading-[0.9]">
          <span className="title-outline block text-[clamp(1.6rem,7vw,4.5rem)]">
            <Letters text={firstName} />
          </span>
          <span className="title-outline block text-[clamp(3.5rem,17vw,11rem)]">
            <Letters text={lastName} from={firstName.length} />
          </span>
        </h1>

        <p className="mt-8 max-w-md text-sm sm:text-base">
          <mark className="box-decoration-clone bg-lemon px-1 leading-7 text-ink">{profile.tagline}</mark>
        </p>

        <FollowSprite className="my-10 w-20 sm:w-28">
          <Hop label="Make the robot jump">
            <PixelArt art={SPRITES.robot} className="bob w-full" title="Pixel robot mascot" />
          </Hop>
        </FollowSprite>

        <PixelButton href="#about" play>
          Press start
        </PixelButton>
      </div>

    </section>
  );
}