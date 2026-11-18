import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type AwardStyle = "gold" | "silver" | "bronze" | "trophy";
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

export function summarizeAwards(ids: readonly string[]) {
  const makers = [...new Set(ids)].filter((id) => Object.hasOwn(SAMPLE_AWARDS, id)).sort();
  const awards = makers.flatMap((id) => [SAMPLE_AWARDS[id]!, ...(SAMPLE_COMPANIONS[id] ?? [])]
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
export type AwardPlacement = { id: string; position: THREE.Vector3; summary?: AwardSummary };

function part(geometry: THREE.BufferGeometry, x = 0, y = 0, z = 0, rx = 0, rz = 0) {
  geometry.rotateX(rx);
  geometry.rotateZ(rz);
  geometry.translate(x, y, z);
  return geometry;
}

function star(radius: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const angle = Math.PI / 2 + i * Math.PI / 5;
    const r = i % 2 ? radius * 0.46 : radius;
    const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
    if (i) shape.lineTo(x, y); else shape.moveTo(x, y);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.018, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008,
    bevelSegments: 1, steps: 1, curveSegments: 1,
  });
}

function merged(parts: THREE.BufferGeometry[]) {
  const geometries = parts.map((geometry) => geometry.index ? geometry.toNonIndexed() : geometry.clone());
  const geometry = mergeGeometries(geometries)!;
  parts.forEach((part) => part.dispose());
  geometries.forEach((part) => part.dispose());
  return geometry;
}

function medalGeometry() {
  return [
    merged([
      part(new THREE.CylinderGeometry(0.28, 0.28, 0.075, 32), 0, 0, 0, Math.PI / 2),
      part(new THREE.TorusGeometry(0.254, 0.022, 6, 32), 0, 0, 0.058),
      part(star(0.16), 0, 0, 0.067),
    ]),
    merged([
      part(new THREE.CylinderGeometry(0.222, 0.222, 0.018, 32), 0, 0, 0.047, Math.PI / 2),
      part(new THREE.BoxGeometry(0.115, 0.26, 0.035), -0.095, -0.27, -0.04, 0, -0.18),
      part(new THREE.BoxGeometry(0.115, 0.26, 0.035), 0.095, -0.27, -0.04, 0, 0.18),
    ]),
  ] as const;
}

function trophyGeometry() {
  const bowl = new THREE.LatheGeometry([
    new THREE.Vector2(0.055, -0.02), new THREE.Vector2(0.13, 0.02),
    new THREE.Vector2(0.2, 0.13), new THREE.Vector2(0.235, 0.3),
    new THREE.Vector2(0.21, 0.3), new THREE.Vector2(0.17, 0.14),
    new THREE.Vector2(0.08, 0.06),
  ], 24);
  return [
    merged([
      bowl,
      part(new THREE.TorusGeometry(0.13, 0.027, 6, 20), -0.21, 0.16),
      part(new THREE.TorusGeometry(0.13, 0.027, 6, 20), 0.21, 0.16),
      part(new THREE.CylinderGeometry(0.038, 0.065, 0.2, 12), 0, -0.12),
      part(new THREE.BoxGeometry(0.3, 0.04, 0.24), 0, -0.23),
      part(star(0.085), 0, 0.17, 0.204),
    ]),
    merged([
      part(new THREE.BoxGeometry(0.32, 0.12, 0.26), 0, -0.31),
      part(new THREE.BoxGeometry(0.17, 0.045, 0.008), 0, -0.3, 0.134),
    ]),
  ] as const;
}

export function createAwards(scene: THREE.Scene) {
  const enamel = new THREE.MeshStandardMaterial({ color: 0x175fc0, metalness: 0.18, roughness: 0.28 });
  const batches = (["gold", "silver", "bronze", "trophy"] as const).map((style) => {
    const metal = new THREE.MeshStandardMaterial({
      color: style === "silver" ? 0xd5e5f5 : style === "bronze" ? 0xd68a55 : 0xffd363,
      metalness: 0.65, roughness: 0.25,
    });
    const geometry = style === "trophy" ? trophyGeometry() : medalGeometry();
    const meshes = geometry.map((shape, index) => {
      const mesh = new THREE.InstancedMesh(shape, index === 0 ? metal : enamel, 12);
      mesh.name = `award-${style}-${index === 0 ? "metal" : "enamel"}`;
      mesh.count = 0;
      mesh.frustumCulled = false;
      scene.add(mesh);
      return mesh;
    });
    return { style, metal, meshes };
  });
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const center = new THREE.Vector3();
  const orbit = new THREE.Vector3();
  const orbitTilt = new THREE.Euler();
  return {
    update(placements: readonly AwardPlacement[], pixelsPerUnit: number, selected: string | null, time = 0) {
      batches.forEach(({ meshes }) => meshes.forEach((mesh) => { mesh.count = 0; }));
      const place = (style: AwardStyle, position: THREE.Vector3, size: number) => {
        const { meshes } = batches.find((batch) => batch.style === style)!;
        scale.setScalar(size);
        matrix.compose(position, rotation, scale);
        const index = meshes[0]!.count;
        for (const mesh of meshes) {
          mesh.setMatrixAt(index, matrix);
          mesh.count++;
        }
      };
      for (const placement of placements) {
        const summary = placement.summary ?? summarizeAwards([placement.id]);
        if (!summary) continue;
        const size = Math.min(1.75, 86 / Math.max(1, pixelsPerUnit), Math.max(0.8, 62 / Math.max(1, pixelsPerUnit)))
          * (selected === placement.id ? 1.12 : 1);
        const seed = Object.keys(SAMPLE_AWARDS).indexOf(summary.leadId);
        center.copy(placement.position);
        // Clear the upright base and the lowest companion arc at every zoom size.
        center.y += size * (0.34 + Math.sin(time / 5200 * Math.PI * 2 + seed * 1.7) * 0.065);
        place(summary.primary, center, size);
        const companions = summary.companions.flatMap(({ style, count }) => Array.from({ length: count }, () => style));
        companions.forEach((style, index) => {
          const angle = time / 10000 * Math.PI * 2 + index * Math.PI * 2 / companions.length + 0.7;
          orbit.set(Math.cos(angle) * 0.62, Math.sin(angle) * 0.48, 0);
          orbitTilt.set(index % 2 ? -0.95 : 0.95, 0, index % 2 ? -0.65 : 0.65);
          orbit.applyEuler(orbitTilt).multiplyScalar(size).add(center);
          place(style, orbit, size * 0.34);
        });
      }
      for (const { meshes } of batches) {
        meshes.forEach((mesh) => { mesh.instanceMatrix.needsUpdate = true; });
      }
    },
    dispose() {
      for (const { meshes, metal } of batches) {
        meshes.forEach((mesh) => { scene.remove(mesh); mesh.geometry.dispose(); mesh.dispose(); });
        metal.dispose();
      }
      enamel.dispose();
    },
  };
}
