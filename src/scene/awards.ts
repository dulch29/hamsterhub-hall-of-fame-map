import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

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
export type AwardPlacement = { id: string; position: THREE.Vector3; summary?: AwardSummary; faceViewer?: boolean };

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
    bevelSegments: 2, steps: 1, curveSegments: 1,
  });
}

function disk(radius: number, depth: number, bevel: number) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 20,
  });
}

function ribbon() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.09, 0.01);
  shape.lineTo(0.09, 0.01);
  shape.lineTo(0.08, -0.27);
  shape.lineTo(0, -0.20);
  shape.lineTo(-0.08, -0.27);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSize: 0.006,
    bevelThickness: 0.006,
    bevelSegments: 1,
    steps: 1,
    curveSegments: 1,
  });
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    positions.setZ(i, positions.getZ(i) + Math.sin(-y * 11) * 0.032);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function colored(geometry: THREE.BufferGeometry, hex: number) {
  const color = new THREE.Color(hex);
  const values = new Float32Array(geometry.getAttribute("position").count * 3);
  for (let i = 0; i < values.length; i += 3) color.toArray(values, i);
  geometry.setAttribute("color", new THREE.BufferAttribute(values, 3));
  return geometry;
}

function merged(parts: THREE.BufferGeometry[]) {
  for (const geometry of parts) if (!geometry.hasAttribute("color")) colored(geometry, 0xffffff);
  const geometries = parts.map((geometry) => geometry.index ? geometry.toNonIndexed() : geometry.clone());
  const geometry = mergeGeometries(geometries)!;
  parts.forEach((part) => part.dispose());
  geometries.forEach((part) => part.dispose());
  return geometry;
}

function medalGeometry() {
  return [
    merged([
      disk(0.29, 0.065, 0.014),
      part(new THREE.TorusGeometry(0.274, 0.024, 8, 40), 0, 0, 0.101),
      part(new THREE.TorusGeometry(0.212, 0.012, 6, 32), 0, 0, 0.108),
      part(star(0.145), 0, 0, 0.113),
      part(new THREE.TorusGeometry(0.265, 0.014, 6, 32), 0, 0, -0.02),
      part(star(0.10), 0, 0, -0.034, Math.PI),
      ...Array.from({ length: 12 }, (_, i) => {
        const angle = i / 12 * Math.PI * 2;
        return part(new THREE.SphereGeometry(0.008, 5, 3), Math.cos(angle) * .244, Math.sin(angle) * .244, .11);
      }),
    ]),
    merged([
      colored(part(disk(0.235, 0.018, 0.006), 0, 0, 0.083), 0x103969),
      colored(part(ribbon(), -0.10, -0.11, -0.07, 0, -0.20), 0x2877cb),
      colored(part(ribbon(), 0.10, -0.11, -0.07, 0, 0.20), 0x1b5ca3),
    ]),
  ] as const;
}

