import { StatBar } from "@/components/interactive/StatBar";
import { playerCard, profile } from "@/content/profile";
import { stats } from "@/content/skills";
import { Avatar } from "./Avatar";

// RPG-style character sheet: portrait + name, info rows, then stat bars.
// Frosted glass (.glass in styles/motion.css): stars and the Earth blur behind it.
export function PlayerCard() {
  return (
    <div className="glass border-4 border-white p-5 font-pixel text-xs sm:text-sm">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 sm:w-24" />
        <div>
          <p className="text-lemon">Player card</p>
          <p className="mt-2 text-base font-bold sm:text-lg">{profile.name}</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        {playerCard.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-white/50">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 space-y-3">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="mb-1 flex justify-between">
              <span>{s.label}</span>
              <span className="text-lemon">{s.value}/10</span>
            </div>
            <StatBar value={s.value} />
          </div>
        ))}
      </div>
    </div>
  );
}