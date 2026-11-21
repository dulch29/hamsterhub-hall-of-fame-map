import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { AwardGroup } from "../data/demoAwards";
import { provinceRecipients } from "../data/provinceRecipients";
import type { AwardSelection } from "../scene/ThailandMap";
import { GUIDE_WELCOME, GUIDE_MAP_HELP, GUIDE_COMPETITIONS, GUIDE_PRESENTATION, provinceNarration } from "./guideContent";
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
import { MASCOT_POSES, mascotSpritePath } from "./mascotSprites";
import { useTypewriter } from "./typewriter";
import { useGuideChat } from "./useGuideChat";
import { guideNavigation } from "../guide/navigation";
import type { GuideDataset, GuideTarget } from "../guide/contract";

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

/** On wide screens the chat bar sits above the hamster wherever it stopped; phones keep the full-width sheet from CSS unless keyboard shrinks viewport. */
function anchoredPanel(
  launcher: HTMLElement | null,
  wander: { x: number; y: number },
  vvHeight: number,
  keyboardInset: number,
): CSSProperties | undefined {
  if (typeof window === "undefined") return undefined;
  if (innerWidth <= 700) {
    if (keyboardInset > 80 || vvHeight <= 520) {
      const bottom = Math.max(10, keyboardInset + 10);
      return { bottom, "--panel-bottom": `${bottom}px` } as CSSProperties;
    }
    return undefined;
  }
  if (!launcher) return undefined;
  const width = Math.min(560, innerWidth - 44);
  const left = Math.min(Math.max(8, launcher.offsetLeft + wander.x - 10), innerWidth - width - 8);
  const maxBottom = Math.max(96, vvHeight - 260);
  const bottom = keyboardInset > 80
    ? keyboardInset + 10
    : vvHeight <= 520
      ? Math.max(12, Math.min(156 - wander.y, vvHeight - 230))
      : Math.max(96, Math.min(156 - wander.y, maxBottom));
  return { left, bottom, "--panel-bottom": `${bottom}px` } as CSSProperties;
}

