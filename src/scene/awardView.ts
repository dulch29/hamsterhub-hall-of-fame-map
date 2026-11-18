import type { ScreenCluster, ScreenPoint } from "../cluster/screen";
import * as THREE from "three";

export function awardAtScreenPoint(x: number, y: number, width: number, height: number, camera: THREE.Camera, planeY: number) {
  const point = new THREE.Vector3(x / width * 2 - 1, 1 - y / height * 2, 0).unproject(camera);
  const direction = camera.getWorldDirection(new THREE.Vector3());
  return point.addScaledVector(direction, (planeY - point.y) / direction.y);
}

type Point = { x: number; y: number; z: number };

export function separateAwardGroups(groups: readonly ScreenCluster[], selected: ScreenPoint, width: number, height: number) {
  const placed = groups.map((group) => ({ ...group }));
  const clamp = (value: number, max: number) => Math.max(32, Math.min(max - 32, value));
  for (const group of placed) {
    // The preview has three samples. Reserve all other targets before moving one.
    const occupied = [selected, ...placed.filter((other) => other !== group)];
    const candidates = [{ x: group.x, y: group.y }];
    for (const dx of [-80, 0, 80])
      for (const dy of [-80, 0, 80])
        candidates.push({ x: clamp(selected.x + dx, width), y: clamp(selected.y + dy, height) });
    candidates.sort((a, b) => Math.hypot(a.x - group.x, a.y - group.y) - Math.hypot(b.x - group.x, b.y - group.y));
    const target = candidates.find((point) => occupied.every((other) => Math.hypot(point.x - other.x, point.y - other.y) >= 76));
    if (target) Object.assign(group, target);
  }
  return placed;
}

export function awardView(anchor: Point, position: Point, target: Point, halfHeight: number, zoom: number) {
  const next = {
    x: Math.max(-5, Math.min(5, anchor.x)),
    y: anchor.y,
    z: Math.max(-8, Math.min(8, anchor.z)),
  };
  return {
    target: next,
    position: {
      x: position.x + next.x - target.x,
      y: position.y + next.y - target.y,
      z: position.z + next.z - target.z,
    },
    zoom: Math.min(8, Math.max(zoom, Math.min(4, Math.max(2.4, halfHeight / 3.8)))),
  };
}
