"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

// [label, href]. "/#id" jumps to a section on the home page, and works from any page.
// Each id must match the `id` of a section.
const LINKS = [
  ["About", "/#about"],
  ["Items", "/#items"],
  ["Code", "/#code"],
  ["Quests", "/#quests"],
  ["Badges", "/#badges"],
  ["Projects", "/#projects"],
  ["Art", "/#art"],
  ["Gallery", "/art"],
  ["Contact", "/#contact"],
];

// Sticky top bar, shared by all pages. On phones the tabs scroll sideways instead of wrapping.
// Frosted glass, so the page shows through as it scrolls under. A lemon pill springs to the tab of
// the section you're reading (aria-current), and an XP bar along the bottom fills in blocks as you
// scroll down the page. Styles: styles/motion.css.
export function Nav() {
  const pathname = usePathname();
  const [section, setSection] = useState("");
  const list = useRef<HTMLUListElement>(null);
  // Home page: the section in view ("/#about"). Other pages: the page itself ("/art").
  const current = pathname === "/" ? `/#${section}` : pathname;

  // Which section crosses a thin line across the middle of the screen. The hero ("top") matches no tab.
  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSection(e.target.id)),
      { rootMargin: "-50% 0px -49% 0px" },
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  // Phones: slide the current tab into view. Scrolls only the tab strip, never the page.
  useEffect(() => {
    const ul = list.current;
    const tab = ul?.querySelector<HTMLElement>("[aria-current]");
    if (!ul || !tab) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ul.scrollTo({ left: tab.offsetLeft - (ul.clientWidth - tab.offsetWidth) / 2, behavior: still ? "auto" : "smooth" });
  }, [current]);

  return (
    <nav className="nav-glass sticky top-0 z-50 flex items-center gap-4 px-4 py-2.5">
      <Link href="/" className="shrink-0 font-pixel text-sm text-lemon">
        IQBAL.EXE
      </Link>
      <MotionConfig reducedMotion="user">
        <ul ref={list} className="relative ml-auto flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="nav-tab relative" aria-current={href === current ? "location" : undefined}>
                {/* Same layoutId on every tab = one pill that glides between them. No bounce: it just arrives. */}
                {href === current && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-lemon"
                    transition={{ type: "spring", bounce: 0, visualDuration: 0.35 }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </MotionConfig>
      <span aria-hidden className="xp" />
    </nav>
  );
}
