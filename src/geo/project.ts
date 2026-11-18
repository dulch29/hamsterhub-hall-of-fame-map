export type Projection = {
  origin: { lng: number; lat: number };
  refLat: number;
  scale: number;
};

// Placeholder projection until licensed geometry supplies its actual bounds.
const defaultProjection: Projection = { origin: { lng: 101, lat: 13 }, refLat: 13, scale: 1 };

function longitudeScale(options: Projection): number {
  if (
    !Number.isFinite(options.origin.lng) || Math.abs(options.origin.lng) > 180 ||
    !Number.isFinite(options.origin.lat) || Math.abs(options.origin.lat) >= 90 ||
    !Number.isFinite(options.refLat) || Math.abs(options.refLat) >= 90 ||
    !Number.isFinite(options.scale) || options.scale <= 0
  ) throw new Error('Invalid projection configuration');
  return Math.cos(options.refLat * Math.PI / 180) * options.scale;
}

export function projectLngLat(
  position: { lng: number; lat: number },
  options: Projection = defaultProjection,
): { x: number; y: number } {
  const factor = longitudeScale(options);
  if (
    !Number.isFinite(position.lng) || Math.abs(position.lng) > 180 ||
    !Number.isFinite(position.lat) || Math.abs(position.lat) >= 90
  ) throw new Error('Invalid geographic position');
  const x = (position.lng - options.origin.lng) * factor;
  const y = (position.lat - options.origin.lat) * options.scale;
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('Invalid projected position');
  return { x, y };
}

export function unprojectXY(
  point: { x: number; y: number },
  options: Projection = defaultProjection,
): { lng: number; lat: number } {
  const factor = longitudeScale(options);
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new Error('Invalid projected position');
  const position = {
    lng: point.x / factor + options.origin.lng,
    lat: point.y / options.scale + options.origin.lat,
  };
  projectLngLat(position, options);
  return position;
}
