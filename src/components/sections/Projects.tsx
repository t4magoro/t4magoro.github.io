import { Reveal } from "@/components/interactive/Reveal";
import { PixelArt } from "@/components/pixel/PixelArt";
import { PixelEdge } from "@/components/pixel/PixelEdge";
import { SPRITES } from "@/components/pixel/sprites";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Window } from "@/components/ui/Window";
import { projects, type Project } from "@/content/projects";

// "Hand Sign Radar" -> "hand-sign-radar.sav"
const toFileName = (name: string) => `${name.toLowerCase().replaceAll(" ", "-")}.sav`;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { name, icon, solo, blurb, tags, repo, live } = project;

  return (
    <Reveal delay={index * 0.06} className="h-full bg-ink">
      <Window title={toFileName(name)} className="lift h-full">
        <div className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <PixelArt art={SPRITES[icon]} className="h-14 w-auto" />
            <span className={`px-2 py-1 font-pixel text-xs uppercase ${solo ? "bg-pink text-white" : "bg-ink text-lemon"}`}>
              {solo ? "Solo" : "Team"}
            </span>
          </div>
          <h3 className="font-pixel text-lg font-bold uppercase leading-tight">{name}</h3>
          <p className="text-sm leading-relaxed">{blurb}</p>

          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t} className="bg-lemon px-2 py-0.5 text-xs">
                {t}
              </li>
            ))}
          </ul>

          {/* mt-auto pushes the buttons to the bottom so all cards line up */}
          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            <a href={repo} target="_blank" rel="noreferrer" className="chip-btn">
              Code
            </a>
            {live && (
              <a href={live} target="_blank" rel="noreferrer" className="chip-btn bg-pink text-white">
                Play
              </a>
            )}
          </div>
        </div>
      </Window>
    </Reveal>
  );
}

export function Projects() {
  return (
    <Section id="projects" className="bg-sky-soft" edge={<PixelEdge color="fill-pink" offset={5} />}>
      <SectionHeader title="Save files" sub="Things I've built. Pick one to load." />

      <ul className="mt-12 grid gap-8 md:grid-cols-3">
        {projects.map((p, i) => (
          <li key={p.name}>
            <ProjectCard project={p} index={i} />
          </li>
        ))}
      </ul>
    </Section>
  );
}