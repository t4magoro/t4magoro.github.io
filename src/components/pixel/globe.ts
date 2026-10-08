// Pixel globe: a sphere drawn pixel by pixel from a generated world map. No libraries, no images.
// createEarth() builds the map once; the function it returns redraws the globe for a spin and a sun.

/** Globe radius in pixels (the section backgrounds read it to circle the Earth). */
export const R = 46;
const HALO = 7; // glow around the planet, in pixels
/** Canvas width and height: the globe, a 1px atmosphere and a 1px outline, then the glow. */
export const SIZE = R * 2 + 4 + HALO * 2;
const W = 256; // world map size (longitude × latitude)
const H = 128;
const TILT = 0.41; // Earth's axial tilt, 23.4° in radians
const SEA = 0.53; // map heights below this are water (sets how much is land)

// Surfaces → [lit, half-lit, dusk, night] colors. The site palette where it fits.
const OCEAN = 0, SHALLOW = 1, GRASS = 2, FOREST = 3, SAND = 4, ICE = 5, CLOUD = 6;
const SHADES = [
  ["#3d8fe0", "#2f76c4", "#255fa3", "#0f1a3a"],
  ["#6ec1ee", "#56a8dc", "#3f8cc4", "#13224a"],
  ["#5bc24a", "#47a83d", "#34873a", "#0d2418"],
  ["#3f9e45", "#2f8237", "#1d5c34", "#0a1a10"],
  ["#e6ec6e", "#cbd85a", "#a9bd4c", "#1c2212"],
  ["#ffffff", "#e4f1fa", "#c5d9ea", "#2a3350"],
  ["#ffffff", "#e6f0f8", "#c9d9e8", "#3a4466"],
].map((row) => row.map(rgb));
const CITY = rgb("#fff15c"); // lemon city lights on the night side
const AIR = rgb("#a8dcff"); // atmosphere on the sunny edge, and the inner glow
const GLOW = rgb("#6ec1ee"); // the outer glow
const OUTLINE = rgb("#2b1a4a");
// 4×4 ordered dither: shade bands break up in a checker pattern, like hand-drawn pixel art.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

// Smooth 3D value noise, so the map has no seam where the longitude wraps around.
function hash(x: number, y: number, z: number, seed: number) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1440662683) + seed;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x: number, y: number, z: number, seed: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const s = (t: number) => t * t * (3 - 2 * t);
  const u = s(x - xi), v = s(y - yi), w = s(z - zi);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  const corner = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz, seed);
  return mix(
    mix(mix(corner(0, 0, 0), corner(1, 0, 0), u), mix(corner(0, 1, 0), corner(1, 1, 0), u), v),
    mix(mix(corner(0, 0, 1), corner(1, 0, 1), u), mix(corner(0, 1, 1), corner(1, 1, 1), u), v),
    w,
  );
}
// 4 layers of noise, each twice as fine and half as strong: big continents with ragged coasts.
function fbm(x: number, y: number, z: number, seed: number) {
  let sum = 0;
  for (let o = 0, f = 1, a = 0.5; o < 4; o++, f *= 2, a /= 2) sum += a * noise(x * f, y * f, z * f, seed + o);
  return sum / 0.9375;
}

