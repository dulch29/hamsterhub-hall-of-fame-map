import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { AwardGroup } from "../data/demoAwards";
import { provinceRecipients } from "../data/provinceRecipients";
import type { AwardSelection } from "../scene/ThailandMap";
import { GUIDE_WELCOME, GUIDE_MAP_HELP, GUIDE_PRESENTATION, provinceNarration, studentNarration } from "./guideContent";
import { GuideChat } from "./GuideChat";
import { CardImage } from "./PinCard";
import {
  faceSignForDelta,
  facingLabel,
  pickRaceWinner,
  pickWanderTarget,
  selectExplainerPose,
  selectGuidePose,
  type MascotScene,
  type MascotWinner,
  type Rect,
} from "./mascotChoreography";
import { FIGHT_FRAMES, MASCOT_POSES, mascotSpritePath } from "./mascotSprites";
import { useTypewriter } from "./typewriter";
import { useGuideChat } from "./useGuideChat";
import { guideNavigation } from "../guide/navigation";
import type { GuideDataset, GuideTarget } from "../guide/contract";

export const ENABLE_ORANGE_HAMSTER = false;

export type StudentPresenterInfo = {
  id: string;
  name: string;
  portraitUrl: string | null;
  initials: string;
  projectTitle?: string;
};

declare global {
  interface Window {
    __MASCOT_RNG?: () => number;
  }
}

function getMascotRng(): () => number {
  return (typeof window !== "undefined" && window.__MASCOT_RNG) || Math.random;
}

/**
 * Anchors the chat pill directly to the Guide hamster's live position on screen
 * (with `--tail-left` pointing straight at the hamster's head), flipping below
 * if Guide is near the top of the viewport.
 */
function anchoredPanel(
  launcher: HTMLElement | null,
  wander: { x: number; y: number },
  vvHeight: number,
  keyboardInset: number,
): { style?: CSSProperties; placement: "above" | "below" } {
  if (typeof window === "undefined") return { placement: "above" };
  if (innerWidth <= 700) {
    if (keyboardInset > 80 || vvHeight <= 520) {
      const bottom = Math.max(10, keyboardInset + 10);
      return { style: { bottom, "--panel-bottom": `${bottom}px` } as CSSProperties, placement: "above" };
    }
    return { placement: "above" };
  }
  if (!launcher) return { placement: "above" };
  const panelWidth = Math.min(340, innerWidth - 24);
  const hamsterLeft = launcher.offsetLeft + wander.x;
  const hamsterTop = launcher.offsetTop + wander.y;
  const hamsterCenterX = hamsterLeft + launcher.offsetWidth / 2;
  const left = Math.round(Math.min(Math.max(12, hamsterCenterX - 42), innerWidth - panelWidth - 12));
  const tailLeft = Math.round(Math.max(18, Math.min(panelWidth - 54, hamsterCenterX - left - 18)));

  if (keyboardInset > 80) {
    const bottom = keyboardInset + 10;
    return {
      style: { left, bottom, "--panel-bottom": `${bottom}px`, "--tail-left": `${tailLeft}px` } as CSSProperties,
      placement: "above",
    };
  }

  // If Guide wandered near the top edge, open the ask bar directly below Guide instead of clipping off-top.
  if (hamsterTop < 180) {
    const top = Math.round(hamsterTop + launcher.offsetHeight + 12);
    return {
      style: { left, top, bottom: "auto", "--panel-top": `${top}px`, "--tail-left": `${tailLeft}px` } as CSSProperties,
      placement: "below",
    };
  }

  const bottom = Math.round(Math.max(18, vvHeight - hamsterTop + 12));
  return {
    style: { left, bottom, "--panel-bottom": `${bottom}px`, "--tail-left": `${tailLeft}px` } as CSSProperties,
    placement: "above",
  };
}

