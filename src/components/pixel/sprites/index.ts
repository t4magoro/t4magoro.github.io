import { ITEMS } from "./items";
import { SCENE } from "./scene";
import { TECH } from "./tech";

// Every sprite is a list of rows made of palette letters (see ../palette.ts).
// All rows in one sprite must have the same length.
export const SPRITES = { ...SCENE, ...TECH, ...ITEMS };

export type SpriteName = keyof typeof SPRITES;