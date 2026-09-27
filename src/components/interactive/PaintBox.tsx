"use client";

import { useRef, useState, type PointerEvent } from "react";
import { PALETTE } from "@/components/pixel/palette";
import { SPRITES } from "@/components/pixel/sprites";

const SIZE = 16; // canvas is SIZE x SIZE cells
const COLORS = [PALETTE.k, PALETTE.w, PALETTE.p, PALETTE.y, PALETTE.b, PALETTE.g];
const ERASER = "";

// Empty canvas with the heart sprite drawn in the middle.
function startCells() {
  const cells = Array<string>(SIZE * SIZE).fill(ERASER);
  SPRITES.heart.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (PALETTE[ch]) cells[(y + 4) * SIZE + x + 3] = PALETTE[ch];
    }),
  );
  return cells;
}

// Tiny paint program: click or drag (mouse or finger) to paint.
export function PaintBox() {
  const [cells, setCells] = useState(startCells);
  const [color, setColor] = useState(PALETTE.p);
  const drawing = useRef(false);

  // elementFromPoint finds the cell under the finger/mouse, even while dragging across cells.
  function paintAt(e: PointerEvent) {
    const index = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.dataset.i;
    if (index === undefined) return;
    const i = Number(index);
    setCells((prev) => (prev[i] === color ? prev : prev.map((c, j) => (j === i ? color : c))));
  }

  return (
    <div className="p-4">
      <div
        role="img"
        aria-label="Pixel canvas. Click or drag to paint."
        className="canvas-bg grid cursor-crosshair touch-none select-none border-2 border-ink"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
        onPointerDown={(e) => {
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          paintAt(e);
        }}
        onPointerMove={(e) => drawing.current && paintAt(e)}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
      >
        {cells.map((c, i) => (
          <div key={i} data-i={i} className="aspect-square" style={{ background: c || undefined }} />
        ))}
      </div>

      <Toolbar color={color} onColor={setColor} onClear={() => setCells(Array(SIZE * SIZE).fill(ERASER))} />
    </div>
  );
}

type ToolbarProps = { color: string; onColor: (c: string) => void; onClear: () => void };

function Toolbar({ color, onColor, onClear }: ToolbarProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {COLORS.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={`Paint color ${c}`}
          aria-pressed={color === c}
          onClick={() => onColor(c)}
          className="swatch size-8 border-2 border-ink"
          style={{ background: c }}
        />
      ))}
      <button type="button" aria-pressed={color === ERASER} onClick={() => onColor(ERASER)} className="swatch chip-btn">
        Erase
      </button>
      <button type="button" onClick={onClear} className="chip-btn ml-auto">
        Clear
      </button>
    </div>
  );
}