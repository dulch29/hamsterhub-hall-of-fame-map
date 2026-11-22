import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type AwardStyle = "gold" | "silver" | "bronze" | "trophy";
export type BuildingLevel = 1 | 2 | 3 | 4;
export type AwardArtwork = Readonly<Record<string, readonly AwardStyle[]>>;
// Preview artwork only. No eligibility, rank or production award inference.
export const SAMPLE_AWARDS: Readonly<Record<string, AwardStyle>> = {
  "mock-2a-0001": "trophy",
  "mock-2a-0002": "silver",
  "mock-2a-0003": "bronze",
};
export const AWARD_NAMES: Record<AwardStyle, string> = {
  gold: "Gold medal", silver: "Silver medal", bronze: "Bronze medal", trophy: "Gold trophy",
};

const SAMPLE_COMPANIONS: Readonly<Record<string, readonly AwardStyle[]>> = {
  "mock-2a-0001": ["gold", "silver"],
  "mock-2a-0002": ["bronze"],
};
const PREVIEW_ORDER: readonly AwardStyle[] = ["trophy", "gold", "silver", "bronze"];

export function buildingLevelForCount(count: number): BuildingLevel {
  if (count >= 8) return 4;
  if (count >= 4) return 3;
  if (count >= 2) return 2;
  return 1;
}

export function summarizeAwards(ids: readonly string[], artwork?: AwardArtwork) {
  const styles = (id: string) => artwork ? artwork[id] ?? []
    : Object.hasOwn(SAMPLE_AWARDS, id) ? [SAMPLE_AWARDS[id]!, ...(SAMPLE_COMPANIONS[id] ?? [])] : [];
  const makers = [...new Set(ids)].filter((id) => styles(id).length).sort();
  const awards = makers.flatMap((id) => styles(id)
    .map((style) => ({ id, style })))
    .sort((a, b) => PREVIEW_ORDER.indexOf(a.style) - PREVIEW_ORDER.indexOf(b.style) || a.id.localeCompare(b.id));
  const first = awards[0];
  if (!first) return null;
  const counts = new Map<AwardStyle, number>();
  for (const { style } of awards.slice(1)) counts.set(style, (counts.get(style) ?? 0) + 1);
  return { primary: first.style, leadId: first.id,
    companions: [...counts].map(([style, count]) => ({ style, count })),
    makerCount: makers.length, awardCount: awards.length };
}

export type AwardSummary = NonNullable<ReturnType<typeof summarizeAwards>>;
export type AwardPlacement = {
  id: string;
  position: THREE.Vector3;
  summary?: AwardSummary;
  recipientCount?: number;
  faceViewer?: boolean;
};

function colored(geometry: THREE.BufferGeometry, hex: number) {
  if (geometry.hasAttribute("uv")) geometry.deleteAttribute("uv");
  const color = new THREE.Color(hex);
  const values = new Float32Array(geometry.getAttribute("position").count * 3);
  for (let i = 0; i < values.length; i += 3) color.toArray(values, i);
  geometry.setAttribute("color", new THREE.BufferAttribute(values, 3));
  return geometry;
}

function box(w: number, h: number, d: number, hex: number, x = 0, y = 0, z = 0) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  geometry.translate(x, y + h / 2, z);
  return colored(geometry, hex);
}

function cyl(rt: number, rb: number, h: number, seg: number, hex: number, x = 0, y = 0, z = 0) {
  const geometry = new THREE.CylinderGeometry(rt, rb, h, seg);
  geometry.translate(x, y + h / 2, z);
  return colored(geometry, hex);
}

function merged(parts: THREE.BufferGeometry[]) {
  const geometries = parts.map((geometry) => geometry.index ? geometry.toNonIndexed() : geometry.clone());
  const geometry = mergeGeometries(geometries)!;
  parts.forEach((part) => part.dispose());
  geometries.forEach((part) => part.dispose());
  return geometry;
}

