// Height (0–2) of each column in the jagged border.
const HEIGHTS = "210201102100012021020110200121021001202011021021".split("").map(Number);
const ROWS = 5;

type Props = {
  /** Tailwind fill class of the NEXT section, e.g. "fill-lemon". */
  color?: string;
  /** Use instead of `color` for an edge at the TOP of a dark section: the fill class of the section
   *  above. The part above the columns is drawn in it and the columns stay see-through, so the space
   *  behind the page (stars, Earth) shows through the black blocks. */
  above?: string;
  /** Fill class for the floating blocks above the edge. Defaults to `color`. */
  accent?: string;
  /** Shifts the pattern so neighbouring edges don't look identical. */
  offset?: number;
};

// Jagged pixel border between two sections: columns in the next section's color rising into this one.
export function PixelEdge({ color, above, accent = color, offset = 0 }: Props) {
  const cols = HEIGHTS.length;
  let solid = "";
  let top = "";
  let floating = "";

  for (let x = 0; x < cols; x++) {
    const h = HEIGHTS[(x + offset) % cols] + 1;
    solid += `M${x} ${ROWS - h}h1v${h}h-1z`;
    top += `M${x} 0h1v${ROWS - h}h-1z`;
    // Roughly every 11th column gets a lone block floating above it.
    if ((x * 7 + offset) % 11 === 0) floating += `M${x} ${ROWS - h - 2}h1v1h-1z`;
  }

  return (
    // The overlap into the neighbouring section hides the hairline seam a fractional pixel position leaves.
    // Not positioned on purpose: the moving section background (Backdrop) paints over it, so its
    // blocks carry on across the jagged border instead of disappearing behind it.
    <svg
      viewBox={`0 0 ${cols} ${ROWS}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={`block w-full ${above ? "-mt-[2px]" : "-mb-px"}`}
    >
      {above ? <path d={top} className={above} /> : <path d={solid} className={color} />}
      <path d={floating} className={accent} />
    </svg>
  );
}