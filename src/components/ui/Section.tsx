import type { ReactNode } from "react";
import { Reveal } from "@/components/interactive/Reveal";

type SectionProps = {
  id: string;
  /** Background/text classes, e.g. "bg-lemon". */
  className: string;
  /** Usually a <PixelEdge> in the next section's color. */
  edge: ReactNode;
  children: ReactNode;
};

// A page section: padded content, then the pixel edge that leads into the next section.
// scroll-mt-12 keeps the heading visible below the sticky nav when you jump to it.
export function Section({ id, className, edge, children }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-12 ${className}`}>
      <div className="relative px-4 pb-16 pt-12 sm:px-10">{children}</div>
      {edge}
    </section>
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