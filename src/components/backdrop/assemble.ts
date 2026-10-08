// The home page's background story. Asteroids gather into a ring around the Earth in About, then fly
// off and become block sculptures of your own icons. In the light sections (Inventory, Quest log,
// Badges, Save files) the sculpture is a small emblem beside the section heading: it scrolls with the
// heading, so nothing moves behind what you're reading; it turns gently and leans toward your mouse.
// In the Art corner it's a large sculpture around the heading that drifts, zooms and turns as you
// scroll. Between sections the blocks tremble, burst out and stream along an S-curve into the next
// form, landing with a small pop. In Spellbook they circle the Earth again; at "Continue?" they spread
// into an asteroid belt around it that reaches the far right edge. Hover pushes blocks, a click
// knocks them apart and they spring back.
import { PALETTE } from "@/components/pixel/palette";
import { SPRITES, type SpriteName } from "@/components/pixel/sprites";
import { areaAt, clamp01, easeInOut, hash, type Area, type Color, type Frame, type Painter } from "./frame";

type Point = [number, number]; // share of the screen's width and height
type Scene =
  | { kind: "emblem"; icon: SpriteName } // beside the section heading
  | { kind: "statue"; icon: SpriteName; from: Point; to: Point } // travels from → to through its section
  | { kind: "ring"; size: number } // a ring around the Earth, size × the Earth's radius
  | { kind: "belt" }; // the finale: a wide belt around the Earth reaching the far right edge

const SCENES: Record<string, Scene> = {
  about: { kind: "ring", size: 1.7 },
  items: { kind: "emblem", icon: "chip" },
  code: { kind: "ring", size: 1.5 },
  quests: { kind: "emblem", icon: "clipboard" },
  badges: { kind: "emblem", icon: "trophy" },
  projects: { kind: "emblem", icon: "ohm" },
  art: { kind: "statue", icon: "palette", from: [0.32, 0.44], to: [0.35, 0.56] }, // around its heading
  contact: { kind: "belt" },
};
const FIELD = 240; // blocks in the rings and the belt

// One voxel per sprite pixel, centered on the sprite. tone: 1 shade, 2 deep, 3 accent, 4 light.
type Voxels = { cells: { X: number; Y: number; tone: number }[]; span: number };
const VOXELS = Object.fromEntries(
  Object.values(SCENES).flatMap((s) => {
    if (s.kind !== "emblem" && s.kind !== "statue") return [];
    const art = SPRITES[s.icon];
    const cells: Voxels["cells"] = [];
    art.forEach((row, r) =>
      [...row].forEach((ch, c) => {
        const hex = PALETTE[ch];
        if (!hex) return;
        const n = parseInt(hex.slice(1), 16);
        const lum = 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
        const tone = hash(c, r, art.length) < 0.04 ? 3 : lum < 70 ? 2 : lum < 170 ? 1 : 4;
        cells.push({ X: c - art[0].length / 2 + 0.5, Y: r - art.length / 2 + 0.5, tone });
      }),
    );
    return [[s.icon, { cells, span: Math.max(art.length, art[0].length) }]];
  }),
) as Record<SpriteName, Voxels>;
const MAX = Math.max(FIELD, ...Object.values(VOXELS).map((v) => v.cells.length));

// Where block j sits in a scene: center, size, depth (for drawing order), tone, and how far it has
// turned: front = width share of the front face, side = width share of the side face (+ right, − left).
type Slot = { x: number; y: number; s: number; z: number; tone: number; front: number; side: number; hidden?: boolean; dim?: boolean };
type Layout = { count: number; slot: (j: number) => Slot };

const bezier = (a: number, b: number, c: number, d: number, e: number) =>
  (1 - e) ** 3 * a + 3 * (1 - e) ** 2 * e * b + 3 * (1 - e) * e * e * c + e ** 3 * d;
const turnLimit = (r: number) => Math.max(-0.75, Math.min(0.75, r));

