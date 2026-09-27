"use client";

import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent } from "react";
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

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={dir === "prev" ? "Previous" : "Next"} className="btn">
      <PixelArt art={SPRITES.play} className={`w-3 ${dir === "prev" ? "-scale-x-100" : ""}`} />
    </button>
  );
}

// Full-screen picture viewer built on the native <dialog>: it closes on Esc, keeps keyboard focus
// inside while open, and returns focus to the clicked card when it closes. Styles: styles/lightbox.css.
export function Lightbox({ items, index, onChange }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  // Keep the dialog open/closed in sync with `index`.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const count = items.length;
  // Wraps around: "next" on the last piece goes back to the first.
  const step = (by: number) => {
    if (index !== null) onChange((index + by + count) % count);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  };
  const item = index === null ? null : items[index];

  return (
    <dialog ref={dialog} className="lightbox" aria-labelledby="lightbox-title" onClose={() => onChange(null)} onKeyDown={onKeyDown}>
      <StarField />
      {item && (
        // Phones: window on top, arrows below. sm and up: ◀ window ▶ in one row.
        // Clicking the empty space around the window closes the viewer.
        <div
          className="relative flex h-full flex-wrap content-center items-center justify-between gap-4 p-4 sm:flex-nowrap sm:p-10"
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
        >
          <button type="button" onClick={() => onChange(null)} className="btn absolute right-4 top-4">
            Close
          </button>

          {count > 1 && <ArrowButton dir="prev" onClick={() => step(-1)} />}

          <Window
            title={`${(index ?? 0) + 1} / ${count}`}
            className="lightbox-panel order-first w-full shadow-[8px_8px_0_var(--color-pink)] sm:order-none sm:max-w-4xl"
          >
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

          {count > 1 && <ArrowButton dir="next" onClick={() => step(1)} />}
        </div>
      )}
    </dialog>
  );
}