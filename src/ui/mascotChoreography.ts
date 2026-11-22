import type { MascotPose } from "./mascotSprites";

export type MascotScene = "tour" | "rivalry" | "race" | "student-solo";
export type MascotWinner = "none" | "guide" | "explainer";

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type Point = {
  x: number;
  y: number;
};

/**
 * Native hamster PNGs face left (`scaleX(1)` = left).
 * Returning `-1` mirrors the sprite (`scaleX(-1)`) to face right; `1` keeps it facing left.
 */
export function faceSignForDelta(dx: number, previousFace = -1): 1 | -1 {
  if (dx > 0.5) return -1;
  if (dx < -0.5) return 1;
  return previousFace === 1 ? 1 : -1;
}

export function facingLabel(face: number): "left" | "right" {
  return face === -1 ? "right" : "left";
}

export function pickRaceWinner(rng: () => number = Math.random): "guide" | "explainer" {
  return rng() < 0.5 ? "guide" : "explainer";
}

export function selectGuidePose(options: {
  moving: boolean;
  step: number;
  dx: number;
  dy: number;
  open: boolean;
  scene: MascotScene;
  arguing: boolean;
  jumping?: boolean;
  hovered?: boolean;
}): MascotPose {
  if (options.jumping) return "jump";
  if (options.moving) {
    return options.step % 2 === 0 ? "walk1" : "walk2";
  }
  if (options.hovered && !options.open) return "curious";
  if (options.open) return "talk";
  if (options.scene === "rivalry" && options.arguing) return "argue";
  return "pet";
}

export function selectExplainerPose(options: {
  traveling: boolean;
  step: number;
  dx: number;
  dy: number;
  typing: boolean;
  scene: MascotScene;
  arguing: boolean;
  jumping?: boolean;
  hovered?: boolean;
}): MascotPose {
  if (options.jumping) return "jump";
  if (options.traveling) {
    return options.step % 2 === 0 ? "walk1" : "walk2";
  }
  if (options.hovered && !options.typing) return "curious";
  if (options.scene === "rivalry" && options.arguing) {
    return options.typing && options.step % 2 === 1 ? "talk" : "argue";
  }
  if (options.typing) return options.step % 2 === 1 ? "talk" : "argue";
  return "pet";
}

export function rectsOverlap(a: Rect, b: Rect, pad = 0): boolean {
  return (
    a.left < b.right + pad &&
    a.right > b.left - pad &&
    a.top < b.bottom + pad &&
    a.bottom > b.top - pad
  );
}

/**
 * Picks a 2D map wander offset `(x, y)` relative to the Guide launcher's base box,
 * widening vertical exploration across the map while avoiding medals, brand mark,
 * credits link, and panels. When medals are supplied, periodically targets a spot
 * adjacent to a medal so Guide opens the tour by walking to a medal without covering it.
 */
export function pickWanderTarget(options: {
  baseRect: Rect;
  viewport: { width: number; height: number };
  obstacles: Rect[];
  medals?: Rect[];
  visitMedal?: boolean;
  currentPos?: Point;
  rng?: () => number;
}): Point {
  const rng = options.rng ?? Math.random;
  const width = Math.max(48, options.baseRect.right - options.baseRect.left);
  const height = Math.max(48, options.baseRect.bottom - options.baseRect.top);
  const margin = options.viewport.width <= 700 ? 10 : 18;
  const topLimit = options.viewport.width <= 700 ? 96 : 112;
  const bottomLimit = options.viewport.height - (options.viewport.width <= 700 ? 52 : 48);

  const minAbsLeft = margin;
  const maxAbsLeft = Math.max(minAbsLeft, options.viewport.width - width - margin);
  const maxLift = Math.max(
    72,
    Math.min(420, Math.round(options.viewport.height * 0.62), options.baseRect.top - topLimit),
  );
  const minAbsTop = Math.max(topLimit, options.baseRect.top - maxLift);
  const maxAbsTop = Math.min(bottomLimit - height, options.baseRect.top);

  const isSafe = (absLeft: number, absTop: number, pad: number): boolean => {
    const candidate: Rect = {
      left: absLeft,
      top: absTop,
      right: absLeft + width,
      bottom: absTop + height,
    };
    return options.obstacles.every((obs) => !rectsOverlap(candidate, obs, pad));
  };

  if (options.visitMedal && options.medals && options.medals.length > 0) {
    const medal = options.medals[Math.floor(rng() * options.medals.length) % options.medals.length]!;
    const offsets: Point[] = [
      { x: medal.left - width - 16, y: medal.bottom - height + 8 },
      { x: medal.right + 16, y: medal.bottom - height + 8 },
      { x: Math.round((medal.left + medal.right - width) / 2), y: medal.bottom + 14 },
      { x: Math.round((medal.left + medal.right - width) / 2), y: medal.top - height - 14 },
    ];
    for (const candidate of offsets) {
      const clampedLeft = Math.min(maxAbsLeft, Math.max(minAbsLeft, Math.round(candidate.x)));
      const clampedTop = Math.min(maxAbsTop, Math.max(minAbsTop, Math.round(candidate.y)));
      if (isSafe(clampedLeft, clampedTop, 8)) {
        return {
          x: clampedLeft - options.baseRect.left,
          y: clampedTop - options.baseRect.top,
        };
      }
    }
  }

  let fallback: Point | null = null;
  for (let attempt = 0; attempt < 28; attempt++) {
    const absLeft = Math.round(minAbsLeft + rng() * Math.max(0, maxAbsLeft - minAbsLeft));
    // Bias half the steps into upper/mid map (`y < -60`) so Guide visibly explores beyond the bottom strip.
    const liftBand = attempt % 2 === 0
      ? 0.22 + rng() * 0.78
      : rng();
    const absTop = Math.round(maxAbsTop - liftBand * Math.max(0, maxAbsTop - minAbsTop));
    const pad = attempt < 18 ? 10 : 4;
    if (isSafe(absLeft, absTop, pad)) {
      const candidate = {
        x: absLeft - options.baseRect.left,
        y: absTop - options.baseRect.top,
      };
      if (!options.currentPos) return candidate;
      const dist = Math.hypot(candidate.x - options.currentPos.x, candidate.y - options.currentPos.y);
      if (dist >= 120 && dist <= 360) return candidate;
      if (!fallback) fallback = candidate;
    }
  }

  return fallback ?? { x: 0, y: 0 };
}
