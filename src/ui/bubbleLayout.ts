export type BubblePoint = { x: number; y: number; size: number };
export type BubbleViewport = { width: number; height: number };
export type BubbleRect = { x: number; y: number; width: number; height: number };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export const isLandscapePhone = (viewport: BubbleViewport) =>
  viewport.height <= 500 && viewport.width > viewport.height;

/** Screen-space decoration only; these points never become student coordinates. */
export function bubbleLayout(viewport: BubbleViewport, anchor: { x: number; y: number }, count: number, portraitCount = 4): BubblePoint[] {
  const { width, height } = viewport;
  const mobile = width < 900;
  const landscape = isLandscapePhone(viewport);
  const top = landscape ? 46 : mobile ? 164 : 48;
  const bottom = height - (landscape ? 44 : mobile ? 136 : 64);
  if (mobile && width < height && bottom - top < 260) {
    // Short phones need two rows to retain minimum targets and control clearance.
    const left = width - 208;
    const upper = top + 28;
    const lower = bottom - 40;
    return [
      { x: left + 28, y: upper, size: 56 },
      { x: left + 96, y: upper, size: 56 },
      { x: left + 164, y: lower, size: 56 },
      { x: left + 164, y: upper, size: 56 },
      { x: left + 40, y: lower, size: 80 },
    ].slice(0, Math.min(5, count));
  }
  const leftPad = landscape ? Math.min(280, Math.round(width * .4)) : 16;
  const scale = landscape
    ? Math.min(.42, (width - leftPad - 24) / 614, Math.max(.18, (bottom - top - 72) / 428))
    : Math.min(mobile ? .46 : 1, (width * (mobile ? .83 : .73) - 16) / 614, (bottom - top) / 583);
  // Four reference portraits, followed by the circular province-list action.
  const offsets = [[231, -114, 158], [362, -288, 130], [394, 26, 120], [522, -153, 184], [218, 140, 180]];
  const slots = offsets.map(([x = 0, y = 0, size = 80], index) => ({
    x: x * scale, y: y * scale, size: Math.max(index === 4 ? 80 : 56, size * scale),
  }));
  const visible = [...slots.slice(0, Math.min(4, portraitCount)), slots[4]!];
  const minX = leftPad;
  const maxX = Math.max(minX, width - 16 - Math.max(...visible.map((point) => point.x + point.size / 2)));
  const minY = top - Math.min(...visible.map((point) => point.y - point.size / 2));
  const maxY = Math.max(minY, bottom - Math.max(...visible.map((point) => point.y + point.size / 2)));
  const origin = {
    x: clamp(anchor.x, minX, maxX),
    y: clamp(anchor.y, minY, maxY),
  };
  return slots.slice(0, Math.min(5, count)).map((point) => ({ ...point, x: origin.x + point.x, y: origin.y + point.y }));
}

export function bubbleFocusX(viewport: BubbleViewport, recipients: number): number {
  if (viewport.width < 900) return viewport.width * .17;
  const slots = bubbleLayout(viewport, { x: 16, y: viewport.height * .58 }, 5, recipients);
  const visible = [...slots.slice(0, Math.min(4, recipients)), slots[4]!];
  const right = Math.max(...visible.map((point) => point.x + point.size / 2)) - 16;
  // Balance the award's 32px left radius against the visible circles' right edge.
  return (viewport.width - right + 32) / 2;
}

export function previewLayout(viewport: BubbleViewport, source: { x: number; y: number; width: number; height: number }) {
  const isDesktop = viewport.width >= 900;
  const isTablet = viewport.width >= 700;
  const width = Math.min(isDesktop ? 450 : isTablet ? 400 : 370, viewport.width - 28);
  const center = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
  const portraitSize = Math.min(180, Math.max(110, viewport.height * .21));
  const y = Math.max(180, Math.min(270, viewport.height * .3));
  const height = Math.min(620, viewport.height - y - 24);
  const x = clamp(center.x - width / 2, 14, viewport.width - width - 14);
  return {
    x, y, width, height,
    portraitX: width / 2, portraitY: -portraitSize * .25, portraitSize,
    nameX: width / 2, nameWidth: width - 36,
  };
}