export function CharacterGuides({ groups, group, studentId, competitionId, student, showAll, anchor, exiting, dataset, onTarget }: {
  groups: AwardGroup[]; group?: AwardGroup; studentId: string | null; competitionId: string | null;
  student?: StudentPresenterInfo | null;
  showAll: boolean; anchor: AwardSelection | null; exiting: boolean;
  dataset: GuideDataset; onTarget: (target: GuideTarget) => void;
}) {
  // Only the hamster is on screen at first; tapping it opens the chat bar above wherever it stands.
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
  const [explainerStep, setExplainerStep] = useState(0);
  const [rivalryJump, setRivalryJump] = useState(false);
  const [racing, setRacing] = useState(false);
  const [winner, setWinner] = useState<MascotWinner>("none");
  const [raceCount, setRaceCount] = useState(0);
  const [viewportMetrics, setViewportMetrics] = useState({ vvHeight: 900, keyboardInset: 0 });
  const traveler = useRef<HTMLDivElement>(null);
  const presenter = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const previousGroup = useRef(group?.id);
  const previousCompetition = useRef<string | null>(null);
  const previousOpen = useRef(open);
  const text = exiting ? GUIDE_MAP_HELP : competitionId ? GUIDE_PRESENTATION
    : studentId ? GUIDE_COMPETITIONS : group ? provinceNarration(group) : help ? GUIDE_MAP_HELP : GUIDE_WELCOME;
  const typed = useTypewriter(text, { instant: paused || hidden });
  const hasPeers = Boolean(group && !showAll && provinceRecipients(group).length > 1);

  useEffect(() => {
    if (typeof Image === "undefined") return;
    for (const mascot of ["guide", "explainer"] as const) {
      for (const pose of MASCOT_POSES) {
        const img = new Image();
        img.src = mascotSpritePath(mascot, pose);
      }
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

  // Phase 3 rivalry jump when Explainer steals the scene on a province/student selection.
  useEffect(() => {
    if (!group || competitionId || exiting || paused || hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRivalryJump(false);
      return;
    }
    setRivalryJump(true);
    const timer = window.setTimeout(() => setRivalryJump(false), 320);
    return () => window.clearTimeout(timer);
  }, [group?.id, studentId, competitionId, exiting, paused, hidden]);

  // Phase 3 race to province on each project click: both run and one randomly wins before the student explains alone.
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
  const arguing = activeScene === "rivalry" && !traveling;

  useEffect(() => {
    if (!traveling && !arguing) { setExplainerStep(0); return; }
    const timer = window.setInterval(() => setExplainerStep((value) => 1 - value), traveling ? 170 : 420);
    return () => window.clearInterval(timer);
  }, [traveling, arguing]);

  useLayoutEffect(() => {
    if (group?.id && previousGroup.current !== group.id) setOpen(false);
    previousGroup.current = group?.id;
  }, [group?.id]);

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
      const from = getComputedStyle(element).transform;
      animation?.cancel();
      let x = 24, y = innerHeight - 230;
      const target = document.querySelector<HTMLElement>(studentId ? ".student-preview" : showAll ? ".province-recipients" : ".map-canvas");
      const landscapePhone = innerHeight <= 500 && innerWidth > innerHeight;
      if (landscapePhone) {
        if ((studentId || showAll) && target) {
          const bounds = target.getBoundingClientRect();
          x = bounds.x >= 96 ? Math.max(12, bounds.x - 84) : 12;
          y = Math.max(66, Math.min(innerHeight - 130, bounds.y + 12));
        } else {
          x = 12;
          y = Math.max(66, Math.min(innerHeight - 130, innerHeight - 150));
        }
      } else if (innerWidth <= 700) {
        x = 12;
        y = studentId ? (hasPeers && innerWidth < 600 ? 156 : 90) : showAll ? 240 : 180;
      } else if (group && target && (studentId || showAll)) {
        const bounds = target.getBoundingClientRect();
        x = Math.max(40, bounds.x - 240); y = Math.min(innerHeight - 210, bounds.y + 180);
      } else if (group && anchor) { x = Math.max(40, anchor.x - 260); y = Math.min(innerHeight - 210, anchor.y + 80); }
      y = Math.max(landscapePhone ? 66 : innerWidth <= 700 ? 90 : 170, y);
      const to = `translate(${x}px, ${y}px)`;
      element.style.transform = to;
      const current = new DOMMatrixReadOnly(from === "none" ? undefined : from);
      const dx = x - current.e;
      const dy = y - current.f;
      setExplainerDelta({ dx, dy });
      if ((Math.abs(dx) < 1 && Math.abs(dy) < 1) || !group || competitionId || exiting || paused || hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // When settled on the left side of the screen, face right (-1) toward the province/card.
        setFace(x <= innerWidth * 0.55 ? -1 : 1);
        setTraveling(false); return;
      }
      setFace(faceSignForDelta(dx, -1));
      animation = element.animate([{ transform: from === "none" ? "translate(24px, 460px)" : from }, { transform: to }],
        { duration: 700, easing: "cubic-bezier(.23, 1, .32, 1)" });
      setTraveling(true);
      void animation.finished.then(() => {
        setFace(x <= innerWidth * 0.55 ? -1 : 1);
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

  useLayoutEffect(() => {
    const placePresenter = () => {
      const element = presenter.current;
      if (!element || !competitionId || !student || exiting) return;
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
      element.style.transform = `translate(${x}px, ${y}px)`;
    };
    placePresenter();
    window.addEventListener("resize", placePresenter);
    return () => window.removeEventListener("resize", placePresenter);
  }, [competitionId, student?.id, showAll, exiting, viewportMetrics.vvHeight]);

  useEffect(() => { if (paused || hidden) setTraveling(false); }, [paused, hidden]);

  // Clicking empty space (anywhere outside the chat and the hamster) closes the chat; focus stays where the user clicked.
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(".guide-panel, .guide-launcher")) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  // The Guide hamster wanders across the map (visiting medals while avoiding collisions) and walks home when chat opens or a province opens.
  const [wander, setWander] = useState({ x: 0, y: 0, dx: 0, dy: 0, ms: 0, face: -1, moving: false });
  const [step, setStep] = useState(0);
  const position = useRef({ x: 0, y: 0 });
  const tourTicks = useRef(0);
  useEffect(() => {
    const element = launcher.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = open || Boolean(group) || paused || hidden || reduced;
    const SPEED = 95; // px per second
    let timer = 0;
    const walkTo = (x: number, y: number, animate: boolean) => {
      const dx = x - position.current.x;
      const dy = y - position.current.y;
      const nextFace = Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 ? -1 : faceSignForDelta(dx, -1);
      const ms = animate ? Math.max(650, Math.round((Math.hypot(dx, dy) / SPEED) * 1000)) : 0;
      position.current = { x, y };
      setWander({ x, y, dx, dy, ms, face: nextFace, moving: ms > 0 });
      return ms;
    };
    if (still) {
      if (position.current.x !== 0 || position.current.y !== 0) {
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
      const rng = getMascotRng();
      const target = pickWanderTarget({
        baseRect,
        viewport: { width: innerWidth, height: innerHeight },
        obstacles,
        medals,
        visitMedal,
        rng,
      });
      const ms = walkTo(target.x, target.y, true);
      timer = window.setTimeout(() => {
        setWander((value) => ({ ...value, moving: false, dx: 0, dy: 0 }));
        timer = window.setTimeout(go, 2800 + Math.round(getMascotRng()() * 3200));
      }, ms);
    };
    timer = window.setTimeout(go, 1800 + Math.round(getMascotRng()() * 1400));
    return () => window.clearTimeout(timer);
  }, [open, group, paused, hidden]);

  useEffect(() => {
    if (!wander.moving) { setStep(0); return; }
    const timer = window.setInterval(() => setStep((value) => 1 - value), 190);
    return () => window.clearInterval(timer);
  }, [wander.moving]);

  const minimize = () => { setOpen(false); launcher.current?.focus({ preventScroll: true }); };
  const guidePose = selectGuidePose({
    moving: wander.moving || racing,
    step,
    dx: wander.dx,
    dy: wander.dy,
    open,
    scene: activeScene,
    arguing,
    jumping: rivalryJump,
  });
  const explainerPose = selectExplainerPose({
    traveling: traveling || racing,
    step: explainerStep,
    dx: explainerDelta.dx,
    dy: explainerDelta.dy,
    typing: !typed.done,
    scene: activeScene,
    arguing,
    jumping: rivalryJump,
  });
  const guideTalking = !wander.moving && (open || chat.loading || arguing);
  const explainerTalking = !traveling && Boolean(group && !competitionId && !exiting && (!typed.done || arguing));
  const compactKeyboard = open && (viewportMetrics.vvHeight <= 520 || viewportMetrics.keyboardInset > 80);

  return <aside className="character-guides" aria-label="ผู้ช่วยสำรวจ Hall of Fame"
    style={{ "--vv-height": `${viewportMetrics.vvHeight}px`, "--vv-keyboard": `${viewportMetrics.keyboardInset}px` } as CSSProperties}
    data-keyboard={compactKeyboard ? "true" : undefined}
    data-paused={paused || hidden}
    data-stage={competitionId ? "presentation" : studentId ? "student" : group ? "province" : "welcome"}
    data-scene={activeScene}
    data-winner={competitionId && !exiting ? winner : "none"}
    data-race-count={raceCount}>
    <button ref={launcher} className="guide-launcher" aria-expanded={open} aria-controls="guide-panel" aria-label={open ? "ย่อ Guide" : "เปิด Guide"}
      data-moving={wander.moving || racing} data-talking={guideTalking} data-pose={guidePose} data-facing={facingLabel(wander.face)}
      style={{ transform: `translate(${wander.x}px, ${wander.y}px)`, transitionDuration: `${wander.ms}ms` }}
      onClick={() => { if (open) minimize(); else { setOpen(true); setHelp(false); } }}>
      <img src={mascotSpritePath("guide", guidePose)} alt=""
        style={{ transform: `scaleX(${wander.face})` }} />
    </button>
    {open && <section ref={panel} id="guide-panel" className="guide-panel" aria-label="Guide ช่วยสำรวจ"
      style={anchoredPanel(launcher.current, wander, viewportMetrics.vvHeight, viewportMetrics.keyboardInset)}
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); minimize(); } }}>
      <h2 className="visually-hidden" tabIndex={-1}>Guide</h2>
      <GuideChat chat={chat} groups={groups} dataset={dataset} onTarget={(target) => { onTarget(target); setOpen(false); }} />
    </section>}
    <div ref={traveler} className="explainer" data-visible={Boolean(group && !competitionId && !exiting)} data-traveling={traveling}
      data-talking={explainerTalking} data-pose={explainerPose} data-facing={facingLabel(face)}
      aria-hidden={!group || Boolean(competitionId) || exiting}>
      <img className="explainer__body" src={mascotSpritePath("explainer", explainerPose)}
        alt="Explainer แฮมสเตอร์แว่นตา ผ้าพันคอสีทอง" style={{ transform: `scaleX(${face})` }} />
      <div className="explainer__caption"><strong>Explainer</strong>
        {activeScene === "rivalry" && (
          <span className="explainer__rivalry" data-rivalry="true" aria-hidden="true">
            Guide: นี่ทัวร์ของฉันนะ! · Explainer: หลบไป ฉันจะเล่าเอง!
          </span>
        )}
        <p aria-hidden="true" data-typing={!typed.done}>{typed.text}</p>
        <p className="visually-hidden">{text}</p></div>
    </div>
    {competitionId && student && !exiting && (
      <div ref={presenter} className="student-presenter" data-visible="true" data-intervene="true" data-winner={winner}>
        <span className="student-portrait student-presenter__portrait">
          <CardImage allowLocal key={student.portraitUrl} url={student.portraitUrl} initials={student.initials} />
        </span>
        <div className="explainer__caption student-presenter__caption">
          <strong>{student.name}</strong>
          <span className="student-presenter__rivalry" data-winner={winner}>
            {winner === "guide"
              ? "Guide วิ่งนำมาเปิดเวที — นักเรียนกระโดดคั่นเล่าเอง!"
              : "Explainer วิ่งชนะมาเปิดเวที — นักเรียนกระโดดคั่นเล่าเอง!"}
          </span>
          <p>{student.projectTitle ? `กำลังนำเสนอ ${student.projectTitle}` : "กำลังนำเสนอผลงาน"}</p>
        </div>
      </div>
    )}
  </aside>;
}
