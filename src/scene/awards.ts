import * as THREE from "three";

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

export const PIN_HEIGHT = 0.96;

export const BUILDING_HEIGHT_BY_LEVEL: Record<BuildingLevel, number> = {
  1: 0.40,
  2: 0.64,
  3: 0.98,
  4: 1.32,
};

export function buildingScaleForView(pixelsPerUnit: number, selected: boolean, faceViewer = false): number {
  return Math.min(1.65, 82 / Math.max(1, pixelsPerUnit), Math.max(0.75, 58 / Math.max(1, pixelsPerUnit)))
    * (selected ? 1.12 : faceViewer ? 1.06 : 1);
}

export function buildingLevelForCount(count: number): BuildingLevel {
  if (count >= 8) return 4;
  if (count >= 4) return 3;
  if (count >= 2) return 2;
  return 1;
}

export type PinColorSpec = {
  body: number;
  hex: string;
  glow: number;
};

const CURATED_PROVINCE_COLORS: Record<string, PinColorSpec> = {
  "TH-10": { body: 0xf59e0b, hex: "#f59e0b", glow: 0xfcd34d }, // Bangkok: warm gold
  "TH-50": { body: 0xe11d48, hex: "#e11d48", glow: 0xfb7185 }, // Chiang Mai: Lanna rose
  "TH-40": { body: 0x10b981, hex: "#10b981", glow: 0x34d399 }, // Khon Kaen: Isan emerald
  "TH-83": { body: 0x0284c7, hex: "#0284c7", glow: 0x38bdf8 }, // Phuket: Andaman sky
};

const PROVINCE_PALETTE: readonly PinColorSpec[] = [
  { body: 0x2563eb, hex: "#2563eb", glow: 0x60a5fa },
  { body: 0x10b981, hex: "#10b981", glow: 0x34d399 },
  { body: 0xf59e0b, hex: "#f59e0b", glow: 0xfcd34d },
  { body: 0xe11d48, hex: "#e11d48", glow: 0xfb7185 },
  { body: 0x7c3aed, hex: "#7c3aed", glow: 0xa78bfa },
  { body: 0x0891b2, hex: "#0891b2", glow: 0x22d3ee },
  { body: 0xea580c, hex: "#ea580c", glow: 0xfb923c },
  { body: 0x059669, hex: "#059669", glow: 0x6ee7b7 },
];

const PIN_COLOR_BLUE: PinColorSpec = { body: 0x0ea5e9, hex: "#0284c7", glow: 0x38bdf8 };
const PIN_COLOR_GREEN: PinColorSpec = { body: 0x10b981, hex: "#059669", glow: 0x34d399 };
const PIN_COLOR_YELLOW: PinColorSpec = { body: 0xf59e0b, hex: "#d97706", glow: 0xffdc50 };

/**
 * Color-codes pins by awardee count: Blue (< 3), Green (3..5), Yellow (>= 6).
 */
export function pinColorForCount(count: number): PinColorSpec {
  if (count < 3) return PIN_COLOR_BLUE;
  if (count < 6) return PIN_COLOR_GREEN;
  return PIN_COLOR_YELLOW;
}

export function provincePinColor(province?: string): PinColorSpec {
  if (province && CURATED_PROVINCE_COLORS[province]) {
    return CURATED_PROVINCE_COLORS[province]!;
  }
  if (!province) return PROVINCE_PALETTE[0]!;
  let hash = 0;
  for (let i = 0; i < province.length; i++) {
    hash = (hash * 31 + province.charCodeAt(i)) >>> 0;
  }
  return PROVINCE_PALETTE[hash % PROVINCE_PALETTE.length]!;
}

export function formatPinCount(count: number): string {
  const safe = Math.max(0, Math.floor(count));
  return safe < 10 ? `0${safe}` : String(safe);
}

const SLOT_DURATION_MS = 2000;
const SLOT_TOTAL_STEPS = 18;

/**
 * Computes the 2-second landing slot-machine reel state before landing on `targetCount`.
 */
export function slotReelState(targetCount: number, elapsedMs: number, staggerMs = 0): {
  current: number;
  next: number;
  offset: number;
  settled: boolean;
} {
  const safeTarget = Math.max(0, Math.floor(targetCount));
  if (elapsedMs <= 0 || elapsedMs >= SLOT_DURATION_MS + staggerMs) {
    return { current: safeTarget, next: safeTarget, offset: 0, settled: true };
  }
  const localMs = Math.max(0, elapsedMs - staggerMs);
  const progress = Math.min(1, localMs / SLOT_DURATION_MS);
  if (progress >= 1) {
    return { current: safeTarget, next: safeTarget, offset: 0, settled: true };
  }
  const eased = 1 - (1 - progress) ** 3;
  const stepFloat = eased * SLOT_TOTAL_STEPS;
  const stepIndex = Math.floor(stepFloat);
  const offset = stepFloat - stepIndex;
  const startDigit = (safeTarget + 100 - (SLOT_TOTAL_STEPS % 100)) % 100;
  const current = (startDigit + stepIndex) % 100;
  const next = (startDigit + stepIndex + 1) % 100;
  return { current, next, offset, settled: false };
}

