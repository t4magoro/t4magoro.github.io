"use client";

import { useEffect, useRef } from "react";
import { createEarth, SIZE } from "./globe";
import { StarField } from "./StarField";

// [page progress 0–1, center x (% of screen width), center y (% of screen height)]
type Stop = [number, number, number];

// Where the Earth floats: each stop is a dark section's empty area on desktop, under the bio
// (About), beside the cards (Spellbook), left of "Continue?".
const STOPS: Stop[] = [
  [0, 30, 68],
  [0.35, 82, 62],
  [1, 9, 56],
];
const EARTH = "min(72vw, 70vh, 540px)"; // on-screen size
const TURNS = 1.5; // spins over the whole page
const IDLE = 1 / 90; // plus one spin per 90 s on its own
const SUN_DAY = -0.6; // sun angle at the top of the page: front-left, so you see the day side
const SUN_NIGHT = 2.7; // at "Continue?": behind it, so you see the night side and a thin lit edge
const FLOAT = 0.25; // seconds the Earth takes to catch up with your scrolling (it floats, it isn't glued)

const place = ([x, y]: number[]) => `translate(calc(${x.toFixed(2)}vw - 50%), calc(${y.toFixed(2)}vh - 50%))`;

// Position between the two stops around progress p, eased so it slows near each stop.
function at(p: number) {
  const b = Math.max(1, STOPS.findIndex(([q]) => q >= p));
  const [p0, x0, y0] = STOPS[b - 1], [p1, x1, y1] = STOPS[Math.min(b, STOPS.length - 1)];
  const t = p1 > p0 ? Math.min(1, Math.max(0, (p - p0) / (p1 - p0))) : 0;
  const e = t * t * (3 - 2 * t);
  return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e];
}

// Space behind the home page: blinking pixel stars that stay still while you scroll, and a pixel Earth
// that drifts and spins as you scroll while the sun moves from day to night. It's one layer under every
// section (page.tsx), so it only shows where the page is see-through black: never over other colors
// or content, and it never blocks a click.
export function Earth() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = createEarth(canvas);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches; // spins with scroll, never moves
    let p = -1, idle = 0, before = performance.now(), last = "", frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - before, 100) / 1000;
      before = now;
      const room = document.documentElement.scrollHeight - innerHeight;
      const target = room > 0 ? Math.min(1, scrollY / room) : 0;
      p = p < 0 || still ? target : p + (target - p) * (1 - Math.exp(-dt / FLOAT));
      if (!still) idle += dt * IDLE;

      const next = place(at(still ? 0 : p));
      if (next !== last) canvas.style.transform = last = next;
      draw(p * TURNS + idle, SUN_DAY + (SUN_NIGHT - SUN_DAY) * p);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    // clip-path keeps the fixed stars and Earth inside the page frame, off the sky around it.
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [clip-path:inset(0)]">
      <div className="fixed inset-0">
        <StarField />
      </div>
      <canvas
        ref={ref}
        width={SIZE}
        height={SIZE}
        className="earth fixed left-0 top-0"
        style={{ width: EARTH, height: EARTH, transform: place(at(0)) }}
      />
    </div>
  );
}
