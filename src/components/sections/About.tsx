import { Reveal } from "@/components/interactive/Reveal";
import { PixelEdge } from "@/components/pixel/PixelEdge";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { PlayerCard } from "./PlayerCard";

const highlight = "box-decoration-clone bg-pink px-1 text-white";

export function About() {
  return (
    <Section
      id="about"
      className="text-white"
      top={<PixelEdge above="fill-sky-soft" accent="fill-pink" />}
      edge={<PixelEdge color="fill-lemon" accent="fill-pink" offset={9} />}
    >
      <Reveal>
        <h2 className="h2">
          Who am <span className="text-pink">I?</span>
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.3fr_1fr]">
        {/* glass: the background Earth blurs behind the text instead of running through it className="glass self-start p-5 sm:p-6"*/}
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