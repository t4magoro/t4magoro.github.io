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
};

// Solo projects first.
export const projects: Project[] = [
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