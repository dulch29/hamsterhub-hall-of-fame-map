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
  const width = Math.min(370, viewport.width - 28);
  const center = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
  const portraitSize = Math.min(180, Math.max(110, viewport.height * .21));
  const y = Math.max(180, Math.min(270, viewport.height * .3));
  const height = Math.min(550, viewport.height - y - 24);
  const x = clamp(center.x - width / 2, 14, viewport.width - width - 14);
  return {
    x, y, width, height,
    portraitX: width / 2, portraitY: -portraitSize * .25, portraitSize,
    nameX: width / 2, nameWidth: width - 36,
  };
}

export function thoughtTrail(origin: { x: number; y: number }, portrait: BubblePoint): BubblePoint[] {
  const dx = portrait.x - origin.x;
  const dy = portrait.y - origin.y;
  const distance = Math.hypot(dx, dy);
  const start = 44;
  const end = distance - portrait.size / 2 - 20;
  const space = end - start;
  if (space < 12) return [];
  const sizes = space < 40 ? [4, 7] : [6, 10, 16];
  return sizes.map((size, index) => {
    const along = start + size / 2 + (space - size) * index / (sizes.length - 1);
    return { x: origin.x + dx * along / distance, y: origin.y + dy * along / distance, size };
  });
}
