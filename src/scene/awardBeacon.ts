import * as THREE from 'three';
import type { AwardPlacement } from './awards';

export function beaconProjection(position: THREE.Vector3, groundY: number, camera: THREE.Camera, width: number, height: number) {
  const project = (point: THREE.Vector3) => {
    const p = point.project(camera);
    return { x: (p.x + 1) * width / 2, y: (1 - p.y) * height / 2 };
  };
  const top = project(position.clone());
  const ground = project(new THREE.Vector3(position.x, groundY, position.z));
  const x = project(new THREE.Vector3(position.x + .48, groundY, position.z));
  const z = project(new THREE.Vector3(position.x, groundY, position.z + .48));
  return { top, ground, length: Math.hypot(top.x - ground.x, top.y - ground.y),
    angle: Math.atan2(ground.y - top.y, ground.x - top.x) - Math.PI / 2,
    plane: [(x.x - ground.x) / 40, (x.y - ground.y) / 40, (z.x - ground.x) / 40, (z.y - ground.y) / 40] };
}

export function createAwardBeacons(host: HTMLElement) {
  const layer = document.createElement('div');
  layer.className = 'award-beacons';
  layer.setAttribute('aria-hidden', 'true');
  host.append(layer);
  const beacons = new Map<string, { root: HTMLElement; beam: HTMLElement; aura: HTMLElement }>();
  return {
    update(placements: readonly AwardPlacement[], groundY: (id: string) => number, camera: THREE.Camera, width: number, height: number) {
      const used = new Set<string>();
      for (const placement of placements) {
        used.add(placement.id);
        let item = beacons.get(placement.id);
        if (!item) {
          const root = document.createElement('div');
          root.className = 'award-beacon';
          const beam = document.createElement('span');
          beam.className = 'award-beacon__beam';
          const aura = document.createElement('span');
          aura.className = 'award-beacon__aura';
          for (const name of ['pool', 'wave', 'wave']) {
            const disk = document.createElement('span'); disk.className = `award-beacon__${name}`; aura.append(disk);
          }
          root.append(aura, beam); layer.append(root);
          item = { root, beam, aura }; beacons.set(placement.id, item);
        }
        const p = beaconProjection(placement.position, groundY(placement.id), camera, width, height);
        item.beam.style.left = `${p.top.x}px`;
        item.beam.style.top = `${p.top.y}px`;
        item.beam.style.height = `${p.length}px`;
        item.beam.style.transform = `translateX(-50%) rotate(${p.angle}rad)`;
        item.aura.style.transform = `matrix(${p.plane.join(',')},${p.ground.x},${p.ground.y})`;
      }
      for (const [id, item] of beacons) if (!used.has(id)) { item.root.remove(); beacons.delete(id); }
    },
    dispose() { layer.remove(); beacons.clear(); },
  };
}
