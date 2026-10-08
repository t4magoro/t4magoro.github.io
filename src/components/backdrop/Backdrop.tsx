"use client";

import { useEffect, useRef } from "react";
import { R as GLOBE_R, SIZE as GLOBE_SIZE } from "@/components/pixel/globe";
import { assemble } from "./assemble";
import { PX, SECTIONS, type Area, type Box, type Color } from "./frame";

// Clicks on these are for the content, not the background.
const CONTENT = "a, button, input, textarea, select, summary, label, dialog, [role='img']";

// Middle of a jagged section edge (an <svg> PixelEdge), where one section's colors hand over to the next.
const edgeMiddle = (el: Element | null | undefined) => {
  if (!(el instanceof SVGSVGElement)) return null;
  const r = el.getBoundingClientRect();
  return r.top + r.height / 2;
};

// The moving background of the home page, from About to "Continue?" (assemble.ts). One canvas
// covers the screen, above the section colors and their jagged edges but under all the content
// (page.tsx), drawn at 1/4 size and scaled up so it's pixel art.
export function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const paint = assemble();
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = SECTIONS.flatMap((s) => {
      const el = document.getElementById(s.id);
      return el ? [{ ...s, el }] : [];
    });
    const globe = document.querySelector("canvas.earth");
    // Each section's heading: its text, not the full-width line (for the emblems beside them).
    const headings = sections.map(({ el }) => el.querySelector("h2"));
    const range = document.createRange();
    // Text on the black space sections: blocks passing behind it fade and the Earth dims, so the
    // words stay readable over a bright planet.
    const texts = [...document.querySelectorAll(SECTIONS.filter((s) => s.space).map((s) => `#${s.id} :is(h2, h3, p, dl, footer)`).join(", "))];

    let taps: { x: number; y: number }[] = [];
    let mouse: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (!(e.target instanceof Element && e.target.closest(CONTENT))) taps.push({ x: e.clientX, y: e.clientY });
    };
    const onMove = (e: PointerEvent) => (mouse = e.pointerType === "mouse" ? { x: e.clientX, y: e.clientY } : null);
    const onLeave = () => (mouse = null);
    addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    const start = performance.now();
    let before = start, last = scrollY, v = 0, w = 0, h = 0, frame = 0;
    // The painter writes into one pixel buffer that goes to the canvas once per frame: thousands of
    // single-pixel writes are cheap, thousands of separate canvas draw calls are not.
    let image = ctx.createImageData(1, 1);
    let mask = new Uint8Array(1); // 1 = inside a section, so nothing is drawn over the hero or the sky
    let soft = new Uint8Array(1); // behind text on a space section: 2 = the text itself, 1 = a 2px rim
    const put = (x: number, y: number, pw: number, ph: number, c: Color, alpha = 1) => {
      const d = image.data, a = Math.round(alpha * 255), faded = Math.round(alpha * 64);
      const x0 = Math.max(0, Math.round(x)), y0 = Math.max(0, Math.round(y));
      const x1 = Math.min(w, Math.round(x) + pw), y1 = Math.min(h, Math.round(y) + ph);
      for (let yy = y0; yy < y1; yy++)
        for (let xx = x0, i = yy * w + xx; xx < x1; xx++, i++) {
          if (!mask[i]) continue;
          d[i * 4] = c[0];
          d[i * 4 + 1] = c[1];
          d[i * 4 + 2] = c[2];
          d[i * 4 + 3] = soft[i] ? faded : a;
        }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!innerWidth || !innerHeight) return; // hidden or minimized window: nothing to draw yet
      const dt = Math.min(now - before, 100) / 1000;
      before = now;
      const nw = Math.ceil(innerWidth / PX), nh = Math.ceil(innerHeight / PX) + 1;
      if (nw !== w || nh !== h) {
        canvas.width = w = nw;
        canvas.height = h = nh;
        canvas.style.width = `${w * PX}px`;
        canvas.style.height = `${h * PX}px`;
        image = ctx.createImageData(w, h);
        mask = new Uint8Array(w * h);
        soft = new Uint8Array(w * h);
      }
      // Scroll speed, smoothed so one jumpy frame doesn't jerk the motion.
      const raw = dt > 0 ? (scrollY - last) / PX / dt : 0;
      last = scrollY;
      v += (raw - v) * (1 - Math.exp(-dt / 0.15));
      // Whole art pixels for the drawing; the leftover fraction moves the canvas itself, so the
      // pixels stay crisp but the background still scrolls smoothly with the page.
      const top = Math.floor(scrollY / PX), shift = scrollY - top * PX;
      canvas.style.transform = `translateY(${-shift}px)`;
      const toRow = (clientY: number) => (clientY + shift) / PX;

      // Every section, even off screen: the painter plans its scenes and hand-offs around them.
      const areas: Area[] = sections.map(({ id, tones, space, el }, i) => {
        const r = el.getBoundingClientRect();
        const y0 = edgeMiddle(el.previousElementSibling) ?? edgeMiddle(el.previousElementSibling?.lastElementChild) ?? r.top;
        const y1 = edgeMiddle(el.lastElementChild) ?? edgeMiddle(el.nextElementSibling) ?? r.bottom;
        const h2 = headings[i];
        let heading: Box | undefined;
        if (h2) {
          range.selectNodeContents(h2);
          const b = range.getBoundingClientRect();
          heading = { x0: b.left / PX, x1: b.right / PX, y0: toRow(b.top), y1: toRow(b.bottom) };
        }
        return { id, tones, space, heading, x0: r.left / PX, x1: r.right / PX, y0: toRow(y0), y1: toRow(y1) };
      });
      const g = globe?.getBoundingClientRect();
      const earth = g ? { x: (g.left + g.width / 2) / PX, y: toRow(g.top + g.height / 2), r: (g.width * GLOBE_R) / GLOBE_SIZE / PX } : null;

      const pressed = taps.map((p) => ({ x: p.x / PX, y: toRow(p.y) }));
      taps = [];
      image.data.fill(0);
      mask.fill(0);
      for (const a of areas) {
        const x0 = Math.max(0, Math.round(a.x0)), x1 = Math.min(w, Math.round(a.x1));
        for (let y = Math.max(0, Math.round(a.y0)); y < Math.min(h, Math.round(a.y1)); y++) mask.fill(1, y * w + x0, y * w + x1);
      }
      // The shadow follows each line of text (not the paragraph's box): a 2px rim, then the line.
      soft.fill(0);
      const lines: DOMRect[] = [];
      for (const el of texts) {
        const box = el.getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight) continue;
        range.selectNodeContents(el);
        lines.push(...range.getClientRects());
      }
      for (const [grow, level] of [[2, 1], [0, 2]])
        for (const r of lines) {
          const x0 = Math.max(0, Math.floor(r.left / PX) - grow), x1 = Math.min(w, Math.ceil(r.right / PX) + grow);
          for (let y = Math.max(0, Math.floor(toRow(r.top)) - grow); y < Math.min(h, Math.ceil(toRow(r.bottom)) + grow); y++)
            soft.fill(level, y * w + x0, y * w + x1);
        }
      if (areas.some((a) => a.y1 > 0 && a.y0 < h))
        paint({
          w,
          h,
          t: still ? 0 : (now - start) / 1000,
          dt: still ? 0 : dt,
          still,
          top,
          v: still ? 0 : v,
          areas,
          earth,
          taps: pressed,
          pointer: mouse && { x: mouse.x / PX, y: toRow(mouse.y) },
          put,
        });
      // The Earth's back shadow: where text crosses the planet, a dark plate dims it behind the
      // words (60% over the text, a dithered 45% on the rim), like the asteroids fading there.
      if (earth) {
        const d = image.data, reach = (earth.r * GLOBE_SIZE) / (2 * GLOBE_R), r2 = reach * reach;
        for (let y = Math.max(0, Math.floor(earth.y - reach)); y < Math.min(h, earth.y + reach); y++)
          for (let x = Math.max(0, Math.floor(earth.x - reach)); x < Math.min(w, earth.x + reach); x++) {
            const i = y * w + x, level = soft[i];
            if (!level || !mask[i] || d[i * 4 + 3] || (x - earth.x) ** 2 + (y - earth.y) ** 2 > r2) continue;
            if (level === 1 && (x + y) & 1) continue;
            d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 20;
            d[i * 4 + 3] = level === 2 ? 153 : 115;
          }
      }
      ctx.putImageData(image, 0, 0);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 [image-rendering:pixelated]" />;
}
