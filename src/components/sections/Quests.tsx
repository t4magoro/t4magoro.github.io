import { Reveal } from "@/components/interactive/Reveal";
import { PixelArt } from "@/components/pixel/PixelArt";
import { PixelEdge } from "@/components/pixel/PixelEdge";
import { SPRITES } from "@/components/pixel/sprites";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";
import { achievements, quests } from "@/content/experience";
import { QuestCard } from "./QuestCard";

function Achievements() {
  return (
    <Reveal className="mt-16">
      <Window title="achievements.txt" className="shadow-px">
        <ul className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          {achievements.map((a) => (
            <li key={a} className="flex items-start gap-3 text-sm leading-relaxed">
              <PixelArt art={SPRITES.trophy} className="mt-0.5 w-6 shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      </Window>
    </Reveal>
  );
}

// Experience as a timeline: a dashed line with one window per job. The line gets painted pink as
// you read down it, and each marker lights up as you pass it (.quest-path in motion-c.css).
export function Quests() {
  return (
    <Section
      id="quests"
      className="dither bg-paper"
      edge={<PixelEdge color="fill-grass" accent="fill-pink" offset={33} />}
    >
      <SectionHeader title="Quest log" sub="Where I've been leveling up." />

      <ol className="quest-path relative mt-12 space-y-10 border-l-4 border-dashed border-ink pl-6 sm:pl-10">
        {quests.map((q) => (
          <QuestCard key={q.role} quest={q} />
        ))}
      </ol>

      <Achievements />
    </Section>
  );
}