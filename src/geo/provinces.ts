import { PROVINCE_CODES, type Kid, type MapPin, type ProvinceCode } from '../types.js';
import { hashId } from './hash.js';

export type ProvinceFeature = {
  type: 'Feature';
  properties: { code: ProvinceCode; name: string };
  geometry:
    | { type: 'Polygon'; coordinates: number[][][] }
    | { type: 'MultiPolygon'; coordinates: number[][][][] };
};

export const provinceNames: Readonly<Record<ProvinceCode, string>> = Object.freeze({
  'TH-10': 'Bangkok',
  'TH-11': 'Samut Prakan',
  'TH-12': 'Nonthaburi',
  'TH-13': 'Pathum Thani',
  'TH-14': 'Phra Nakhon Si Ayutthaya',
  'TH-15': 'Ang Thong',
  'TH-16': 'Lop Buri',
  'TH-17': 'Sing Buri',
  'TH-18': 'Chai Nat',
  'TH-19': 'Saraburi',
  'TH-20': 'Chon Buri',
  'TH-21': 'Rayong',
  'TH-22': 'Chanthaburi',
  'TH-23': 'Trat',
  'TH-24': 'Chachoengsao',
  'TH-25': 'Prachin Buri',
  'TH-26': 'Nakhon Nayok',
  'TH-27': 'Sa Kaeo',
  'TH-30': 'Nakhon Ratchasima',
  'TH-31': 'Buri Ram',
  'TH-32': 'Surin',
  'TH-33': 'Si Sa Ket',
  'TH-34': 'Ubon Ratchathani',
  'TH-35': 'Yasothon',
  'TH-36': 'Chaiyaphum',
  'TH-37': 'Amnat Charoen',
  'TH-38': 'Bueng Kan',
  'TH-39': 'Nong Bua Lam Phu',
  'TH-40': 'Khon Kaen',
  'TH-41': 'Udon Thani',
  'TH-42': 'Loei',
  'TH-43': 'Nong Khai',
  'TH-44': 'Maha Sarakham',
  'TH-45': 'Roi Et',
  'TH-46': 'Kalasin',
  'TH-47': 'Sakon Nakhon',
  'TH-48': 'Nakhon Phanom',
  'TH-49': 'Mukdahan',
  'TH-50': 'Chiang Mai',
  'TH-51': 'Lamphun',
  'TH-52': 'Lampang',
  'TH-53': 'Uttaradit',
  'TH-54': 'Phrae',
  'TH-55': 'Nan',
  'TH-56': 'Phayao',
  'TH-57': 'Chiang Rai',
  'TH-58': 'Mae Hong Son',
  'TH-60': 'Nakhon Sawan',
  'TH-61': 'Uthai Thani',
  'TH-62': 'Kamphaeng Phet',
  'TH-63': 'Tak',
  'TH-64': 'Sukhothai',
  'TH-65': 'Phitsanulok',
  'TH-66': 'Phichit',
  'TH-67': 'Phetchabun',
  'TH-70': 'Ratchaburi',
  'TH-71': 'Kanchanaburi',
  'TH-72': 'Suphan Buri',
  'TH-73': 'Nakhon Pathom',
  'TH-74': 'Samut Sakhon',
  'TH-75': 'Samut Songkhram',
  'TH-76': 'Phetchaburi',
  'TH-77': 'Prachuap Khiri Khan',
  'TH-80': 'Nakhon Si Thammarat',
  'TH-81': 'Krabi',
  'TH-82': 'Phang-nga',
  'TH-83': 'Phuket',
  'TH-84': 'Surat Thani',
  'TH-85': 'Ranong',
  'TH-86': 'Chumphon',
  'TH-90': 'Songkhla',
  'TH-91': 'Satun',
  'TH-92': 'Trang',
  'TH-93': 'Phatthalung',
  'TH-94': 'Pattani',
  'TH-95': 'Yala',
  'TH-96': 'Narathiwat',
});

