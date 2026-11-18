export type BubblePoint = { x: number; y: number; size: number };
export type BubbleViewport = { width: number; height: number };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Screen-space decoration only; these points never become student coordinates. */
export function bubbleLayout(viewport: BubbleViewport, anchor: { x: number; y: number }, count: number): BubblePoint[] {
  const { width, height } = viewport;
  const mobile = width < 900;
  const scale = mobile ? Math.min(1, (height - 260) / 420) : Math.min(1, (width / 2 - 32) / 495, (height - 200) / 490);
  const offsets = mobile
    ? [[88, -70, 84], [10, -190, 72], [-92, -85, 78], [82, 90, 76], [-70, 100, 70]]
    : [[165, -90, 124], [280, -250, 100], [410, -105, 144], [310, 125, 108], [130, 150, 96]];
  return offsets.slice(0, Math.min(5, count)).map(([dx = 0, dy = 0, diameter = 80]) => {
    const size = Math.max(56, diameter * scale);
    return {
      x: clamp(anchor.x + dx * scale, size / 2 + 16, width - size / 2 - 16),
      y: clamp(anchor.y + dy * scale, size / 2 + 160, height - size / 2 - 135),
      size,
    };
  });
}

export function previewLayout(viewport: BubbleViewport, source: { x: number; y: number; width: number; height: number }) {
  const mobile = viewport.width < 900;
  const width = Math.min(360, viewport.width - 28);
  const height = Math.min(620, viewport.height - (mobile ? 180 : 170));
  return {
    width, height,
    x: clamp(source.x + source.width / 2 - width / 2, 14, viewport.width - width - 14),
    y: clamp(source.y - 50, mobile ? 140 : 130, viewport.height - height - 20),
  };
}
