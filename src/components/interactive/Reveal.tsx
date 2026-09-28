"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds to wait before fading in. Use small steps (0.05) to stagger a list. */
  delay?: number;
  className?: string;
};

// Fades content in when it scrolls up past a line at 85% of the screen height, and back out when
// it drops below that line again (scrolling up). Blocks you scrolled past at the top stay visible.
// The server HTML is VISIBLE ("static"), so a refresh, slow JavaScript or failed JavaScript never
// shows a blank page. States: static (as sent by the server), waiting (hidden since page load),
// shown (faded in), hidden (faded out). The look is in styles/animations.css ([data-reveal]).
export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "waiting" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let firstCheck = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState((s) => (s === "waiting" || s === "hidden" ? "shown" : s));
        } else if (entry.boundingClientRect.top > 0) {
          // Below the line. At page load hide it instantly ("waiting", no fade-out on load);
          // later, when you scroll up, fade it out ("hidden").
          setState(firstCheck ? "waiting" : "hidden");
        }
        firstCheck = false;
      },
      { rootMargin: "0px 0px -15% 0px" }, // the "line": 15% above the bottom of the screen
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