// The world map: what's at each longitude/latitude, the clouds, and where the cities are.
function buildMap() {
  const ground = new Uint8Array(W * H);
  const clouds = new Uint8Array(W * H);
  const cities = new Uint8Array(W * H);
  for (let v = 0; v < H; v++) {
    const lat = (0.5 - (v + 0.5) / H) * Math.PI;
    for (let u = 0; u < W; u++) {
      const lon = (u / W) * 2 * Math.PI;
      const x = Math.cos(lat) * Math.sin(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.cos(lon);
      const height = fbm(x * 1.8 + 5, y * 1.8, z * 1.8, 11);
      const wet = fbm(x * 2.5, y * 2.5 + 7, z * 2.5, 23);
      const polar = Math.abs(lat) + (height - 0.5) * 0.4;
      const i = v * W + u;
      if (polar > 1.25) ground[i] = ICE;
      else if (height < SEA) ground[i] = height > SEA - 0.035 ? SHALLOW : OCEAN;
      else if (Math.abs(lat) > 0.2 && Math.abs(lat) < 0.65 && wet < 0.45) ground[i] = SAND;
      else ground[i] = wet > 0.56 ? FOREST : GRASS;
      // Clouds are stretched along the longitude, like weather bands.
      clouds[i] = fbm(x * 2.2, y * 5, z * 2.2, 37) > 0.6 ? 1 : 0;
      cities[i] = height >= SEA && ground[i] !== ICE && hash(u, v, 3, 99) < 0.07 ? 1 : 0;
    }
  }
  return { ground, clouds, cities };
}

/** Draws the globe on `canvas`. Call the returned function with the spin (in turns) and the
 *  sun's angle (radians; 0 = facing you, π = behind the globe). Redraws only when something changed. */
export function createEarth(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const { ground, clouds, cities } = buildMap();
  const image = ctx.createImageData(SIZE, SIZE);

  // Per screen pixel, once: the surface direction (normal), and where on the map it looks.
  // ring: 0 planet, 1 atmosphere, 2 outline, 3 glow (k = how far out in the glow, 0–1)
  const pixels: { i: number; nx: number; ny: number; nz: number; col: number; row: number; ring: number; k: number }[] = [];
  for (let py = 0; py < SIZE; py++) {
    for (let px = 0; px < SIZE; px++) {
      const dx = px + 0.5 - SIZE / 2, dy = py + 0.5 - SIZE / 2;
      const dist = Math.hypot(dx, dy);
      if (dist > R + 2 + HALO) continue;
      const i = (py * SIZE + px) * 4;
      if (dist > R) {
        const ring = dist > R + 2 ? 3 : dist > R + 1 ? 2 : 1;
        pixels.push({ i, nx: dx / dist, ny: -dy / dist, nz: 0, col: 0, row: 0, ring, k: (dist - R - 2) / HALO });
        continue;
      }
      const nx = dx / R, ny = -dy / R, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      // Undo the tilt to find latitude/longitude on the globe itself.
      const gx = nx * Math.cos(TILT) + ny * Math.sin(TILT), gy = -nx * Math.sin(TILT) + ny * Math.cos(TILT);
      const lat = Math.asin(Math.max(-1, Math.min(1, gy))), lon = Math.atan2(gx, nz);
      const row = Math.min(H - 1, Math.floor((0.5 - lat / Math.PI) * H));
      pixels.push({ i, nx, ny, nz, col: (lon / (2 * Math.PI)) * W, row, ring: 0, k: 0 });
    }
  }

  let last = "";
  return function draw(spin: number, sun: number) {
    const turn = Math.floor(((spin % 1) + 1) * W) % W; // map columns turned so far
    const drift = Math.floor(spin * W * 0.25) % W; // clouds lag behind a little
    const sunStep = Math.round(sun * 50) / 50;
    const key = `${turn} ${drift} ${sunStep}`;
    if (key === last) return;
    last = key;

    // Sun direction: swings around the globe, a little above it.
    const lx = Math.sin(sunStep) * 0.94, ly = 0.34, lz = Math.cos(sunStep) * 0.94;
    const d = image.data;
    for (const p of pixels) {
      const light = p.nx * lx + p.ny * ly + p.nz * lz;
      let color: number[];
      const x = (p.i / 4) % SIZE, y = Math.floor(p.i / 4 / SIZE);
      if (p.ring === 3) {
        // Glow: dithered, thinning out with distance, brightest on the sunny side.
        const strength = (1 - p.k) ** 1.6 * (0.3 + 0.7 * Math.min(1, Math.max(0, light + 0.4)));
        if (strength <= BAYER[(x & 3) + (y & 3) * 4] / 16) {
          d[p.i + 3] = 0;
          continue;
        }
        color = p.k < 0.4 ? AIR : GLOW;
      } else if (p.ring) {
        color = p.ring === 1 && light > 0.15 ? AIR : OUTLINE;
      } else {
        const lit = light + (BAYER[(x & 3) + (y & 3) * 4] / 16 - 0.5) * 0.25;
        const shade = lit > 0.45 ? 0 : lit > 0.15 ? 1 : lit > -0.05 ? 2 : 3;
        const col = (Math.floor(p.col) + turn + W) % W;
        const at = p.row * W + col;
        if (clouds[p.row * W + ((col + drift) % W)]) color = SHADES[CLOUD][shade];
        else if (shade === 3 && cities[at]) color = CITY;
        else color = SHADES[ground[at]][shade];
      }
      d[p.i] = color[0];
      d[p.i + 1] = color[1];
      d[p.i + 2] = color[2];
      d[p.i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  };
}