export function CharacterGuides({ groups, group, studentId, competitionId, student, showAll, anchor, exiting, dataset, onTarget, guidingTap, onDialogueDone }: {
  groups: AwardGroup[]; group?: AwardGroup; studentId: string | null; competitionId: string | null;
  student?: StudentPresenterInfo | null;
  showAll: boolean; anchor: AwardSelection | null; exiting: boolean;
  dataset: GuideDataset; onTarget: (target: GuideTarget) => void;
  guidingTap?: boolean; onDialogueDone?: (stage: "province" | "student" | "presentation") => void;
}) {
  // Only the hamster is on screen at first; tapping it opens the chat bar anchored directly to where it stands.
  const [open, setOpen] = useState(false);
  const contextTarget: GuideTarget | undefined = group ? { kind: studentId ? "student" : "province", id: studentId ?? group.id, label: "" } : undefined;
  const context = contextTarget && guideNavigation(contextTarget, groups, dataset) ? `${contextTarget.kind}:${contextTarget.id}` : undefined;
  const chat = useGuideChat(open, dataset, context);
  const [help, setHelp] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(typeof document !== "undefined" ? document.hidden : false);
  const [traveling, setTraveling] = useState(false);
  const [face, setFace] = useState(-1); // sprites face left; -1 mirrors them to face right, 1 keeps them facing left
  const [explainerDelta, setExplainerDelta] = useState({ dx: 0, dy: 0 });
  const [explainerPos, setExplainerPos] = useState({ x: 24, y: 460 });
  const explainerPosRef = useRef(explainerPos);
  explainerPosRef.current = explainerPos;
  const [captionLayout, setCaptionLayout] = useState<{ style?: CSSProperties; placement: "above" | "below" }>({ placement: "above" });
  const [speechLayout, setSpeechLayout] = useState<CSSProperties | undefined>(undefined);
  const [explainerStep, setExplainerStep] = useState(0);
  const [fightPhase, setFightPhase] = useState<"idle" | "run-in" | "fighting" | "done">("idle");
  const [fightFrame, setFightFrame] = useState(0);
  const [provinceWinner, setProvinceWinner] = useState<"guide" | "explainer">("explainer");
  const [racing, setRacing] = useState(false);
  const [winner, setWinner] = useState<MascotWinner>("none");
  const [raceCount, setRaceCount] = useState(0);
  const [guideHovered, setGuideHovered] = useState(false);
  const [explainerHovered, setExplainerHovered] = useState(false);
  const [pointerDown, setPointerDown] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const [viewportMetrics, setViewportMetrics] = useState({ vvHeight: 900, keyboardInset: 0 });
  const traveler = useRef<HTMLDivElement>(null);
  const explainerRoamer = useRef<HTMLButtonElement>(null);
  const presenter = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const previousGroup = useRef(group?.id);
  const previousCompetition = useRef<string | null>(null);
  const previousOpen = useRef(open);
  const wasOnStageRef = useRef(false);
  const wasGroupActiveRef = useRef(false);
  const lastTravelTargetRef = useRef<{ x: number; y: number } | null>(null);
  const returningRef = useRef(false);
  const lastStagePosRef = useRef<{ x: number; y: number } | null>(null);
  const text = exiting ? GUIDE_MAP_HELP : competitionId ? GUIDE_PRESENTATION
    : studentId && group ? studentNarration(group, studentId) : group ? provinceNarration(group) : help ? GUIDE_MAP_HELP : GUIDE_WELCOME;
  // Hold typing until the mascot fight finishes so the winner always starts speaking after taking the stage.
  const typedText = group && !exiting && fightPhase !== "done" ? "" : text;
  const typed = useTypewriter(typedText, { instant: paused || hidden });
  const hasPeers = Boolean(group && !showAll && provinceRecipients(group).length > 1);

  useEffect(() => {
    if (typeof Image === "undefined") return;
    for (const mascot of ["guide", "explainer"] as const) {
      for (const pose of MASCOT_POSES) {
        const img = new Image();
        img.src = mascotSpritePath(mascot, pose);
      }
    }
    for (const frame of FIGHT_FRAMES) {
      const img = new Image();
      img.src = frame;
    }
  }, []);

  useLayoutEffect(() => {
    const syncViewport = () => {
      const vv = window.visualViewport;
      const vvHeight = Math.round(vv?.height ?? window.innerHeight);
      const vvOffsetTop = Math.round(vv?.offsetTop ?? 0);
      const keyboardInset = Math.max(0, Math.round(window.innerHeight - vvHeight - vvOffsetTop));
      setViewportMetrics({ vvHeight, keyboardInset });
    };
    syncViewport();
    window.visualViewport?.addEventListener("resize", syncViewport);
    window.visualViewport?.addEventListener("scroll", syncViewport);
    window.addEventListener("resize", syncViewport);
    return () => {
      window.visualViewport?.removeEventListener("resize", syncViewport);
      window.visualViewport?.removeEventListener("scroll", syncViewport);
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  // Phase 3 province fight: when a province is clicked, Guide runs to Explainer and they fight to win who explains!
  useLayoutEffect(() => {
    if (!group || exiting) {
      previousGroup.current = undefined;
      setFightPhase("idle");
      return;
    }
    const isNewProvince = previousGroup.current !== group.id;
    if (isNewProvince) {
      setOpen(false);
      previousGroup.current = group.id;
      if (!ENABLE_ORANGE_HAMSTER) {
        setProvinceWinner("explainer");
        setFightPhase("done");
        return;
      }
      const provWinner = pickRaceWinner(getMascotRng());
      setProvinceWinner(provWinner);
      const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (paused || hidden || reduced) {
        setFightPhase("done");
        return;
      }
      setFightPhase("run-in");
      setFightFrame(0);
    }
  }, [group?.id, exiting, paused, hidden]);

  useEffect(() => {
    if (fightPhase === "idle" || fightPhase === "done") return;
    if (paused || hidden || competitionId) {
      setFightPhase("done");
      return;
    }
    if (fightPhase === "run-in") {
      const timer = window.setTimeout(() => setFightPhase("fighting"), 420);
      return () => window.clearTimeout(timer);
    }
    if (fightPhase === "fighting") {
      const frameTimer = window.setInterval(() => setFightFrame((f) => (f + 1) % FIGHT_FRAMES.length), 220);
      const doneTimer = window.setTimeout(() => setFightPhase("done"), 1100);
      return () => {
        window.clearInterval(frameTimer);
        window.clearTimeout(doneTimer);
      };
    }
  }, [fightPhase, paused, hidden, competitionId]);

  const lastCompletedDialogue = useRef("");
  useEffect(() => {
    if (!group || exiting || fightPhase !== "done") {
      lastCompletedDialogue.current = "";
      return;
    }
    if (!typed.done || typed.text.length === 0) return;
    const stage: "province" | "student" | "presentation" = competitionId ? "presentation" : studentId ? "student" : "province";
    const key = `${group.id}:${stage}:${typedText}`;
    if (lastCompletedDialogue.current === key) return;
    lastCompletedDialogue.current = key;
    onDialogueDone?.(stage);
  }, [group, exiting, fightPhase, competitionId, studentId, typedText, typed.done, typed.text.length, onDialogueDone]);

  // Phase 3 race to province on each project click: both run and one randomly wins before the student jumps in to explain alone.
  useLayoutEffect(() => {
    if (!competitionId || exiting) {
      previousCompetition.current = null;
      setRacing(false);
      if (!group || exiting) setWinner("none");
      return;
    }
    if (previousCompetition.current !== competitionId) {
      previousCompetition.current = competitionId;
      const chosen = pickRaceWinner(getMascotRng());
      setWinner(chosen);
      setRaceCount((count) => count + 1);
      const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!paused && !hidden && !reduced) {
        setRacing(true);
        const timer = window.setTimeout(() => setRacing(false), 340);
        return () => window.clearTimeout(timer);
      }
      setRacing(false);
    }
  }, [competitionId, group?.id, exiting, paused, hidden]);

  const activeScene: MascotScene = !group || exiting
    ? "tour"
    : competitionId
      ? (racing ? "race" : "student-solo")
      : "rivalry";
  const fighting = activeScene === "rivalry" && fightPhase === "fighting";
  const runningToFight = activeScene === "rivalry" && fightPhase === "run-in";
  const arguing = activeScene === "rivalry" && !traveling && !fighting;

  useEffect(() => {
    if (!traveling && !arguing && !racing) { setExplainerStep(0); return; }
    const timer = window.setInterval(() => setExplainerStep((value) => 1 - value), (traveling || racing) ? 140 : 380);
    return () => window.clearInterval(timer);
  }, [traveling, arguing, racing]);

  useLayoutEffect(() => {
    if (open && !previousOpen.current) panel.current?.querySelector<HTMLElement>("textarea")?.focus({ preventScroll: true });
    previousOpen.current = open;
  }, [open]);

  useLayoutEffect(() => {
    const root = document.querySelector(".map-preview");
    if (!root) return;
    const sync = () => setPaused(Boolean(root.querySelector('.map-stage[data-motion="paused"], .map-canvas[data-context="recovering"]')));
    const observer = new MutationObserver(sync);
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-motion", "data-context"] });
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    sync();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useLayoutEffect(() => {
    let animation: Animation | undefined;
    const move = () => {
      const element = traveler.current;
      if (!element) return;
      const isGroupActive = Boolean(group && !exiting);
      const enteringStage = isGroupActive && !wasGroupActiveRef.current;
      wasGroupActiveRef.current = isGroupActive;
      if (!isGroupActive) {
        lastTravelTargetRef.current = null;
      }

      let x = 24, y = innerHeight - 230;
      const target = document.querySelector<HTMLElement>(studentId ? ".student-preview" : showAll ? ".province-recipients" : ".map-canvas");
      const targetBounds = (studentId || showAll) && target ? target.getBoundingClientRect() : null;
      const landscapePhone = innerHeight <= 500 && innerWidth > innerHeight;
      if (landscapePhone) {
        if (targetBounds) {
          x = targetBounds.x >= 96 ? Math.max(12, targetBounds.x - 84) : 12;
          y = Math.max(66, Math.min(innerHeight - 130, targetBounds.y + 12));
        } else {
          x = 12;
          y = Math.max(66, Math.min(innerHeight - 130, innerHeight - 150));
        }
      } else if (innerWidth <= 700) {
        x = 12;
        y = studentId ? (hasPeers && innerWidth < 600 ? 128 : 74) : showAll ? 240 : 180;
      } else if (group && targetBounds) {
        x = Math.max(24, Math.min(targetBounds.left - 168, targetBounds.left - 220));
        y = Math.min(innerHeight - 210, targetBounds.y + 180);
      } else if (group && anchor) {
        x = Math.max(24, anchor.x - 260);
        y = Math.min(innerHeight - 210, anchor.y + 80);
      }
      y = Math.max(landscapePhone ? 66 : innerWidth <= 700 ? 74 : 170, y);

      // When a student project opens, the explaining mascot steps aside to make room for the student's jump-in.
      const asideX = competitionId ? Math.max(8, x - (innerWidth <= 700 ? 48 : 110)) : x;
      const asideY = competitionId ? Math.min(innerHeight - 110, y + (innerWidth <= 700 ? 72 : 36)) : y;
      setExplainerPos({ x, y });
      lastStagePosRef.current = { x: asideX, y: asideY };

      if (innerWidth > 700 && !landscapePhone) {
        const safeLeft = 16;
        const safeRight = targetBounds && targetBounds.left > 210 ? Math.max(180, targetBounds.left - 16) : innerWidth - 16;
        const maxWidth = Math.min(260, Math.max(148, safeRight - safeLeft));
        const hamsterCenterX = asideX + 60;
        const absLeft = Math.max(safeLeft, Math.min(safeRight - maxWidth, hamsterCenterX - maxWidth / 2));
        const captionLeft = Math.round(absLeft - asideX);
        const tailLeft = Math.round(Math.max(16, Math.min(maxWidth - 26, hamsterCenterX - absLeft - 5)));
        const placement = asideY < 136 ? "below" : "above";
        setCaptionLayout({
          placement,
          style: {
            "--caption-left": `${captionLeft}px`,
            "--caption-max-width": `${Math.round(maxWidth)}px`,
            "--caption-tail-left": `${tailLeft}px`,
          } as CSSProperties,
        });
      } else {
        setCaptionLayout({ placement: "above", style: undefined });
      }

      if (
        !enteringStage &&
        isGroupActive &&
        lastTravelTargetRef.current &&
        Math.abs(lastTravelTargetRef.current.x - asideX) < 2 &&
        Math.abs(lastTravelTargetRef.current.y - asideY) < 2
      ) {
        return;
      }
      lastTravelTargetRef.current = isGroupActive ? { x: asideX, y: asideY } : null;

      const from = getComputedStyle(element).transform;
      animation?.cancel();

      let startTransform = from;
      let startX = 24;
      let startY = 460;
      if ((enteringStage || from === "none") && launcher.current) {
        const lRect = launcher.current.getBoundingClientRect();
        if (lRect.width > 0) {
          const travelerW = element.offsetWidth || (innerWidth <= 700 ? 56 : 120);
          const travelerH = element.offsetHeight || (innerWidth <= 700 ? 64 : 138);
          startX = Math.round(lRect.left + lRect.width / 2 - travelerW / 2);
          startY = Math.round(lRect.bottom - travelerH);
          const startScale = Math.max(0.45, Math.min(1, Number((lRect.height / travelerH).toFixed(3))));
          startTransform = `translate(${startX}px, ${startY}px) scale(${startScale})`;
        }
      } else if (from !== "none") {
        const current = new DOMMatrixReadOnly(from);
        startX = current.e;
        startY = current.f;
      }
      if (startTransform === "none") {
        startTransform = "translate(24px, 460px)";
      }

      const to = `translate(${asideX}px, ${asideY}px)`;
      element.style.transform = to;
      const dx = asideX - startX;
      const dy = asideY - startY;
      setExplainerDelta({ dx, dy });
      if ((Math.abs(dx) < 1 && Math.abs(dy) < 1) || !group || exiting || paused || hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setFace(asideX <= innerWidth * 0.55 ? -1 : 1);
        setTraveling(false); return;
      }
      setFace(faceSignForDelta(dx, -1));
      const duration = Math.round(Math.min(920, Math.max(380, (Math.hypot(dx, dy) / 380) * 1000)));
      animation = element.animate([{ transform: startTransform }, { transform: `${to} scale(1)` }],
        { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
      setTraveling(true);
      void animation.finished.then(() => {
        setFace(asideX <= innerWidth * 0.55 ? -1 : 1);
        setTraveling(false);
      }, () => {});
    };
    move();
    window.addEventListener("resize", move);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", move);
    return () => {
      if (animation && traveler.current) traveler.current.style.transform = getComputedStyle(traveler.current).transform;
      animation?.cancel(); window.removeEventListener("resize", move); preference.removeEventListener("change", move);
    };
  }, [group?.id, studentId, showAll, competitionId, anchor?.x, anchor?.y, paused, hidden, exiting, hasPeers]);

  // Student portrait jumps in an arc from the card identity to the Explainer's spot when a project opens!
  useLayoutEffect(() => {
    let jumpAnim: Animation | undefined;
    const placePresenter = (animateJump: boolean) => {
      const element = presenter.current;
      if (!element || !competitionId || !student || exiting) {
        setSpeechLayout(undefined);
        return;
      }
      const landscapePhone = innerHeight <= 500 && innerWidth > innerHeight;
      const target = document.querySelector<HTMLElement>(".student-preview");
      const bounds = target?.getBoundingClientRect();
      let x = 24;
      let y = 160;
      if (landscapePhone) {
        x = bounds && bounds.x >= 96 ? Math.max(12, Math.round((bounds.x - 64) / 2)) : 12;
        y = 104;
      } else if (innerWidth <= 700) {
        x = 12;
        y = 156;
      } else if (innerWidth >= 1000 && bounds) {
        x = Math.max(24, Math.round(bounds.x - 208));
        y = Math.max(160, Math.min(innerHeight - 210, Math.round(bounds.y + 135)));
      } else if (bounds) {
        x = Math.max(24, Math.round(bounds.x - 190));
        y = Math.max(160, Math.min(innerHeight - 210, Math.round(bounds.y + 110)));
      }
      if (innerWidth > 700 && !landscapePhone && bounds && bounds.left > 200) {
        const safeLeft = 16;
        const safeRight = Math.max(180, bounds.left - 16);
        const maxWidth = Math.min(260, Math.max(140, safeRight - safeLeft));
        const presenterCenterX = x + 70;
        const absLeft = Math.max(safeLeft, Math.min(safeRight - maxWidth, presenterCenterX - maxWidth / 2));
        const tailLeft = Math.round(Math.max(16, Math.min(maxWidth - 26, presenterCenterX - absLeft)));
        setSpeechLayout({
          "--speech-left": `${Math.round(absLeft - x)}px`,
          "--speech-transform": "none",
          "--speech-max-width": `${Math.round(maxWidth)}px`,
          "--speech-tail-left": `${tailLeft}px`,
        } as CSSProperties);
      } else {
        setSpeechLayout(undefined);
      }
      const to = `translate(${x}px, ${y}px)`;
      element.style.transform = to;
      if (animateJump && !paused && !hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const identity = document.querySelector<HTMLElement>(".student-preview__identity");
        const fromRect = identity?.getBoundingClientRect();
        const fromX = fromRect ? Math.round(fromRect.x) : x + 120;
        const fromY = fromRect ? Math.round(fromRect.y) : y - 40;
        const midX = Math.round((fromX + x) / 2);
        const midY = Math.max(16, Math.min(fromY, y) - 58);
        jumpAnim?.cancel();
        jumpAnim = element.animate(
          [
            { transform: `translate(${fromX}px, ${fromY}px) scale(0.86)`, opacity: 0.9 },
            { transform: `translate(${midX}px, ${midY}px) scale(1.08)`, offset: 0.48, opacity: 1 },
            { transform: `translate(${x}px, ${y + 6}px) scale(0.96, 1.04)`, offset: 0.85, opacity: 1 },
            { transform: to, opacity: 1 },
          ],
          { duration: 480, easing: "cubic-bezier(.22, 1, .36, 1)" },
        );
      }
    };
    placePresenter(true);
    const onResize = () => placePresenter(false);
    window.addEventListener("resize", onResize);
    return () => {
      jumpAnim?.cancel();
      window.removeEventListener("resize", onResize);
    };
  }, [competitionId, student?.id, showAll, exiting, viewportMetrics.vvHeight, paused, hidden]);

  useEffect(() => { if (paused || hidden) setTraveling(false); }, [paused, hidden]);

  // Clicking empty space (anywhere outside the chat and the hamster) closes the chat; focus stays where the user clicked.
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(".guide-panel, .guide-launcher, .explainer-roam")) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  // Guide wanders across the map while idle; freezes IN PLACE when chat opens; runs to Explainer when a province is clicked!
  const [wander, setWander] = useState({ x: 0, y: 0, dx: 0, dy: 0, ms: 0, face: -1, moving: false });
  const [step, setStep] = useState(0);
  const [dragging, setDragging] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const tourTicks = useRef(0);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const element = launcher.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED = 90;
    let timer = 0;

    const syncLivePosition = () => {
      const raw = getComputedStyle(element).transform;
      if (raw && raw !== "none") {
        const matrix = new DOMMatrixReadOnly(raw);
        position.current = { x: Math.round(matrix.e), y: Math.round(matrix.f) };
      }
    };

    const walkTo = (x: number, y: number, animate: boolean, forcedMs?: number) => {
      syncLivePosition();
      const dx = x - position.current.x;
      const dy = y - position.current.y;
      const nextFace = Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 ? -1 : faceSignForDelta(dx, -1);
      const ms = animate ? (forcedMs ?? Math.max(520, Math.round((Math.hypot(dx, dy) / SPEED) * 1000))) : 0;
      position.current = { x, y };
      setWander({ x, y, dx, dy, ms, face: nextFace, moving: ms > 0 });
      return ms;
    };

    // When chat is open or user is dragging Guide, keep it under direct control.
    if (open || dragging) {
      return;
    }

    // When a province is clicked, Guide runs straight toward Explainer's position to fight!
    if (runningToFight && !reduced && !paused && !hidden) {
      const targetPos = explainerPosRef.current;
      const targetX = Math.round(targetPos.x - element.offsetLeft - 24);
      const targetY = Math.round(targetPos.y - element.offsetTop + 12);
      const ms = walkTo(targetX, targetY, true, 380);
      if (ms) timer = window.setTimeout(() => setWander((v) => ({ ...v, moving: false, dx: 0, dy: 0 })), ms);
      return () => window.clearTimeout(timer);
    }

    const still = Boolean(group) || paused || hidden || reduced;
    if (still) {
      if (!group && !fighting && !returningRef.current && (position.current.x !== 0 || position.current.y !== 0)) {
        const animate = !reduced && !hidden && !paused;
        const ms = walkTo(0, 0, animate);
        if (ms) timer = window.setTimeout(() => setWander((value) => ({ ...value, moving: false, dx: 0, dy: 0, face: -1 })), ms);
      }
      return () => window.clearTimeout(timer);
    }

    const readRects = (selector: string): Rect[] =>
      [...document.querySelectorAll<HTMLElement>(selector)]
        .filter((node) => node.offsetWidth > 0 && node.offsetHeight > 0)
        .map((node) => {
          const r = node.getBoundingClientRect();
          return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
        });
    const go = () => {
      if (returningRef.current) {
        timer = window.setTimeout(go, 400);
        return;
      }
      const baseLeft = element.offsetLeft;
      const baseTop = element.offsetTop;
      const baseRect: Rect = {
        left: baseLeft,
        top: baseTop,
        right: baseLeft + element.offsetWidth,
        bottom: baseTop + element.offsetHeight,
      };
      const medals = readRects(".map-marker");
      const obstacles = [
        ...medals,
        ...readRects(".brand-mark, .credits-link, .guide-panel, .province-recipients, .student-preview"),
      ];
      const visitMedal = tourTicks.current % 2 === 0;
      tourTicks.current += 1;
      const target = pickWanderTarget({
        baseRect,
        viewport: { width: innerWidth, height: innerHeight },
        obstacles,
        medals,
        visitMedal,
        currentPos: position.current,
        rng: getMascotRng(),
      });
      const ms = walkTo(target.x, target.y, true);
      timer = window.setTimeout(() => {
        setWander((value) => ({ ...value, moving: false, dx: 0, dy: 0 }));
        timer = window.setTimeout(go, 2800 + Math.round(getMascotRng()() * 3200));
      }, ms);
    };
    timer = window.setTimeout(go, 1800 + Math.round(getMascotRng()() * 1400));
    return () => window.clearTimeout(timer);
  }, [open, group, paused, hidden, runningToFight, fighting, dragging]);

  useEffect(() => {
    if (!wander.moving) { setStep(0); return; }
    const timer = window.setInterval(() => setStep((value) => 1 - value), 190);
    return () => window.clearInterval(timer);
  }, [wander.moving]);

  // Grey Explainer also roams the map while idle (non-interactive) and sprints in to fight when an award is clicked.
  const [explainerWander, setExplainerWander] = useState({ x: 0, y: 0, dx: 0, dy: 0, ms: 0, face: -1, moving: false });
  const [explainerRoamStep, setExplainerRoamStep] = useState(0);
  const explainerRoamPos = useRef({ x: 0, y: 0 });
  const explainerTourTicks = useRef(1);

  useEffect(() => {
    const element = explainerRoamer.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED = 95;
    let timer = 0;

    const walkTo = (x: number, y: number, animate: boolean, forcedMs?: number) => {
      const dx = x - explainerRoamPos.current.x;
      const dy = y - explainerRoamPos.current.y;
      const nextFace = Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 ? -1 : faceSignForDelta(dx, -1);
      const ms = animate ? (forcedMs ?? Math.max(540, Math.round((Math.hypot(dx, dy) / SPEED) * 1000))) : 0;
      explainerRoamPos.current = { x, y };
      setExplainerWander({ x, y, dx, dy, ms, face: nextFace, moving: ms > 0 });
      return ms;
    };

    if (runningToFight && !reduced && !paused && !hidden) {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      explainerRoamPos.current = { x: Math.round(matrix.e), y: Math.round(matrix.f) };
      const targetX = Math.round(explainerPos.x - element.offsetLeft + 24);
      const targetY = Math.round(explainerPos.y - element.offsetTop + 12);
      const ms = walkTo(targetX, targetY, true, 380);
      if (ms) timer = window.setTimeout(() => setExplainerWander((v) => ({ ...v, moving: false, dx: 0, dy: 0 })), ms);
      return () => window.clearTimeout(timer);
    }

    const still = Boolean(group) || paused || hidden || reduced;
    if (still) {
      if (!fighting && (explainerRoamPos.current.x !== 0 || explainerRoamPos.current.y !== 0)) {
        const animate = !reduced && !hidden && !paused;
        const ms = walkTo(0, 0, animate);
        if (ms) timer = window.setTimeout(() => setExplainerWander((value) => ({ ...value, moving: false, dx: 0, dy: 0, face: -1 })), ms);
      }
      return () => window.clearTimeout(timer);
    }

    const readRects = (selector: string): Rect[] =>
      [...document.querySelectorAll<HTMLElement>(selector)]
        .filter((node) => node.offsetWidth > 0 && node.offsetHeight > 0)
        .map((node) => {
          const r = node.getBoundingClientRect();
          return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
        });
    const go = () => {
      const baseLeft = element.offsetLeft;
      const baseTop = element.offsetTop;
      const baseRect: Rect = {
        left: baseLeft,
        top: baseTop,
        right: baseLeft + element.offsetWidth,
        bottom: baseTop + element.offsetHeight,
      };
      const medals = readRects(".map-marker");
      const obstacles = [
        ...medals,
        ...readRects(".brand-mark, .credits-link, .guide-panel, .guide-launcher, .province-recipients, .student-preview"),
      ];
      const visitMedal = explainerTourTicks.current % 2 === 0;
      explainerTourTicks.current += 1;
      const target = pickWanderTarget({
        baseRect,
        viewport: { width: innerWidth, height: innerHeight },
        obstacles,
        medals,
        visitMedal,
        rng: getMascotRng(),
      });
      const ms = walkTo(target.x, target.y, true);
      timer = window.setTimeout(() => {
        setExplainerWander((value) => ({ ...value, moving: false, dx: 0, dy: 0 }));
        timer = window.setTimeout(go, 3100 + Math.round(getMascotRng()() * 3400));
      }, ms);
    };
    timer = window.setTimeout(go, 1200 + Math.round(getMascotRng()() * 1400));
    return () => window.clearTimeout(timer);
  }, [group, paused, hidden, runningToFight, fighting, explainerPos.x, explainerPos.y]);

  useEffect(() => {
    if (!explainerWander.moving) { setExplainerRoamStep(0); return; }
    const timer = window.setInterval(() => setExplainerRoamStep((value) => 1 - value), 200);
    return () => window.clearInterval(timer);
  }, [explainerWander.moving]);

  const minimize = () => { setOpen(false); launcher.current?.focus({ preventScroll: true }); };
  const handleLauncherClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (open) {
      minimize();
      return;
    }
    // Freeze Guide at its exact live CSS transform so the ask bar anchors right above it where it stands.
    if (launcher.current) {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(launcher.current).transform);
      const liveX = Math.round(matrix.e);
      const liveY = Math.round(matrix.f);
      position.current = { x: liveX, y: liveY };
      setWander((v) => ({ ...v, x: liveX, y: liveY, dx: 0, dy: 0, ms: 0, moving: false }));
    }
    setOpen(true);
    setHelp(false);
  };

  useEffect(() => () => {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
  }, []);

  const handleLauncherPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || guideOnStage) return;
    setPointerDown(true);
    const element = launcher.current;
    let liveX = position.current.x;
    let liveY = position.current.y;
    if (element) {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      liveX = Math.round(matrix.e);
      liveY = Math.round(matrix.f);
      position.current = { x: liveX, y: liveY };
      setWander((v) => ({ ...v, x: liveX, y: liveY, dx: 0, dy: 0, ms: 0, moving: false }));
    }
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: liveX, originY: liveY, moved: false };
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = window.setTimeout(() => {
      if (dragRef.current) {
        setDragging(true);
      }
    }, 220);
  };

  const handleLauncherPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) {
      if (holdTimerRef.current) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      drag.moved = true;
      setDragging(true);
      setOpen(false);
      try {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      } catch {}
    }
    const element = launcher.current;
    let nextX = Math.round(drag.originX + dx);
    let nextY = Math.round(drag.originY + dy);
    if (element) {
      const minX = 8 - element.offsetLeft;
      const maxX = Math.max(minX, innerWidth - element.offsetWidth - 8 - element.offsetLeft);
      const minY = 8 - element.offsetTop;
      const maxY = Math.max(minY, innerHeight - element.offsetHeight - 8 - element.offsetTop);
      nextX = Math.round(Math.min(maxX, Math.max(minX, nextX)));
      nextY = Math.round(Math.min(maxY, Math.max(minY, nextY)));
    }
    const face = Math.abs(dx) >= 2 ? faceSignForDelta(dx, wander.face) : wander.face;
    position.current = { x: nextX, y: nextY };
    setWander({ x: nextX, y: nextY, dx, dy, ms: 0, face, moving: false });
  };

  const finishLauncherDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setPointerDown(false);
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const wasMoved = drag.moved;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {}
    }
    if (wasMoved) {
      suppressClickRef.current = true;
    } else {
      suppressClickRef.current = false;
    }
    setDragging(false);
  };

  const isHoverIdle = guideHovered && !pointerDown && !dragging && !wander.moving && !open && !racing && !runningToFight;
  const guidePose = dragging
    ? "roll"
    : selectGuidePose({
        moving: wander.moving || racing || runningToFight,
        step,
        dx: wander.dx,
        dy: wander.dy,
        open,
        scene: activeScene,
        arguing,
        jumping: false,
        hovered: isHoverIdle,
      });
  const primaryMascot = ENABLE_ORANGE_HAMSTER ? "guide" : "explainer";
  const activeExplainerMascot = ENABLE_ORANGE_HAMSTER
    ? (fightPhase === "done" ? provinceWinner : "explainer")
    : "explainer";
  const provinceLoser = provinceWinner === "guide" ? "explainer" : "guide";
  const showLoserCrying = ENABLE_ORANGE_HAMSTER && Boolean(group && fightPhase === "done" && !exiting);
  const guideOnStage = Boolean(group && !exiting && !runningToFight);

  useLayoutEffect(() => {
    const wasOnStage = wasOnStageRef.current;
    wasOnStageRef.current = guideOnStage;
    if (!wasOnStage || guideOnStage) return;
    const element = launcher.current;
    if (!element) return;
    const travelerEl = traveler.current;
    const travelerRect = travelerEl?.getBoundingClientRect();
    const fallbackW = innerWidth <= 700 ? 56 : 120;
    const fallbackH = innerWidth <= 700 ? 64 : 138;
    const stageCenterX = travelerRect && travelerRect.width
      ? travelerRect.left + travelerRect.width / 2
      : (lastStagePosRef.current?.x ?? element.offsetLeft) + fallbackW / 2;
    const stageBottomY = travelerRect && travelerRect.height
      ? travelerRect.bottom
      : (lastStagePosRef.current?.y ?? element.offsetTop) + fallbackH;

    const minX = 8 - element.offsetLeft;
    const maxX = Math.max(minX, innerWidth - element.offsetWidth - 8 - element.offsetLeft);
    const minY = 8 - element.offsetTop;
    const maxY = Math.max(minY, innerHeight - element.offsetHeight - 8 - element.offsetTop);
    const startX = Math.round(Math.min(maxX, Math.max(minX, stageCenterX - element.offsetWidth / 2 - element.offsetLeft)));
    const startY = Math.round(Math.min(maxY, Math.max(minY, stageBottomY - element.offsetHeight - element.offsetTop)));
    position.current = { x: startX, y: startY };

    // Synchronously commit the starting transform with 0ms duration and flush layout so CSS transition never skips the start frame.
    element.style.transitionDuration = "0ms";
    element.style.transform = `translate(${startX}px, ${startY}px)`;
    void element.offsetWidth;
    setWander({ x: startX, y: startY, dx: 0, dy: 0, ms: 0, face: -1, moving: false });

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused || hidden || (startX === 0 && startY === 0)) {
      returningRef.current = false;
      return;
    }
    returningRef.current = true;
    let raf = 0;
    let timer = 0;
    raf = window.requestAnimationFrame(() => {
      const dx = -startX;
      const dy = -startY;
      const ms = Math.max(520, Math.round((Math.hypot(dx, dy) / 110) * 1000));
      const nextFace = faceSignForDelta(dx, -1);
      position.current = { x: 0, y: 0 };
      setWander({ x: 0, y: 0, dx, dy, ms, face: nextFace, moving: true });
      timer = window.setTimeout(() => {
        returningRef.current = false;
        setWander((value) => ({ ...value, moving: false, dx: 0, dy: 0, face: -1 }));
      }, ms);
    });
    return () => {
      returningRef.current = false;
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [guideOnStage, paused, hidden]);
  const explainerRoamPose = (explainerWander.moving || runningToFight)
    ? (explainerRoamStep === 0 ? "walk1" : "walk2")
    : "pet";
  useEffect(() => {
    if (guideOnStage) setOpen(false);
  }, [guideOnStage]);
  const loserLeft = typeof window !== "undefined" && innerWidth <= 700
    ? (competitionId ? Math.max(8, explainerPos.x - 4) : Math.min(innerWidth - 64, explainerPos.x + 52))
    : (competitionId ? Math.max(8, explainerPos.x - 196) : Math.max(12, explainerPos.x + 112));
  const loserTop = typeof window !== "undefined" && innerWidth <= 700
    ? (competitionId ? Math.min(innerHeight - 76, explainerPos.y + 72) : Math.min(innerHeight - 76, explainerPos.y + 44))
    : Math.min(typeof window !== "undefined" ? innerHeight - 96 : 600, explainerPos.y + 44);
  const explainerPose = selectExplainerPose({
    traveling: traveling || racing,
    step: explainerStep,
    dx: explainerDelta.dx,
    dy: explainerDelta.dy,
    typing: !typed.done,
    scene: activeScene,
    arguing,
    jumping: false,
    hovered: explainerHovered,
  });
  const guideTalking = !wander.moving && (open || chat.loading || arguing);
  const explainerTalking = !traveling && Boolean(group && !competitionId && !exiting && (!typed.done || arguing));
  const compactKeyboard = open && (viewportMetrics.vvHeight <= 520 || viewportMetrics.keyboardInset > 80);
  const panelAnchor = anchoredPanel(launcher.current, wander, viewportMetrics.vvHeight, viewportMetrics.keyboardInset);

  return <aside className="character-guides" aria-label="ผู้ช่วยสำรวจ Hall of Fame"
    style={{ "--vv-height": `${viewportMetrics.vvHeight}px`, "--vv-keyboard": `${viewportMetrics.keyboardInset}px` } as CSSProperties}
    data-keyboard={compactKeyboard ? "true" : undefined}
    data-paused={paused || hidden}
    data-stage={competitionId ? "presentation" : studentId ? "student" : group ? "province" : "welcome"}
    data-scene={activeScene}
    data-fighting={fighting ? "true" : "false"}
    data-province-winner={group && !exiting ? provinceWinner : "none"}
    data-winner={competitionId && !exiting ? winner : "none"}
    data-race-count={raceCount}>
    <button ref={launcher} className="guide-launcher" aria-expanded={open} aria-controls="guide-panel" aria-label={open ? "ย่อ Guide" : "เปิด Guide"}
      data-moving={wander.moving || racing || runningToFight} data-talking={guideTalking} data-pose={guidePose} data-facing={facingLabel(wander.face)}
      data-dragging={dragging ? "true" : undefined}
      data-hovered={isHoverIdle ? "true" : undefined}
      data-hidden-in-fight={guideOnStage ? "true" : undefined}
      aria-hidden={guideOnStage || undefined}
      tabIndex={guideOnStage ? -1 : undefined}
      style={{ transform: `translate(${wander.x}px, ${wander.y}px)`, transitionDuration: `${wander.ms}ms` }}
      onPointerDown={handleLauncherPointerDown}
      onPointerMove={handleLauncherPointerMove}
      onPointerUp={finishLauncherDrag}
      onPointerCancel={finishLauncherDrag}
      onPointerEnter={(e) => { if (e.pointerType !== "touch") setGuideHovered(true); }}
      onPointerLeave={() => {
        setGuideHovered(false);
        if (!dragRef.current) setPointerDown(false);
      }}
      onDragStart={(event) => event.preventDefault()}
      onClick={handleLauncherClick}>
      {isHoverIdle && (
        <span className="guide-hover-bubble" aria-hidden="true">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </span>
      )}
      <img src={mascotSpritePath(primaryMascot, guidePose)} alt="" draggable={false}
        style={{ transform: `scaleX(${wander.face})` }} />
    </button>
    {ENABLE_ORANGE_HAMSTER && (
      <button ref={explainerRoamer} type="button" className="explainer-roam"
        aria-expanded={open} aria-controls="guide-panel" aria-label={open ? "ย่อ Guide" : "เปิด Guide"}
        data-moving={explainerWander.moving || runningToFight}
        data-pose={explainerRoamPose}
        data-facing={facingLabel(explainerWander.face)}
        data-hidden-in-fight={guideOnStage ? "true" : undefined}
        aria-hidden={guideOnStage || undefined}
        tabIndex={guideOnStage ? -1 : undefined}
        style={{ transform: `translate(${explainerWander.x}px, ${explainerWander.y}px)`, transitionDuration: `${explainerWander.ms}ms` }}
        onClick={handleLauncherClick}>
        <img src={mascotSpritePath("explainer", explainerRoamPose)} alt="" draggable={false}
          style={{ transform: `scaleX(${explainerWander.face})` }} />
      </button>
    )}
    {open && <section ref={panel} id="guide-panel" className="guide-panel" aria-label="Guide ช่วยสำรวจ"
      data-placement={panelAnchor.placement}
      style={panelAnchor.style}
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); minimize(); } }}>
      <h2 className="visually-hidden" tabIndex={-1}>Guide</h2>
      <GuideChat chat={chat} groups={groups} dataset={dataset} onTarget={(target) => { onTarget(target); setOpen(false); }} />
    </section>}
    {fighting && (
      <div className="mascot-fight" data-frame={fightFrame + 1}
        style={{ transform: `translate(${Math.max(12, explainerPos.x - 24)}px, ${Math.max(72, explainerPos.y - 16)}px)` }}
        aria-hidden="true">
        <img src={FIGHT_FRAMES[fightFrame]} alt="" />
      </div>
    )}
    {showLoserCrying && (
      <div className="mascot-loser" data-crying="true" data-mascot={provinceLoser}
        style={{ transform: `translate(${loserLeft}px, ${loserTop}px)` }}
        aria-hidden="true">
        <img src={mascotSpritePath(provinceLoser, "cry")} alt="" />
      </div>
    )}
    <div ref={traveler} className="explainer"
      data-visible={Boolean(group && !competitionId && !exiting)}
      data-aside={Boolean(group && competitionId && !exiting) ? "true" : undefined}
      data-hidden-in-fight={fighting || runningToFight ? "true" : undefined}
      data-traveling={traveling}
      data-talking={explainerTalking} data-pose={explainerPose} data-facing={facingLabel(face)}
      data-guiding-tap={guidingTap ? "true" : undefined}
      aria-hidden={!group || Boolean(competitionId) || exiting}
      onPointerEnter={(e) => { if (e.pointerType !== "touch") setExplainerHovered(true); }}
      onPointerLeave={() => setExplainerHovered(false)}>
      <img className="explainer__body" src={mascotSpritePath(activeExplainerMascot, explainerPose)}
        alt={activeExplainerMascot === "guide" ? "Guide แฮมสเตอร์สีส้ม" : "Explainer แฮมสเตอร์หมวกเหลือง"}
        style={{ transform: `scaleX(${face})` }} />
      <div className="explainer__caption" style={captionLayout.style} data-caption-placement={captionLayout.placement}><strong>{activeExplainerMascot === "guide" ? "Guide" : "Explainer"}</strong>
        {ENABLE_ORANGE_HAMSTER && activeScene === "rivalry" && (
          <span className="explainer__rivalry" data-rivalry="true" aria-hidden="true">
            {provinceWinner === "guide"
              ? "Guide ชนะศึกแย่งไมค์! ขอเล่าจังหวัดนี้เอง!"
              : "Explainer ชนะศึกแย่งไมค์! หลบไป ฉันจะเล่าเอง!"}
          </span>
        )}
        <p aria-hidden="true" data-typing={!typed.done}>{typed.text}</p>
        <p className="visually-hidden">{text}</p></div>
    </div>
    {competitionId && student && !exiting && (
      <div ref={presenter} className="student-presenter" data-visible="true" data-intervene="true" data-winner={winner}>
        <div className="student-presenter__speech" style={speechLayout}>
          <p>{student.projectTitle ? `กำลังนำเสนอ ${student.projectTitle}` : "กำลังนำเสนอผลงาน"}</p>
        </div>
        <span className="student-portrait student-presenter__portrait">
          <CardImage allowLocal key={student.portraitUrl} url={student.portraitUrl} initials={student.initials} />
        </span>
        <div className="student-presenter__name">
          <strong>{student.name}</strong>
        </div>
      </div>
    )}
  </aside>;
}
