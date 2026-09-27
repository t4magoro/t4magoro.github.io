import { Clouds, type Cloud } from "./Clouds";
import { COLS, LANDSCAPE, ROWS } from "./landscape";

// Kept in the top part of the sky, above the mountains.
const SKY_CLOUDS: Cloud[] = [
  { top: "4%", w: "16%", duration: "90s", delay: "-20s" },
  { top: "14%", w: "9%", duration: "60s", delay: "-45s" },
  { top: "24%", w: "13%", duration: "110s", delay: "-80s" },
  { top: "9%", w: "7%", duration: "50s", delay: "-5s" },
  { top: "32%", w: "11%", duration: "75s", delay: "-60s" },
];

// Whole-page background: sky, drifting clouds, and a pixel landscape pinned to the bottom.
// `fixed` + `-z-10` keeps it behind everything and still while the page scrolls.
// "slice" scales it like background-size: cover, so pixels stay square on any screen.
export function Scenery() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-linear-to-b from-sky to-sky-soft">
      <Clouds clouds={SKY_CLOUDS} />
      <svg
        viewBox={`0 0 ${COLS} ${ROWS}`}
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
        className="absolute inset-x-0 bottom-0 h-[55vh] w-full"
      >
        {LANDSCAPE.map(([d, color]) => (
          <path key={color} d={d} fill={color} />
        ))}
      </svg>
    </div>
  );
}