const SPIN_START_DELAY_MS = 2600;
const SPIN_CYCLE_MS = 6500;
const SPIN_ACTIVE_MS = 2200;

/**
 * Occasionally spins one pin like a glowing spinning top (`ลูกข่างเรืองแสง`).
 */
export function spinningTopState(timeMs: number, pinIndex: number, pinCount: number, isSelected: boolean): {
  active: boolean;
  spinAngle: number;
  glow: number;
  tilt: number;
} {
  if (isSelected || pinCount <= 0 || timeMs < SPIN_START_DELAY_MS) {
    return { active: false, spinAngle: 0, glow: 0, tilt: 0 };
  }
  const elapsed = timeMs - SPIN_START_DELAY_MS;
  const cycle = Math.floor(elapsed / SPIN_CYCLE_MS);
  const activeIndex = (cycle * 3 + 1) % pinCount;
  if (activeIndex !== pinIndex) {
    return { active: false, spinAngle: 0, glow: 0, tilt: 0 };
  }
  const phaseMs = elapsed % SPIN_CYCLE_MS;
  if (phaseMs >= SPIN_ACTIVE_MS) {
    return { active: false, spinAngle: 0, glow: 0, tilt: 0 };
  }
  const t = phaseMs / SPIN_ACTIVE_MS;
  const eased = t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
  const envelope = Math.sin(Math.PI * t);
  return {
    active: true,
    spinAngle: eased * Math.PI * 10,
    glow: envelope,
    tilt: envelope * 0.14,
  };
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
  province?: string;
};

function createPinBodyGeometry(): THREE.BufferGeometry {
  const cx = 0;
  const cy = 0.62;
  const r = 0.30;
  const theta = Math.asin(r / cy);
  const tx = r * Math.cos(theta);
  const ty = cy - r * Math.sin(theta);

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(tx, ty);
  shape.absarc(cx, cy, r, -theta, Math.PI + theta, false);
  shape.lineTo(0, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.014,
    bevelSegments: 2,
    curveSegments: 24,
  });
  geometry.translate(0, 0.014, -0.035);
  geometry.computeVertexNormals();
  return geometry;
}

