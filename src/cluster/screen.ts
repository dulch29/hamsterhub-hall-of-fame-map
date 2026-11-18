export type ScreenPoint = { id: string; x: number; y: number };
export type ScreenCluster = { id: string; x: number; y: number; ids: string[] };

const compareIds = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Connected components of points whose Euclidean distance is <= radius.
 * Coordinates are projected screen pixels; callers recompute after camera/resize changes.
 * Members and components are ordered by ID, and markers use their members' centroid.
 * Duplicate IDs retain their multiplicity. Inputs are never mutated.
 */
export function clusterPoints(points: readonly ScreenPoint[], radius = 32): ScreenCluster[] {
  if (!Number.isFinite(radius) || radius < 0) {
    throw new RangeError('Radius must be finite and non-negative');
  }
  for (const point of points) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      throw new RangeError('Screen coordinates must be finite');
    }
  }
  const sorted = [...points].sort((a, b) =>
    compareIds(a.id, b.id) || a.x - b.x || a.y - b.y);
  const parents = sorted.map((_, index) => index);
  const find = (index: number): number => {
    while (parents[index] !== index) {
      parents[index] = parents[parents[index]!]!;
      index = parents[index]!;
    }
    return index;
  };
  const cells = new Map<string, number[]>();
  const cellSize = radius || 1;
  for (const [index, point] of sorted.entries()) {
    const cellX = Math.floor(point.x / cellSize);
    const cellY = Math.floor(point.y / cellSize);
    // Query only neighboring cells, retaining exact Euclidean threshold semantics.
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const neighbors = cells.get(`${cellX + dx},${cellY + dy}`);
        for (const otherIndex of neighbors ?? []) {
          const other = sorted[otherIndex]!;
          if (Math.hypot(point.x - other.x, point.y - other.y) <= radius) {
            const root = find(index);
            const otherRoot = find(otherIndex);
            parents[Math.max(root, otherRoot)] = Math.min(root, otherRoot);
          }
        }
      }
    }
    const key = `${cellX},${cellY}`;
    const cell = cells.get(key);
    if (cell) cell.push(index);
    else cells.set(key, [index]);
  }

  const groups = new Map<number, ScreenPoint[]>();
  for (const [index, point] of sorted.entries()) {
    const root = find(index);
    const members = groups.get(root);
    if (members) members.push(point);
    else groups.set(root, [point]);
  }
  return [...groups.values()].map((members) => {
    const ids = members.map((point) => point.id);
    return {
      // JSON encoding avoids ambiguous identities when IDs contain separators.
      id: `cluster:${JSON.stringify(ids)}`,
      x: members.reduce((sum, point) => sum + point.x / members.length, 0),
      y: members.reduce((sum, point) => sum + point.y / members.length, 0),
      ids,
    };
  });
}

/**
 * Place sorted IDs along a square spiral centered at (cx, cy).
 * Every pair is at least spacing pixels apart, regardless of member count.
 * These are temporary screen targets; underlying map anchors stay with the caller.
 */
export function fanOut(
  ids: readonly string[],
  cx: number,
  cy: number,
  spacing = 40,
): ScreenPoint[] {
  if (!Number.isFinite(cx) || !Number.isFinite(cy)) {
    throw new RangeError('Fan-out center must be finite');
  }
  if (!Number.isFinite(spacing) || spacing <= 0) {
    throw new RangeError('Spacing must be finite and positive');
  }
  let x = 0;
  let y = 0;
  let dx = 0;
  let dy = -1;
  return [...ids].sort(compareIds).map((id) => {
    const point = { id, x: cx + x * spacing, y: cy + y * spacing };
    if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
      [dx, dy] = [-dy, dx];
    }
    x += dx;
    y += dy;
    return point;
  });
}
