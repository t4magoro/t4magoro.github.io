"use client";

import { motion } from "motion/react";

// Segmented stat bar that fills one block at a time, like an RPG menu.
// The segments are drawn by the .stat-fill background; clip-path reveals them.
export function StatBar({ value, max = 10 }: { value: number; max?: number }) {
  const hiddenPercent = 100 - (value / max) * 100;
  // Jump in whole blocks instead of sliding smoothly.
  const stepped = (t: number) => Math.floor(t * value) / value;

  return (
    <div className="border-2 border-white p-0.5">
      <motion.div
        className="stat-fill"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: `inset(0 ${hiddenPercent}% 0 0)` }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: stepped }}
      />
    </div>
  );
}