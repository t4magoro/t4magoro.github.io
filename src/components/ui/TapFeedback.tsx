"use client";

import { useEffect } from "react";

const TAP_MS = 250; // how long a tapped card stays lifted

// Tap animations for phones:
// 1. iPhone Safari only shows CSS :active styles when the page listens for touches (empty listener).
// 2. Android Chrome ignores :active on plain boxes like the inventory cards. So on every tap/click
//    we briefly mark the card with data-tapped, and CSS gives it the hover lift (styles/surfaces.css).
//    "click" only fires for real taps, not while scrolling, so cards don't jump as you scroll past.
export function TapFeedback() {
  useEffect(() => {
    const noop = () => {};
    const onClick = (e: MouseEvent) => {
      const card = e.target instanceof Element ? e.target.closest<HTMLElement>(".lift") : null;
      if (!card) return;
      card.dataset.tapped = "";
      window.setTimeout(() => delete card.dataset.tapped, TAP_MS);
    };
    document.addEventListener("touchstart", noop, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("touchstart", noop);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}