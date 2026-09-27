import { Reveal } from "@/components/interactive/Reveal";
import { PixelArt } from "@/components/pixel/PixelArt";
import { PixelEdge } from "@/components/pixel/PixelEdge";
import { SPRITES } from "@/components/pixel/sprites";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { PlayerCard } from "./PlayerCard";

// Twinkling stars in the black background. d = animation delay.
const SPARKLES = [
  { left: "5%", top: "10%", d: "0s" },
  { left: "90%", top: "6%", d: "0.4s" },
  { left: "70%", top: "34%", d: "0.9s" },
  { left: "10%", top: "60%", d: "1.3s" },
  { left: "94%", top: "72%", d: "0.2s" },
  { left: "48%", top: "88%", d: "1.1s" },
];

const highlight = "box-decoration-clone bg-pink px-1 text-white";

function Sparkles() {
  return SPARKLES.map((s, i) => (
    <PixelArt
      key={i}
      art={SPRITES.sparkle}
      className="twinkle pointer-events-none absolute w-4"
      style={{ left: s.left, top: s.top, animationDelay: s.d }}
    />
  ));
}

export function About() {
  return (
    <Section id="about" className="bg-ink text-white" edge={<PixelEdge color="fill-lemon" accent="fill-pink" offset={9} />}>
      <Sparkles />

      <Reveal>
        <h2 className="h2">
          Who am <span className="text-pink">I?</span>
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.3fr_1fr]">
        <Reveal delay={0.06}>
          <p className="text-xl leading-snug sm:text-2xl">
            I&apos;m {profile.first}. I make <mark className={highlight}>hardware talk to the internet</mark> and keep{" "}
            <mark className={highlight}>projects on track</mark>.
          </p>
          <div className="mt-6 max-w-prose space-y-4 text-sm leading-relaxed text-white/75">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <PlayerCard />
        </Reveal>
      </div>
    </Section>
  );
}