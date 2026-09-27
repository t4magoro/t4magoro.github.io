"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useMotionTemplate, useSpring } from "motion/react";

// How far (px) the sprite can drift from its resting spot.
const RANGE_X = 80;
const RANGE_Y = 40;
const SPRING = { stiffness: 100, damping: 10 };

// Drifts its children toward the mouse on a spring.
// Skipped on touch screens and for people who prefer reduced motion.
export function FollowSprite({ children, className }: { children: ReactNode; className?: string }) {
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const transform = useMotionTemplate`translate(${x}px, ${y}px)`;

  useEffect(() => {
    if (!matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / innerWidth - 0.5) * RANGE_X);
      y.set((e.clientY / innerHeight - 0.5) * RANGE_Y);
    };
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div className={className} style={{ transform }}>
      {children}
    </motion.div>
  );
}