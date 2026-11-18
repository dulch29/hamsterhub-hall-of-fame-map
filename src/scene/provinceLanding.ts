export function landingHeight(elapsed: number, index: number, count: number) {
  const delay = (index / Math.max(1, count - 1)) ** 0.75 * 520;
  const progress = Math.max(0, Math.min(1, (elapsed - delay) / 680));
  return (8 + index % 3 * 0.3) * (1 - progress) ** 3;
}
