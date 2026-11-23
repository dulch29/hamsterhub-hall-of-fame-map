import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Kid } from "../types";
import type { ProvinceFeature } from "../geo/provinces";
import { generateProvincePins, provinceNames } from "../geo/provinces";
import { projectLngLat } from "../geo/project";
import { clusterPoints, fanOut } from "../cluster/screen";
import { awardView, separateAwardGroups, awardAtScreenPoint } from "./awardView";
import {
  BUILDING_HEIGHT_BY_LEVEL,
  buildingLevelForCount,
  buildingScaleForView,
  createAwards,
  summarizeAwards,
  type AwardSummary,
  type AwardPlacement,
  type AwardArtwork,
} from "./awards";
import { decorateAward } from "./awardDecoration";
import { createAwardBeacons } from "./awardBeacon";
import { createBuildingFireworks } from "./fireworks";
import { landingHeight, prepareLandingCamera, LANDING_DURATION } from "./provinceLanding";
import { createProvinceGeometry } from "./provinceGeometry";
import type { MapFailure } from "./mapFailure";
import { bubbleFocusX } from "../ui/bubbleLayout";
export type AwardSelection = { kidId: string; x: number; y: number; width: number; height: number };
type Props = {
  kids: Kid[];
  features: ProvinceFeature[];
  onSelect: (id: string) => void;
  onCluster: (ids: string[]) => void;
  onFailure: (reason: MapFailure) => void;
  preview?: boolean;
  previewArtwork?: AwardArtwork;
  previewRecipientCounts?: Record<string, number>;
  previewProjectCounts?: Record<string, number>;
  onFirework?: (leadKidId: string) => void;
  onAwardSelection?: (selection: AwardSelection | null) => void;
  onAwardDismissRequest?: (animate: boolean) => void;
  awardDismissal?: { request: number; animate: boolean };
  awardFocus?: { request: number; kidId: string; animate: boolean } | null;
};
const mapPoint = (lng: number, lat: number) => {
  const point = projectLngLat({ lng, lat });
  return new THREE.Vector2(point.x, point.y);
};
export default function ThailandMap(props: Props) {
  const [motionPaused, setMotionPaused] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const callbacks = useRef(props);
  callbacks.current = props;
  const actions = useRef<{
    zoom: (factor: number, animate: boolean) => void;
    reset: (animate: boolean) => void;
    finishEntrance: () => void;
    pauseAwards: (paused: boolean) => void;
    dismissAward: (animate: boolean) => void;
    focusAward: (kidId: string, animate: boolean) => void;
  } | null>(null);
  const updateKids = useRef<((kids: readonly Kid[]) => void) | null>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      callbacks.current.onFailure("webgl-init");
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.1, 100);
    camera.position.set(0, 19, 10);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xeaf4ff, 0);
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive 3D map of Thailand. Tab to a maker's badge or use the student list for keyboard navigation.",
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
    controls.maxZoom = props.preview ? 2.5 : 8;
    controls.minPolarAngle = 0.15;
    controls.maxPolarAngle = 0.85;
    controls.enablePan = !props.preview;
    controls.touches = { ONE: props.preview ? THREE.TOUCH.ROTATE : THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
    controls.mouseButtons = {
      LEFT: props.preview ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.update();
    scene.add(new THREE.HemisphereLight(0xe9f5ff, 0x25446c, props.preview ? 2.2 : 2.8));
    const sun = new THREE.DirectionalLight(0xffffff, 2.1);
    sun.position.set(-3, 12, 5);
    scene.add(sun);
    if (props.preview) {
      const rim = new THREE.DirectionalLight(0x79b9ff, 2.6);
      rim.position.set(5, 6, -8);
      scene.add(rim);
    }
    const resources: { dispose: () => void }[] = [];
    const provinceMaterials: {
      code: Kid["province"];
      material: THREE.MeshStandardMaterial;
      baseColor: number;
    }[] = [];
    const colors = props.preview
      ? [0x4c85bc, 0x6095c4, 0x417bae, 0x6a9bc9, 0x528dbd]
      : [0xabcff1, 0xb5d7f3, 0xa3c6e9, 0xc3ddf5, 0x97bee6];
    const sides = new THREE.MeshStandardMaterial({ color: 0x163c68, roughness: 0.6, metalness: 0.15 });
    resources.push(sides);
    const landBounds = new THREE.Box3();
    const provinceGroups = new Map<Kid["province"], THREE.Group>();
    props.features.forEach((feature, index) => {
      const provinceGroup = new THREE.Group();
      provinceGroups.set(feature.properties.code, provinceGroup);
      scene.add(provinceGroup);
      const polygons =
        feature.geometry.type === "Polygon"
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;
      const baseColor = colors[index % colors.length]!;
      const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: props.preview ? 0.38 : 0.85,
        metalness: props.preview ? 0.12 : 0,
      });
      provinceMaterials.push({
        code: feature.properties.code,
        material,
        baseColor,
      });
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xf3f8ff,
        transparent: true,
        opacity: props.preview ? 0.3 : 0.85,
      });
      resources.push(material, lineMaterial);
      const shapes: THREE.Shape[] = [];
      polygons.forEach((polygon) => {
        const ring = polygon[0];
        if (!ring || ring.length < 4) return;
        const toPath = (points: number[][]) =>
          points.map((p) => mapPoint(p[0]!, p[1]!));
        const shape = new THREE.Shape(toPath(ring));
        polygon
          .slice(1)
          .forEach((hole) => shape.holes.push(new THREE.Path(toPath(hole))));
        shapes.push(shape);
      });
      const { geometry, outline } = createProvinceGeometry(shapes, props.preview ? .24 : .16);
      provinceGroup.add(new THREE.Mesh(geometry, props.preview ? [material, sides] : material));
      provinceGroup.add(new THREE.LineSegments(outline, lineMaterial));
      landBounds.expandByObject(provinceGroup);
      resources.push(geometry, outline);
    });
    const homeTarget = props.preview ? landBounds.getCenter(new THREE.Vector3()) : new THREE.Vector3(0, 0, -0.2);
    const homePosition = homeTarget.clone().add(props.preview
      ? new THREE.Vector3(-10, 19, 12)
      : new THREE.Vector3(0, 19, 10.2));
    if (props.preview) {
      controls.target.copy(homeTarget);
      camera.position.copy(homePosition);
      controls.update();
      camera.updateMatrixWorld();
      // Center the visible silhouette; a rotated world bounding box biases it left.
      let left = Infinity, right = -Infinity;
      const vertex = new THREE.Vector3();
      for (const province of provinceGroups.values()) {
        province.updateMatrixWorld(true);
        const land = province.children[0] as THREE.Mesh<THREE.BufferGeometry>;
        const vertices = land.geometry.getAttribute("position");
        for (let index = 0; index < vertices.count; index++) {
          vertex.fromBufferAttribute(vertices, index).applyMatrix4(land.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
          left = Math.min(left, vertex.x);
          right = Math.max(right, vertex.x);
        }
      }
      const shift = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar((left + right) / 2);
      homeTarget.add(shift);
      homePosition.add(shift);
      controls.target.copy(homeTarget);
      camera.position.copy(homePosition);
      controls.update();
    }
    camera.updateMatrixWorld();
    const landView = new THREE.Box3();
    for (const x of [landBounds.min.x, landBounds.max.x])
      for (const y of [landBounds.min.y, landBounds.max.y])
        for (const z of [landBounds.min.z, landBounds.max.z])
          landView.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
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
    const awards = props.preview ? createAwards(scene) : null;
    const beacons = props.preview ? createAwardBeacons(element) : null;
    const fireworks = props.preview ? createBuildingFireworks(scene) : null;
    let fireworkTimer = 0;
    let awardPlacements: AwardPlacement[] = [];
    let awardFrame = 0;
    let awardTime = 0;
    let lastAwardFrame: number | null = null;
    let awardsPaused = motionPaused;
    let awardsTurning = false;
    let kidNames = new Map<string, string>();
    let kidProvinces = new Map<string, Kid["province"]>();
    const markerButtons = new Map<string, HTMLButtonElement>();
    let width = 1,
      height = 1,
      frame = 0;
    let fanIds: string[] | null = null;
    let fanPage = 0;
    let restoreFanPageFocus = false;
    let pendingFocusId: string | null = null;
    let selectedPinId: string | null = null;
    let reportedSelection = "";
    let awardReturnView: { position: THREE.Vector3; target: THREE.Vector3; zoom: number } | null = null;
    let hoveredMarkerKey: string | null = null;
    let stopped = false;
    let contextLost = false;
    let recoveryTimer: ReturnType<typeof setTimeout> | undefined;
    element.dataset.context = "ready";
    element.dataset.moving = "false";
    let sceneDirty = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const landingOrder = [...provinceGroups.values()]
      .map((group) => ({ group, z: new THREE.Box3().setFromObject(group).getCenter(new THREE.Vector3()).z }))
      .sort((a, b) => a.z - b.z).map(({ group }) => group);
    let landingFrame = 0;
    let landingStarted: number | null = null;
    let landingComplete = !props.preview || reducedMotion.matches || document.hidden;
    // Lift the lowest land corner beyond the sky edge for this fitted viewport.
    const skyLift = () => {
      const previous = camera.position.clone();
      const lift = prepareLandingCamera(camera, landBounds);
      homePosition.add(camera.position.clone().sub(previous));
      return lift;
    };
    let landingLift = landingComplete ? 0 : skyLift();
    element.dataset.landing = landingComplete ? "settled" : "falling";
    element.dataset.hidden = String(document.hidden);
    if (!landingComplete) landingOrder.forEach((group, index) => {
      group.position.y = landingHeight(0, index, landingOrder.length, landingLift);
    });
    const finishLanding = () => {
      if (landingComplete) return;
      cancelAnimationFrame(landingFrame);
      landingComplete = true;
      landingOrder.forEach((group) => { group.position.y = 0; });
      element.dataset.landing = "settled";
      sceneDirty = true;
      requestDraw();
    };
    const tickLanding = (now: number) => {
      if (stopped || contextLost || landingComplete) return;
      landingStarted ??= now;
      landingOrder.forEach((group, index) => { group.position.y = landingHeight(now - landingStarted!, index, landingOrder.length, landingLift); });
      sceneDirty = true;
      if (now - landingStarted >= LANDING_DURATION) finishLanding();
      draw();
      if (!landingComplete) landingFrame = requestAnimationFrame(tickLanding);
    };
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
      onComplete?: () => void,
    ) => {
      finishLanding();
      stopCamera();
      fanIds = null;
      fanPage = 0;
      status.textContent = "";
      const fromPosition = camera.position.clone();
      const fromTarget = controls.target.clone();
      const fromZoom = camera.zoom;
      const duration = animate && !contextLost && !reducedMotion.matches && !document.hidden ? 240 : 0;
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
        if (progress === 1) {
          stopCamera();
          onComplete?.();
        }
        draw();
        if (progress < 1) cameraFrame = requestAnimationFrame(tick);
      };
      finishCamera = () => tick(start + duration);
      tick(start);
    };
    const draw = () => {
      if (stopped || contextLost) return;
      if (props.preview) sceneDirty = true;
      camera.updateMatrixWorld();
      if (props.preview) {
        element.dataset.cameraTarget = controls.target.toArray().map((value) => value.toFixed(5)).join(",");
        element.dataset.cameraTilt = controls.getPolarAngle().toFixed(5);
        element.dataset.cameraAngle = controls.getAzimuthalAngle().toFixed(5);
        element.dataset.cameraZoom = camera.zoom.toFixed(5);
        element.dataset.selectedProvince = selectedPinId ? kidProvinces.get(selectedPinId) ?? "" : "";
        provinceMaterials.forEach(({ code, material, baseColor }) => {
          const active = [...kidProvinces.values()].includes(code);
          const selected = code === kidProvinces.get(selectedPinId ?? "");
          material.color.setHex(selected ? 0xdcfff0 : active ? 0xa9eddb : baseColor);
          material.emissive.setHex(selected ? 0x28795d : active ? 0x164b3b : 0);
        });
      }
      const projectedPoints = positions
        .map((p) => {
          const position = p.position.clone();
          position.y += provinceGroups.get(kidProvinces.get(p.id)!)?.position.y ?? 0;
          const s = position.project(camera);
          return {
            id: p.id,
            x: ((s.x + 1) * width) / 2,
            y: ((1 - s.y) * height) / 2,
          };
        });
      const points = projectedPoints.filter(
          (p) =>
            p.x > -24 && p.x < width + 24 && p.y > -24 && p.y < height + 24,
        );
      const selectedPoint = props.preview ? projectedPoints.find((p) => p.id === selectedPinId) : undefined;
      let groups = clusterPoints(points.filter((p) => p !== selectedPoint), props.preview ? 52 : 36);
      if (selectedPoint) {
        groups = separateAwardGroups(groups, selectedPoint, width, height);
        groups.push({ ...selectedPoint, ids: [selectedPoint.id] });
      }
      const selectionKey = selectedPoint
        ? `${selectedPoint.id}:${selectedPoint.x.toFixed(1)}:${selectedPoint.y.toFixed(1)}:${width}:${height}`
        : "";
      if (selectionKey !== reportedSelection) {
        reportedSelection = selectionKey;
        callbacks.current.onAwardSelection?.(selectedPoint
          ? { kidId: selectedPoint.id, x: selectedPoint.x, y: selectedPoint.y, width, height }
          : null);
      }
      awardPlacements = [];
      const focusedMarker =
        document.activeElement instanceof HTMLButtonElement &&
        labels.contains(document.activeElement)
          ? document.activeElement
          : null;
      const usedMarkers = new Set<string>();
      let hoveredPinId: string | null = null;
      const marker = (
        id: string,
        x: number,
        y: number,
        text: string,
        title: string,
        click: (event: MouseEvent) => void,
        cluster = false,
        origin?: { x: number; y: number },
        summary: AwardSummary | null = props.preview ? summarizeAwards([id], callbacks.current.previewArtwork) : null,
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
          const ribbon = document.createElement("span");
          ribbon.className = "marker-ribbon";
          ribbon.setAttribute("aria-hidden", "true");
          for (let i = 0; i < 3; i++) {
            const spark = document.createElement("span");
            spark.className = `marker-spark marker-spark-${i}`;
            core.append(spark);
          }
          button.append(ribbon, core);
          if (!props.preview) {
            const label = document.createElement("span");
            label.className = "marker-label";
            label.setAttribute("aria-hidden", "true");
            button.append(label);
          } else if (!cluster) {
            const buildingLabel = document.createElement("span");
            buildingLabel.className = "building-label";
            buildingLabel.setAttribute("aria-hidden", "true");
            button.append(buildingLabel);
          }
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
        if (!props.preview) button.title = title;
        button.setAttribute("aria-label", title);
        const label = button.querySelector(".marker-label");
        if (label) label.textContent = cluster ? "" : title;
        if (props.preview && !cluster) {
          button.setAttribute("aria-pressed", String(selectedPinId === id));
        }
        if (props.preview && summary) {
          button.dataset.award = summary.primary;
          const recipientCount = callbacks.current.previewRecipientCounts?.[summary.leadId] ?? summary.makerCount;
          decorateAward(button, summary, recipientCount);
          const buildingLabel = button.querySelector<HTMLElement>(".building-label");
          if (buildingLabel) {
            const provinceCode = kidProvinces.get(summary.leadId);
            const provinceName = provinceCode ? provinceNames[provinceCode] ?? "" : "";
            const projectCount = callbacks.current.previewProjectCounts?.[summary.leadId] ?? recipientCount;
            const isSelected = selectedPinId === id;
            const nextKey = isSelected ? `selected:${provinceName}:${projectCount}` : `hover:${provinceName}`;
            if (buildingLabel.dataset.labelKey !== nextKey) {
              buildingLabel.dataset.labelKey = nextKey;
              buildingLabel.dataset.mode = isSelected ? "selected" : "hover";
              if (isSelected) {
                const countSpan = document.createElement("span");
                countSpan.className = "building-label__count";
                countSpan.textContent = String(projectCount);
                buildingLabel.replaceChildren(
                  `${provinceName} has `,
                  countSpan,
                  ` ${projectCount === 1 ? "project" : "projects"}.`,
                );
              } else {
                buildingLabel.textContent = provinceName;
              }
            }
          }
          button.dataset.hovered = String(hoveredMarkerKey === key);
          // Ground static building models directly onto the extruded province top surface.
          const elevation = provinceGroups.get(kidProvinces.get(summary.leadId)!)?.position.y ?? 0;
          const projected = awardAtScreenPoint(x, y, width, height, camera, 0.24 + elevation);
          awardPlacements.push({ id: summary.leadId, position: projected, summary, recipientCount });
          if (buildingLabel) {
            const level = buildingLevelForCount(recipientCount);
            const pixelsPerUnit = height * camera.zoom / (camera.top - camera.bottom);
            const scale = buildingScaleForView(pixelsPerUnit, selectedPinId === id, hoveredMarkerKey === key);
            const roofWorld = projected.clone();
            roofWorld.y += BUILDING_HEIGHT_BY_LEVEL[level] * scale;
            const roofScreen = roofWorld.project(camera);
            const roofScreenY = ((1 - roofScreen.y) * height) / 2;
            const liftPx = Math.max(24, Math.round(y - roofScreenY + 14));
            buildingLabel.style.setProperty("--building-label-lift", `${liftPx}px`);
          }
          if (hoveredMarkerKey === key) hoveredPinId = summary.leadId;
          button.onpointerenter = (event) => {
            if (event.pointerType !== "mouse") return;
            hoveredMarkerKey = key;
            sceneDirty = true;
            requestDraw();
          };
          button.onpointerleave = () => {
            if (hoveredMarkerKey !== key) return;
            hoveredMarkerKey = null;
            sceneDirty = true;
            requestDraw();
          };
        }
        button.dataset.id = id;
        button.onclick = (event) => {
          if (props.preview && !cluster) {
            selectAwardById(id, event.detail > 0);
          }
          click(event);
        };
        return button;
      };
      groups.forEach((group) => {
        if (group.ids.length === 1) {
          const id = group.ids[0]!;
          marker(id, group.x, group.y, "</>", kidNames.get(id) ?? "Maker", () =>
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
          const targets = fanOut(pageIds, 0, 0, props.preview ? 72 : 42);
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
          const margin = props.preview ? 32 : 24;
          const cx = clampCenter(group.x, margin - minX, width - margin - maxX);
          const cy = clampCenter(
            group.y + (props.preview && selectedPoint ? 80 : 0),
            80 - minY,
            height - 120 - (pageCount > 1 ? pageY : maxY),
          );
          targets.forEach((p) =>
            marker(
              p.id,
              cx + p.x,
              cy + p.y,
              "</>",
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
              if (props.preview) {
                fanIds = group.ids;
                fanPage = 0;
                requestDraw();
                return;
              }
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
            undefined,
            props.preview ? summarizeAwards(group.ids, callbacks.current.previewArtwork) : null,
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
        if (props.preview && !focusMoved) {
          // Zoom/rotation can put the invoking medal outside the current view.
          element.focus({ preventScroll: true });
          focusMoved = true;
        }
        pendingFocusId = null;
      }
      for (const [key, button] of markerButtons) {
        if (!usedMarkers.has(key)) {
          if (hoveredMarkerKey === key) hoveredMarkerKey = null;
          button.remove();
          markerButtons.delete(key);
        }
      }
      for (const placement of awardPlacements) {
        placement.faceViewer = [selectedPinId, hoveredPinId].some((activeId) => activeId !== null
          && kidProvinces.get(activeId) === kidProvinces.get(placement.id));
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
      updateAwardMatrices();
      beacons?.update(awardPlacements, (id) => .24 + (provinceGroups.get(kidProvinces.get(id)!)?.position.y ?? 0), camera, width, height);
      if (sceneDirty) {
        renderer.render(scene, camera);
        sceneDirty = false;
      }
      if (awardsTurning && !awardFrame && !document.hidden && !reducedMotion.matches)
        awardFrame = requestAnimationFrame(tickAwards);
    };
    const requestDraw = () => {
      if (stopped || contextLost) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; draw(); });
    };
    const updateAwardMatrices = () => {
      awardsTurning = awards?.update(awardPlacements, height * camera.zoom / (camera.top - camera.bottom),
        selectedPinId, awardTime, camera.quaternion,
        reducedMotion.matches || document.hidden ? undefined : performance.now()) ?? false;
    };
    const tickAwards = (now: number) => {
      awardFrame = 0;
      const fireworksActive = fireworks?.active() ?? false;
      if (stopped || contextLost || reducedMotion.matches || document.hidden || (awardsPaused && !awardsTurning && !fireworksActive)) {
        lastAwardFrame = null;
        return;
      }
      const dtMs = lastAwardFrame !== null ? Math.min(64, now - lastAwardFrame) : 16;
      if (!awardsPaused) awardTime += dtMs;
      lastAwardFrame = now;
      const stillBursting = fireworks?.update(dtMs / 1000) ?? false;
      // Camera/landing frames also render awards; idle motion only updates mesh matrices.
      // A queued draw() (e.g. during a drag) updates the same matrices and renders after this tick, so skip the duplicate render.
      if (landingComplete && !movingCamera && (awardPlacements.length || stillBursting) && !frame) {
        updateAwardMatrices();
        renderer.render(scene, camera);
      }
      if ((!awardsPaused || awardsTurning || stillBursting) && !awardFrame) awardFrame = requestAnimationFrame(tickAwards);
      else if (awardsPaused && !awardsTurning && !stillBursting) lastAwardFrame = null;
    };
    const syncAwardMotion = () => {
      cancelAnimationFrame(awardFrame);
      awardFrame = 0;
      lastAwardFrame = null;
      const playing = !!awards && !contextLost && !awardsPaused && !reducedMotion.matches && !document.hidden;
      element.dataset.awardMotion = playing ? "playing" : "paused";
      if (reducedMotion.matches) awardTime = 0;
      requestDraw();
      if (playing) awardFrame = requestAnimationFrame(tickAwards);
    };
    const changed = () => {
      if (movingCamera) return;
      if (!selectedPinId) awardReturnView = null;
      sceneDirty = true;
      status.textContent = "";
      if (!props.preview) {
        const next = controls.target.clone();
        controls.target.x = THREE.MathUtils.clamp(next.x, -5, 5);
        controls.target.z = THREE.MathUtils.clamp(next.z, -8, 8);
        camera.position.add(controls.target.clone().sub(next));
      }
      fanIds = null;
      fanPage = 0;
      restoreFanPageFocus = false;
      requestDraw();
    };
    controls.addEventListener("change", changed);
    const userCameraStart = () => {
      finishLanding();
      stopCamera();
      pendingFocusId = null;
      if (!props.preview) selectedPinId = null;
      hoveredMarkerKey = null;
      sceneDirty = true;
      requestDraw();
    };
    controls.addEventListener("start", userCameraStart);
    const dismissAward = (animate: boolean) => {
      selectedPinId = null;
      sceneDirty = true;
      if (awardReturnView) {
        const view = awardReturnView;
        // Retain the first origin if selection interrupts the return journey.
        moveCamera(view.position, view.target, view.zoom, animate, () => { awardReturnView = null; });
      } else requestDraw();
    };
    const dismissPin = (event: KeyboardEvent) => {
      finishLanding();
      if (event.key === "Escape" && !event.defaultPrevented) {
        dismissAward(false);
      }
    };
    const stage = element.parentElement ?? element;
    stage.addEventListener("keydown", dismissPin);
    const dismissBackground = () => {
      hoveredMarkerKey = null;
      if (selectedPinId && callbacks.current.onAwardDismissRequest) callbacks.current.onAwardDismissRequest(true);
      else dismissAward(true);
    };
    let backgroundPointer: { id: number; x: number; y: number } | null = null;
    const backgroundDown = (event: PointerEvent) => {
      backgroundPointer = event.isPrimary && event.button === 0
        ? { id: event.pointerId, x: event.clientX, y: event.clientY } : null;
    };
    const backgroundMove = (event: PointerEvent) => {
      if (backgroundPointer && Math.hypot(event.clientX - backgroundPointer.x, event.clientY - backgroundPointer.y) > 6)
        backgroundPointer = null;
    };
    const backgroundCancel = () => { backgroundPointer = null; };
    const backgroundClick = (event: MouseEvent) => {
      if (props.preview && (!backgroundPointer
        || Math.hypot(event.clientX - backgroundPointer.x, event.clientY - backgroundPointer.y) > 6)) return;
      backgroundPointer = null;
      dismissBackground();
    };
    renderer.domElement.addEventListener("pointerdown", backgroundDown);
    renderer.domElement.addEventListener("pointermove", backgroundMove);
    renderer.domElement.addEventListener("pointercancel", backgroundCancel);
    renderer.domElement.addEventListener("click", backgroundClick);
    const motionPreferenceChanged = () => {
      if (reducedMotion.matches) finishLanding();
      finishCamera?.();
      stopCamera();
      if (reducedMotion.matches)
        labels.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      syncAwardMotion();
    };
    reducedMotion.addEventListener("change", motionPreferenceChanged);
    const visibilityChanged = () => {
      element.dataset.hidden = String(document.hidden);
      if (document.hidden) {
        finishLanding();
        finishCamera?.();
        stopCamera();
      }
      syncAwardMotion();
    };
    document.addEventListener("visibilitychange", visibilityChanged);
    const resize = new ResizeObserver(() => {
      if (landingStarted !== null) finishLanding();
      finishCamera?.();
      stopCamera();
      width = element.clientWidth;
      height = element.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      const halfHeight = props.preview
        ? Math.max((landView.max.y - landView.min.y) / 2, (landView.max.x - landView.min.x) / (2 * aspect))
        : 7.6;
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      sceneDirty = true;
      fanIds = null;
      fanPage = 0;
      restoreFanPageFocus = false;
      requestDraw();
      if (!landingComplete && landingStarted === null) {
        landingLift = skyLift();
        landingOrder.forEach((group, index) => { group.position.y = landingHeight(0, index, landingOrder.length, landingLift); });
        cancelAnimationFrame(landingFrame);
        landingFrame = requestAnimationFrame(tickLanding);
      }
    });
    resize.observe(element);
    const lost = (event: Event) => {
      event.preventDefault();
      if (stopped || contextLost) return;
      contextLost = true;
      element.dataset.context = "recovering";
      setRecovering(true);
      controls.enabled = false;
      labels.inert = true;
      finishLanding();
      finishCamera?.();
      stopCamera();
      cancelAnimationFrame(frame);
      syncAwardMotion();
      recoveryTimer = setTimeout(() => {
        if (!stopped && contextLost) callbacks.current.onFailure("context-timeout");
      }, 8000);
    };
    const restored = () => {
      if (stopped || !contextLost) return;
      clearTimeout(recoveryTimer);
      contextLost = false;
      element.dataset.context = "ready";
      setRecovering(false);
      controls.enabled = true;
      labels.inert = false;
      sceneDirty = true;
      syncAwardMotion();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    renderer.domElement.addEventListener("webglcontextrestored", restored);
    updateKids.current = (kids) => {
      if (stopped) return;
      stopCamera();
      pendingFocusId = null;
      selectedPinId = null;
      hoveredMarkerKey = null;
      awardReturnView = null;
      let pins;
      try {
        pins = generateProvincePins(kids, props.features);
      } catch {
        callbacks.current.onFailure("geometry");
        return;
      }
      positions = pins.map((pin) => {
        const p = mapPoint(pin.position.lng, pin.position.lat);
        return { id: pin.kidId, position: new THREE.Vector3(p.x, props.preview ? 0.24 : 0.28, -p.y) };
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
      pinMesh.count = props.preview ? 0 : pins.length;
      positions.forEach((p, i) =>
        pinMesh.setMatrixAt(
          i,
          matrix.makeTranslation(p.position.x, 0.28, p.position.z),
        ),
      );
      pinMesh.instanceMatrix.needsUpdate = true;
      // Instance positions can move between provinces without changing capacity.
      pinMesh.boundingBox = null;
      pinMesh.boundingSphere = null;
      const visibleKids = kids.filter((kid) => kid.showOnMap);
      kidNames = new Map(visibleKids.map((kid) => [kid.id, kid.displayName]));
      kidProvinces = new Map(visibleKids.map((kid) => [kid.id, kid.province]));
      const active = new Set(visibleKids.map((kid) => kid.province));
      provinceMaterials.forEach(({ code, material, baseColor }) => {
        material.color.setHex(active.has(code) ? (props.preview ? 0xa9eddb : 0xffdc50) : baseColor);
        material.emissive.setHex(props.preview && active.has(code) ? 0x164b3b : 0x000000);
        material.emissiveIntensity = 0.45;
      });
      sceneDirty = true;
      fanIds = null;
      fanPage = 0;
      restoreFanPageFocus = false;
      requestDraw();
    };
    const selectAwardById = (id: string, animate: boolean) => {
      const anchor = positions.find((p) => p.id === id);
      if (!anchor) return;
      if (selectedPinId === id) {
        requestDraw();
        return;
      }
      const width = element.clientWidth;
      const height = element.clientHeight;
      finishLanding();
      awardReturnView ??= { position: camera.position.clone(), target: controls.target.clone(), zoom: camera.zoom };
      selectedPinId = id;
      sceneDirty = true;
      const view = awardView(anchor.position, camera.position, controls.target, camera.top, camera.zoom);
      const zoom = Math.min(controls.maxZoom, view.zoom);
      const frameX = bubbleFocusX({ width, height }, callbacks.current.previewRecipientCounts?.[id] ?? 1) / width;
      const shift = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
        .multiplyScalar((.5 - frameX) * (camera.right - camera.left) / zoom)
        .addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1),
          .08 * (camera.top - camera.bottom) / zoom);
      moveCamera(new THREE.Vector3(view.position.x, view.position.y, view.position.z).add(shift),
        new THREE.Vector3(view.target.x, view.target.y, view.target.z).add(shift), zoom, animate);
    };
    actions.current = {
      finishEntrance: finishLanding,
      pauseAwards: (paused) => { awardsPaused = paused; syncAwardMotion(); },
      dismissAward: (animate) => {
        const previousId = selectedPinId;
        dismissAward(animate);
        pendingFocusId = previousId;
        requestDraw();
      },
      focusAward: (kidId, animate) => {
        if (props.preview) selectAwardById(kidId, animate);
      },
      zoom: (factor, animate) => {
        if (!selectedPinId) awardReturnView = null;
        moveCamera(camera.position.clone(), controls.target.clone(),
          THREE.MathUtils.clamp(camera.zoom * factor, controls.minZoom, controls.maxZoom), animate);
      },
      reset: (animate) => {
        selectedPinId = null;
        awardReturnView = null;
        hoveredMarkerKey = null;
        pendingFocusId = null;
        callbacks.current.onCluster([]);
        moveCamera(homePosition.clone(), homeTarget.clone(), 1, animate);
      },
    };
    requestDraw();
    syncAwardMotion();
    const scheduleFirework = (delayMs: number) => {
      if (!props.preview || !fireworks || stopped) return;
      window.clearTimeout(fireworkTimer);
      fireworkTimer = window.setTimeout(() => {
        if (stopped) return;
        if (
          landingComplete &&
          !contextLost &&
          !document.hidden &&
          !reducedMotion.matches &&
          awardPlacements.length > 0
        ) {
          const target = awardPlacements[Math.floor(Math.random() * awardPlacements.length)]!;
          fireworks.launch(target.position, () => callbacks.current.onFirework?.(target.id));
          if (!awardFrame) awardFrame = requestAnimationFrame(tickAwards);
        }
        scheduleFirework(10000 + Math.round(Math.random() * 6000));
      }, delayMs);
    };
    if (props.preview && fireworks) {
      scheduleFirework(4500);
    }
    return () => {
      stopped = true;
      window.clearTimeout(fireworkTimer);
      clearTimeout(recoveryTimer);
      cancelAnimationFrame(landingFrame);
      cancelAnimationFrame(awardFrame);
      stopCamera();
      reducedMotion.removeEventListener("change", motionPreferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.dispose();
      stage.removeEventListener("keydown", dismissPin);
      renderer.domElement.removeEventListener("pointerdown", backgroundDown);
      renderer.domElement.removeEventListener("pointermove", backgroundMove);
      renderer.domElement.removeEventListener("pointercancel", backgroundCancel);
      renderer.domElement.removeEventListener("click", backgroundClick);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("webglcontextrestored", restored);
      pinMesh.dispose();
      beacons?.dispose();
      fireworks?.dispose();
      awards?.dispose();
      resources.forEach((r) => r.dispose());
      if (!contextLost) renderer.forceContextLoss();
      renderer.dispose();
      renderer.domElement.remove();
      labels.remove();
      status.remove();
      actions.current = null;
      updateKids.current = null;
    };
  }, [props.features, props.preview]);
  useEffect(() => {
    updateKids.current?.(props.kids);
  }, [props.kids, props.features, props.preview]);
  useEffect(() => {
    if (props.awardDismissal?.request) actions.current?.dismissAward(props.awardDismissal.animate);
  }, [props.awardDismissal]);
  useEffect(() => {
    if (props.awardFocus?.request) actions.current?.focusAward(props.awardFocus.kidId, props.awardFocus.animate);
  }, [props.awardFocus]);
  useEffect(() => { actions.current?.pauseAwards(motionPaused); }, [motionPaused]);
  useEffect(() => {
    const stage = host.current?.parentElement;
    if (!stage) return;
    const observer = new MutationObserver(() => {
      const attr = stage.getAttribute("data-motion");
      if (attr === "paused" || attr === "playing") {
        actions.current?.finishEntrance();
        setMotionPaused(attr === "paused");
      }
    });
    observer.observe(stage, { attributes: true, attributeFilter: ["data-motion"] });
    return () => observer.disconnect();
  }, []);
  return (
    <div className="map-stage" data-motion={motionPaused ? "paused" : "playing"}>
      {recovering && <p className="map-recovery" role="status">กำลังกู้คืนแผนที่… ยังดูผลงานที่เปิดไว้ได้</p>}
      {!props.preview && (
        <button className="motion-toggle" disabled={recovering}
          onClick={() => { actions.current?.finishEntrance(); setMotionPaused((paused) => !paused); }}>
          {motionPaused ? "Resume sparkles" : "Pause sparkles"}
        </button>
      )}
      <div
        className="map-canvas"
        ref={host}
        tabIndex={-1}
        role="region"
        aria-label="Interactive Thailand map"
      />
      {!props.preview && (
        <>
          <div className="map-controls" aria-label="Map controls">
            <button disabled={recovering} onClick={(event) => actions.current?.zoom(1.5, event.detail > 0)} aria-label="Zoom in">+</button>
            <button disabled={recovering} onClick={(event) => actions.current?.zoom(1 / 1.5, event.detail > 0)} aria-label="Zoom out">−</button>
            <button disabled={recovering} onClick={(event) => actions.current?.reset(event.detail > 0)} aria-label="Reset map view">⌂</button>
          </div>
          <p className="map-hint">Drag to explore · Scroll to zoom · Right-drag to tilt</p>
        </>
      )}
    </div>
  );
}
