import Link from "next/link";

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
export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center gap-4 bg-ink px-4 py-2.5">
      <Link href="/" className="shrink-0 font-pixel text-sm text-lemon">
        IQBAL.EXE
      </Link>
      <ul className="ml-auto flex gap-2 overflow-x-auto [scrollbar-width:none]">
        {LINKS.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="nav-tab">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}