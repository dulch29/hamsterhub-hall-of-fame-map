import * as THREE from "three";

export function createProvinceGeometry(shapes: THREE.Shape[], depth: number) {
  const geometry = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: false, curveSegments: 1 });
  geometry.rotateX(-Math.PI / 2);
  // Extrusion adds two material groups per island. Share two draws for the province.
  const indices: number[] = [];
  const groups = [...geometry.groups];
  geometry.clearGroups();
  for (const materialIndex of [0, 1]) {
    const start = indices.length;
    for (const group of groups) {
      if (group.materialIndex !== materialIndex) continue;
      for (let i = group.start; i < group.start + group.count; i++) indices.push(i);
    }
    geometry.addGroup(start, indices.length - start, materialIndex);
  }
  geometry.setIndex(indices);
  const edges: THREE.Vector3[] = [];
  for (const shape of shapes) {
    const ring = shape.getPoints(1);
    for (let i = 1; i < ring.length; i++) {
      for (const point of [ring[i - 1]!, ring[i]!]) edges.push(new THREE.Vector3(point.x, depth + .01, -point.y));
    }
  }
  return { geometry, outline: new THREE.BufferGeometry().setFromPoints(edges) };
}
