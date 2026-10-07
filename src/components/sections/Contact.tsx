import { Reveal } from "@/components/interactive/Reveal";
import { PixelEdge } from "@/components/pixel/PixelEdge";
import { PixelButton } from "@/components/ui/PixelButton";
import { profile } from "@/content/profile";

// Last section, styled like an arcade "Continue?" screen. No pixel edge below: nothing comes after it.
// The jagged border above it is its own (see Section's `top`); no background, so space shows through.
export function Contact() {
  return (
    <>
      <PixelEdge above="fill-pink" accent="fill-lemon" offset={14} />
      <section id="contact" className="scroll-mt-12 px-4 pb-10 pt-16 text-center text-white">
        {/* relative: keeps the text above the background Earth (components/pixel/Earth.tsx) */}
        <div className="relative">
          <Reveal>
            <p className="font-pixel text-sm text-pink">Game over?</p>
            <h2 className="h2 mt-2">
              Continue<span className="blink">?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/75">
              Open to IoT, project control and Work opportunity. Insert coin (or just send an email).
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-12 flex flex-wrap justify-center gap-6">
            <PixelButton href={`mailto:${profile.email}`} play className="[--c:var(--color-pink)]">
              Yes, email me
            </PixelButton>
            <PixelButton href={profile.linkedin} className="[--c:var(--color-lemon)]">
              LinkedIn
            </PixelButton>
            <PixelButton href={profile.github} className="[--c:var(--color-sky)]">
              GitHub
            </PixelButton>
          </Reveal>

          <footer className="mt-24 font-pixel text-xs text-white/40">
            © {new Date().getFullYear()} {profile.name} · made with Love
          </footer>
        </div>
      </section>
    </>
  );
}