function landscapeCardLayout(viewport: BubbleViewport, hasLogo: boolean) {
  const portraitSize = viewport.width < 640 ? 84 : 104;
  const leftRail = viewport.width < 640 ? 180 : viewport.width < 760 ? 200 : 240;
  const rightReserve = hasLogo && viewport.width >= 760 ? 116 : 16;
  const width = Math.min(460, viewport.width - leftRail - rightReserve);
  const x = leftRail;
  const y = 62;
  const height = Math.max(220, viewport.height - 76);
  const portraitX = -Math.round(leftRail / 2) + 8;
  const portraitY = Math.round(height * .52);
  const nameX = portraitX;
  const nameWidth = leftRail - 24;
  const logoSize = 60;
  const logoX = viewport.width >= 760 ? width + 16 : portraitX - logoSize / 2;
  const logoY = viewport.width >= 760 ? 12 : portraitY + portraitSize / 2 + 10;
  return { x, y, width, height, portraitX, portraitY, portraitSize, nameX, nameWidth, logoSize, logoX, logoY, hasLogo };
}

export function profileLayout(viewport: BubbleViewport, source: BubbleRect, hasLogo: boolean, hasPeers = false, alignRight = false) {
  if (isLandscapePhone(viewport)) return landscapeCardLayout(viewport, hasLogo);
  const bounds = previewLayout(viewport, source);
  if (alignRight && viewport.width > 700) {
    bounds.width = Math.min(480, Math.round(viewport.width * 0.42));
    bounds.x = Math.max(14, viewport.width - bounds.width - 32);
    bounds.portraitX = bounds.width / 2;
    bounds.nameX = bounds.width / 2;
    bounds.nameWidth = bounds.width - 36;
  }
  if (hasPeers && viewport.width < 600) {
    bounds.y = Math.max(bounds.y, Math.min(350, viewport.height - 240));
    bounds.height = Math.min(550, viewport.height - bounds.y - 24);
    bounds.portraitSize = Math.min(140, bounds.portraitSize);
    bounds.portraitY = -bounds.portraitSize * .25;
  }
  const logoSize = viewport.width < 600 ? 62 : 96;
  const rightFits = bounds.x + bounds.width + logoSize + 28 <= viewport.width - 14;
  const leftFits = bounds.x - logoSize - 28 >= 14;
  const logoX = rightFits ? bounds.width + 28 : leftFits ? -logoSize - 28 : viewport.width < 600 ? 4 : bounds.width - logoSize - 4;
  const logoY = rightFits || leftFits ? 12 : -76;
  if (hasLogo && !rightFits && !leftFits) {
    bounds.portraitSize = Math.min(140, bounds.portraitSize);
    bounds.portraitY = -bounds.portraitSize * .25;
  }
  return { ...bounds, logoSize, logoX, logoY, hasLogo };
}

export type ProfileLayout = ReturnType<typeof profileLayout>;

/** On wide screens the student stands beside the selected presentation. */
export function presentationLayout(viewport: BubbleViewport, source: BubbleRect, hasLogo: boolean, hasPeers = false): ProfileLayout {
  if (isLandscapePhone(viewport)) return landscapeCardLayout(viewport, hasLogo);
  if (viewport.width < 1000) return profileLayout(viewport, source, hasLogo, hasPeers);
  const width = Math.min(560, viewport.width - 460);
  const x = clamp(viewport.width * .44, 280, viewport.width - width - 140);
  const y = Math.max(160, Math.min(220, viewport.height * .23));
  return { x, y, width, height: Math.min(580, viewport.height - y - 40),
    portraitX: -128, portraitY: 220, portraitSize: 190, nameX: -128, nameWidth: 210,
    logoX: width + 24, logoY: 20, logoSize: 96, hasLogo };
}

const overlaps = (a: BubbleRect, b: BubbleRect) => a.x < b.x + b.width && a.x + a.width > b.x
  && a.y < b.y + b.height && a.y + a.height > b.y;