function drawPinFace(
  ctx: CanvasRenderingContext2D,
  hexColor: string,
  current: number,
  next: number,
  offset: number,
  settled: boolean,
) {
  const size = ctx.canvas.width;
  const half = size / 2;
  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = "#f8fbff";
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(half, half, half - 8, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = hexColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 92px system-ui, -apple-system, 'Segoe UI', sans-serif";

  const travel = 104;
  if (settled || offset <= 0.001) {
    ctx.fillText(formatPinCount(current), half, half + 4);
  } else {
    ctx.fillText(formatPinCount(current), half, half + 4 - offset * travel);
    ctx.fillText(formatPinCount(next), half, half + 4 + (1 - offset) * travel);
  }
  ctx.restore();
}

function createRadialTexture(innerStop: number, midStop: number, midAlpha: number, outerStop: number): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255, 255, 255, 0)");
  grad.addColorStop(innerStop, "rgba(255, 255, 255, 0)");
  grad.addColorStop(midStop, `rgba(255, 255, 255, ${midAlpha})`);
  grad.addColorStop(outerStop, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

type PinInstance = {
  group: THREE.Group;
  bodyMesh: THREE.Mesh;
  bodyMat: THREE.MeshStandardMaterial;
  frontFace: THREE.Mesh;
  backFace: THREE.Mesh;
  faceMat: THREE.MeshBasicMaterial;
  haloMesh: THREE.Mesh;
  haloMat: THREE.MeshBasicMaterial;
  groundGlow: THREE.Mesh;
  groundGlowMat: THREE.MeshBasicMaterial;
  auraGroup: THREE.Group;
  auraBaseMat: THREE.MeshBasicMaterial;
  auraWave1: THREE.Mesh;
  auraWave1Mat: THREE.MeshBasicMaterial;
  auraWave2: THREE.Mesh;
  auraWave2Mat: THREE.MeshBasicMaterial;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  texture: THREE.CanvasTexture | null;
  lastDrawKey: string;
};

export function createAwards(scene: THREE.Scene) {
  const rootGroup = new THREE.Group();
  rootGroup.name = "province-map-pins";
  scene.add(rootGroup);

  const bodyGeometry = createPinBodyGeometry();
  const faceGeometry = new THREE.CircleGeometry(0.225, 36);
  const haloGeometry = new THREE.TorusGeometry(0.38, 0.018, 12, 48);
  const groundGlowGeometry = new THREE.RingGeometry(0.08, 0.24, 32);
  groundGlowGeometry.rotateX(-Math.PI / 2);
  const auraBaseGeometry = new THREE.CircleGeometry(0.58, 40);
  auraBaseGeometry.rotateX(-Math.PI / 2);
  const auraWaveGeometry = new THREE.RingGeometry(0.24, 0.44, 48);
  auraWaveGeometry.rotateX(-Math.PI / 2);

  const auraGlowTexture = createRadialTexture(0, 0.2, 0.85, 1);
  const auraRingTexture = createRadialTexture(0.45, 0.72, 1, 1);

  const pins = new Map<string, PinInstance>();
  const cameraForward = new THREE.Vector3();

  const createPinInstance = (id: string, colorSpec: PinColorSpec): PinInstance => {
    const group = new THREE.Group();
    group.name = `map-pin-${id}`;

    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorSpec.body,
      emissive: colorSpec.glow,
      emissiveIntensity: 0.14,
      metalness: 0.18,
      roughness: 0.32,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMat);
    group.add(bodyMesh);

    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let texture: THREE.CanvasTexture | null = null;
    if (typeof document !== "undefined") {
      canvas = document.createElement("canvas");
      canvas.width = 192;
      canvas.height = 192;
      ctx = canvas.getContext("2d");
      if (ctx) {
        drawPinFace(ctx, colorSpec.hex, 0, 0, 0, true);
        texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
      }
    }

    const faceMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
    });
    const frontFace = new THREE.Mesh(faceGeometry, faceMat);
    frontFace.position.set(0, 0.634, 0.052);
    const backFace = new THREE.Mesh(faceGeometry, faceMat);
    backFace.position.set(0, 0.634, -0.052);
    backFace.rotation.y = Math.PI;
    group.add(frontFace, backFace);

    const haloMat = new THREE.MeshBasicMaterial({
      color: colorSpec.glow,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMat);
    haloMesh.rotation.x = Math.PI / 2;
    haloMesh.position.set(0, 0.44, 0);
    haloMesh.visible = false;
    group.add(haloMesh);

    const groundGlowMat = new THREE.MeshBasicMaterial({
      color: colorSpec.glow,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const groundGlow = new THREE.Mesh(groundGlowGeometry, groundGlowMat);
    groundGlow.position.set(0, 0.015, 0);
    group.add(groundGlow);

    rootGroup.add(group);

    const auraGroup = new THREE.Group();
    auraGroup.name = `map-pin-aura-${id}`;
    auraGroup.visible = false;

    const auraBaseMat = new THREE.MeshBasicMaterial({
      color: colorSpec.glow,
      map: auraGlowTexture,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const auraBase = new THREE.Mesh(auraBaseGeometry, auraBaseMat);

    const makeWave = () => {
      const mat = new THREE.MeshBasicMaterial({
        color: colorSpec.glow,
        map: auraRingTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(auraWaveGeometry, mat);
      return { mesh, mat };
    };
    const w1 = makeWave();
    const w2 = makeWave();
    auraGroup.add(auraBase, w1.mesh, w2.mesh);
    rootGroup.add(auraGroup);

    return {
      group,
      bodyMesh,
      bodyMat,
      frontFace,
      backFace,
      faceMat,
      haloMesh,
      haloMat,
      groundGlow,
      groundGlowMat,
      auraGroup,
      auraBaseMat,
      auraWave1: w1.mesh,
      auraWave1Mat: w1.mat,
      auraWave2: w2.mesh,
      auraWave2Mat: w2.mat,
      canvas,
      ctx,
      texture,
      lastDrawKey: "",
    };
  };

  const disposePin = (pin: PinInstance) => {
    rootGroup.remove(pin.group, pin.auraGroup);
    pin.bodyMat.dispose();
    pin.faceMat.dispose();
    pin.haloMat.dispose();
    pin.groundGlowMat.dispose();
    pin.auraBaseMat.dispose();
    pin.auraWave1Mat.dispose();
    pin.auraWave2Mat.dispose();
    pin.texture?.dispose();
  };

  return {
    update(placements: readonly AwardPlacement[], pixelsPerUnit: number, selected: string | null, time = 0,
      viewRotation?: THREE.Quaternion, _facingTime?: number) {
      const seen = new Set<string>();
      let animating = false;

      let cameraYaw = 0;
      if (viewRotation) {
        cameraForward.set(0, 0, 1).applyQuaternion(viewRotation);
        cameraYaw = Math.atan2(cameraForward.x, cameraForward.z);
      }

      placements.forEach((placement, index) => {
        const summary = placement.summary ?? summarizeAwards([placement.id]);
        if (!summary) return;
        const count = placement.recipientCount ?? summary.makerCount;
        const colorSpec = pinColorForCount(count);
        seen.add(placement.id);

        let pin = pins.get(placement.id);
        if (!pin) {
          pin = createPinInstance(placement.id, colorSpec);
          pins.set(placement.id, pin);
        } else {
          pin.bodyMat.color.setHex(colorSpec.body);
          pin.bodyMat.emissive.setHex(colorSpec.glow);
          pin.haloMat.color.setHex(colorSpec.glow);
          pin.groundGlowMat.color.setHex(colorSpec.glow);
          pin.auraBaseMat.color.setHex(colorSpec.glow);
          pin.auraWave1Mat.color.setHex(colorSpec.glow);
          pin.auraWave2Mat.color.setHex(colorSpec.glow);
        }

        const isSelected = selected === placement.id;
        const scale = buildingScaleForView(pixelsPerUnit, isSelected, placement.faceViewer);
        const bobRamp = Math.min(1, time / 600);
        const bob = time > 0 ? Math.sin(time * 0.0028 + index * 1.35) * 0.055 * bobRamp : 0;
        const floatY = 0.10 + bob;

        const slot = slotReelState(count, time, index * 120);
        if (!slot.settled) animating = true;
        const drawKey = slot.settled
          ? `settled:${colorSpec.hex}:${slot.current}`
          : `roll:${colorSpec.hex}:${slot.current}:${slot.next}:${Math.round(slot.offset * 12)}`;
        if (pin.ctx && pin.texture && pin.lastDrawKey !== drawKey) {
          pin.lastDrawKey = drawKey;
          drawPinFace(pin.ctx, colorSpec.hex, slot.current, slot.next, slot.offset, slot.settled);
          pin.texture.needsUpdate = true;
        }

        const spin = spinningTopState(time, index, placements.length, isSelected);
        if (spin.active) animating = true;

        pin.group.position.set(placement.position.x, placement.position.y + floatY, placement.position.z);
        pin.group.scale.setScalar(scale);
        pin.group.rotation.set(spin.tilt, cameraYaw + spin.spinAngle, spin.tilt * 0.6);

        pin.bodyMat.emissiveIntensity = isSelected ? 0.36 : 0.14 + spin.glow * 0.62;
        pin.haloMesh.visible = spin.active;
        if (spin.active) {
          pin.haloMat.opacity = spin.glow * 0.78;
          pin.haloMesh.scale.setScalar(0.95 + spin.glow * 0.25);
        }
        pin.groundGlow.position.y = -floatY + 0.015;
        pin.groundGlowMat.opacity = isSelected ? 0.55 : 0.22 + spin.glow * 0.45;

        pin.auraGroup.visible = isSelected;
        if (isSelected) {
          pin.auraGroup.position.set(placement.position.x, placement.position.y + 0.018, placement.position.z);
          pin.auraGroup.scale.setScalar(scale);
          if (time > 0) {
            const cycleMs = 1800;
            const p1 = (time % cycleMs) / cycleMs;
            const p2 = ((time + cycleMs * 0.5) % cycleMs) / cycleMs;
            const applyWave = (mesh: THREE.Mesh, mat: THREE.MeshBasicMaterial, p: number) => {
              const s = 0.45 + p * 2.05;
              mesh.scale.setScalar(s);
              mat.opacity = Math.max(0, 0.85 * (1 - p) * (1 - p));
            };
            applyWave(pin.auraWave1, pin.auraWave1Mat, p1);
            applyWave(pin.auraWave2, pin.auraWave2Mat, p2);
            pin.auraBaseMat.opacity = 0.34 + Math.sin(time * 0.004) * 0.1;
          } else {
            pin.auraWave1.scale.setScalar(1.25);
            pin.auraWave1Mat.opacity = 0.55;
            pin.auraWave2Mat.opacity = 0;
            pin.auraBaseMat.opacity = 0.38;
          }
        }
      });

      for (const [id, pin] of pins) {
        if (!seen.has(id)) {
          disposePin(pin);
          pins.delete(id);
        }
      }

      if (time > 0 && placements.length > 0) animating = true;
      return animating;
    },
    dispose() {
      for (const pin of pins.values()) disposePin(pin);
      pins.clear();
      scene.remove(rootGroup);
      bodyGeometry.dispose();
      faceGeometry.dispose();
      haloGeometry.dispose();
      groundGlowGeometry.dispose();
      auraBaseGeometry.dispose();
      auraWaveGeometry.dispose();
      auraGlowTexture?.dispose();
      auraRingTexture?.dispose();
    },
  };
}
