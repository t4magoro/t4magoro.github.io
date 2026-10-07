"use client";

import { motion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

// Tap to make the content jump (used for the hero robot, see .hop in styles/animations.css).
// Or grab it: it stretches on a rubber band and, when you let go, springs home at the speed you threw it.
// Changing `key` re-creates the inner div, which restarts the jump on every tap.
export function Hop({ children, label }: { children: ReactNode; label: string }) {
  const [hops, setHops] = useState(0);
  const dragged = useRef(false); // a throw ends with a click too: don't jump on that one

  return (
    <motion.button
      type="button"
      aria-label={label}
      drag
      // Pinned at its spot; dragElastic = how far it stretches (0.5 = half as far as your finger).
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.5}
      // Bouncy on purpose: a throw carries momentum, so a little overshoot feels right.
      dragTransition={{ bounceStiffness: 400, bounceDamping: 14 }}
      whileDrag={{ scale: 1.1, rotate: -8 }}
      onPointerDown={() => (dragged.current = false)}
      onDragStart={() => (dragged.current = true)}
      onClick={() => !dragged.current && setHops((n) => n + 1)}
      className="block w-full cursor-grab active:cursor-grabbing"
    >
      <div key={hops} className={hops > 0 ? "hop" : undefined}>
        {children}
      </div>
    </motion.button>
  );
}
