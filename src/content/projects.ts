import type { SpriteName } from "@/components/pixel/sprites";

export type Project = {
  name: string;
  icon: SpriteName;
  /** true = built alone ("Solo" badge), false = team project ("Team" badge). */
  solo: boolean;
  blurb: string;
  /** Languages, frameworks and hardware used. */
  tags: string[];
  repo: string;
  /** Live demo URL. Leave out if there isn't one (hides the "Play" button). */
  live?: string;
  /** Ohm's API: the card shows how Ohm is doing right now. */
  ohmApi?: string;
  /** Still being built: shows a "Beta" badge. */
  beta?: boolean;
  /** A few sentences on how it works, in a "How it works" box that opens on click. */
  howItWorks?: string[];
};

// Solo projects first.
export const projects: Project[] = [
  {
    name: "Ohm",
    icon: "ohm",
    solo: true,
    beta: true,
    blurb: "The internet's robot pet: visitors keep one pixel robot alive together. Bandung's live weather drains its battery, and it learns to talk from what people type.",
    tags: ["TypeScript", "Next.js", "Cloudflare Workers", "C++ / WebAssembly", "SQLite"],
    repo: "https://github.com/t4magoro/ohm-api",
    live: "https://t4magoro.github.io/ohm/",
    ohmApi: "https://ohm-api.t4magoro.workers.dev",
    howItWorks: [
      "Ohm learns with a Markov chain. It cuts every sentence people type into groups of three words and counts which word came after each pair: from “aku suka kopi” it learns that “kopi” can follow “aku suka”.",
      "To reply, it starts from the rarest word it knows in your message, then keeps picking a likely next word from those counts until the sentence ends. That weighted pick runs in C++ compiled to WebAssembly.",
      "Its brain grows with its vocabulary: under 50 words it babbles, from 50 it follows the last word, and from 300 the last two.",
      "It only learns words from an approved list with a blocklist on top, and your own message is never shown to anyone else.",
    ],
  },
  {
    name: "Hand Sign Radar",
    icon: "radar",
    solo: true,
    blurb: "Recognizes SIBI alphabet hand signs from TI mmWave (FMCW) radar data with CNN and LSTM models. Published at IEEE.",
    tags: ["Python", "TensorFlow / Keras", "OpenCV", "NumPy", "TI mmWave radar"],
    repo: "https://github.com/t4magoro/Hand-Sign-Radar",
  },
  {
    name: "Birthday App",
    icon: "heart",
    solo: true,
    blurb: "A surprise birthday web app I built for my girlfriend, deployed to GitHub Pages with GitHub Actions.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Docker"],
    repo: "https://github.com/t4magoro/Birthday-app",
    live: "https://t4magoro.github.io/Birthday-app/",
  },
  {
    name: "UHF RFID Test",
    icon: "antenna",
    solo: false,
    blurb: "Team project: a Laravel web app for UHF RFID tags, with an MQTT broker (Mosquitto) and live updates over websockets.",
    tags: ["IoT", "UHF RFID", "Laravel", "MQTT", "Docker"],
    repo: "https://github.com/t4magoro/testing-",
  },
];