"use client";

import { useEffect, useRef } from "react";
import { createEarth, R, SIZE } from "./globe";
import { StarField } from "./StarField";

// Where the Earth floats, tied to the sections so it fits every screen size:
// [section id, how far the section has scrolled past (share of its height), where its top is on the
//  screen (share of the screen height: 1 = bottom, 0 = top), center x (% of screen width), center y
//  (% of screen height)]
type Stop = [string, number, number, number, number];
const STOPS: Stop[] = [
  // About: while it scrolls up into view, the Earth sweeps from the top right down past the player
  // card and lands lower left, below the bio, before you start reading. It stays there meanwhile.
  ["about", 0, 1, 83, 5],
  ["about", 0, 0.66, 70, 30],
  ["about", 0, 0.33, 52, 58],
  ["about", 0, 0, 28, 82],
  ["about", 0.7, 0, 28, 82],
  ["code", 0.3, 0, 82, 60], // beside the Spellbook cards
  ["contact", 0, 0, 9, 56], // left of "Continue?" (or wherever the page stops scrolling)
];
const PLANET = "min(69vw, 67vh, 518px)"; // the planet's diameter on screen
const EARTH = `calc(${PLANET} * ${(SIZE / (2 * R)).toFixed(4)})`; // its canvas, a bit bigger for the glow
const TURNS = 1.5; // spins over the whole page
const IDLE = 1 / 90; // plus one spin per 90 s on its own
const SUN_DAY = -0.6; // sun angle at the top of the page: front-left, so you see the day side
const SUN_NIGHT = 2.7; // at "Continue?": behind it, so you see the night side and a thin lit edge
const FLOAT = 0.25; // seconds the Earth takes to catch up with your scrolling (it floats, it isn't glued)

const place = ([x, y]: number[]) => `translate(calc(${x.toFixed(2)}vw - 50%), calc(${y.toFixed(2)}vh - 50%))`;

// Position at scroll position `at` on a smooth curve through the stops (Catmull-Rom), so the Earth
// glides through them instead of stopping at each one. keys: each stop's scroll position, x and y.
function along(keys: number[][], at: number) {
  const last = keys.length - 1;
  if (at <= keys[0][0]) return keys[0].slice(1);
  if (at >= keys[last][0]) return keys[last].slice(1);
  const i = Math.max(0, keys.findIndex(([s], k) => k < last && at >= s && at <= keys[k + 1][0]));
  const [p0, p1, p2, p3] = [keys[Math.max(0, i - 1)], keys[i], keys[i + 1], keys[Math.min(last, i + 2)]];
  const t = (at - p1[0]) / Math.max(1, p2[0] - p1[0]);
  return [1, 2].map(
    (d) =>
      0.5 *
      (2 * p1[d] + (p2[d] - p0[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t * t + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * t * t * t),
  );
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
    const sections = STOPS.map(([id]) => document.getElementById(id));
    let s = -1, idle = 0, before = performance.now(), last = "", frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - before, 100) / 1000;
      before = now;
      s = s < 0 || still ? scrollY : s + (scrollY - s) * (1 - Math.exp(-dt / FLOAT));
      const room = document.documentElement.scrollHeight - innerHeight;
      const p = room > 0 ? Math.min(1, s / room) : 0;
      if (!still) idle += dt * IDLE;

      // Each stop's scroll position, from where its section is right now: never past the end of the
      // page, and always after the stop before it.
      const keys = STOPS.map(([, f, a, x, y], i) => {
        const r = sections[i]?.getBoundingClientRect();
        return [r ? Math.min(room, scrollY + r.top + f * r.height - a * innerHeight) : 0, x, y];
      });
      for (let i = 1; i < keys.length; i++) keys[i][0] = Math.max(keys[i][0], keys[i - 1][0] + 1);
      const next = place(still ? (STOPS[0].slice(3) as number[]) : along(keys, s));
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
        style={{ width: EARTH, height: EARTH, transform: place(STOPS[0].slice(3) as number[]) }}
      />
    </div>
  );
}
