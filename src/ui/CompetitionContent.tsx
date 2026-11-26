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
            {entry.project && <span className="student-competition__project">{entry.project.title}</span>}
            {entry.featured && <span className="competition-featured">การแข่งขันแนะนำ</span>}
          </span><span className="student-competition__arrow" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </button>
      </li>)}
    </ul>
    {!entries.length && <p role="status">ยังไม่มีการแข่งขันที่แสดงได้</p>}
  </div>;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function SlideMedia({ slide }: { slide: PresentationSlide }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const url = safeImageUrl(slide.url);
  if (!url || state === "error") return <div className="presentation-unavailable" role="img" aria-label={slide.alt || "สื่อนำเสนอ"}>
    <span>สื่อนำเสนอไม่พร้อมใช้งาน</span>
  </div>;

  const isVideo = slide.type === "video" || isVideoUrl(url);

  if (isVideo) {
    const posterUrl = slide.poster ? safeImageUrl(slide.poster) ?? undefined : undefined;
    return (
      <video
        key={url}
        src={url}
        poster={posterUrl}
        controls
        playsInline
        preload="metadata"
        className="presentation-video"
        aria-label={slide.alt || "วิดีโอนำเสนอผลงาน"}
        onLoadedData={() => setState("ready")}
        onError={() => setState("error")}
      />
    );
  }

  return <>
    {state === "loading" && <span className="presentation-loading" role="status">กำลังโหลดภาพนำเสนอ…</span>}
    <img src={url} alt={slide.alt || "ภาพนำเสนอ"} referrerPolicy="no-referrer"
      onLoad={() => setState("ready")} onError={() => setState("error")} />
  </>;
}

export function CompetitionPresentation({ entry, descriptionId, expanded, pdfUrl, onTypeTick, onTruncate }: {
  entry: StudentCompetition;
  descriptionId: string;
  expanded: boolean;
  pdfUrl?: string | null;
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
      {(entry.project || pdfUrl) && <div className="student-preview__project-row">
        {entry.project && <h4>{entry.project.title}</h4>}
        {pdfUrl && <a className="student-preview__document" href={pdfUrl} target="_blank" rel="noopener noreferrer"
          aria-label="ดูเอกสารนำเสนอ (PDF เปิดแท็บใหม่)"><span>Full PDF</span><span aria-hidden="true">↗</span></a>}
      </div>}
    </header>
    {slide ? <div className="presentation-gallery" role="group" aria-label="ภาพนำเสนอ" onKeyDown={(event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "ArrowLeft" && index > 0) setIndex((value) => Math.max(0, value - 1));
      else if (event.key === "ArrowRight" && index < entry.slides.length - 1) setIndex((value) => Math.min(entry.slides.length - 1, value + 1));
    }}>
      <figure className="presentation-media" data-slide-index={index + 1}>
        <SlideMedia key={`${index}:${slide.url}`} slide={slide} />
      </figure>
      <div className="presentation-controls">
        {entry.slides.length > 1 && <button aria-label="สไลด์ก่อนหน้า" aria-disabled={index === 0}
          onClick={() => { if (index > 0) setIndex((value) => Math.max(0, value - 1)); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>}
        <p aria-live="polite" aria-atomic="true">สไลด์ {index + 1} / {entry.slides.length}</p>
        {entry.slides.length > 1 && <button aria-label="สไลด์ถัดไป" aria-disabled={index === entry.slides.length - 1}
          onClick={() => { if (index < entry.slides.length - 1) setIndex((value) => Math.min(entry.slides.length - 1, value + 1)); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>}
      </div>
    </div> : <p className="presentation-empty" role="status">ยังไม่มีสไลด์ภาพสำหรับการแข่งขันนี้</p>}
    {entry.project && <div className="presentation-speech" data-done={typed.done}>
      <p ref={measureRef} className="presentation-speech__measure" aria-hidden="true">{full}</p>
      <p id={descriptionId} className="student-preview__description"
        data-expanded={expanded}>
        <span aria-hidden="true" data-typing={!typed.done}>{typed.text}</span>
        <span className="visually-hidden">{full}</span></p></div>}
    {!entry.project && <div className="student-preview__empty"><p>ยังไม่ได้เชื่อมผลงานกับการแข่งขันนี้</p>
        <p className="discovery-muted">ดูผลงานอื่น ๆ ได้ที่โปรไฟล์ของนักเรียน</p></div>}
  </div>;
}
