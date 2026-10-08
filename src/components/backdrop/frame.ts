// Shared pieces for the animated section background (Backdrop.tsx and assemble.ts).

/** CSS pixels per art pixel: the backdrop is drawn small and scaled up, so it stays pixel art. */
export const PX = 4;

export type Color = number[]; // [r, g, b]
const rgb = (hex: string): Color => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** A section's tones: [background, shade, deep, accent, light]. Bold enough to read as a scene,
 *  but dark text on them (or white text on pink) keeps its contrast. */
export type Tones = Color[];

const SPACE = ["#141414", "#2a2d55", "#454a8c", "#fff15c", "#7a80c4"];

/** Every section the story passes through, top to bottom. Space sections show the Earth, and
 *  blocks passing behind their white text fade so it stays readable. */
export const SECTIONS = [
  { id: "about", tones: SPACE, space: true },
  { id: "items", tones: ["#fff15c", "#f5d93a", "#e0b62a", "#f54ba3", "#fffbc2"] },
  { id: "code", tones: SPACE, space: true },
  { id: "quests", tones: ["#f3efe3", "#e3dac3", "#c9bb98", "#f54ba3", "#fffdf6"] },
  { id: "badges", tones: ["#5bc24a", "#4aae3c", "#34873a", "#fff15c", "#8fdc7a"] },
  { id: "projects", tones: ["#c5e6f8", "#9fd3f2", "#6ec1ee", "#2a7fb8", "#eaf6fd"] },
  { id: "art", tones: ["#f54ba3", "#e33b93", "#c22a7b", "#fff15c", "#ff8cc6"] },
  { id: "contact", tones: SPACE, space: true },
].map((s) => ({ ...s, tones: s.tones.map(rgb), space: Boolean(s.space) }));

/** A section in art pixels relative to the screen (it may be above or below the screen). Where two
 *  sections meet at a jagged edge, the line between them is the middle of that edge. */
export type Area = { id: string; x0: number; x1: number; y0: number; y1: number; tones: Tones; space: boolean; heading?: Box };
export type Box = { x0: number; x1: number; y0: number; y1: number };

/** Everything a painter needs for one frame. */
export type Frame = {
  w: number; // screen size in art pixels
  h: number;
  t: number; // seconds since start
  dt: number; // seconds since the last frame
  still: boolean; // reduced motion: t, dt and v stay 0, draw a calm picture that only follows scrolling
  top: number; // how far the page is scrolled, in whole art pixels: screen row y = page row top + y
  v: number; // scroll speed in art pixels per second (+ = down), smoothed
  areas: Area[]; // the sections above, top to bottom, on screen or not
  earth: { x: number; y: number; r: number } | null; // the background Earth's center and radius on screen
  taps: { x: number; y: number }[]; // pointer presses on the background since the last frame
  pointer: { x: number; y: number } | null; // mouse position (null on touch or outside)
  /** Paints a w×h block of art pixels (alpha 0–1). Outside the sections it does nothing. */
  put: (x: number, y: number, w: number, h: number, c: Color, alpha?: number) => void;
};

/** A painter draws one frame. Built once; it keeps its own state between frames. */
export type Painter = (f: Frame) => void;

/** Same inputs, same number in 0–1: the "random" layout is identical on every visit and frame. */
export function hash(a: number, b: number, seed = 0) {
  let h = Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(seed, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** The section under a screen row, if any. */
export const areaAt = (areas: Area[], y: number) => areas.find((a) => y >= a.y0 && y < a.y1);

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const easeInOut = (n: number) => (n < 0.5 ? 4 * n * n * n : 1 - (-2 * n + 2) ** 3 / 2);
