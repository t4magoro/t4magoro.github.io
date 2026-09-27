// Draws the background landscape (mountains, hills, field) on a COLS x ROWS pixel grid.
// Everything is computed once at build time and becomes plain SVG paths.

export const COLS = 96;
export const ROWS = 32;
const FIELD = 6; // field height in pixels
const SNOW_LINE = 17; // mountain pixels above this height are snow

// [column, height] of each peak.
const MOUNTAIN_PEAKS: [number, number][] = [[8, 21], [27, 15], [47, 24], [68, 17], [87, 22]];
const HILL_PEAKS: [number, number][] = [[0, 11], [20, 13], [41, 10], [60, 12], [80, 14], [96, 11]];

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}z`;

// Height of every column for a mountain range. `slope` = pixels lost per column away from a peak
// (1 = steep staircase, 0.5 = gentle hill). `shaded` = column is on the right side of its peak.
function ridge(peaks: [number, number][], slope: number) {
  return Array.from({ length: COLS }, (_, x) => {
    let best = { h: 0, shaded: false };
    for (const [px, ph] of peaks) {
      const h = Math.round(ph - Math.abs(x - px) * slope);
      if (h > best.h) best = { h, shaded: x > px };
    }
    return best;
  });
}

// Turns a ridge into three paths: sunny side, shaded side, and (optionally) snow caps.
function drawRidge(peaks: [number, number][], slope: number, snowLine = Infinity) {
  let lit = "";
  let shade = "";
  let snow = "";
  ridge(peaks, slope).forEach(({ h, shaded }, x) => {
    const column = rect(x, ROWS - h, 1, h);
    if (shaded) shade += column;
    else lit += column;
    if (h > snowLine) snow += rect(x, ROWS - h, 1, Math.min(2, h - snowLine));
  });
  return { lit, shade, snow };
}

// Flat field with two darker stripes, grass tufts along the top, and pink/yellow flowers.
// The "(x * n) % m" tests scatter things unevenly but identically on every build (no Math.random).
function drawField() {
  const top = ROWS - FIELD;
  let grass = "";
  let pinkFlowers = "";
  let yellowFlowers = "";
  for (let x = 0; x < COLS; x++) {
    if ((x * 5) % 7 < 3) grass += rect(x, top - 1, 1, 1);
    if ((x * 13) % 17 < 2) pinkFlowers += rect(x, ROWS - 2 - (x % 3), 1, 1);
    if ((x * 7) % 19 < 2) yellowFlowers += rect(x, ROWS - 1 - (x % 2) * 2, 1, 1);
  }
  const base = rect(0, top, COLS, FIELD) + grass;
  const stripes = rect(0, top + 2, COLS, 1) + rect(0, top + 4, COLS, 1);
  return { base, stripes, pinkFlowers, yellowFlowers };
}

const mountains = drawRidge(MOUNTAIN_PEAKS, 1, SNOW_LINE);
const hills = drawRidge(HILL_PEAKS, 0.5);
const field = drawField();

// [path, color], painted back to front.
export const LANDSCAPE: [string, string][] = [
  [mountains.lit, "#8a9bd6"],
  [mountains.shade, "#6f80c4"],
  [mountains.snow, "#ffffff"],
  [hills.lit, "#3f9e45"],
  [hills.shade, "#34873a"],
  [field.base, "#5bc24a"],
  [field.stripes, "#52b441"],
  [field.pinkFlowers, "#f54ba3"],
  [field.yellowFlowers, "#fff15c"],
];