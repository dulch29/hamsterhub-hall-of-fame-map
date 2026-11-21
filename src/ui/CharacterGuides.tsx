import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { AwardGroup } from "../data/demoAwards";
import { provinceRecipients } from "../data/provinceRecipients";
import type { AwardSelection } from "../scene/ThailandMap";
import { GUIDE_WELCOME, GUIDE_MAP_HELP, GUIDE_COMPETITIONS, GUIDE_PRESENTATION, provinceNarration } from "./guideContent";
import { GuideChat } from './GuideChat';
import { CardImage } from "./PinCard";
import { MASCOT_POSES, mascotSpritePath, type MascotPose } from "./mascotSprites";
import { useTypewriter } from "./typewriter";
import { useGuideChat } from './useGuideChat';
import { guideNavigation } from '../guide/navigation';
import type { GuideDataset, GuideTarget } from '../guide/contract';

export type StudentPresenterInfo = {
  id: string;
  name: string;
  portraitUrl: string | null;
  initials: string;
  projectTitle?: string;
};

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
  const bottom = keyboardInset > 80
    ? keyboardInset + 10
    : vvHeight <= 520
      ? Math.max(12, Math.min(156 - wander.y, vvHeight - 230))
      : Math.min(156 - wander.y, Math.max(96, vvHeight - 260));
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
  const contextTarget: GuideTarget | undefined = group ? { kind: studentId ? 'student' : 'province', id: studentId ?? group.id, label: '' } : undefined;
  const context = contextTarget && guideNavigation(contextTarget, groups, dataset) ? `${contextTarget.kind}:${contextTarget.id}` : undefined;
  const chat = useGuideChat(open, dataset, context);
  const [help, setHelp] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(typeof document !== "undefined" ? document.hidden : false);
  const [traveling, setTraveling] = useState(false);
  const [face, setFace] = useState(-1); // sprites face left; -1 keeps them, 1 mirrors them to face right
  const [explainerStep, setExplainerStep] = useState(0);
  const [viewportMetrics, setViewportMetrics] = useState({ vvHeight: 900, keyboardInset: 0 });
  const traveler = useRef<HTMLDivElement>(null);
  const presenter = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const previousGroup = useRef(group?.id);
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
  useEffect(() => {
    if (!traveling) { setExplainerStep(0); return; }
    const timer = window.setInterval(() => setExplainerStep((value) => 1 - value), 170);
    return () => window.clearInterval(timer);
  }, [traveling]);
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
      if ((Math.abs(current.e - x) < 1 && Math.abs(current.f - y) < 1) || !group || competitionId || exiting || paused || hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTraveling(false); return;
      }
      setFace(x > current.e ? 1 : -1);
      animation = element.animate([{ transform: from === "none" ? "translate(24px, 460px)" : from }, { transform: to }],
        { duration: 700, easing: "cubic-bezier(.23, 1, .32, 1)" });
      setTraveling(true);
      void animation.finished.then(() => setTraveling(false), () => {});
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
  // The Guide hamster wanders along the bottom of the page while idle and walks home when the chat opens.
  const [wander, setWander] = useState({ x: 0, y: 0, ms: 0, face: -1, moving: false });
  const [step, setStep] = useState(0);
  const position = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const element = launcher.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = open || Boolean(group) || paused || hidden || reduced;
    const SPEED = 70; // px per second
    let timer = 0;
    const walkTo = (x: number, y: number, face: number, animate: boolean) => {
      const ms = animate ? Math.max(700, Math.hypot(x - position.current.x, y - position.current.y) / SPEED * 1000) : 0;
      position.current = { x, y };
      setWander({ x, y, ms, face, moving: ms > 0 });
      return ms;
    };
    if (still) {
      if (!open && (position.current.x !== 0 || position.current.y !== 0)) {
        const animate = !reduced && !hidden;
        const ms = walkTo(0, 0, position.current.x > 0 ? 1 : -1, animate);
        if (ms) timer = window.setTimeout(() => setWander((value) => ({ ...value, moving: false })), ms);
      }
      return () => window.clearTimeout(timer);
    }
    const go = () => {
      const width = element.offsetWidth;
      const minX = -(element.offsetLeft - 8), maxX = innerWidth - element.offsetLeft - width - 8;
      const x = Math.round(minX + Math.random() * Math.max(0, maxX - minX));
      const y = -Math.round(Math.random() * 56);
      const ms = walkTo(x, y, x >= position.current.x ? -1 : 1, true);
      timer = window.setTimeout(() => {
        setWander((value) => ({ ...value, moving: false }));
        timer = window.setTimeout(go, 3500 + Math.random() * 4500);
      }, ms);
    };
    timer = window.setTimeout(go, 6000 + Math.random() * 3000);
    return () => window.clearTimeout(timer);
  }, [open, group, paused, hidden]);
  useEffect(() => {
    if (!wander.moving) { setStep(0); return; }
    const timer = window.setInterval(() => setStep((value) => 1 - value), 190);
    return () => window.clearInterval(timer);
  }, [wander.moving]);
  const minimize = () => { setOpen(false); launcher.current?.focus({ preventScroll: true }); };
  const guidePose: MascotPose = wander.moving ? (`walk${step + 1}` as MascotPose) : open ? "talk" : "pet";
  const explainerPose: MascotPose = traveling ? (`walk${explainerStep + 1}` as MascotPose) : !typed.done ? "talk" : "pet";
  const compactKeyboard = open && (viewportMetrics.vvHeight <= 520 || viewportMetrics.keyboardInset > 80);
  const scene = competitionId ? "student-solo" : "tour";
  return <aside className="character-guides" aria-label="ผู้ช่วยสำรวจ Hall of Fame"
    style={{ "--vv-height": `${viewportMetrics.vvHeight}px`, "--vv-keyboard": `${viewportMetrics.keyboardInset}px` } as CSSProperties}
    data-keyboard={compactKeyboard ? "true" : undefined}
    data-paused={paused || hidden}
    data-stage={competitionId ? "presentation" : studentId ? "student" : group ? "province" : "welcome"}
    data-scene={scene}
    data-winner="none">
    <button ref={launcher} className="guide-launcher" aria-expanded={open} aria-controls="guide-panel" aria-label={open ? "ย่อ Guide" : "เปิด Guide"}
      data-moving={wander.moving} data-pose={guidePose} data-facing={wander.face === -1 ? "right" : "left"}
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
      data-pose={explainerPose} data-facing={face === -1 ? "right" : "left"}
      aria-hidden={!group || Boolean(competitionId) || exiting}>
      <img className="explainer__body" src={mascotSpritePath("explainer", explainerPose)}
        alt="Explainer แฮมสเตอร์แว่นตา ผ้าพันคอสีทอง" style={{ transform: `scaleX(${face})` }} />
      <div className="explainer__caption"><strong>Explainer</strong>
        <p aria-hidden="true" data-typing={!typed.done}>{typed.text}</p>
        <p className="visually-hidden">{text}</p></div>
    </div>
    {competitionId && student && !exiting && (
      <div ref={presenter} className="student-presenter" data-visible="true">
        <span className="student-portrait student-presenter__portrait">
          <CardImage allowLocal key={student.portraitUrl} url={student.portraitUrl} initials={student.initials} />
        </span>
        <div className="explainer__caption student-presenter__caption">
          <strong>{student.name}</strong>
          <p>{student.projectTitle ? `กำลังนำเสนอ ${student.projectTitle}` : "กำลังนำเสนอผลงาน"}</p>
        </div>
      </div>
    )}
  </aside>;
}
