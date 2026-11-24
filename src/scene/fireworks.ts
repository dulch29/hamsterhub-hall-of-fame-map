import * as THREE from "three";

type RocketPhase = {
  kind: "rocket";
  origin: THREE.Vector3;
  apexY: number;
  age: number;
  duration: number;
  headPoints: THREE.Points;
  headGeometry: THREE.BufferGeometry;
  headMaterial: THREE.PointsMaterial;
  trailLine: THREE.Line;
  trailGeometry: THREE.BufferGeometry;
  trailMaterial: THREE.LineBasicMaterial;
  onBurst?: () => void;
};

type BurstPhase = {
  kind: "burst";
  age: number;
  lifetime: number;
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  trails: THREE.LineSegments;
  trailGeometry: THREE.BufferGeometry;
  trailMaterial: THREE.LineBasicMaterial;
  flash: THREE.Sprite;
  flashMaterial: THREE.SpriteMaterial;
  positions: Float32Array;
  prevPositions: Float32Array;
  velocities: Float32Array;
  trailPositions: Float32Array;
};

type ActiveFirework = RocketPhase | BurstPhase;

const PALETTE = [0xffdc50, 0xff9500, 0x67e8f9, 0xfb7185, 0xffffff] as const;

export type BuildingFireworks = {
  launch: (origin: THREE.Vector3, onBurst?: () => void) => void;
  update: (dtSeconds: number) => boolean;
  active: () => boolean;
  dispose: () => void;
};

function createGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.28, "rgba(255, 255, 255, 0.92)");
  grad.addColorStop(0.65, "rgba(255, 255, 255, 0.35)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Two-stage 3D fireworks: shoots a glowing rocket from an award building into the sky,
 * then explodes into bright glowing sparks and streaks visible under OrthographicCamera.
 */
export function createBuildingFireworks(scene: THREE.Scene): BuildingFireworks {
  const glowTexture = createGlowTexture();
  const activeItems: ActiveFirework[] = [];
  const pendingLaunches: Array<{ delay: number; origin: THREE.Vector3; apexY: number; onBurst?: () => void }> = [];

  const removeItem = (index: number) => {
    const item = activeItems[index];
    if (!item) return;
    if (item.kind === "rocket") {
      scene.remove(item.headPoints, item.trailLine);
      item.headGeometry.dispose();
      item.headMaterial.dispose();
      item.trailGeometry.dispose();
      item.trailMaterial.dispose();
    } else {
      scene.remove(item.points, item.trails, item.flash);
      item.geometry.dispose();
      item.material.dispose();
      item.trailGeometry.dispose();
      item.trailMaterial.dispose();
      item.flashMaterial.dispose();
    }
    activeItems.splice(index, 1);
  };

  const spawnBurst = (x: number, y: number, z: number) => {
    const count = 22;
    const positions = new Float32Array(count * 3);
    const prevPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const trailPositions = new Float32Array(count * 6);
    const trailColors = new Float32Array(count * 6);
    const color = new THREE.Color();
    const basePaletteIndex = Math.floor(Math.random() * PALETTE.length);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i6 = i * 6;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      prevPositions[i3] = x;
      prevPositions[i3 + 1] = y;
      prevPositions[i3 + 2] = z;

      const theta = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.28 + Math.random() * 0.32;
      velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i3 + 1] = Math.cos(phi) * speed * 0.88 + 0.12;
      velocities[i3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

      const paletteHex = PALETTE[(basePaletteIndex + (i % 2)) % PALETTE.length]!;
      color.setHex(paletteHex);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      trailPositions[i6] = x;
      trailPositions[i6 + 1] = y;
      trailPositions[i6 + 2] = z;
      trailPositions[i6 + 3] = x;
      trailPositions[i6 + 4] = y;
      trailPositions[i6 + 5] = z;

      trailColors[i6] = color.r;
      trailColors[i6 + 1] = color.g;
      trailColors[i6 + 2] = color.b;
      trailColors[i6 + 3] = color.r * 0.35;
      trailColors[i6 + 4] = color.g * 0.35;
      trailColors[i6 + 5] = color.b * 0.35;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3.8,
      sizeAttenuation: false,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.renderOrder = 22;

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute("color", new THREE.BufferAttribute(trailColors, 3));

    const trailMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    const trails = new THREE.LineSegments(trailGeometry, trailMaterial);
    trails.renderOrder = 21;

    const flashMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xfff4c2,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const flash = new THREE.Sprite(flashMaterial);
    flash.position.set(x, y, z);
    flash.scale.set(0.18, 0.18, 1);
    flash.renderOrder = 23;

    scene.add(points, trails, flash);
    activeItems.push({
      kind: "burst",
      age: 0,
      lifetime: 0.82,
      points,
      geometry,
      material,
      trails,
      trailGeometry,
      trailMaterial,
      flash,
      flashMaterial,
      positions,
      prevPositions,
      velocities,
      trailPositions,
    });
  };

  const spawnRocket = (origin: THREE.Vector3, apexY: number, onBurst?: () => void) => {
    const startY = origin.y + 0.22;
    const headPositions = new Float32Array([origin.x, startY, origin.z]);
    const headGeometry = new THREE.BufferGeometry();
    headGeometry.setAttribute("position", new THREE.BufferAttribute(headPositions, 3));
    const headMaterial = new THREE.PointsMaterial({
      size: 5.5,
      sizeAttenuation: false,
      map: glowTexture,
      color: 0xffe484,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const headPoints = new THREE.Points(headGeometry, headMaterial);
    headPoints.renderOrder = 22;

    const trailCoords = new Float32Array([
      origin.x, startY, origin.z,
      origin.x, startY, origin.z,
    ]);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailCoords, 3));
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xffd269,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const trailLine = new THREE.Line(trailGeometry, trailMaterial);
    trailLine.renderOrder = 21;

    scene.add(headPoints, trailLine);
    activeItems.push({
      kind: "rocket",
      origin: origin.clone(),
      apexY,
      age: 0,
      duration: 0.28 + Math.random() * 0.06,
      headPoints,
      headGeometry,
      headMaterial,
      trailLine,
      trailGeometry,
      trailMaterial,
      onBurst,
    });
  };

  return {
    launch(origin: THREE.Vector3, onBurst?: () => void) {
      // Cluster of 5 tiny fireworks scattered across the province area
      const clusterOffsets = [
        { dx: 0, dz: 0, delay: 0, h: 0.72 },
        { dx: -0.32 + (Math.random() - 0.5) * 0.08, dz: 0.24 + (Math.random() - 0.5) * 0.08, delay: 0.12, h: 0.65 },
        { dx: 0.30 + (Math.random() - 0.5) * 0.08, dz: -0.22 + (Math.random() - 0.5) * 0.08, delay: 0.24, h: 0.76 },
        { dx: -0.20 + (Math.random() - 0.5) * 0.08, dz: -0.30 + (Math.random() - 0.5) * 0.08, delay: 0.38, h: 0.62 },
        { dx: 0.34 + (Math.random() - 0.5) * 0.08, dz: 0.26 + (Math.random() - 0.5) * 0.08, delay: 0.52, h: 0.70 },
      ];

      clusterOffsets.forEach((item, index) => {
        const clusterOrigin = new THREE.Vector3(
          origin.x + item.dx,
          origin.y,
          origin.z + item.dz
        );
        const apexY = origin.y + item.h + (Math.random() - 0.5) * 0.08;
        const cb = index === 0 ? onBurst : undefined;

        if (item.delay <= 0) {
          spawnRocket(clusterOrigin, apexY, cb);
        } else {
          pendingLaunches.push({
            delay: item.delay,
            origin: clusterOrigin,
            apexY,
            onBurst: cb,
          });
        }
      });
    },

    update(dtSeconds: number) {
      const dt = Math.min(0.05, Math.max(0, dtSeconds));

      // Process pending cluster rocket launches
      for (let i = pendingLaunches.length - 1; i >= 0; i--) {
        const p = pendingLaunches[i]!;
        p.delay -= dt;
        if (p.delay <= 0) {
          pendingLaunches.splice(i, 1);
          spawnRocket(p.origin, p.apexY, p.onBurst);
        }
      }

      if (!activeItems.length && !pendingLaunches.length) return false;
      const drag = Math.exp(-2.5 * dt);

      for (let i = activeItems.length - 1; i >= 0; i--) {
        const item = activeItems[i]!;
        if (item.kind === "rocket") {
          item.age += dt;
          const t = Math.min(1, item.age / item.duration);
          const eased = 1 - (1 - t) * (1 - t);
          const startY = item.origin.y + 0.22;
          const curY = startY + (item.apexY - startY) * eased;
          const tailY = Math.max(startY, curY - 0.22);

          const headPos = item.headGeometry.getAttribute("position") as THREE.BufferAttribute;
          headPos.setXYZ(0, item.origin.x, curY, item.origin.z);
          headPos.needsUpdate = true;

          const trailPos = item.trailGeometry.getAttribute("position") as THREE.BufferAttribute;
          trailPos.setXYZ(0, item.origin.x, curY, item.origin.z);
          trailPos.setXYZ(1, item.origin.x, tailY, item.origin.z);
          trailPos.needsUpdate = true;

          if (t >= 1) {
            const { x, z } = item.origin;
            const y = item.apexY;
            const burstCb = item.onBurst;
            removeItem(i);
            spawnBurst(x, y, z);
            burstCb?.();
          }
        } else {
          item.age += dt;
          const progress = item.age / item.lifetime;
          if (progress >= 1) {
            removeItem(i);
            continue;
          }

          const { positions, prevPositions, velocities, trailPositions } = item;
          const count = positions.length / 3;
          for (let p = 0; p < count; p++) {
            const p3 = p * 3;
            const p6 = p * 6;
            prevPositions[p3] = positions[p3]!;
            prevPositions[p3 + 1] = positions[p3 + 1]!;
            prevPositions[p3 + 2] = positions[p3 + 2]!;

            velocities[p3]! *= drag;
            velocities[p3 + 1] = velocities[p3 + 1]! * drag - 0.82 * dt;
            velocities[p3 + 2]! *= drag;

            positions[p3]! += velocities[p3]! * dt;
            positions[p3 + 1]! += velocities[p3 + 1]! * dt;
            positions[p3 + 2]! += velocities[p3 + 2]! * dt;

            trailPositions[p6] = positions[p3]!;
            trailPositions[p6 + 1] = positions[p3 + 1]!;
            trailPositions[p6 + 2] = positions[p3 + 2]!;
            trailPositions[p6 + 3] = positions[p3]! - velocities[p3]! * 0.045;
            trailPositions[p6 + 4] = positions[p3 + 1]! - velocities[p3 + 1]! * 0.045;
            trailPositions[p6 + 5] = positions[p3 + 2]! - velocities[p3 + 2]! * 0.045;
          }

          (item.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
          (item.trailGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

          const fade = Math.max(0, 1 - progress * progress);
          item.material.opacity = fade;
          item.material.size = 3.8 * (0.7 + 0.3 * fade);
          item.trailMaterial.opacity = fade * 0.75;

          const flashFade = Math.max(0, 1 - progress * 5.0);
          item.flashMaterial.opacity = flashFade * 0.85;
          const flashScale = 0.18 + progress * 0.35;
          item.flash.scale.set(flashScale, flashScale, 1);
        }
      }
      return activeItems.length > 0 || pendingLaunches.length > 0;
    },

    active() {
      return activeItems.length > 0 || pendingLaunches.length > 0;
    },

    dispose() {
      pendingLaunches.length = 0;
      while (activeItems.length) removeItem(activeItems.length - 1);
      glowTexture?.dispose();
    },
  };
}
