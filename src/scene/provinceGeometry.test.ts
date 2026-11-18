import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createProvinceGeometry } from "./provinceGeometry";

const square = (x: number) => new THREE.Shape([
  new THREE.Vector2(x, 0), new THREE.Vector2(x + 1, 0),
  new THREE.Vector2(x + 1, 1), new THREE.Vector2(x, 1), new THREE.Vector2(x, 0),
]);

test("multipart province keeps two material draws regardless of island count", () => {
  const shapes = Array.from({ length: 73 }, (_, i) => square(i * 2));
  const { geometry, outline } = createProvinceGeometry(shapes, 0.24);
  assert.equal(geometry.groups.length, 2);
  assert.deepEqual(geometry.groups.map((group) => group.materialIndex), [0, 1]);
  const indices = Array.from(geometry.index!.array);
  assert.equal(new Set(indices).size, geometry.getAttribute("position").count);
  assert.equal(indices.length, geometry.getAttribute("position").count);
  const normal = geometry.getAttribute("normal");
  for (const group of geometry.groups) {
    for (const index of indices.slice(group.start, group.start + group.count)) {
      assert.ok(group.materialIndex === 0 ? Math.abs(normal.getY(index)) > 0.99 : Math.abs(normal.getY(index)) < 1e-6);
    }
  }
  geometry.dispose(); outline.dispose();
});

test("batched province preserves holes, vertex attributes and bounds", () => {
  const shape = square(0);
  shape.holes.push(new THREE.Path([
    new THREE.Vector2(.2, .2), new THREE.Vector2(.8, .2), new THREE.Vector2(.8, .8),
    new THREE.Vector2(.2, .8), new THREE.Vector2(.2, .2),
  ]));
  const shapes = [shape, square(3)];
  const { geometry, outline } = createProvinceGeometry(shapes, 0.24);
  const original = new THREE.ExtrudeGeometry(shapes, { depth: .24, bevelEnabled: false, curveSegments: 1 });
  original.rotateX(-Math.PI / 2);
  for (const name of ["position", "normal", "uv"]) {
    assert.deepEqual(geometry.getAttribute(name).array, original.getAttribute(name).array);
  }
  geometry.computeBoundingBox(); original.computeBoundingBox();
  assert.deepEqual(geometry.boundingBox, original.boundingBox);
  geometry.dispose(); outline.dispose(); original.dispose();
});

test("province outlines retain closed rings without lines joining islands", () => {
  const { geometry, outline } = createProvinceGeometry([square(0), square(3)], .24);
  const points = outline.getAttribute("position");
  assert.equal(points.count, 16);
  for (let i = 0; i < points.count; i += 2) {
    const a = new THREE.Vector3().fromBufferAttribute(points, i);
    const b = new THREE.Vector3().fromBufferAttribute(points, i + 1);
    assert.ok(Math.abs(a.distanceTo(b) - 1) < 1e-6);
    assert.ok(Math.abs(a.y - .25) < 1e-6);
  }
  geometry.dispose(); outline.dispose();
});
