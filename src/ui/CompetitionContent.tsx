import { useLayoutEffect, useRef, useState } from "react";
import type { PresentationSlide } from "../data/demoAwards";
import type { StudentCompetition } from "../data/studentCompetitions";
import { safeImageUrl } from "./links";
import { useTypewriter } from "./typewriter";

export function resolveEntryThumbnail(entry: StudentCompetition): string | null {
  const fromProject = safeImageUrl(entry.project?.thumbnailUrl);
  if (fromProject) return fromProject;
  const fromPoster = safeImageUrl(entry.slides[0]?.poster);
  if (fromPoster) return fromPoster;
  const imageSlide = entry.slides.find((slide) => slide.type !== "video" && !isVideoUrl(slide.url));
  return safeImageUrl(imageSlide?.url) ?? null;
}

export function CompetitionList({ entries, onSelect }: {
  entries: StudentCompetition[];
  onSelect: (id: string, button: HTMLButtonElement) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<ReadonlySet<string>>(() => new Set());
  const [loadedIds, setLoadedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [failedIds, setFailedIds] = useState<ReadonlySet<string>>(() => new Set());

  const activate = (id: string) => {
    setHoveredId(id);
    setSeenIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  };
  const deactivate = (id: string) => {
    setHoveredId((prev) => (prev === id ? null : prev));
  };

  return <div className="competition-list">
    <h3>การแข่งขันและผลงาน</h3>
    <p className="discovery-muted">เลือกการแข่งขันเพื่อดูผลงานและการนำเสนอ</p>
    <ul aria-label="การแข่งขันของนักเรียน">
      {entries.map((entry) => {
        const id = entry.award.id;
        const thumbUrl = resolveEntryThumbnail(entry);
        const showBg = Boolean(thumbUrl && seenIds.has(id) && !failedIds.has(id));
        const isVisible = hoveredId === id && loadedIds.has(id);
        return <li key={id}>
          <button className="student-competition" data-competition-id={id}
            onMouseEnter={() => activate(id)}
            onMouseLeave={() => deactivate(id)}
            onFocus={() => activate(id)}
            onBlur={() => deactivate(id)}
            onClick={(event) => onSelect(id, event.currentTarget)}>
            {showBg && thumbUrl && <span className="student-competition__bg" data-visible={isVisible ? "true" : "false"} aria-hidden="true">
              <img
                src={thumbUrl}
                alt=""
                decoding="async"
                fetchPriority="low"
                referrerPolicy="no-referrer"
                onLoad={() => setLoadedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))}
                onError={() => setFailedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))}
              />
            </span>}
            <span><strong>{entry.award.title}{entry.featured && <span className="competition-featured" title="การแข่งขันแนะนำ" aria-label="การแข่งขันแนะนำ">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.45l-5.87 3.09 1.12-6.53-4.74-4.62 6.56-.95L12 2.5z" />
              </svg>
            </span>}</strong>
              {entry.project && <span className="student-competition__project">{entry.project.title}</span>}
            </span><span className="student-competition__arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </button>
        </li>;
      })}
    </ul>
    {!entries.length && <p role="status">ยังไม่มีการแข่งขันที่แสดงได้</p>}
  </div>;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function SlideMedia({ slide, fallbackPoster }: { slide: PresentationSlide; fallbackPoster?: string | null }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const url = safeImageUrl(slide.url);
  if (!url || state === "error") return <div className="presentation-unavailable" role="img" aria-label={slide.alt || "สื่อนำเสนอ"}>
    <span>สื่อนำเสนอไม่พร้อมใช้งาน</span>
  </div>;

  const isVideo = slide.type === "video" || isVideoUrl(url);

  if (isVideo) {
    const posterUrl = safeImageUrl(slide.poster ?? fallbackPoster) ?? undefined;
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
        <SlideMedia key={`${index}:${slide.url}`} slide={slide} fallbackPoster={entry.project?.thumbnailUrl} />
      </figure>
      {entry.slides.length > 1 && (
        <div className="presentation-controls">
          <button aria-label="สไลด์ก่อนหน้า" aria-disabled={index === 0}
            onClick={() => { if (index > 0) setIndex((value) => Math.max(0, value - 1)); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <p aria-live="polite" aria-atomic="true">สไลด์ {index + 1} / {entry.slides.length}</p>
          <button aria-label="สไลด์ถัดไป" aria-disabled={index === entry.slides.length - 1}
            onClick={() => { if (index < entry.slides.length - 1) setIndex((value) => Math.min(entry.slides.length - 1, value + 1)); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
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
