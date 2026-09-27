import { About } from "@/components/sections/About";
import { Art } from "@/components/sections/Art";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Inventory } from "@/components/sections/Inventory";
import { Languages } from "@/components/sections/Languages";
import { Nav } from "@/components/sections/Nav";
import { Projects } from "@/components/sections/Projects";
import { Quests } from "@/components/sections/Quests";
import { PersonSchema } from "@/components/ui/PersonSchema";

// The whole site is one page. Each section lives in src/components/sections/.
export default function Home() {
  return (
    <main className="mx-auto max-w-6xl bg-ink sm:my-6 sm:border-4 sm:border-ink sm:shadow-[10px_10px_0_rgb(20_20_20/0.35)]">
      <PersonSchema />
      <Nav />
      <Hero />
      <About />
      <Inventory />
      <Languages />
      <Quests />
      <Certificates />
      <Projects />
      <Art />
      <Contact />
    </main>
  );
}