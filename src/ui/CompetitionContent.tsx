import { useLayoutEffect, useRef, useState } from "react";
import type { PresentationSlide } from "../data/demoAwards";
import type { StudentCompetition } from "../data/studentCompetitions";
import { safeImageUrl } from "./links";
import { useTypewriter } from "./typewriter";

export function CompetitionList({ entries, onSelect }: {
  entries: StudentCompetition[];
  onSelect: (id: string, button: HTMLButtonElement) => void;
}) {
  return <div className="competition-list">
    <h3>การแข่งขันและผลงาน</h3>
    <p className="discovery-muted">เลือกการแข่งขันเพื่อดูผลงานและการนำเสนอ</p>
    <ul aria-label="การแข่งขันของนักเรียน">
      {entries.map((entry) => <li key={entry.award.id}>
        <button className="student-competition" data-competition-id={entry.award.id}
          onClick={(event) => onSelect(entry.award.id, event.currentTarget)}>
          <span><strong>{entry.award.title}</strong>
            {entry.featured && <span className="competition-featured">การแข่งขันแนะนำ</span>}
          </span><span aria-hidden="true">›</span>
        </button>
      </li>)}
    </ul>
    {!entries.length && <p role="status">ยังไม่มีการแข่งขันที่แสดงได้</p>}
  </div>;
}

function SlideImage({ slide }: { slide: PresentationSlide }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const url = safeImageUrl(slide.url);
  if (!url || state === "error") return <div className="presentation-unavailable" role="img" aria-label={slide.alt || "ภาพนำเสนอ"}>
    <span>ภาพนำเสนอไม่พร้อมใช้งาน</span>
  </div>;
  return <>
    {state === "loading" && <span className="presentation-loading" role="status">กำลังโหลดภาพนำเสนอ…</span>}
    <img src={url} alt={slide.alt || "ภาพนำเสนอ"} referrerPolicy="no-referrer"
      onLoad={() => setState("ready")} onError={() => setState("error")} />
  </>;
}

export function CompetitionPresentation({ entry, descriptionId, expanded, speaker, onTypeTick, onTruncate }: {
  entry: StudentCompetition;
  descriptionId: string;
  expanded: boolean;
  speaker?: string;
  onTypeTick?: () => void;
  onTruncate?: (truncated: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const measureRef = useRef<HTMLParagraphElement>(null);
  const truncateRef = useRef(onTruncate);
  truncateRef.current = onTruncate;
  useLayoutEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  // The student "tells" the project themselves: the description types out like a chat message, with a quiet tick every few letters.
  const ticks = useRef(0);
  const full = entry.project?.shortDescription ?? "";
  const typed = useTypewriter(full, { onTick: () => { if (++ticks.current % 3 === 1) onTypeTick?.(); } });
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) { truncateRef.current?.(false); return; }
    const check = () => truncateRef.current?.(el.scrollHeight > el.clientHeight + 1);
    check();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [full]);
  const slide = entry.slides[index];
  return <div className="competition-presentation" data-competition-id={entry.award.id}>
    <header className="student-preview__project-heading">
      <h3 ref={heading} tabIndex={-1}>{entry.award.title}</h3>
      {entry.project && <h4>{entry.project.title}</h4>}
    </header>
    {entry.project && <div className="presentation-speech" data-done={typed.done}>
      {speaker && <span className="presentation-speech__speaker" aria-hidden="true">{speaker}</span>}
      <p ref={measureRef} className="student-preview__description presentation-speech__measure" aria-hidden="true">{full}</p>
      <p id={descriptionId} className="student-preview__description"
        data-expanded={expanded}>
        <span aria-hidden="true" data-typing={!typed.done}>{typed.text}</span>
        <span className="visually-hidden">{full}</span></p></div>}
    {slide ? <div className="presentation-gallery" role="group" aria-label="ภาพนำเสนอ" onKeyDown={(event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "ArrowLeft" && index > 0) setIndex((value) => Math.max(0, value - 1));
      else if (event.key === "ArrowRight" && index < entry.slides.length - 1) setIndex((value) => Math.min(entry.slides.length - 1, value + 1));
    }}>
      <figure className="presentation-media" data-slide-index={index + 1}>
        <SlideImage key={`${index}:${slide.url}`} slide={slide} />
      </figure>
      <div className="presentation-controls">
        {entry.slides.length > 1 && <button aria-label="สไลด์ก่อนหน้า" aria-disabled={index === 0}
          onClick={() => { if (index > 0) setIndex((value) => Math.max(0, value - 1)); }}>‹</button>}
        <p aria-live="polite" aria-atomic="true">สไลด์ {index + 1} / {entry.slides.length}</p>
        {entry.slides.length > 1 && <button aria-label="สไลด์ถัดไป" aria-disabled={index === entry.slides.length - 1}
          onClick={() => { if (index < entry.slides.length - 1) setIndex((value) => Math.min(entry.slides.length - 1, value + 1)); }}>›</button>}
      </div>
    </div> : <p className="presentation-empty" role="status">ยังไม่มีสไลด์ภาพสำหรับการแข่งขันนี้</p>}
    {!entry.project && <div className="student-preview__empty"><p>ยังไม่ได้เชื่อมผลงานกับการแข่งขันนี้</p>
        <p className="discovery-muted">ดูผลงานอื่น ๆ ได้ที่โปรไฟล์ของนักเรียน</p></div>}
  </div>;
}
