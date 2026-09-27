"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useSpring } from "motion/react";

// How far (px) the sprite can drift from its resting spot.
const RANGE_X = 80;
const RANGE_Y = 40;
const SPRING = { stiffness: 100, damping: 10 };

// Drifts its children toward the pointer on a spring.
// Mouse: follows the cursor anywhere on the page.
// Touch screens: springs toward each tap inside its section (the hero). Taps, not touches,
// so scrolling through the hero doesn't drag it around. Off for people who prefer reduced motion.
export function FollowSprite({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const transform = useMotionTemplate`translate(${x}px, ${y}px)`;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const moveTo = (e: Event) => {
      const { clientX, clientY, detail } = e as MouseEvent;
      if (e.type === "click" && detail === 0) return; // keyboard "click" (Enter) has no position
      x.set((clientX / innerWidth - 0.5) * RANGE_X);
      y.set((clientY / innerHeight - 0.5) * RANGE_Y);
    };

    const mouse = matchMedia("(pointer: fine)").matches;
    const target: EventTarget = mouse ? window : (ref.current?.closest("section") ?? window);
    const type = mouse ? "pointermove" : "click";
    target.addEventListener(type, moveTo);
    return () => target.removeEventListener(type, moveTo);
  }, [x, y]);

  return (
    <motion.div ref={ref} className={className} style={{ transform }}>
      {children}
    </motion.div>
  );
}