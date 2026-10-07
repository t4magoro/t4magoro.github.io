import { Reveal } from "@/components/interactive/Reveal";
import { StatBar } from "@/components/interactive/StatBar";
import { PixelEdge } from "@/components/pixel/PixelEdge";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";
import { languages, toolkits, type Language } from "@/content/languages";

function LanguageCard({ lang, index }: { lang: Language; index: number }) {
  return (
    <Reveal delay={index * 0.05} className="h-full">
      <div className="glass flex h-full flex-col gap-4 border-4 border-white p-4">
        <div className="flex items-center gap-3">
          <span className={`grid size-12 shrink-0 place-items-center font-pixel text-xs font-bold text-ink ${lang.color}`}>
            {lang.short}
          </span>
          <h3 className="font-pixel text-sm font-bold uppercase leading-tight">{lang.name}</h3>
        </div>
        <div>
          <p className="mb-1 text-right font-pixel text-xs text-lemon">Lv {lang.level}/10</p>
          <StatBar value={lang.level} />
        </div>
        <p className="text-xs leading-relaxed text-white/75">{lang.note}</p>
      </div>
    </Reveal>
  );
}

// Frameworks & tools. Pink shadow, because the usual black one would vanish on this background.
function Toolkit() {
  return (
    <Reveal className="mt-12">
      <Window title="equipment.cfg" className="shadow-[6px_6px_0_var(--color-pink)]">
        <ul className="space-y-4 p-5 sm:p-6">
          {toolkits.map(({ label, tools }) => (
            <li key={label} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="w-28 shrink-0 font-pixel text-xs uppercase">{label}</span>
              <ul className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <li key={tool} className="bg-lemon px-2 py-0.5 text-xs">
                    {tool}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Window>
    </Reveal>
  );
}

// Programming languages + frameworks/tools, kept apart from the general skills in Inventory.
export function Languages() {
  return (
    <Section
      id="code"
      className="text-white"
      top={<PixelEdge above="fill-lemon" accent="fill-pink" offset={21} />}
      edge={<PixelEdge color="fill-paper" accent="fill-lemon" offset={27} />}
    >
      <SectionHeader title="Spellbook" sub="Programming languages I've mastered, and the gear I build with." />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {languages.map((lang, i) => (
          <li key={lang.name}>
            <LanguageCard lang={lang} index={i} />
          </li>
        ))}
      </ul>

      <Toolkit />
    </Section>
  );
}