import { PixelArt } from "./PixelArt";
import { SPRITES } from "./sprites";

// [left, top, size class, twinkle delay]. Mixed sizes make it look deeper.
const STARS: [string, string, string, string][] = [
  ["4%", "8%", "w-4", "0s"],
  ["18%", "22%", "w-2", "0.7s"],
  ["30%", "6%", "w-3", "1.2s"],
  ["46%", "14%", "w-2", "0.3s"],
  ["63%", "5%", "w-5", "0.9s"],
  ["79%", "18%", "w-3", "1.5s"],
  ["93%", "9%", "w-4", "0.5s"],
  ["8%", "52%", "w-3", "1.1s"],
  ["95%", "46%", "w-2", "0.2s"],
  ["3%", "86%", "w-5", "1.4s"],
  ["22%", "93%", "w-2", "0.6s"],
  ["52%", "90%", "w-3", "1s"],
  ["74%", "84%", "w-2", "0.4s"],
  ["90%", "92%", "w-4", "1.3s"],
];

// Twinkling pixel stars covering their (positioned) parent. Decoration only.
export function StarField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {STARS.map(([left, top, size, delay]) => (
        <PixelArt
          key={left + top}
          art={SPRITES.sparkle}
          className={`twinkle absolute ${size}`}
          style={{ left, top, animationDelay: delay }}
        />
      ))}
    </div>
  );
}