/** Include float travel and the nickname, not just the face's circular outline. */
export const bubbleFootprint = (point: BubblePoint): BubbleRect => ({
  x: point.x - point.size / 2 - 7, y: point.y - point.size / 2 - 12,
  width: point.size + 14, height: point.size + 48,
});

export function profileObstacles(layout: ProfileLayout): BubbleRect[] {
  return [
    { x: layout.x - 16, y: layout.y - 12, width: layout.width + 32, height: layout.height + 28 },
    layout.portraitX < 0
      ? { x: layout.x + layout.portraitX - layout.portraitSize / 2 - 16,
          y: layout.y + layout.portraitY - layout.portraitSize / 2 - 100,
          width: layout.portraitSize + 32, height: layout.portraitSize + 116 }
      : { x: layout.x + 10, y: layout.y - layout.portraitSize * .75 - 88,
          width: layout.width - 20, height: layout.portraitSize * .75 + 88 },
    ...(layout.hasLogo ? [{ x: layout.x + layout.logoX - 16, y: layout.y + layout.logoY - 24,
      width: layout.logoSize + 32, height: layout.logoSize + 48 }] : []),
  ];
}

export function spreadBubbles(viewport: BubbleViewport, points: BubblePoint[], selectedIndex: number, layout: ProfileLayout): BubblePoint[] {
  const peers = points.map((point, index) => ({ point, index })).filter(({ index }) => index !== selectedIndex);
  if (!peers.length) return points;
  const landscape = isLandscapePhone(viewport);
  if (viewport.width < 600 && !landscape) {
    const gap = 16;
    const size = Math.min(56, (viewport.width - 32 - (peers.length - 1) * gap) / peers.length);
    const start = (viewport.width - peers.length * size - (peers.length - 1) * gap) / 2;
    const result = [...points];
    peers.forEach(({ index }, order) => { result[index] = { x: start + size / 2 + order * (size + gap), y: 90, size }; });
    return result;
  }
  const obstacles = [...profileObstacles(layout),
    { x: viewport.width - 164, y: 0, width: 164, height: 64 },
    { x: viewport.width - 154, y: 112, width: 154, height: 56 },
  ];
  // Retry smaller targets if a narrow landscape has no room at the first size.
  for (const maximum of [104, 88, 72, 56, 44]) {
    const result = [...points];
    const occupied = [...obstacles];
    let fits = true;
    for (const { point, index } of peers) {
      const size = Math.min(point.size, maximum, viewport.width < 900 ? 80 : 104);
      let best: BubblePoint | undefined;
      let cost = Infinity;
      const yMin = landscape ? size / 2 + 48 : size / 2 + 76;
      const yMax = landscape ? viewport.height - size / 2 - 16 : viewport.height - size / 2 - 76;
      for (let y = yMin; y <= yMax; y += 12) {
        for (let x = size / 2 + 24; x <= viewport.width - size / 2 - 24; x += 12) {
          const candidate = { x, y, size };
          const footprint = bubbleFootprint(candidate);
          if (occupied.some((obstacle) => overlaps(footprint, obstacle))) continue;
          const distance = (x - point.x) ** 2 + (y - point.y) ** 2;
          if (distance < cost) { cost = distance; best = candidate; }
        }
      }
      if (!best) { fits = false; break; }
      result[index] = best;
      occupied.push(bubbleFootprint(best));
    }
    if (fits) return result;
  }
  return points;
}

export function thoughtTrail(origin: { x: number; y: number }, portrait: BubblePoint): BubblePoint[] {
  const dx = portrait.x - origin.x;
  const dy = portrait.y - origin.y;
  const distance = Math.hypot(dx, dy);
  const compact = portrait.size < 90;
  const start = compact ? 32 : 44;
  const end = distance - portrait.size / 2 - (compact ? 10 : 20);
  const space = end - start;
  if (space < 12) return [];
  const sizes = space < 24 ? [3, 6] : space < 40 ? [3, 6, 10]
    : [portrait.size * .08, portrait.size * .16, Math.min(52, portrait.size * .34)];
  return sizes.map((size, index) => {
    const along = start + size / 2 + (space - size) * index / (sizes.length - 1);
    return { x: origin.x + dx * along / distance, y: origin.y + dy * along / distance, size };
  });
}
