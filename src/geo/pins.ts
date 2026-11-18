import type { Kid, MapPin, ProvinceCode } from '../types';
import { hashId } from './hash';

// radiusDeg uses latitude degrees; longitude offsets are scaled at the anchor latitude.
export type ProvinceAnchor = { lng: number; lat: number; radiusDeg: number };

function mixedFraction(id: string): number {
  // Murmur3 avalanche breaks the correlation between hashes with related suffixes.
  let value = hashId(id);
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b);
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35);
  value ^= value >>> 16;
  return (value >>> 0) / 4294967296;
}

// Synthetic placement only; polygon containment must be checked when real geometry is selected.
export function derivePins(
  kids: readonly Kid[],
  anchors: Readonly<Partial<Record<ProvinceCode, ProvinceAnchor>>>,
): MapPin[] {
  return kids.filter((kid) => kid.showOnMap === true).map((kid) => {
    const anchor = Object.hasOwn(anchors, kid.province) ? anchors[kid.province] : undefined;
    if (!anchor) throw new Error(`Missing anchor: ${kid.province}`);
    if (
      !Number.isFinite(anchor.lng) || !Number.isFinite(anchor.lat) ||
      !Number.isFinite(anchor.radiusDeg) || anchor.radiusDeg <= 0 ||
      Math.abs(anchor.lat) >= 90 || Math.abs(anchor.lng) > 180
    ) throw new Error(`Invalid anchor: ${kid.province}`);

    const radius = anchor.radiusDeg * Math.sqrt(mixedFraction(`${kid.id}:r`));
    const angle = 2 * Math.PI * mixedFraction(`${kid.id}:a`);
    const lng = anchor.lng + radius * Math.cos(angle) / Math.cos(anchor.lat * Math.PI / 180);
    const lat = anchor.lat + radius * Math.sin(angle);
    if (!Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) {
      throw new Error(`Invalid derived position: ${kid.province}`);
    }
    return { kidId: kid.id, position: { lng, lat } };
  });
}
