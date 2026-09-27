"use client";

import { useEffect } from "react";

// Makes casual saving of pictures harder: no right-click "Save image as" and no dragging
// images to the desktop. Works together with the img rules in styles/theme.css (long-press on phones).
// This is a DETERRENT, not protection: anything shown on a public page can still be screenshotted
// or pulled from DevTools. Never upload anything you aren't OK with being public.
export function ImageGuard() {
  useEffect(() => {
    const block = (e: Event) => {
      if (e.target instanceof Element && e.target.closest("img")) e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);

  return null;
}