// A sculpture centered at ax, ay, voxel size b, turned by `turn` (radians), breathing row by row.
function statue(vox: Voxels, ax: number, ay: number, b: number, turn: number, t: number, breathe: boolean): Layout {
  const front = Math.cos(turn), side = Math.sin(turn);
  return {
    count: vox.cells.length,
    slot: (j) => {
      const c = vox.cells[j % vox.cells.length];
      const wave = breathe ? Math.sin(t * 1.6 + c.Y * 0.45) * 0.5 : 0;
      return { x: ax + c.X * b * front, y: ay + (c.Y + wave) * b, s: b, z: c.X * side, tone: c.tone, front, side };
    },
  };
}

export function assemble(): Painter {
  // Each block's spring: an offset from its place and a velocity. Pushed away, it springs back.
  const ox = new Float32Array(MAX), oy = new Float32Array(MAX), vx = new Float32Array(MAX), vy = new Float32Array(MAX);

  return (f) => {
    const { w, h, t, dt, still, areas, earth, taps, pointer } = f;
    const wide = w > 200, small = Math.min(w, h);

    // Which hand-off is happening: a seam moving from 80% to 20% of the screen height.
    let from = 0, to = 0, m = 0, shake = 0;
    for (let k = 0; k < areas.length; k++) if (areas[k].y0 <= h / 2) from = to = k;
    for (let k = 0; k < areas.length - 1; k++) {
      const s = areas[k].y1;
      if (s < h * 0.8 && s > h * 0.2) [from, to, m] = [k, k + 1, (h * 0.8 - s) / (h * 0.6)];
    }
    if (from === to && from < areas.length - 1) shake = clamp01((h - areas[from].y1) / (h * 0.2));
    if (still) m = m < 0.5 ? 0 : 1;

    // A scene's layout for block j.
    const layout = (area: Area): Layout => {
      const scene = SCENES[area.id];
      // q = how far through this section you are (0 → 1).
      const q = clamp01((h / 2 - area.y0) / Math.max(1, area.y1 - area.y0)), drift = q - 0.5;
      // Dolly: small as a section arrives, closest in its middle, small again as it leaves.
      const zoom = (0.65 + 0.6 * Math.sin(Math.PI * q)) * (1 - 0.07 * shake);
      if (scene.kind === "emblem") {
        // About twice the heading's height, just right of it (inside the section).
        const vox = VOXELS[scene.icon], hd = area.heading;
        const b = Math.max(2, ((hd ? hd.y1 - hd.y0 : 18) * 2.2) / vox.span), size = b * vox.span;
        const ax = hd ? Math.min(hd.x1 + size * 0.8, area.x1 - size * 0.6) : area.x1 - size;
        const ay = hd ? (hd.y0 + hd.y1) / 2 : area.y0 + size;
        const lean = pointer ? ((pointer.x - ax) / w) * 1.2 : 0;
        return statue(vox, ax, ay, b, still ? 0.3 : turnLimit(0.45 * Math.sin(t * 0.4) + lean), t, !still);
      }
      if (scene.kind === "statue") {
        const vox = VOXELS[scene.icon];
        const b = (Math.min(w * (wide ? 0.34 : 0.55), h * 0.5) / vox.span) * zoom;
        // Its path through the section: eased (it holds at both ends) and bowed into a gentle arc.
        const [fx, fy] = scene.from, [tx, ty] = scene.to, e = easeInOut(q);
        const cx = (fx + tx) / 2 - (ty - fy) * 0.18, cy = (fy + ty) / 2 + (tx - fx) * 0.18;
        const ax = ((1 - e) ** 2 * fx + 2 * (1 - e) * e * cx + e * e * tx) * w;
        const ay = ((1 - e) ** 2 * fy + 2 * (1 - e) * e * cy + e * e * ty) * h + (still ? 0 : Math.sin(t * 1.2) * 1.5);
        // Scrolling turns it, your mouse leans it.
        const lean = pointer ? ((pointer.x - ax) / w) * 1.2 : 0;
        return statue(vox, ax, ay, b, still ? 0.25 : turnLimit(drift * 1.1 + 0.15 * Math.sin(t * 0.35) + lean), t, !still);
      }
      // Asteroids around the Earth. A ring hugs the planet and tilts as you scroll; the belt is flat,
      // dips to the right under the "Continue?" text and reaches the far right edge.
      const e = earth ?? { x: w * 0.15, y: h * 0.6, r: Math.min(w, h) * 0.2 };
      const ring = scene.kind === "ring";
      const a = ring ? e.r * scene.size * (0.75 + 0.35 * Math.sin(Math.PI * q)) : Math.max(e.r * 1.5, area.x1 - 3 - e.x);
      const bb = a * (ring ? 0.34 : 0.16), tilt = ring ? -0.35 + drift * 0.5 : 0.1;
      const base = Math.max(2, small / (ring ? 44 : 36)) * (ring ? zoom : 1);
      const spin = t * 0.05 + f.top * 0.006; // scrolling spins it
      return {
        count: FIELD,
        slot: (j) => {
          const phi = (j / FIELD) * Math.PI * 2 + spin + (hash(j, 1, 71) - 0.5) * 0.2;
          const k = 1 + (hash(j, 2, 71) - 0.5) * 0.16, depth = Math.sin(phi);
          const px = Math.cos(phi) * a * k, py = depth * bb * k;
          const x = e.x + px * Math.cos(tilt) - py * Math.sin(tilt), y = e.y + px * Math.sin(tilt) + py * Math.cos(tilt);
          const behind = depth < 0 && Math.hypot(x - e.x, y - e.y) < e.r; // hidden by the planet
          const tumble = still ? 0.3 : Math.sin(t * (1 + hash(j, 3, 71)) + j); // asteroids tumble
          // The far side is smaller and faded, so it recedes.
          return { x, y, s: base * (0.5 + 0.5 * (depth + 1)) * (0.6 + 0.8 * hash(j, 4, 71)), z: depth * 100, tone: hash(j, 5, 71) < 0.5 ? 1 : 2, front: Math.abs(Math.cos(tumble)) * 0.7 + 0.3, side: Math.sin(tumble) * 0.7, hidden: behind, dim: depth < 0 };
        },
      };
    };

    const A = areas[from], B = areas[to];
    if (!A || !SCENES[A.id] || !SCENES[B.id]) return;
    const la = layout(A), lb = from === to ? la : layout(B);
    const n = from === to ? la.count : Math.max(la.count, lb.count);
    // The first scene assembles as its section scrolls in: blocks fly in from beyond the upper right.
    const arriving = from === 0 && to === 0 ? clamp01((h - areas[0].y0) / (h * 0.6)) : 1;

    // Play: the mouse pushes blocks, a click blasts them; springs pull them home (bouncy on purpose).
    const blasts = taps.map((p) => ({ ...p, r: 50, force: 260 }));
    if (pointer) blasts.push({ ...pointer, r: 14, force: 900 * dt });

    const draws: (Slot & { alpha: number; ghost?: boolean })[] = [];
    for (let j = 0; j < n; j++) {
      let p0 = la.slot(j);
      if (arriving < 1) {
        const ej = easeInOut(still ? Math.round(arriving) : clamp01((arriving - hash(j, 6, 5) * 0.4) / 0.6));
        const sx = w * (0.7 + 0.5 * hash(j, 7, 5)), sy = -h * (0.1 + 0.5 * hash(j, 8, 5));
        p0 = { ...p0, x: sx + (p0.x - sx) * ej, y: sy + (p0.y - sy) * ej + Math.sin(Math.PI * ej) * h * 0.15 };
      }
      let p: Slot = p0;
      if (from !== to) {
        const p1 = lb.slot(j);
        // Blocks peel off one after another (left side first), then fly an S-curve.
        const mj = clamp01((m - (hash(j, 1, 5) * 0.25 + (p0.x / w) * 0.15)) / 0.6);
        const dx = p1.x - p0.x, dy = p1.y - p0.y, len = Math.hypot(dx, dy) || 1;
        const bend = (0.2 + 0.2 * hash(j, 7, 5)) * len, nx = -dy / len, ny = dx / len;
        const at = (e: number): Slot => {
          const x = bezier(p0.x, p0.x + dx / 3 + nx * bend, p0.x + (2 * dx) / 3 - nx * bend, p1.x, e);
          const y = bezier(p0.y, p0.y + dy / 3 + ny * bend, p0.y + (2 * dy) / 3 - ny * bend, p1.y, e);
          const pop = 1 + 0.3 * Math.sin(Math.PI * clamp01((e - 0.8) / 0.2)); // lands with a pop
          const s = (p0.s + (p1.s - p0.s) * e) * (1 - 0.45 * Math.sin(Math.PI * e)) * pop; // zooms out in flight
          const mid = e > 0 && e < 1;
          return { x, y, s, z: mid ? 1000 : e < 0.5 ? p0.z : p1.z, tone: e < 0.5 ? p0.tone : p1.tone, front: mid ? 1 : e < 0.5 ? p0.front : p1.front, side: mid ? 0.25 : e < 0.5 ? p0.side : p1.side, hidden: e < 0.5 ? p0.hidden : p1.hidden };
        };
        const e = easeInOut(mj);
        p = at(e);
        // Motion trail: two fading copies a little behind on the curve.
        if (!still && e > 0.06 && e < 0.94)
          for (const [back, alpha] of [[0.05, 0.35], [0.1, 0.15]]) draws.push({ ...at(Math.max(0, e - back)), z: 999, alpha, ghost: true });
      }
      let { x, y } = p;
      if (!still) {
        x += (hash(j, Math.floor(t * 30), 9) - 0.5) * 3 * shake; // tremble before take-off
        y += (hash(j, Math.floor(t * 30), 10) - 0.5) * 3 * shake;
        for (const bl of blasts) {
          const ddx = x - bl.x, ddy = y - bl.y, d = Math.hypot(ddx, ddy) || 1;
          if (d < bl.r) {
            vx[j] += (ddx / d) * bl.force * (1 - d / bl.r);
            vy[j] += (ddy / d) * bl.force * (1 - d / bl.r);
          }
        }
        vx[j] += (-60 * ox[j] - 9 * vx[j]) * dt;
        vy[j] += (-60 * oy[j] - 9 * vy[j]) * dt;
        ox[j] += vx[j] * dt;
        oy[j] += vy[j] * dt;
        x += ox[j];
        y += oy[j];
      }
      draws.push({ ...p, x, y, alpha: p.dim ? 0.5 : 1 });
    }

    // Back to front, so nearer blocks (and their side faces) cover the ones behind.
    draws.sort((a, b) => a.z - b.z);
    for (const d of draws) if (!d.ghost && !d.hidden && !d.dim) voxel(f, d, true);
    for (const d of draws) if (!d.hidden) voxel(f, d, false);
  };
}

// One block: a front face (light top edge), a side face showing how far it's turned, and its shadow.
function voxel({ areas, put }: Frame, d: Slot & { alpha: number }, shadow: boolean) {
  const area = areaAt(areas, d.y);
  if (!area || d.s < 0.5) return;
  const [, shade, deep, , light] = area.tones;
  const face: Color = area.tones[d.tone];
  const sideColor = face === deep ? shade : deep;
  const s = Math.max(1, Math.round(d.s)), fw = Math.max(1, Math.round(d.s * d.front)), sw = Math.round(d.s * Math.abs(d.side));
  const x = Math.round(d.x - fw / 2), y = Math.round(d.y - s / 2);
  if (shadow) {
    put(x + Math.round(s * 0.3), y + Math.round(s * 0.3), fw, s, deep, 0.3);
    return;
  }
  if (sw > 0) put(d.side > 0 ? x + fw : x - sw, y, sw, s, sideColor, d.alpha);
  put(x, y, fw, s, face, d.alpha);
  if (s >= 3) put(x, y, fw, Math.max(1, Math.round(s / 6)), light, d.alpha);
}
