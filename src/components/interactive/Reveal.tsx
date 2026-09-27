"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds to wait before animating. Use small steps (0.05) to stagger a list. */
  delay?: number;
  className?: string;
};

// Fades and slides content in the first time it scrolls into view.
// The server HTML is VISIBLE ("static"), so a refresh, slow JavaScript or failed JavaScript
// never shows a blank page. Only blocks that start below the screen are hidden, then revealed
// when you scroll to them. The look is in styles/animations.css ([data-reveal]).
export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let firstCheck = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState((s) => (s === "hidden" ? "shown" : s));
          observer.disconnect();
        } else if (firstCheck && entry.boundingClientRect.top > 0) {
          setState("hidden"); // starts below the screen: hide until it scrolls in
        }
        firstCheck = false;
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal={state} className={className} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}