function trophyGeometry() {
  const profile = new THREE.SplineCurve([
    new THREE.Vector2(0.05, -0.03), new THREE.Vector2(0.13, 0.0),
    new THREE.Vector2(0.22, 0.12), new THREE.Vector2(0.27, 0.30),
    new THREE.Vector2(0.25, 0.35), new THREE.Vector2(0.215, 0.35),
    new THREE.Vector2(0.20, 0.28), new THREE.Vector2(0.15, 0.13),
    new THREE.Vector2(0.075, 0.045), new THREE.Vector2(0.05, 0.045),
  ]);
  const profilePoints = profile.getPoints(26);
  const bowl = new THREE.LatheGeometry(profilePoints, 32);
  const seatOnCup = (geometry: THREE.BufferGeometry) => {
    const positions = geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i);
      let radius = 0;
      for (let j = 1; j < profilePoints.length; j++) {
        const a = profilePoints[j - 1]!, b = profilePoints[j]!;
        if (a.y === b.y || y < Math.min(a.y, b.y) || y > Math.max(a.y, b.y)) continue;
        radius = Math.max(radius, THREE.MathUtils.lerp(a.x, b.x, (y - a.y) / (b.y - a.y)));
      }
      // Seat the seal on the outer lathe surface instead of a floating flat plane.
      positions.setZ(i, Math.sqrt(Math.max(0, radius * radius - x * x)) + positions.getZ(i) - .24);
    }
    geometry.computeVertexNormals();
    return geometry;
  };
  const handle = (side: number) => new THREE.TubeGeometry(new THREE.CubicBezierCurve3(
    new THREE.Vector3(side * .215, .29, 0), new THREE.Vector3(side * .45, .36, 0),
    new THREE.Vector3(side * .41, .035, 0), new THREE.Vector3(side * .17, .065, 0),
  ), 20, .032, 7, false);
  return [
    merged([
      bowl,
      part(new THREE.TorusGeometry(0.255, 0.024, 8, 28), 0, 0.345, 0, Math.PI / 2),
      handle(-1), handle(1),
      part(new THREE.CylinderGeometry(0.04, 0.07, 0.20, 16), 0, -0.12),
      part(new THREE.CylinderGeometry(0.14, 0.17, 0.045, 24), 0, -0.235),
      seatOnCup(part(new THREE.TorusGeometry(0.095, 0.012, 6, 24), 0, 0.18, 0.256)),
      seatOnCup(part(star(0.065), 0, 0.18, 0.263)),
      part(new RoundedBoxGeometry(0.17, 0.045, 0.018, 1, .008), 0, -0.30, 0.146),
    ]),
    merged([
      colored(part(new RoundedBoxGeometry(0.34, 0.12, 0.28, 2, .025), 0, -0.31), 0x103969),
      colored(seatOnCup(part(disk(0.083, 0.012, .004), 0, 0.18, .244)), 0x103969),
    ]),
  ] as const;
}

export function createAwards(scene: THREE.Scene) {
  const enamel = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, metalness: 0.12, roughness: 0.32 });
  const medals = medalGeometry();
  const batches = (["gold", "silver", "bronze", "trophy"] as const).map((style) => {
    const metal = new THREE.MeshStandardMaterial({
      color: style === "silver" ? 0xd5e5f5 : style === "bronze" ? 0xd68a55 : 0xffd363,
      metalness: 0.65, roughness: 0.25,
    });
    const geometry = style === "trophy" ? trophyGeometry() : medals;
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
  const restingRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, THREE.MathUtils.degToRad(15)));
  const turns = new Map<string, { current: THREE.Quaternion; from: THREE.Quaternion; target: THREE.Quaternion; start: number }>();
  const scale = new THREE.Vector3();
  const center = new THREE.Vector3();
  const orbit = new THREE.Vector3();
  const orbitTilt = new THREE.Euler();
  return {
    update(placements: readonly AwardPlacement[], pixelsPerUnit: number, selected: string | null, time = 0,
      viewRotation?: THREE.Quaternion, facingTime?: number) {
      let turning = false;
      const visibleIds = new Set(placements.map((placement) => placement.id));
      for (const id of turns.keys()) if (!visibleIds.has(id)) turns.delete(id);
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
        rotation.copy(restingRotation);
        if ((placement.faceViewer ?? selected === placement.id) && viewRotation) rotation.premultiply(viewRotation);
        let turn = turns.get(placement.id);
        if (!turn) {
          turn = { current: restingRotation.clone(), from: restingRotation.clone(), target: restingRotation.clone(), start: 0 };
          turns.set(placement.id, turn);
        }
        if (facingTime === undefined) {
          turn.current.copy(rotation);
          turn.from.copy(rotation);
          turn.target.copy(rotation);
        } else {
          if (turn.target.angleTo(rotation) > 1e-6) {
            turn.from.copy(turn.current);
            turn.target.copy(rotation);
            turn.start = facingTime;
          }
          const progress = THREE.MathUtils.clamp((facingTime - turn.start) / 280, 0, 1);
          turn.current.slerpQuaternions(turn.from, turn.target, 1 - (1 - progress) ** 3);
          turning ||= turn.current.angleTo(turn.target) > 1e-6;
        }
        rotation.copy(turn.current);
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
      return turning;
    },
    dispose() {
      turns.clear();
      const geometries = new Set<THREE.BufferGeometry>();
      for (const { meshes, metal } of batches) {
        meshes.forEach((mesh) => { scene.remove(mesh); geometries.add(mesh.geometry); mesh.dispose(); });
        metal.dispose();
      }
      geometries.forEach((geometry) => geometry.dispose());
      enamel.dispose();
    },
  };
}