export const provinceNamesTh: Readonly<Record<ProvinceCode, string>> = Object.freeze({
  'TH-10': 'กรุงเทพ',
  'TH-11': 'สมุทรปราการ',
  'TH-12': 'นนทบุรี',
  'TH-13': 'ปทุมธานี',
  'TH-14': 'พระนครศรีอยุธยา',
  'TH-15': 'อ่างทอง',
  'TH-16': 'ลพบุรี',
  'TH-17': 'สิงห์บุรี',
  'TH-18': 'ชัยนาท',
  'TH-19': 'สระบุรี',
  'TH-20': 'ชลบุรี',
  'TH-21': 'ระยอง',
  'TH-22': 'จันทบุรี',
  'TH-23': 'ตราด',
  'TH-24': 'ฉะเชิงเทรา',
  'TH-25': 'ปราจีนบุรี',
  'TH-26': 'นครนายก',
  'TH-27': 'สระแก้ว',
  'TH-30': 'นครราชสีมา',
  'TH-31': 'บุรีรัมย์',
  'TH-32': 'สุรินทร์',
  'TH-33': 'ศรีสะเกษ',
  'TH-34': 'อุบลราชธานี',
  'TH-35': 'ยโสธร',
  'TH-36': 'ชัยภูมิ',
  'TH-37': 'อำนาจเจริญ',
  'TH-38': 'บึงกาฬ',
  'TH-39': 'หนองบัวลำภู',
  'TH-40': 'ขอนแก่น',
  'TH-41': 'อุดรธานี',
  'TH-42': 'เลย',
  'TH-43': 'หนองคาย',
  'TH-44': 'มหาสารคาม',
  'TH-45': 'ร้อยเอ็ด',
  'TH-46': 'กาฬสินธุ์',
  'TH-47': 'สกลนคร',
  'TH-48': 'นครพนม',
  'TH-49': 'มุกดาหาร',
  'TH-50': 'เชียงใหม่',
  'TH-51': 'ลำพูน',
  'TH-52': 'ลำปาง',
  'TH-53': 'อุตรดิตถ์',
  'TH-54': 'แพร่',
  'TH-55': 'น่าน',
  'TH-56': 'พะเยา',
  'TH-57': 'เชียงราย',
  'TH-58': 'แม่ฮ่องสอน',
  'TH-60': 'นครสวรรค์',
  'TH-61': 'อุทัยธานี',
  'TH-62': 'กำแพงเพชร',
  'TH-63': 'ตาก',
  'TH-64': 'สุโขทัย',
  'TH-65': 'พิษณุโลก',
  'TH-66': 'พิจิตร',
  'TH-67': 'เพชรบูรณ์',
  'TH-70': 'ราชบุรี',
  'TH-71': 'กาญจนบุรี',
  'TH-72': 'สุพรรณบุรี',
  'TH-73': 'นครปฐม',
  'TH-74': 'สมุทรสาคร',
  'TH-75': 'สมุทรสงคราม',
  'TH-76': 'เพชรบุรี',
  'TH-77': 'ประจวบคีรีขันธ์',
  'TH-80': 'นครศรีธรรมราช',
  'TH-81': 'กระบี่',
  'TH-82': 'พังงา',
  'TH-83': 'ภูเก็ต',
  'TH-84': 'สุราษฎร์ธานี',
  'TH-85': 'ระนอง',
  'TH-86': 'ชุมพร',
  'TH-90': 'สงขลา',
  'TH-91': 'สตูล',
  'TH-92': 'ตรัง',
  'TH-93': 'พัทลุง',
  'TH-94': 'ปัตตานี',
  'TH-95': 'ยะลา',
  'TH-96': 'นราธิวาส',
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRing(value: unknown): value is number[][] {
  if (!Array.isArray(value) || value.length < 4) return false;
  if (!value.every((point: unknown) =>
    Array.isArray(point) && point.length === 2 &&
    typeof point[0] === 'number' && Number.isFinite(point[0]) && Math.abs(point[0]) <= 180 &&
    typeof point[1] === 'number' && Number.isFinite(point[1]) && Math.abs(point[1]) <= 90,
  )) return false;
  const ring = value as number[][];
  const first = ring[0]!;
  const last = ring[ring.length - 1]!;
  if (first[0] !== last[0] || first[1] !== last[1]) return false;
  // Translate to the first vertex to avoid cancellation for tiny island rings.
  let twiceArea = 0;
  for (let i = 1; i < ring.length; i++) {
    const a = ring[i - 1]!;
    const b = ring[i]!;
    twiceArea += (a[0]! - first[0]!) * (b[1]! - first[1]!) -
      (b[0]! - first[0]!) * (a[1]! - first[1]!);
  }
  return twiceArea !== 0;
}

function isPolygon(value: unknown): value is number[][][] {
  return Array.isArray(value) && value.length > 0 && value.every(isRing);
}

function isFeature(value: unknown): value is ProvinceFeature {
  if (!isRecord(value) || value.type !== 'Feature' ||
    !isRecord(value.properties) || !isRecord(value.geometry)) return false;
  const { code, name } = value.properties;
  if (typeof code !== 'string' || !PROVINCE_CODES.includes(code as ProvinceCode) ||
    typeof name !== 'string' || name.trim().length === 0) return false;
  const geometry = value.geometry;
  return geometry.type === 'Polygon' ? isPolygon(geometry.coordinates) :
    geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates) &&
    geometry.coordinates.length > 0 && geometry.coordinates.every(isPolygon);
}

/** Fetch the bundled WGS84 [longitude, latitude] geometry; reject incomplete assets. */
export async function loadProvinces(signal?: AbortSignal): Promise<ProvinceFeature[]> {
  const base = import.meta.env?.BASE_URL ?? '/';
  const response = await fetch(`${base}data/thailand-provinces.geojson`, { signal });
  if (!response.ok) throw new Error(`Province geometry request failed: ${response.status}`);
  const data: unknown = await response.json();
  if (!isRecord(data) || data.type !== 'FeatureCollection' || !Array.isArray(data.features) ||
    data.features.length !== PROVINCE_CODES.length || !data.features.every(isFeature)) {
    throw new Error('Invalid province geometry asset');
  }
  const features: ProvinceFeature[] = data.features;
  const codes = new Set(features.map((feature) => feature.properties.code));
  if (codes.size !== PROVINCE_CODES.length || PROVINCE_CODES.some((code) => !codes.has(code))) {
    throw new Error('Province geometry must cover all 77 unique province codes');
  }
  return features;
}

// -1 is on the boundary, 0 outside, 1 inside. Boundary points are never accepted.
function inRing(x: number, y: number, ring: number[][]): -1 | 0 | 1 {
  let inside = false;
  for (let i = 1; i < ring.length; i++) {
    const [ax, ay] = ring[i - 1]! as [number, number];
    const [bx, by] = ring[i]! as [number, number];
    const cross = (x - ax) * (by - ay) - (y - ay) * (bx - ax);
    if (Math.abs(cross) <= 1e-12 &&
      x >= Math.min(ax, bx) && x <= Math.max(ax, bx) &&
      y >= Math.min(ay, by) && y <= Math.max(ay, by)) return -1;
    if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) {
      inside = !inside;
    }
  }
  return inside ? 1 : 0;
}

