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
  // Architectural palette: deep slate-navy podiums, crisp steel-blue facades, travertine, and champagne gold
  const plinth = 0x102238;
  const podium = 0x193250;
  const facadeDark = 0x1e3b5c;
  const facadeMid = 0x2b5078;
  const facadeLight = 0x4573a1;
  const stone = 0xd8e4f0;
  const gold = 0xe8be5a;
  const goldBright = 0xf7d883;
  const glassWarm = 0xffe79e;
  const glassBright = 0xfff3c9;

  if (level === 1) {
    // Tier 1 (~0.40 tall): Contemporary Thai Boutique Pavilion
    // 2-step dark granite plinth, corner pilasters, cantilevered eave with gold soffit, stepped roof & clerestory lantern
    return [
      merged([
        box(0.42, 0.032, 0.42, plinth, 0, 0, 0),
        box(0.36, 0.032, 0.36, podium, 0, 0.032, 0),
        box(0.16, 0.022, 0.08, stone, 0, 0.01, 0.21), // front entry step
        box(0.28, 0.17, 0.28, facadeMid, 0, 0.064, 0),
        // 4 corner steel pilasters
        box(0.045, 0.18, 0.045, facadeDark, -0.135, 0.064, -0.135),
        box(0.045, 0.18, 0.045, facadeDark, 0.135, 0.064, -0.135),
        box(0.045, 0.18, 0.045, facadeDark, -0.135, 0.064, 0.135),
        box(0.045, 0.18, 0.045, facadeDark, 0.135, 0.064, 0.135),
        // Cantilevered gold soffit + deep eave roof + stepped hipped crown
        box(0.37, 0.018, 0.37, gold, 0, 0.234, 0),
        box(0.41, 0.034, 0.41, plinth, 0, 0.252, 0),
        box(0.29, 0.038, 0.29, podium, 0, 0.286, 0),
        box(0.18, 0.032, 0.18, facadeLight, 0, 0.324, 0),
        box(0.11, 0.018, 0.11, goldBright, 0, 0.382, 0),
      ]),
      merged([
        // Studio glass bays + glowing clerestory ridge lantern
        box(0.295, 0.105, 0.295, glassWarm, 0, 0.095, 0),
        box(0.145, 0.026, 0.145, glassBright, 0, 0.356, 0),
      ]),
    ];
  }

  if (level === 2) {
    // Tier 2 (~0.64 tall): Modern Bangkok Architectural Mid-Rise
    // Stepped podium + illuminated lobby canopy, asymmetric dual-massing tower, vertical fins & rooftop skylight
    return [
      merged([
        box(0.48, 0.04, 0.48, plinth, 0, 0, 0),
        box(0.42, 0.04, 0.42, podium, 0, 0.04, 0),
        box(0.20, 0.018, 0.09, gold, 0, 0.13, 0.22), // entry canopy
        // Main tower shaft
        box(0.32, 0.34, 0.32, facadeMid, -0.02, 0.08, -0.01),
        // Asymmetric vertical architectural fins
        box(0.038, 0.35, 0.34, facadeDark, -0.14, 0.08, -0.01),
        box(0.038, 0.35, 0.34, facadeDark, 0.10, 0.08, -0.01),
        box(0.34, 0.35, 0.038, facadeDark, -0.02, 0.08, 0.11),
        // Upper setback wing & terrace
        box(0.34, 0.024, 0.34, gold, -0.02, 0.42, -0.01),
        box(0.22, 0.13, 0.24, facadeLight, 0.03, 0.444, -0.03),
        box(0.24, 0.024, 0.26, goldBright, 0.03, 0.574, -0.03),
        box(0.12, 0.018, 0.14, podium, 0.03, 0.622, -0.03),
      ]),
      merged([
        box(0.332, 0.046, 0.332, glassBright, -0.02, 0.092, -0.01),
        box(0.332, 0.042, 0.332, glassWarm, -0.02, 0.185, -0.01),
        box(0.332, 0.042, 0.332, glassWarm, -0.02, 0.268, -0.01),
        box(0.332, 0.042, 0.332, glassWarm, -0.02, 0.350, -0.01),
        box(0.232, 0.044, 0.252, glassBright, 0.03, 0.486, -0.03),
        box(0.11, 0.024, 0.13, glassBright, 0.03, 0.598, -0.03), // skylight penthouse
      ]),
    ];
  }

  if (level === 3) {
    // Tier 3 (~0.98 tall): King Power Mahanakhon-Inspired Pixelated Skyscraper
    // Terraced granite podium, sleek dark steel-and-glass monolith, spiraling 3D pixelated cutout ribbon, gold SkyWalk crown
    return [
      merged([
        box(0.54, 0.045, 0.54, plinth, 0, 0, 0),
        box(0.46, 0.045, 0.46, podium, 0, 0.045, 0),
        // Core square monolith
        box(0.33, 0.78, 0.33, facadeDark, 0, 0.09, 0),
        // Vertical corner structural mullions
        box(0.035, 0.78, 0.035, podium, -0.165, 0.09, -0.165),
        box(0.035, 0.78, 0.035, podium, 0.165, 0.09, -0.165),
        box(0.035, 0.78, 0.035, podium, -0.165, 0.09, 0.165),
        box(0.035, 0.78, 0.035, podium, 0.165, 0.09, 0.165),
        // Spiraling 3D pixelated cutout blocks wrapping around the tower
        box(0.11, 0.075, 0.11, facadeLight, 0.145, 0.18, 0.145),
        box(0.095, 0.065, 0.095, gold, 0.07, 0.25, 0.165),
        box(0.11, 0.075, 0.11, facadeLight, -0.145, 0.31, 0.145),
        box(0.095, 0.065, 0.095, facadeMid, -0.165, 0.38, 0.06),
        box(0.11, 0.075, 0.11, facadeLight, -0.145, 0.44, -0.145),
        box(0.095, 0.065, 0.095, gold, -0.06, 0.51, -0.165),
        box(0.11, 0.075, 0.11, facadeLight, 0.145, 0.57, -0.145),
        box(0.095, 0.065, 0.095, facadeMid, 0.165, 0.64, -0.05),
        box(0.11, 0.075, 0.11, facadeLight, 0.145, 0.70, 0.145),
        box(0.095, 0.065, 0.095, gold, 0.04, 0.76, 0.165),
        // Cantilevered SkyWalk observation deck crown
        box(0.36, 0.025, 0.36, gold, 0, 0.87, 0),
        box(0.38, 0.04, 0.38, plinth, 0, 0.895, 0),
        box(0.24, 0.045, 0.24, goldBright, 0, 0.935, 0),
      ]),
      merged([
        // Illuminated lobby atrium
        box(0.345, 0.055, 0.345, glassBright, 0, 0.10, 0),
        // Horizontal glass curtain-wall bands
        box(0.342, 0.032, 0.342, glassWarm, 0, 0.22, 0),
        box(0.342, 0.032, 0.342, glassWarm, 0, 0.35, 0),
        box(0.342, 0.032, 0.342, glassWarm, 0, 0.48, 0),
        box(0.342, 0.032, 0.342, glassWarm, 0, 0.61, 0),
        box(0.342, 0.032, 0.342, glassWarm, 0, 0.74, 0),
        // Glowing sky-terrace pixel pockets inside the spiral
        box(0.088, 0.055, 0.088, glassBright, 0.155, 0.245, 0.11),
        box(0.088, 0.055, 0.088, glassBright, -0.11, 0.375, 0.155),
        box(0.088, 0.055, 0.088, glassBright, -0.155, 0.505, -0.10),
        box(0.088, 0.055, 0.088, glassBright, 0.11, 0.635, -0.155),
        box(0.088, 0.055, 0.088, glassBright, 0.155, 0.755, 0.10),
        // SkyWalk glass parapet band
        box(0.355, 0.025, 0.355, glassBright, 0, 0.85, 0),
      ]),
    ];
  }

  // Tier 4 (~1.32 tall): Grand Bangkok Supertall Landmark (Baiyoke II / Magnolias Waterfront Inspired)
  // Faceted octagonal terraced podium, tapered 8-sided shaft with gold ribs, sky-lounge setback, observation crown & needle spire
  return [
    merged([
      cyl(0.29, 0.31, 0.05, 8, plinth, 0, 0, 0),
      cyl(0.24, 0.26, 0.055, 8, podium, 0, 0.05, 0),
      // Main faceted 8-sided tapered supertall shaft
      cyl(0.185, 0.215, 0.68, 8, facadeDark, 0, 0.105, 0),
      // 4 champagne-gold vertical structural ribs
      box(0.032, 0.69, 0.41, gold, 0, 0.105, 0),
      box(0.41, 0.69, 0.032, gold, 0, 0.105, 0),
      // Mid-tower sky-lounge setback & crown collar
      cyl(0.205, 0.205, 0.035, 8, goldBright, 0, 0.785, 0),
      cyl(0.145, 0.165, 0.17, 8, facadeMid, 0, 0.82, 0),
      // Illuminated observation deck crown & lantern
      cyl(0.185, 0.16, 0.035, 8, goldBright, 0, 0.99, 0),
      cyl(0.11, 0.13, 0.08, 8, podium, 0, 1.025, 0),
      cyl(0.06, 0.08, 0.045, 8, gold, 0, 1.105, 0),
      // Soaring Bangkok landmark needle spire
      cyl(0.007, 0.028, 0.17, 8, goldBright, 0, 1.15, 0),
    ]),
    merged([
      cyl(0.252, 0.252, 0.035, 8, glassBright, 0, 0.06, 0),
      cyl(0.214, 0.217, 0.04, 8, glassWarm, 0, 0.17, 0),
      cyl(0.209, 0.212, 0.04, 8, glassWarm, 0, 0.28, 0),
      cyl(0.204, 0.207, 0.04, 8, glassWarm, 0, 0.39, 0),
      cyl(0.199, 0.202, 0.04, 8, glassWarm, 0, 0.50, 0),
      cyl(0.194, 0.197, 0.04, 8, glassWarm, 0, 0.61, 0),
      cyl(0.189, 0.192, 0.04, 8, glassBright, 0, 0.71, 0),
      cyl(0.160, 0.165, 0.055, 8, glassBright, 0, 0.88, 0),
      cyl(0.125, 0.125, 0.03, 8, glassBright, 0, 1.05, 0),
    ]),
  ];
}

export function createAwards(scene: THREE.Scene) {
  const structureMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, vertexColors: true, metalness: 0.36, roughness: 0.30,
  });
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, vertexColors: true, emissive: 0xffc857, emissiveIntensity: 0.62, metalness: 0.18, roughness: 0.16,
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
