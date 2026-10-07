"use client";

import Image from "next/image";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { PixelArt } from "@/components/pixel/PixelArt";
import { SPRITES } from "@/components/pixel/sprites";
import { StarField } from "@/components/pixel/StarField";
import { Window } from "@/components/ui/Window";

/** Anything with a picture can be shown: artworks, certificates, ... */
export type LightboxItem = {
  src: string;
  title: string;
  year?: string;
  description?: string;
  alt: string;
};

type Props = {
  items: LightboxItem[];
  /** Which item is shown. null = closed. */
  index: number | null;
  onChange: (index: number | null) => void;
};

// A flick counts as "next" when its projected landing spot is this far (px) from the middle.
const SWIPE = 120;
// How long closing takes; matches .lightbox[data-closing] in styles/lightbox.css.
const CLOSE_MS = 240;
// Pieces slide in from the side you're heading to and out the other side. dir: 1 = next, -1 = previous.
const SLIDE = {
  enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -300, opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } }),
};

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={dir === "prev" ? "Previous" : "Next"} className="btn">
      <PixelArt art={SPRITES.play} className={`w-3 ${dir === "prev" ? "-scale-x-100" : ""}`} />
    </button>
  );
}

// Full-screen picture viewer built on the native <dialog>: it closes on Esc, keeps keyboard focus
// inside while open, and returns focus to the clicked card when it closes. Styles: styles/lightbox.css.
// It grows out of the card that opened it and shrinks back into it when it closes. Drag or flick the
// picture sideways to change it.
export function Lightbox({ items, index, onChange }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const dragged = useRef(false); // a drag ends with a click too: don't close the viewer on that one
  const [dir, setDir] = useState(0);

  // Keep the dialog open/closed in sync with `index`.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) {
      // Grow out of the card that opened it. A focused button = keyboard or most mouse clicks;
      // otherwise (Safari mouse clicks) the pointerdown below already saved the spot.
      const opener = document.activeElement;
      if (opener instanceof HTMLButtonElement) {
        const b = opener.getBoundingClientRect();
        d.style.setProperty("--from", `${b.left + b.width / 2}px ${b.top + b.height / 2}px`);
      }
      d.showModal();
    }
    if (index === null && d.open) {
      delete d.dataset.closing;
      d.close();
    }
  }, [index]);

  // Remember where each click starts, for the grow-from-card animation (--from).
  useEffect(() => {
    const d = dialog.current;
    const remember = (e: PointerEvent) => {
      if (d && !d.open) d.style.setProperty("--from", `${e.clientX}px ${e.clientY}px`);
    };
    addEventListener("pointerdown", remember, true);
    return () => removeEventListener("pointerdown", remember, true);
  }, []);

  // Play the shrink-back animation first, then really close.
  const close = (e?: SyntheticEvent) => {
    e?.preventDefault(); // Esc: stop the browser's instant close
    const d = dialog.current;
    if (!d?.open || d.dataset.closing !== undefined) return;
    d.dataset.closing = "";
    setTimeout(() => onChange(null), CLOSE_MS);
  };

  const count = items.length;
  // Wraps around: "next" on the last piece goes back to the first.
  const step = (by: number) => {
    if (index === null) return;
    setDir(by);
    onChange((index + by + count) % count);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  };
  const item = index === null ? null : items[index];

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-labelledby="lightbox-title"
      onCancel={close}
      onClose={() => {
        setDir(0);
        onChange(null);
      }}
      onKeyDown={onKeyDown}
    >
      <StarField />
      {item && (
        // Phones: window on top, arrows below. sm and up: ◀ window ▶ in one row.
        // Clicking the empty space around the window closes the viewer.
        <div
          className="lightbox-stage relative flex h-full flex-wrap content-center items-center justify-between gap-4 p-4 sm:flex-nowrap sm:p-10"
          onPointerDown={() => (dragged.current = false)}
          onClick={(e) => e.target === e.currentTarget && !dragged.current && close()}
        >
          <button type="button" onClick={() => close()} className="btn absolute right-4 top-4">
            Close
          </button>

          {count > 1 && <ArrowButton dir="prev" onClick={() => step(-1)} />}

          {/* Reduced motion: no sliding, the pieces only cross-fade. */}
          <MotionConfig reducedMotion="user">
            {/* popLayout: the old piece leaves while the new one takes its place. */}
            <AnimatePresence initial={false} mode="popLayout" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                variants={SLIDE}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", bounce: 0, visualDuration: 0.3 }}
                className="order-first w-full sm:order-none sm:max-w-4xl"
                drag={count > 1 ? "x" : false}
                // Pinned to the middle but stretchy 1:1 (elastic 1): it follows the finger, then springs back.
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={(_, { offset, velocity }) => {
                  // Where the flick would coast to (Apple's momentum projection, ≈ velocity × 0.5 s), not
                  // just where the finger let go. A quick short flick counts as much as a long slow drag.
                  const landing = offset.x + velocity.x * 0.5;
                  if (landing < -SWIPE) step(1);
                  else if (landing > SWIPE) step(-1);
                }}
              >
                <Window title={`${(index ?? 0) + 1} / ${count}`} className="w-full shadow-[8px_8px_0_var(--color-pink)]">
                  <div className="relative aspect-video max-h-[60vh] w-full bg-paper">
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 896px) 100vw, 896px" className="object-contain" />
                  </div>
                  <div className="max-w-prose p-4 sm:p-5">
                    <h2 id="lightbox-title" className="font-pixel text-lg font-bold uppercase">
                      {item.title}
                      {item.year && ` · ${item.year}`}
                    </h2>
                    {item.description && <p className="mt-2 text-sm leading-relaxed">{item.description}</p>}
                  </div>
                </Window>
              </motion.div>
            </AnimatePresence>
          </MotionConfig>

          {count > 1 && <ArrowButton dir="next" onClick={() => step(1)} />}
        </div>
      )}
    </dialog>
  );
}
