import type { SpriteName } from "@/components/pixel/sprites";

export type Stat = { label: string; value: number };
export type Item = { name: string; icon: SpriteName; note: string };

// Bars on the Player card. Self-rated, 1 to 10. Programming languages live in languages.ts.
export const stats: Stat[] = [
  { label: "IoT / MCU", value: 8 },
  { label: "Project control", value: 8 },
  { label: "Risk assessment", value: 7 },
  { label: "Data analysis", value: 7 },
  { label: "Client comms", value: 8 },
];

// Cards in the "Inventory" section: general skills, not programming languages.
// `icon` must be a sprite name.
export const inventory: Item[] = [
  { name: "IoT & MCU", icon: "chip", note: "Microcontrollers, sensors and RFID, and getting them online." },
  { name: "Project control", icon: "clipboard", note: "Timelines, subcontractors and ATP sign-offs." },
  { name: "Risk assessment", icon: "shield", note: "Finding what can break in each project phase, before it does." },
  { name: "Data analysis", icon: "monitor", note: "Turning sensor and radar data into answers." },
  { name: "Client care", icon: "heart", note: "Clear updates, and fast answers when something goes wrong." },
  { name: "Digital Art", icon: "palette", note: "Side quest. A bit rusty, still loyal." },
];