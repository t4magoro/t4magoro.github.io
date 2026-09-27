import type { CSSProperties } from "react";
import { PixelArt } from "./PixelArt";
import { SPRITES } from "./sprites";

export type Cloud = {
  /** Distance from the top of the parent, e.g. "10%". */
  top: string;
  /** Cloud width as a % of the parent, e.g. "15%". */
  w: string;
  /** Time to cross once, e.g. "60s". Longer = slower. */
  duration: string;
  /** Negative delay starts the cloud part-way across, so they don't all begin at the left edge. */
  delay: string;
};

// Pixel clouds drifting left to right forever (see .drift in animations.css).
// The parent must be positioned (relative/fixed) with overflow hidden.
export function Clouds({ clouds }: { clouds: Cloud[] }) {
  return clouds.map((c, i) => (
    <div
      key={i}
      aria-hidden
      className="drift pointer-events-none absolute inset-x-0"
      style={{ top: c.top, "--w": c.w, animationDuration: c.duration, animationDelay: c.delay } as CSSProperties}
    >
      <PixelArt art={SPRITES.cloud} className="cloud" />
    </div>
  ));
}