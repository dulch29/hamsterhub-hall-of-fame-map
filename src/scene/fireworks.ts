import * as THREE from "three";

type FireworkBurst = {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  positions: Float32Array;
  velocities: Float32Array;
  age: number;
  lifetime: number;
};

const PALETTE = [0xffdc50, 0xff9500, 0x67e8f9, 0xffffff, 0xfb7185] as const;

export type BuildingFireworks = {
  launch: (origin: THREE.Vector3) => void;
  update: (dtSeconds: number) => boolean;
  active: () => boolean;
  dispose: () => void;
};

/**
 * Lightweight 3D particle bursts launched occasionally above award buildings.
 */
export function createBuildingFireworks(scene: THREE.Scene): BuildingFireworks {
  const bursts: FireworkBurst[] = [];

  const removeBurst = (index: number) => {
    const burst = bursts[index];
    if (!burst) return;
    scene.remove(burst.points);
    burst.geometry.dispose();
    burst.material.dispose();
    bursts.splice(index, 1);
  };

  return {
    launch(origin: THREE.Vector3) {
      const count = 36;
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const color = new THREE.Color();
      const baseX = origin.x;
      const baseY = origin.y + 0.72;
      const baseZ = origin.z;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = baseX;
        positions[i3 + 1] = baseY;
        positions[i3 + 2] = baseZ;

        const theta = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 0.85 + Math.random() * 0.95;
        velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i3 + 1] = Math.abs(Math.cos(phi)) * speed * 1.15 + 0.55;
        velocities[i3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

        color.setHex(PALETTE[i % PALETTE.length]!);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.14,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      bursts.push({
        points,
        geometry,
        material,
        positions,
        velocities,
        age: 0,
        lifetime: 1.25,
      });
    },

    update(dtSeconds: number) {
      if (!bursts.length) return false;
      const dt = Math.min(0.05, Math.max(0, dtSeconds));
      const drag = Math.exp(-2.4 * dt);

      for (let i = bursts.length - 1; i >= 0; i--) {
        const burst = bursts[i]!;
        burst.age += dt;
        const progress = burst.age / burst.lifetime;
        if (progress >= 1) {
          removeBurst(i);
          continue;
        }
        const { positions, velocities } = burst;
        const count = positions.length / 3;
        for (let p = 0; p < count; p++) {
          const p3 = p * 3;
          velocities[p3]! *= drag;
          velocities[p3 + 1] = velocities[p3 + 1]! * drag - 1.55 * dt;
          velocities[p3 + 2]! *= drag;

          positions[p3]! += velocities[p3]! * dt;
          positions[p3 + 1]! += velocities[p3 + 1]! * dt;
          positions[p3 + 2]! += velocities[p3 + 2]! * dt;
        }
        const posAttr = burst.geometry.getAttribute("position") as THREE.BufferAttribute;
        posAttr.needsUpdate = true;
        burst.material.opacity = Math.max(0, 1 - progress * progress);
      }
      return bursts.length > 0;
    },

    active() {
      return bursts.length > 0;
    },

    dispose() {
      while (bursts.length) removeBurst(bursts.length - 1);
    },
  };
}
