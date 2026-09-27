export type Language = {
  name: string;
  /** 2–4 letters shown on the colored tile. */
  short: string;
  /** Tile color: a Tailwind bg class from styles/theme.css. */
  color: string;
  /** Self-rated mastery, 1 to 10. */
  level: number;
  note: string;
};

// Programming languages, shown in the "Spellbook" section.
export const languages: Language[] = [
  {
    name: "C / C++",
    short: "C++",
    color: "bg-sky",
    level: 8,
    note: "Microcontroller firmware. I also taught C to first-year students.",
  },
  {
    name: "Python",
    short: "PY",
    color: "bg-grass",
    level: 8,
    note: "Radar signal processing and CNN/LSTM models for Hand Sign Radar.",
  },
  { name: "HTML", short: "HTML", color: "bg-pink", level: 7, note: "Page structure for the many web apps including this site." },
  { name: "CSS", short: "CSS", color: "bg-paper", level: 7, note: "Styling with Tailwind CSS, including this pixel theme." },
  { name: "JavaScript", short: "JS", color: "bg-lemon", level: 7, note: "Interactive web apps, mostly with React and TypeScript." },
];

// Frameworks and tools, grouped. Only list what you've used yourself.
export const toolkits: { label: string; tools: string[] }[] = [
  { label: "Web", tools: ["React", "Next.js", "TypeScript", "Vite", "Tailwind CSS"] },
  { label: "AI & data", tools: ["TensorFlow / Keras", "OpenCV", "NumPy", "Pandas", "Matplotlib"] },
  { label: "Hardware", tools: ["Microcontrollers", "TI mmWave radar", "UHF RFID"] },
  { label: "DevOps", tools: ["Docker", "Git", "GitHub Actions"] },
];