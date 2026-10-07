import { Reveal } from "@/components/interactive/Reveal";
import { Window } from "@/components/ui/Window";
import type { Quest } from "@/content/experience";

// One job on the timeline. The square marker sits on the dashed line of the parent <ol>
// (its left offset = the list's padding + half the line width + half the marker).
export function QuestCard({ quest }: { quest: Quest }) {
  const { role, org, period, active, points } = quest;

  return (
    <li className="relative">
      <span
        aria-hidden
        className={`quest-mark absolute -left-[34px] top-5 size-4 border-2 border-ink sm:-left-[50px] ${active ? "bg-pink" : "bg-white"}`}
      />
      <Reveal>
        <Window title={period} className="shadow-px max-w-3xl">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-pixel text-lg font-bold uppercase leading-tight sm:text-xl">{role}</h3>
                <p className="mt-1 text-sm text-ink/70">{org}</p>
              </div>
              <span
                className={`px-2 py-1 font-pixel text-xs uppercase ${active ? "bg-pink text-white" : "bg-ink text-lemon"}`}
              >
                {active ? "In progress" : "Cleared"}
              </span>
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-relaxed">
              {points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-pink" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Window>
      </Reveal>
    </li>
  );
}