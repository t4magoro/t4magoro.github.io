import Link from "next/link";
import type { ReactNode } from "react";
import { PixelArt } from "@/components/pixel/PixelArt";
import { SPRITES } from "@/components/pixel/sprites";

type Props = {
  href: string;
  children: ReactNode;
  /** Show a blinking ▶ arrow before the label. */
  play?: boolean;
  /** Extra classes. Change the border color with e.g. "[--c:var(--color-pink)]". */
  className?: string;
};

// Notched pixel-style link button.
// "/..." = page on this site (Next <Link>, no full reload). "http..." = opens in a new tab.
export function PixelButton({ href, children, play = false, className = "" }: Props) {
  const classes = `btn ${className}`;
  const label = (
    <>
      {play && <PixelArt art={SPRITES.play} className="blink w-2.5" />}
      {children}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  const external = href.startsWith("http");
  return (
    <a href={href} className={classes} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {label}
    </a>
  );
}