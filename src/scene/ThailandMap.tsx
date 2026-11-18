import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Kid } from "../types";
import type { ProvinceFeature } from "../geo/provinces";
import { generateProvincePins } from "../geo/provinces";
import { projectLngLat } from "../geo/project";
import { clusterPoints, fanOut } from "../cluster/screen";
type Props = {
  kids: Kid[];
  features: ProvinceFeature[];
  onSelect: (id: string) => void;
  onCluster: (ids: string[]) => void;
  onFailure: () => void;
};
const mapPoint = (lng: number, lat: number) => {
  const point = projectLngLat({ lng, lat });
  return new THREE.Vector2(point.x, point.y);
};
export default function ThailandMap(props: Props) {
  const [motionPaused, setMotionPaused] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const callbacks = useRef(props);
  callbacks.current = props;
  const actions = useRef<{
    zoom: (factor: number, animate: boolean) => void;
    reset: (animate: boolean) => void;
  } | null>(null);
  const updateKids = useRef<((kids: readonly Kid[]) => void) | null>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      callbacks.current.onFailure();
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.1, 100);
    camera.position.set(0, 19, 10);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xeaf4ff, 0);
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive 3D map of Thailand. Use the student list for keyboard navigation.",
    );
    renderer.domElement.setAttribute("role", "img");
    element.append(renderer.domElement);
    const labels = document.createElement("div");
    labels.className = "map-markers";
    element.append(labels);
    const status = document.createElement("span");
    status.className = "map-status";
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    element.append(status);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, -0.2);
    controls.enableDamping = false;
    controls.minZoom = 1;
    controls.maxZoom = 8;
    controls.minPolarAngle = 0.15;
    controls.maxPolarAngle = 0.85;
    controls.enablePan = true;
    controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.update();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x55739c, 2.8));
    const sun = new THREE.DirectionalLight(0xffffff, 2.1);
    sun.position.set(-3, 12, 5);
    scene.add(sun);
    const resources: { dispose: () => void }[] = [];
    const provinceMaterials: {
      code: Kid["province"];
      material: THREE.MeshStandardMaterial;
      baseColor: number;
    }[] = [];
    const colors = [0xabcff1, 0xb5d7f3, 0xa3c6e9, 0xc3ddf5, 0x97bee6];
    props.features.forEach((feature, index) => {
      const polygons =
        feature.geometry.type === "Polygon"
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;
      const baseColor = colors[index % colors.length]!;
      const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.85,
      });
      provinceMaterials.push({
        code: feature.properties.code,
        material,
        baseColor,
      });
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xf3f8ff,
        transparent: true,
        opacity: 0.85,
      });
      resources.push(material, lineMaterial);
      polygons.forEach((polygon) => {
        const ring = polygon[0];
        if (!ring || ring.length < 4) return;
        const toPath = (points: number[][]) =>
          points.map((p) => mapPoint(p[0]!, p[1]!));
        const shape = new THREE.Shape(toPath(ring));
        polygon
          .slice(1)
          .forEach((hole) => shape.holes.push(new THREE.Path(toPath(hole))));
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 0.16,
          bevelEnabled: false,
          curveSegments: 1,
        });
        geometry.rotateX(-Math.PI / 2);
        scene.add(new THREE.Mesh(geometry, material));
        resources.push(geometry);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(
          toPath(ring).map((p) => new THREE.Vector3(p.x, 0.17, -p.y)),
        );
        scene.add(new THREE.Line(lineGeometry, lineMaterial));
        resources.push(lineGeometry);
      });
    });
    const pinGeometry = new THREE.SphereGeometry(0.065, 10, 8);
    const pinMaterial = new THREE.MeshStandardMaterial({
      color: 0x16325b,
      roughness: 0.4,
    });
    let pinMesh = new THREE.InstancedMesh(pinGeometry, pinMaterial, 500);
    pinMesh.count = 0;
    const matrix = new THREE.Matrix4();
    let positions: { id: string; position: THREE.Vector3 }[] = [];
    scene.add(pinMesh);
    resources.push(pinGeometry, pinMaterial);
    let kidNames = new Map<string, string>();
    const markerButtons = new Map<string, HTMLButtonElement>();
    let width = 1,
      height = 1,
      frame = 0;
    let fanIds: string[] | null = null;
    let fanPage = 0;
    let restoreFanPageFocus = false;
    let pendingFocusId: string | null = null;
    let stopped = false;
    let sceneDirty = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cameraFrame = 0;
    let movingCamera = false;
    let finishCamera: (() => void) | null = null;
    const stopCamera = () => {
      cancelAnimationFrame(cameraFrame);
      movingCamera = false;
      finishCamera = null;
      element.dataset.moving = "false";
    };
    const moveCamera = (
      position: THREE.Vector3, target: THREE.Vector3, zoom: number, animate: boolean,
    ) => {
      stopCamera();
      fanIds = null;
      fanPage = 0;
      status.textContent = "";
      const fromPosition = camera.position.clone();
      const fromTarget = controls.target.clone();
      const fromZoom = camera.zoom;
      const duration = animate && !reducedMotion.matches && !document.hidden ? 240 : 0;
      const start = performance.now();
      movingCamera = true;
      element.dataset.moving = "true";
      const tick = (now: number) => {
        if (stopped) return;
        const progress = duration ? THREE.MathUtils.clamp((now - start) / duration, 0, 1) : 1;
        const eased = 1 - (1 - progress) ** 3;
        camera.position.lerpVectors(fromPosition, position, eased);
        controls.target.lerpVectors(fromTarget, target, eased);
        camera.zoom = THREE.MathUtils.lerp(fromZoom, zoom, eased);
        camera.updateProjectionMatrix();
        controls.update();
        sceneDirty = true;
        if (progress === 1) stopCamera();
        draw();
        if (progress < 1) cameraFrame = requestAnimationFrame(tick);
      };
      finishCamera = () => tick(start + duration);
      tick(start);
    };
    const draw = () => {
      if (stopped) return;
      if (sceneDirty) {
        renderer.render(scene, camera);
        sceneDirty = false;
      }
      const points = positions
        .map((p) => {
          const s = p.position.clone().project(camera);
          return {
            id: p.id,
            x: ((s.x + 1) * width) / 2,
            y: ((1 - s.y) * height) / 2,
          };
        })
        .filter(
          (p) =>
            p.x > -24 && p.x < width + 24 && p.y > -24 && p.y < height + 24,
        );
      const groups = clusterPoints(points, 36);
      const focusedMarker =
        document.activeElement instanceof HTMLButtonElement &&
        labels.contains(document.activeElement)
          ? document.activeElement
          : null;
      const usedMarkers = new Set<string>();
      const marker = (
        id: string,
        x: number,
        y: number,
        text: string,
        title: string,
        click: (event: MouseEvent) => void,
        cluster = false,
        origin?: { x: number; y: number },
      ) => {
        const key = `${cluster ? "cluster" : "pin"}:${id}`;
        usedMarkers.add(key);
        let button = markerButtons.get(key);
        if (!button) {
          button = document.createElement("button");
          button.type = "button";
          const core = document.createElement("span");
          core.className = "marker-core";
          core.setAttribute("aria-hidden", "true");
          const value = document.createElement("span");
          value.className = "marker-value";
          core.append(value);
          for (let i = 0; i < 3; i++) {
            const spark = document.createElement("span");
            spark.className = `marker-spark marker-spark-${i}`;
            core.append(spark);
          }
          button.append(core);
          if (origin && !reducedMotion.matches) {
            core.animate([
              { opacity: 0, transform: origin
                ? `translate(${origin.x - x}px, ${origin.y - y}px) scale(0.97)`
                : "translateY(6px) scale(0.97)" },
              { opacity: 1, transform: "translate(0, 0) scale(1)" },
            ], { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
          }
          markerButtons.set(key, button);
          labels.append(button);
        }
        button.className = cluster ? "map-marker cluster-marker" : "map-marker";
        // Bound compositor work in the spread fixture; every other light is static.
        button.classList.toggle("is-ambient", usedMarkers.size <= 30);
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        const value = button.querySelector(".marker-value")!;
        if (value.textContent !== text) value.textContent = text;
        button.title = title;
        button.setAttribute("aria-label", title);
        button.dataset.id = id;
        button.onclick = click;
        return button;
      };
      groups.forEach((group) => {
        if (group.ids.length === 1) {
          const id = group.ids[0]!;
          marker(id, group.x, group.y, "✦", kidNames.get(id) ?? "Maker", () =>
            callbacks.current.onSelect(id),
          );
        } else if (
          fanIds?.length === group.ids.length &&
          fanIds.every((id, index) => id === group.ids[index])
        ) {
          const pageSize = 24;
          const pageCount = Math.ceil(group.ids.length / pageSize);
          fanPage %= pageCount;
          const start = fanPage * pageSize;
          const pageIds = group.ids.slice(start, start + pageSize);
          const announcement = `Showing makers ${start + 1} to ${start + pageIds.length} of ${group.ids.length}`;
          if (status.textContent !== announcement)
            status.textContent = announcement;
          const targets = fanOut(pageIds, 0, 0, 42);
          const minX = Math.min(...targets.map((p) => p.x));
          const maxX = Math.max(...targets.map((p) => p.x));
          const minY = Math.min(...targets.map((p) => p.y));
          const maxY = Math.max(...targets.map((p) => p.y));
          const pageY = maxY + 48;
          // Include marker radii and the page control in the footprint. Reserve
          // space for the caption above and map controls/legend below.
          const clampCenter = (value: number, min: number, max: number) =>
            min <= max
              ? THREE.MathUtils.clamp(value, min, max)
              : (min + max) / 2;
          const cx = clampCenter(group.x, 24 - minX, width - 24 - maxX);
          const cy = clampCenter(
            group.y,
            80 - minY,
            height - 120 - (pageCount > 1 ? pageY : maxY),
          );
          targets.forEach((p) =>
            marker(
              p.id,
              cx + p.x,
              cy + p.y,
              "✦",
              kidNames.get(p.id) ?? "Maker",
              () => callbacks.current.onSelect(p.id),
              false,
              { x: group.x, y: group.y },
            ),
          );
          if (pageCount > 1) {
            const pageButton = marker(
              `${group.id}:page`,
              cx,
              cy + pageY,
              `${fanPage + 1}/${pageCount}`,
              `Next makers in group. Page ${fanPage + 1} of ${pageCount}, makers ${start + 1}–${start + pageIds.length} of ${group.ids.length}.`,
              () => {
                fanPage = (fanPage + 1) % pageCount;
                restoreFanPageFocus = true;
                requestDraw();
              },
              true,
            );
            if (restoreFanPageFocus) {
              pageButton.focus({ preventScroll: true });
            }
          }
        } else
          marker(
            group.id,
            group.x,
            group.y,
            String(group.ids.length),
            `Explore ${group.ids.length} makers. Zoom in or choose from the group list.`,
            (event) => {
              pendingFocusId = group.ids[0]!;
              callbacks.current.onCluster(group.ids);
              if (camera.zoom >= 7.99) {
                fanIds = group.ids;
                fanPage = 0;
                requestDraw();
                return;
              }
              const ids = new Set(group.ids);
              const center = positions
                .filter((p) => ids.has(p.id))
                .reduce((sum, p) => sum.add(p.position), new THREE.Vector3())
                .divideScalar(group.ids.length);
              const delta = center.clone().sub(controls.target);
              moveCamera(camera.position.clone().add(delta), center,
                Math.min(8, camera.zoom * 1.85), event.detail > 0);
            },
            true,
          );
      });
      let focusMoved = false;
      if (pendingFocusId && !movingCamera) {
        const group = groups.find((group) =>
          group.ids.includes(pendingFocusId!),
        );
        if (group) {
          const key = [
            `cluster:${group.id}:page`,
            `pin:${pendingFocusId}`,
            `cluster:${group.id}`,
          ].find((key) => usedMarkers.has(key));
          const target = key ? markerButtons.get(key) : undefined;
          if (target) {
            target.focus({ preventScroll: true });
            focusMoved = true;
          }
        }
        pendingFocusId = null;
      }
      for (const [key, button] of markerButtons) {
        if (!usedMarkers.has(key)) {
          button.remove();
          markerButtons.delete(key);
        }
      }
      if (
        focusedMarker &&
        !focusedMarker.isConnected &&
        !movingCamera &&
        !restoreFanPageFocus &&
        !focusMoved
      ) {
        element.focus({ preventScroll: true });
      }
      restoreFanPageFocus = false;
    };
    const requestDraw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const changed = () => {
      if (movingCamera) return;
      sceneDirty = true;
      status.textContent = "";
      const next = controls.target.clone();
      controls.target.x = THREE.MathUtils.clamp(next.x, -5, 5);
      controls.target.z = THREE.MathUtils.clamp(next.z, -8, 8);
      camera.position.add(controls.target.clone().sub(next));
      fanIds = null;
      fanPage = 0;
      restoreFanPageFocus = false;
      requestDraw();
    };
    controls.addEventListener("change", changed);
    const userCameraStart = () => {
      stopCamera();
      pendingFocusId = null;
    };
    controls.addEventListener("start", userCameraStart);
    const motionPreferenceChanged = () => {
      finishCamera?.();
      stopCamera();
      if (reducedMotion.matches)
        labels.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    };
    reducedMotion.addEventListener("change", motionPreferenceChanged);
    const visibilityChanged = () => {
      element.dataset.hidden = String(document.hidden);
      if (document.hidden) {
        finishCamera?.();
        stopCamera();
      }
    };
    document.addEventListener("visibilitychange", visibilityChanged);
    const resize = new ResizeObserver(() => {
      finishCamera?.();
      stopCamera();
      width = element.clientWidth;
      height = element.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      camera.left = -7.6 * aspect;
      camera.right = 7.6 * aspect;
      camera.top = 7.6;
      camera.bottom = -7.6;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      sceneDirty = true;
      fanIds = null;
      fanPage = 0;
      restoreFanPageFocus = false;
      requestDraw();
    });
    resize.observe(element);
    const lost = (event: Event) => {
      event.preventDefault();
      callbacks.current.onFailure();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    updateKids.current = (kids) => {
      if (stopped) return;
      stopCamera();
      pendingFocusId = null;
      let pins;
      try {
        pins = generateProvincePins(kids, props.features);
      } catch {
        callbacks.current.onFailure();
        return;
      }
      positions = pins.map((pin) => {
        const p = mapPoint(pin.position.lng, pin.position.lat);
        return { id: pin.kidId, position: new THREE.Vector3(p.x, 0.28, -p.y) };
      });
      if (pins.length > pinMesh.instanceMatrix.count) {
        scene.remove(pinMesh);
        pinMesh.dispose();
        pinMesh = new THREE.InstancedMesh(
          pinGeometry,
          pinMaterial,
          pins.length,
        );
        scene.add(pinMesh);
      }
      pinMesh.count = pins.length;
      positions.forEach((p, i) =>
        pinMesh.setMatrixAt(
          i,
          matrix.makeTranslation(p.position.x, p.position.y, p.position.z),
        ),
      );
      pinMesh.instanceMatrix.needsUpdate = true;
      // Instance positions can move between provinces without changing capacity.
      pinMesh.boundingBox = null;
      pinMesh.boundingSphere = null;
      const visibleKids = kids.filter((kid) => kid.showOnMap);
      kidNames = new Map(visibleKids.map((kid) => [kid.id, kid.displayName]));
      const active = new Set(visibleKids.map((kid) => kid.province));
      provinceMaterials.forEach(({ code, material, baseColor }) => {
        material.color.setHex(active.has(code) ? 0xffdc50 : baseColor);
      });
      sceneDirty = true;
      fanIds = null;
      fanPage = 0;
      restoreFanPageFocus = false;
      requestDraw();
    };
    actions.current = {
      zoom: (factor, animate) => {
        moveCamera(camera.position.clone(), controls.target.clone(),
          THREE.MathUtils.clamp(camera.zoom * factor, 1, 8), animate);
      },
      reset: (animate) => {
        callbacks.current.onCluster([]);
        moveCamera(new THREE.Vector3(0, 19, 10), new THREE.Vector3(0, 0, -0.2), 1, animate);
      },
    };
    requestDraw();
    return () => {
      stopped = true;
      stopCamera();
      reducedMotion.removeEventListener("change", motionPreferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      pinMesh.dispose();
      resources.forEach((r) => r.dispose());
      renderer.forceContextLoss();
      renderer.dispose();
      renderer.domElement.remove();
      labels.remove();
      status.remove();
      actions.current = null;
      updateKids.current = null;
    };
  }, [props.features]);
  useEffect(() => {
    updateKids.current?.(props.kids);
  }, [props.kids, props.features]);
  return (
    <div className="map-stage" data-motion={motionPaused ? "paused" : "playing"}>
      <button className="motion-toggle"
        onClick={() => setMotionPaused((paused) => !paused)}>
        {motionPaused ? "Resume sparkles" : "Pause sparkles"}
      </button>
      <div
        className="map-canvas"
        ref={host}
        tabIndex={-1}
        role="region"
        aria-label="Interactive Thailand map"
      />
      <div className="map-controls" aria-label="Map controls">
        <button onClick={(event) => actions.current?.zoom(1.5, event.detail > 0)} aria-label="Zoom in">
          +
        </button>
        <button
          onClick={(event) => actions.current?.zoom(1 / 1.5, event.detail > 0)}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={(event) => actions.current?.reset(event.detail > 0)}
          aria-label="Reset map view"
        >
          ⌂
        </button>
      </div>
      <p className="map-hint">
        Drag to explore · Scroll to zoom · Right-drag to tilt
      </p>
    </div>
  );
}
