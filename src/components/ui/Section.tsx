import type { ReactNode } from "react";
import { Reveal } from "@/components/interactive/Reveal";

type SectionProps = {
  id: string;
  /** Background/text classes, e.g. "bg-lemon". */
  className: string;
  /** Usually a <PixelEdge> in the next section's color. Leave out when the next section is dark:
   *  dark sections draw that border themselves (`top`). */
  edge?: ReactNode;
  /** Dark sections only: a <PixelEdge above="..."> in the color of the section above. It sits just
   *  before the section, so jumping to the section still lands on its heading. */
  top?: ReactNode;
  children: ReactNode;
};

// A page section: padded content, then the pixel edge that leads into the next section.
// scroll-mt-12 keeps the heading visible below the sticky nav when you jump to it.
// Dark sections have no background of their own: the space behind the page (stars, Earth) shows.
export function Section({ id, className, edge, top, children }: SectionProps) {
  return (
    <>
      {top}
      <section id={id} className={`scroll-mt-12 ${className}`}>
        <div className="relative px-4 pb-16 pt-12 sm:px-10">{children}</div>
        {edge}
      </section>
    </>
  );
}

export function SectionHeader({ title, sub, className }: { title: string; sub: string; className?: string }) {
  return (
    <Reveal className={className}>
      <h2 className="h2">{title}</h2>
      <p className="mt-3 text-sm">{sub}</p>
    </Reveal>
  );
}