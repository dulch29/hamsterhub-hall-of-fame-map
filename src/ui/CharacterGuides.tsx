import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { AwardGroup } from "../data/demoAwards";
import type { AwardSelection } from "../scene/ThailandMap";
import { GUIDE_WELCOME, GUIDE_MAP_HELP, GUIDE_COMPETITIONS, GUIDE_PRESENTATION, provinceNarration, guideChoices } from "./guideContent";
import { useNarration } from "./useNarration";
import { provinceRecipients } from "../data/provinceRecipients";
import { GuideChat } from './GuideChat';
import { useGuideChat } from './useGuideChat';
import { guideNavigation } from '../guide/navigation';
import type { GuideDataset, GuideTarget } from '../guide/contract';
import "./guides.css";

export function CharacterGuides({ groups, group, studentId, competitionId, showAll, anchor, exiting, onProvince, onPerson, dataset, onTarget }: {
  groups: AwardGroup[]; group?: AwardGroup; studentId: string | null; competitionId: string | null;
  showAll: boolean; anchor: AwardSelection | null; exiting: boolean;
  onProvince: (id: string, source: HTMLButtonElement) => void;
  onPerson: (id: string) => void;
  dataset: GuideDataset; onTarget: (target: GuideTarget) => void;
}) {
  const [open, setOpen] = useState(true);
  const contextTarget: GuideTarget | undefined = group ? { kind: studentId ? 'student' : 'province', id: studentId ?? group.id, label: '' } : undefined;
  const context = contextTarget && guideNavigation(contextTarget, groups, dataset) ? `${contextTarget.kind}:${contextTarget.id}` : undefined;
  const chat = useGuideChat(open, dataset, context);
  const [help, setHelp] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [traveling, setTraveling] = useState(false);
  const traveler = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const previousGroup = useRef(group?.id);
  const previousOpen = useRef(open);
  const choices = useMemo(() => guideChoices(groups), [groups]);
  const text = exiting ? GUIDE_MAP_HELP : competitionId ? GUIDE_PRESENTATION
    : studentId ? GUIDE_COMPETITIONS : group ? provinceNarration(group) : help ? GUIDE_MAP_HELP : GUIDE_WELCOME;
  const selection = useMemo(() => ({ province: group?.id ?? null, student: studentId,
    level: competitionId ? 3 : studentId ? 2 : showAll ? 1 : 0,
    key: `${group?.id ?? "home"}:${studentId ?? ""}:${competitionId ?? ""}:${showAll}:${exiting}`,
  }), [group?.id, studentId, competitionId, showAll, exiting]);
  const narration = useNarration(text, selection, paused || hidden || exiting);
  useLayoutEffect(() => {
    if (group?.id && previousGroup.current !== group.id) setOpen(false);
    previousGroup.current = group?.id;
  }, [group?.id]);
  useLayoutEffect(() => {
    if (open && !previousOpen.current) panel.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
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
  const minimize = () => { setOpen(false); narration.stop(); launcher.current?.focus({ preventScroll: true }); };
  return <aside className="character-guides" aria-label="ผู้ช่วยสำรวจ Hall of Fame"
    data-paused={paused || hidden} data-stage={competitionId ? "presentation" : studentId ? "student" : group ? "province" : "welcome"}>
    <button ref={launcher} className="guide-launcher" aria-expanded={open} aria-controls="guide-panel" aria-label={open ? "ย่อ Guide" : "เปิด Guide"}
      onClick={() => { if (open) minimize(); else { setOpen(true); setHelp(false); } }}>
      <img src="/demo/guide-hamster.svg" alt="" /><span>Guide</span>
    </button>
    {open && <section ref={panel} id="guide-panel" className="guide-panel" aria-label="Guide ช่วยสำรวจ"
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); minimize(); } }}>
      <header><img src="/demo/guide-hamster.svg" alt="Guide แฮมสเตอร์ผ้าพันคอสีมิ้นต์" />
        <div><h2 tabIndex={-1}>Guide</h2><p>มาสำรวจด้วยกัน</p></div>
        <button aria-label="ย่อหน้าต่าง Guide" onClick={minimize}>−</button></header>
      <GuideChat chat={chat} groups={groups} dataset={dataset} onTarget={(target) => { onTarget(target); setOpen(false); }} />
      <p className="guide-text">{help ? GUIDE_MAP_HELP : text}</p>
      <button className="guide-question" aria-pressed={help} onClick={() => { narration.stop(); setHelp((value) => !value); }}>ใช้งานแผนที่อย่างไร?</button>
      <p className="guide-choice-label">เริ่มสำรวจจังหวัด</p>
      <div className="guide-choices">{choices.map((choice) => <button key={choice.id} onClick={(event) => {
        onProvince(choice.id, event.currentTarget); setOpen(false);
      }}>{choice.label}<span>{choice.count} คน</span></button>)}</div>
      {group && <><p className="guide-choice-label">รู้จักเจ้าของผลงานในจังหวัดนี้</p>
        <div className="guide-choices">{provinceRecipients(group).map(({ kid }) => <button key={kid.id} onClick={() => {
          onPerson(kid.id); setOpen(false);
        }}>{kid.nickname || kid.displayName}<span>ดูการแข่งขัน</span></button>)}</div></>}
      <p className="guide-local-note">เลือกดูผลงานได้ด้วยตัวเองเสมอ แม้ Guide ไม่พร้อมตอบ</p>
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
      <img className="explainer__body" src="/demo/explainer-hamster.svg" alt="Explainer แฮมสเตอร์แว่นตา ผ้าพันคอสีทอง" />
      <div className="explainer__caption"><strong>Explainer</strong><p>{text}</p></div>
    </div>
    {narration.status === "speaking" && !open && <button className="narration-skip" onClick={narration.stop}>ข้ามเสียง</button>}
    {narration.status === "text" && !open && <div className="narration-fallback" role="status">
      <p>{group ? "ไม่มีเสียงไทย · อ่านคำแนะนำบนหน้าจอได้" : text}</p>
      <button onClick={narration.toggle}>ปิดคำแนะนำเสียง</button>
    </div>}
    {competitionId && <p className="presentation-guide-text">{GUIDE_PRESENTATION}</p>}
  </aside>;
}
