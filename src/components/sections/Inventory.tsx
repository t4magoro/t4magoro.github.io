import { Reveal } from "@/components/interactive/Reveal";
import { PixelArt } from "@/components/pixel/PixelArt";
import { PixelEdge } from "@/components/pixel/PixelEdge";
import { SPRITES, type SpriteName } from "@/components/pixel/sprites";
import { Section, SectionHeader } from "@/components/ui/Section";
import { inventory, type Item } from "@/content/skills";

// "hardware + a plan = shipped!", a nod to the "egg + clock" equation on the Tamagotchi page.
const EQUATION: [SpriteName, string][] = [
  ["chip", "hardware"],
  ["clipboard", "a plan"],
  ["robot", "shipped!"],
];

// The card sits on a black block (the Reveal's bg-ink); .lift raises it off on hover.
function ItemCard({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={index * 0.05} className="h-full bg-ink">
      <div className="lift flex h-full flex-col items-center gap-3 border-4 border-ink bg-white p-4 text-center sm:p-6">
        <PixelArt art={SPRITES[item.icon]} className="h-12 w-auto sm:h-16" />
        <h3 className="font-pixel text-sm font-bold uppercase sm:text-base">{item.name}</h3>
        <p className="text-xs leading-relaxed sm:text-sm">{item.note}</p>
      </div>
    </Reveal>
  );
}

function Equation() {
  return (
    <Reveal className="mt-16 flex items-center justify-center gap-3 font-pixel text-2xl sm:gap-6 sm:text-4xl">
      {EQUATION.map(([icon, label], i) => (
        <div key={icon} className="contents">
          {i > 0 && <span aria-hidden>{i === 1 ? "+" : "="}</span>}
          <figure className="flex flex-col items-center">
            <PixelArt art={SPRITES[icon]} className="h-14 w-auto sm:h-20" />
            <figcaption className="mt-2 font-mono text-xs">{label}</figcaption>
          </figure>
        </div>
      ))}
    </Reveal>
  );
}

export function Inventory() {
  return (
    <Section id="items" className="bg-lemon" edge={<PixelEdge color="fill-ink" accent="fill-pink" offset={21} />}>
      <SectionHeader title="Inventory" sub="Items collected so far." className="text-center" />

      <ul className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3">
        {inventory.map((item, i) => (
          <li key={item.name}>
            <ItemCard item={item} index={i} />
          </li>
        ))}
      </ul>

      <Equation />
    </Section>
  );
}