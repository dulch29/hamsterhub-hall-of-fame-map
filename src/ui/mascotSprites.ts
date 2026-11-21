export type MascotId = "guide" | "explainer";
export type MascotPose = "pet" | "walk1" | "walk2" | "talk" | "back" | "jump" | "argue";

export const MASCOT_POSES: readonly MascotPose[] = [
  "pet",
  "walk1",
  "walk2",
  "talk",
  "back",
  "jump",
  "argue",
];

export function mascotSpritePath(mascot: MascotId, pose: MascotPose): string {
  return `/demo/${mascot}-${pose}.png`;
}