function buildingGeometry(level: BuildingLevel): readonly [THREE.BufferGeometry, THREE.BufferGeometry] {
  if (level === 1) {
    // Low-rise compact studio building (~0.33 tall)
    return [
      merged([
        box(0.40, 0.05, 0.40, 0x365b82, 0, 0, 0),
        box(0.32, 0.24, 0.32, 0x6f94b8, 0, 0.05, 0),
        box(0.35, 0.04, 0.35, 0x93b5d6, 0, 0.29, 0),
      ]),
      merged([
        box(0.332, 0.065, 0.332, 0xffdf85, 0, 0.14, 0),
      ]),
    ];
  }
  if (level === 2) {
    // Mid-rise rectangular building (~0.55 tall)
    return [
      merged([
        box(0.46, 0.07, 0.46, 0x2f547a, 0, 0, 0),
        box(0.36, 0.43, 0.36, 0x8fb2d4, 0, 0.07, 0),
        box(0.39, 0.05, 0.39, 0xb6d2ed, 0, 0.50, 0),
      ]),
      merged([
        box(0.372, 0.055, 0.372, 0xffeaa3, 0, 0.14, 0),
        box(0.372, 0.055, 0.372, 0xffeaa3, 0, 0.26, 0),
        box(0.372, 0.055, 0.372, 0xffeaa3, 0, 0.38, 0),
      ]),
    ];
  }
  if (level === 3) {
    // Modern stepped high-rise tower with gold cornice (~0.82 tall)
    return [
      merged([
        box(0.52, 0.09, 0.52, 0x24466b, 0, 0, 0),
        box(0.40, 0.42, 0.40, 0x537ca6, 0, 0.09, 0),
        box(0.42, 0.03, 0.42, 0xf2c55c, 0, 0.51, 0),
        box(0.30, 0.24, 0.30, 0xa8c8e6, 0, 0.54, 0),
        box(0.33, 0.04, 0.33, 0xf2c55c, 0, 0.78, 0),
      ]),
      merged([
        box(0.412, 0.048, 0.412, 0xfff0b8, 0, 0.14, 0),
        box(0.412, 0.048, 0.412, 0xfff0b8, 0, 0.23, 0),
        box(0.412, 0.048, 0.412, 0xfff0b8, 0, 0.32, 0),
        box(0.412, 0.048, 0.412, 0xfff0b8, 0, 0.41, 0),
        box(0.312, 0.048, 0.312, 0xfff0b8, 0, 0.59, 0),
        box(0.312, 0.048, 0.312, 0xfff0b8, 0, 0.68, 0),
      ]),
    ];
  }
  // Level 4: Grand luxury skyscraper with champagne-gold crown & spire (~1.16 tall)
  return [
    merged([
      box(0.58, 0.07, 0.58, 0x1b3452, 0, 0, 0),
      box(0.48, 0.07, 0.48, 0x2b4f78, 0, 0.07, 0),
      cyl(0.21, 0.21, 0.64, 24, 0x1e3c5e, 0, 0.14, 0),
      cyl(0.23, 0.23, 0.04, 24, 0xffd363, 0, 0.78, 0),
      cyl(0.15, 0.15, 0.14, 24, 0x345e8c, 0, 0.82, 0),
      cyl(0.17, 0.17, 0.03, 24, 0xffd363, 0, 0.96, 0),
      cyl(0.008, 0.032, 0.17, 12, 0xffdf85, 0, 0.99, 0),
    ]),
    merged([
      cyl(0.216, 0.216, 0.042, 24, 0xfff2bf, 0, 0.19, 0),
      cyl(0.216, 0.216, 0.042, 24, 0xfff2bf, 0, 0.29, 0),
      cyl(0.216, 0.216, 0.042, 24, 0xfff2bf, 0, 0.39, 0),
      cyl(0.216, 0.216, 0.042, 24, 0xfff2bf, 0, 0.49, 0),
      cyl(0.216, 0.216, 0.042, 24, 0xfff2bf, 0, 0.59, 0),
      cyl(0.216, 0.216, 0.042, 24, 0xfff2bf, 0, 0.69, 0),
      cyl(0.156, 0.156, 0.050, 24, 0xfff2bf, 0, 0.865, 0),
    ]),
  ];
}

export function createAwards(scene: THREE.Scene) {
  const structureMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, vertexColors: true, metalness: 0.28, roughness: 0.36,
  });
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, vertexColors: true, emissive: 0xffd275, emissiveIntensity: 0.45, metalness: 0.1, roughness: 0.22,
  });

  const batches = ([1, 2, 3, 4] as const).map((level) => {
    const geometry = buildingGeometry(level);
    const meshes = geometry.map((shape, index) => {
      const mesh = new THREE.InstancedMesh(shape, index === 0 ? structureMat : windowMat, 32);
      mesh.name = `building-${level}-${index === 0 ? "structure" : "windows"}`;
      mesh.count = 0;
      mesh.frustumCulled = false;
      scene.add(mesh);
      return mesh;
    });
    return { level, meshes };
  });

  const matrix = new THREE.Matrix4();
  const identityRotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  return {
    update(placements: readonly AwardPlacement[], pixelsPerUnit: number, selected: string | null, _time = 0,
      _viewRotation?: THREE.Quaternion, _facingTime?: number) {
      batches.forEach(({ meshes }) => meshes.forEach((mesh) => { mesh.count = 0; }));
      for (const placement of placements) {
        const summary = placement.summary ?? summarizeAwards([placement.id]);
        if (!summary) continue;
        const count = placement.recipientCount ?? summary.makerCount;
        const level = buildingLevelForCount(count);
        const { meshes } = batches.find((batch) => batch.level === level)!;
        const size = Math.min(1.65, 82 / Math.max(1, pixelsPerUnit), Math.max(0.75, 58 / Math.max(1, pixelsPerUnit)))
          * (selected === placement.id ? 1.12 : placement.faceViewer ? 1.06 : 1);
        scale.setScalar(size);
        matrix.compose(placement.position, identityRotation, scale);
        const index = meshes[0]!.count;
        if (index >= meshes[0]!.instanceMatrix.count) continue;
        for (const mesh of meshes) {
          mesh.setMatrixAt(index, matrix);
          mesh.count++;
        }
      }
      for (const { meshes } of batches) {
        meshes.forEach((mesh) => { mesh.instanceMatrix.needsUpdate = true; });
      }
      return false;
    },
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>();
      for (const { meshes } of batches) {
        meshes.forEach((mesh) => { scene.remove(mesh); geometries.add(mesh.geometry); mesh.dispose(); });
      }
      geometries.forEach((geometry) => geometry.dispose());
      structureMat.dispose();
      windowMat.dispose();
    },
  };
}