function inPolygon(x: number, y: number, polygon: number[][][]): boolean {
  return inRing(x, y, polygon[0]!) === 1 &&
    polygon.slice(1).every((hole) => inRing(x, y, hole) === 0);
}

type SamplingPart = {
  polygon: number[][][];
  minX: number;
  minY: number;
  width: number;
  height: number;
  cumulativeArea: number;
};

function prepareParts(feature: ProvinceFeature): SamplingPart[] {
  if (!isFeature(feature)) throw new Error('Invalid province feature');
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  let cumulativeArea = 0;
  return polygons.map((polygon) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const point of polygon[0]!) {
      minX = Math.min(minX, point[0]!);
      minY = Math.min(minY, point[1]!);
      maxX = Math.max(maxX, point[0]!);
      maxY = Math.max(maxY, point[1]!);
    }
    const width = maxX - minX, height = maxY - minY;
    cumulativeArea += width * height;
    return { polygon, minX, minY, width, height, cumulativeArea };
  });
}

function randomFrom(seed: string): () => number {
  let state = hashId(seed);
  // Mulberry32 mixes sequential hash values before producing each sample.
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

type ProvincePlacement = {
  lng: number;
  lat: number;
  radius: number;
  longitudeScale: number;
  polygon: number[][][];
};

function pointToRingDistSq(px: number, py: number, ring: number[][]): number {
  let minSq = Infinity;
  for (let i = 0; i < ring.length - 1; i++) {
    const [ax, ay] = ring[i]!;
    const [bx, by] = ring[i + 1]!;
    const dx = bx! - ax!;
    const dy = by! - ay!;
    const lenSq = dx * dx + dy * dy;
    const t = lenSq > 0 ? Math.max(0, Math.min(1, ((px - ax!) * dx + (py - ay!) * dy) / lenSq)) : 0;
    const projX = ax! + t * dx;
    const projY = ay! + t * dy;
    const distSq = (px - projX) ** 2 + (py - projY) ** 2;
    if (distSq < minSq) minSq = distSq;
  }
  return minSq;
}

function pointToPolygonDistSq(px: number, py: number, polygon: number[][][]): number {
  let minSq = pointToRingDistSq(px, py, polygon[0]!);
  for (const hole of polygon.slice(1)) {
    minSq = Math.min(minSq, pointToRingDistSq(px, py, hole));
  }
  return minSq;
}

function interiorAnchor(feature: ProvinceFeature): ProvincePlacement {
  const parts = prepareParts(feature);
  // Prefer the largest polygon part so buildings sit on the main landmass rather than small islands.
  const mainPart = parts.reduce((best, candidate) =>
    candidate.width * candidate.height > best.width * best.height ? candidate : best,
  );
  const candidates: Array<[number, number]> = [
    [mainPart.minX + mainPart.width / 2, mainPart.minY + mainPart.height / 2],
  ];
  const grid = 7;
  for (let gx = 1; gx <= grid; gx++) {
    for (let gy = 1; gy <= grid; gy++) {
      candidates.push([
        mainPart.minX + (gx / (grid + 1)) * mainPart.width,
        mainPart.minY + (gy / (grid + 1)) * mainPart.height,
      ]);
    }
  }
  let bestLng = 0;
  let bestLat = 0;
  let bestDistSq = -1;
  for (const [lng, lat] of candidates) {
    if (!inPolygon(lng, lat, mainPart.polygon)) continue;
    const distSq = pointToPolygonDistSq(lng, lat, mainPart.polygon);
    if (distSq > bestDistSq) {
      bestDistSq = distSq;
      bestLng = lng;
      bestLat = lat;
    }
  }
  if (bestDistSq >= 0) {
    const longitudeScale = Math.cos(bestLat * Math.PI / 180);
    const radius = Math.min(0.1, Math.min(mainPart.width * longitudeScale, mainPart.height) * 0.15);
    return { lng: bestLng, lat: bestLat, radius, longitudeScale, polygon: mainPart.polygon };
  }

  const totalArea = parts[parts.length - 1]!.cumulativeArea;
  const random = randomFrom(`province-anchor:${feature.properties.code}`);
  for (let attempt = 0; attempt < 16384; attempt++) {
    const target = random() * totalArea;
    const part = parts.find((candidate) => target < candidate.cumulativeArea)!;
    const lng = part.minX + random() * part.width;
    const lat = part.minY + random() * part.height;
    if (!inPolygon(lng, lat, part.polygon)) continue;
    const longitudeScale = Math.cos(lat * Math.PI / 180);
    const radius = Math.min(0.1, Math.min(part.width * longitudeScale, part.height) * 0.15);
    return { lng, lat, radius, longitudeScale, polygon: part.polygon };
  }
  throw new Error(`Unable to sample province anchor: ${feature.properties.code}`);
}

/**
 * Synthetic province-anchor plus ID-seeded disc jitter, stable under reorder/filter.
 * Every returned point is strictly in an exterior ring and outside all holes.
 * Anchor and jitter searches are bounded; neither uses an unchecked fallback.
 */
export function generateProvincePins(
  kids: readonly Kid[],
  features: readonly ProvinceFeature[],
): MapPin[] {
  const byCode = new Map<ProvinceCode, ProvinceFeature>();
  for (const feature of features) {
    const code = feature.properties.code;
    if (byCode.has(code)) throw new Error(`Duplicate province geometry: ${code}`);
    byCode.set(code, feature);
  }
  const prepared = new Map<ProvinceCode, ProvincePlacement>();
  return kids.filter((kid) => kid.showOnMap === true).map((kid) => {
    const feature = byCode.get(kid.province);
    if (!feature) throw new Error(`Missing province geometry: ${kid.province}`);
    let anchor = prepared.get(kid.province);
    if (!anchor) {
      anchor = interiorAnchor(feature);
      prepared.set(kid.province, anchor);
    }
    const random = randomFrom(JSON.stringify([kid.id, kid.province]));
    for (let attempt = 0; attempt < 16384; attempt++) {
      const radius = anchor.radius * Math.sqrt(random());
      const angle = random() * 2 * Math.PI;
      const lng = anchor.lng + radius * Math.cos(angle) / anchor.longitudeScale;
      const lat = anchor.lat + radius * Math.sin(angle);
      if (inPolygon(lng, lat, anchor.polygon)) return { kidId: kid.id, position: { lng, lat } };
    }
    throw new Error(`Unable to sample province interior: ${kid.province}`);
  });
}
