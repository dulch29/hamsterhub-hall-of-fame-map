import * as THREE from "three";

export const LANDING_DURATION = 2200;

export function prepareLandingCamera(camera: THREE.OrthographicCamera, bounds: THREE.Box3) {
  const view = bounds.clone().applyMatrix4(camera.matrixWorldInverse);
  const lift = (camera.top / camera.zoom - view.min.y + 1) / Math.max(0.01, camera.matrixWorld.elements[5]!);
  const falling = bounds.clone();
  // Include province staggering and the award geometry carried above the land.
  falling.max.y += lift + 3;
  falling.applyMatrix4(camera.matrixWorldInverse);
  const retreat = Math.max(0, falling.max.z + camera.near + 1);
  const backward = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 2);
  camera.position.addScaledVector(backward, retreat);
  camera.far = Math.max(camera.far, -falling.min.z + retreat + 1);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return lift;
}

export function landingHeight(elapsed: number, index: number, count: number, startHeight = 8) {
  const delay = (index / Math.max(1, count - 1)) ** 0.75 * 900;
  const progress = Math.max(0, Math.min(1, (elapsed - delay) / 1300));
  const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
  return (startHeight + index % 3 * 0.3) * (1 - eased);
}
