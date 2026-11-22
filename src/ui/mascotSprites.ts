export type MascotId = "guide" | "explainer";
export type MascotPose = "pet" | "walk1" | "walk2" | "talk" | "back" | "jump" | "argue" | "cry" | "roll" | "curious";

export const MASCOT_POSES: readonly MascotPose[] = [
  "pet",
  "walk1",
  "walk2",
  "talk",
  "back",
  "jump",
  "argue",
  "cry",
  "roll",
  "curious",
];

export const FIGHT_FRAMES = [
  "/demo/fight-1.png",
  "/demo/fight-2.png",
  "/demo/fight-3.png",
] as const;

export function mascotSpritePath(mascot: MascotId, pose: MascotPose): string {
  return `/demo/${mascot}-${pose}.png`;
}
