// Height (0–2) of each column in the jagged border.
const HEIGHTS = "210201102100012021020110200121021001202011021021".split("").map(Number);
const ROWS = 5;

type Props = {
  /** Tailwind fill class of the NEXT section, e.g. "fill-ink". */
  color: string;
  /** Fill class for the floating blocks above the edge. Defaults to `color`. */
  accent?: string;
  /** Shifts the pattern so neighbouring edges don't look identical. */
  offset?: number;
};

// Jagged pixel border at the bottom of a section, filled with the next section's color.
export function PixelEdge({ color, accent = color, offset = 0 }: Props) {
  const cols = HEIGHTS.length;
  let solid = "";
  let floating = "";

  for (let x = 0; x < cols; x++) {
    const h = HEIGHTS[(x + offset) % cols] + 1;
    solid += `M${x} ${ROWS - h}h1v${h}h-1z`;
    // Roughly every 11th column gets a lone block floating above it.
    if ((x * 7 + offset) % 11 === 0) floating += `M${x} ${ROWS - h - 2}h1v1h-1z`;
  }

  return (
    <svg viewBox={`0 0 ${cols} ${ROWS}`} shapeRendering="crispEdges" aria-hidden className="relative -mb-px block w-full">
      <path d={solid} className={color} />
      <path d={floating} className={accent} />
    </svg>
  );
}