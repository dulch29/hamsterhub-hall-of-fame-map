import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { AwardGroup } from "../data/demoAwards";
import type { AwardSelection } from "../scene/ThailandMap";
import { GUIDE_WELCOME, GUIDE_MAP_HELP, GUIDE_COMPETITIONS, GUIDE_PRESENTATION, provinceNarration } from "./guideContent";
import { useNarration } from "./useNarration";
import { GuideChat } from './GuideChat';
import { useTypewriter } from "./typewriter";
import { useGuideChat } from './useGuideChat';
import { guideNavigation } from '../guide/navigation';
import type { GuideDataset, GuideTarget } from '../guide/contract';
import "./guides.css";

/** On wide screens the chat bar sits above the hamster wherever it stopped; phones keep the full-width sheet from CSS. */
function anchoredPanel(launcher: HTMLElement | null, wander: { x: number; y: number }): React.CSSProperties | undefined {
  if (!launcher || innerWidth <= 700) return undefined;
  const width = Math.min(560, innerWidth - 44);
  const left = Math.min(Math.max(8, launcher.offsetLeft + wander.x - 10), innerWidth - width - 8);
  return { left, bottom: 156 - wander.y };
}

export function CharacterGuides({ groups, group, studentId, competitionId, showAll, anchor, exiting, dataset, onTarget }: {
  groups: AwardGroup[]; group?: AwardGroup; studentId: string | null; competitionId: string | null;
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
  const [hidden, setHidden] = useState(document.hidden);
  const [traveling, setTraveling] = useState(false);
  const [face, setFace] = useState(-1); // sprites face left; -1 keeps them, 1 mirrors them to face right
  const [explainerStep, setExplainerStep] = useState(0);
  const traveler = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const previousGroup = useRef(group?.id);
  const previousOpen = useRef(open);
  const text = exiting ? GUIDE_MAP_HELP : competitionId ? GUIDE_PRESENTATION
    : studentId ? GUIDE_COMPETITIONS : group ? provinceNarration(group) : help ? GUIDE_MAP_HELP : GUIDE_WELCOME;
  const selection = useMemo(() => ({ province: group?.id ?? null, student: studentId,
    level: competitionId ? 3 : studentId ? 2 : showAll ? 1 : 0,
    key: `${group?.id ?? "home"}:${studentId ?? ""}:${competitionId ?? ""}:${showAll}:${exiting}`,
  }), [group?.id, studentId, competitionId, showAll, exiting]);
  const narration = useNarration(text, selection, paused || hidden || exiting);
  const typed = useTypewriter(text, { instant: paused || hidden });
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
      if (innerWidth <= 700) { x = 12; y = studentId ? 90 : showAll ? 240 : 180; }
      else if (group && target && (studentId || showAll)) {
        const bounds = target.getBoundingClientRect();
        x = Math.max(40, bounds.x - 240); y = Math.min(innerHeight - 210, bounds.y + 180);
      } else if (group && anchor) { x = Math.max(40, anchor.x - 260); y = Math.min(innerHeight - 210, anchor.y + 80); }
      y = Math.max(innerWidth <= 700 ? 90 : 170, y);
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
  }, [group?.id, studentId, showAll, competitionId, anchor?.x, anchor?.y, paused, hidden, exiting]);
  useEffect(() => { if (paused || hidden) setTraveling(false); }, [paused, hidden]);
  // Clicking empty space (anywhere outside the chat and the hamster) closes the chat; focus stays where the user clicked.
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(".guide-panel, .guide-launcher")) return;
      setOpen(false); narration.stop();
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, narration]);
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
  const minimize = () => { setOpen(false); narration.stop(); launcher.current?.focus({ preventScroll: true }); };
  return <aside className="character-guides" aria-label="ผู้ช่วยสำรวจ Hall of Fame"
    data-paused={paused || hidden} data-stage={competitionId ? "presentation" : studentId ? "student" : group ? "province" : "welcome"}>
    <button ref={launcher} className="guide-launcher" aria-expanded={open} aria-controls="guide-panel" aria-label={open ? "ย่อ Guide" : "เปิด Guide"}
      data-moving={wander.moving}
      style={{ transform: `translate(${wander.x}px, ${wander.y}px)`, transitionDuration: `${wander.ms}ms` }}
      onClick={() => { if (open) minimize(); else { setOpen(true); setHelp(false); } }}>
      <img src={wander.moving ? `/demo/guide-walk${step + 1}.png` : "/demo/guide-pet.png"} alt=""
        style={{ transform: `scaleX(${wander.face})` }} />
    </button>
    {open && <section ref={panel} id="guide-panel" className="guide-panel" aria-label="Guide ช่วยสำรวจ"
      style={anchoredPanel(launcher.current, wander)}
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); minimize(); } }}>
      <h2 className="visually-hidden" tabIndex={-1}>Guide</h2>
      <GuideChat chat={chat} groups={groups} dataset={dataset} onTarget={(target) => { onTarget(target); setOpen(false); }} />
    </section>}
    <div className="narration-controls" data-status={narration.status}>
      <button aria-pressed={narration.enabled} onClick={narration.toggle}>
        {narration.enabled ? "ปิดเสียงบรรยาย" : "เปิดเสียงบรรยาย"}</button>
      {narration.status === "speaking" ? <button onClick={narration.stop}>ข้ามเสียง</button>
        : narration.enabled && <button onClick={narration.replay} disabled={paused || hidden}>ฟังอีกครั้ง</button>}
      {narration.status === "text" && <span role="status">อ่านคำแนะนำแทนเสียงได้</span>}
    </div>
    <div ref={traveler} className="explainer" data-visible={Boolean(group && !competitionId && !exiting)} data-traveling={traveling}
      aria-hidden={!group || Boolean(competitionId) || exiting}
      >
      <img className="explainer__body" src={traveling ? `/demo/explainer-walk${explainerStep + 1}.png` : "/demo/explainer-pet.png"}
        alt="Explainer แฮมสเตอร์แว่นตา ผ้าพันคอสีทอง" style={{ transform: `scaleX(${face})` }} />
      <div className="explainer__caption"><strong>Explainer</strong>
        <p aria-hidden="true" data-typing={!typed.done}>{typed.text}</p>
        <p className="visually-hidden">{text}</p></div>
    </div>
    {narration.status === "speaking" && !open && <button className="narration-skip" onClick={narration.stop}>ข้ามเสียง</button>}
    {narration.status === "text" && !open && <div className="narration-fallback" role="status">
      <p>{group ? "ไม่มีเสียงไทย · อ่านคำแนะนำบนหน้าจอได้" : text}</p>
      <button onClick={narration.toggle}>ปิดคำแนะนำเสียง</button>
    </div>}
    {competitionId && <p className="presentation-guide-text">{GUIDE_PRESENTATION}</p>}
  </aside>;
}
