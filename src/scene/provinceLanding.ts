export const LANDING_DURATION = 2200;

export function landingHeight(elapsed: number, index: number, count: number) {
  const delay = (index / Math.max(1, count - 1)) ** 0.75 * 900;
  const progress = Math.max(0, Math.min(1, (elapsed - delay) / 1300));
  const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
  return (8 + index % 3 * 0.3) * (1 - eased);
}
