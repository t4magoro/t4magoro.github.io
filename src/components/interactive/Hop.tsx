"use client";

import { useState, type ReactNode } from "react";

// Tap or click to make the content jump (used for the hero robot). See .hop in styles/animations.css.
// Changing `key` re-creates the inner div, which restarts the animation on every tap.
export function Hop({ children, label }: { children: ReactNode; label: string }) {
  const [hops, setHops] = useState(0);

  return (
    <button type="button" aria-label={label} onClick={() => setHops((n) => n + 1)} className="block w-full cursor-pointer">
      <div key={hops} className={hops > 0 ? "hop" : undefined}>
        {children}
      </div>
    </button>
  );
}