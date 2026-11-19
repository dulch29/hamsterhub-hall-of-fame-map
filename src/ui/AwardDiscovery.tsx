import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { AwardGroup, RecipientAward } from "../data/demoAwards";
import type { AwardSelection } from "../scene/ThailandMap";
import { provinceNames } from "../geo/provinces";
import { CardImage, initialsFor } from "./PinCard";
import { StudentPreview } from "./StudentPreview";
import { bubbleLayout, profileLayout, spreadBubbles, thoughtTrail, type BubblePoint, type BubbleRect } from "./bubbleLayout";
import { useDiscoveryMotion } from "./useDiscoveryMotion";

type Props = {
  group: AwardGroup;
  award: RecipientAward;
  studentId: string | null;
  showAll: boolean;
  anchor: AwardSelection | null;
  previewSource: HTMLElement | null;
  previewClosing: boolean;
  previewAnimate: boolean;
  presentationUrl?: string;
  portraitUrl?: string;
  localPreview?: boolean;
  fictional?: boolean;
  closing: boolean;
  onClosed: () => void;
  onPreviewClosed: () => void;
  onAward: (id: string) => void;
  onStudent: (id: string, button: HTMLButtonElement, animate: boolean) => void;
  onShowAll: () => void;
  onBack: (animate?: boolean) => void;
  onClose: (animate: boolean) => void;
};

export function AwardDiscovery(props: Props) {
  const { group, award, studentId, showAll, anchor } = props;
  const root = useRef<HTMLDivElement>(null);
  useDiscoveryMotion(root, props.closing, props.onClosed, studentId, props.previewClosing, props.previewSource, props.previewAnimate);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const [previewOrigin, setPreviewOrigin] = useState<BubbleRect | null>(null);
  const [sourceBounds, setSourceBounds] = useState<BubbleRect | null>(null);
  const lastPositions = useRef<BubblePoint[]>([]);
  useLayoutEffect(() => {
    const resize = () => setViewport({ width: innerWidth, height: innerHeight });
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    root.current?.querySelector<HTMLButtonElement>(".award-choice[aria-pressed=true]")?.focus({ preventScroll: true });
  }, [group.id]);
  const student = award.recipients.find((kid) => kid.id === studentId);
  const origin = anchor ?? { x: viewport.width / 2, y: viewport.height / 2 };
  const positions = useMemo(() => bubbleLayout(viewport, origin, award.recipients.length),
    [viewport, origin.x, origin.y, award.recipients.length]);
  const bounds = useMemo(() => profileLayout(viewport, previewOrigin ?? {
    x: viewport.width / 2 - 42, y: viewport.height / 3 - 42, width: 84, height: 84,
  }, Boolean(award.logoUrl), award.recipients.length > 1), [viewport, previewOrigin, award.logoUrl, award.recipients.length]);
  const spread = useMemo(() => student ? spreadBubbles(viewport, positions,
    award.recipients.findIndex((kid) => kid.id === student.id), bounds) : positions,
  [viewport, positions, student, award.recipients, bounds]);
  const targets = props.closing && lastPositions.current.length === positions.length ? lastPositions.current : spread;
  useLayoutEffect(() => { if (!props.closing) lastPositions.current = spread; }, [spread, props.closing]);
  const first = positions[0]!;
  const select = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    const source = event.currentTarget.querySelector(".recipient-orb, .recipient-portrait") ?? event.currentTarget;
    const { x, y, width, height } = source.getBoundingClientRect();
    const rect = { x, y, width, height };
    if (!student) setPreviewOrigin(rect);
    setSourceBounds(rect);
    props.onStudent(id, event.currentTarget, event.detail > 0);
  };
  return (
    <div ref={root} className={`award-discovery ${student ? "has-student" : ""} ${showAll ? "shows-all" : ""} ${props.closing ? "is-closing" : ""}`}
      data-anchor-x={origin.x} data-anchor-y={origin.y} data-state={props.closing ? "recalling" : "open"}
      data-push-motion={props.previewAnimate} inert={props.closing} lang="th">
      <section className="award-recipients" aria-label="ผู้ได้รับรางวัล">
        <div className="recipient-context">
          <header className="award-recipients__header">
            <div>
              <p className="discovery-eyebrow">{props.localPreview ? "เจ้าของผลงาน" : "ผู้ได้รับรางวัล"} · {provinceNames[group.province]}</p>
              <h2>พบกับเจ้าของไอเดีย</h2>
            </div>
            <button className="discovery-close" aria-label="ปิดรายชื่อผู้ได้รับรางวัล"
              onClick={(event) => props.onClose(event.detail > 0)}>×</button>
          </header>
          <div className="award-choices" aria-label="เลือกรางวัล">
            {group.awards.map((item) => <button key={item.id} className="award-choice"
              aria-pressed={award.id === item.id} onClick={() => props.onAward(item.id)}>
              <span className={`award-choice__dot award-choice__dot--${item.style}`} aria-hidden="true" />{item.title}
            </button>)}
          </div>
          <p className="recipient-count" aria-live="polite">{award.recipients.length} {props.localPreview ? "คนในการแข่งขันนี้" : "คนได้รับรางวัลนี้"} <span>· แตะใบหน้าเพื่อดูผลงาน</span></p>
        </div>
        <div className="thought-trail" aria-hidden="true">
          {thoughtTrail(origin, first).map((dot, index) => <span key={index} style={{
            left: dot.x, top: dot.y, width: dot.size, height: dot.size,
          }} />)}
        </div>
        <div className="recipient-bubbles" role="group" aria-label="เลือกนักเรียน" key={award.id}>
          {award.recipients.slice(0, 5).map((kid, index) => {
            const point = positions[index]!;
            const target = targets[index] ?? point;
            const scale = target.size / point.size;
            const style = {
              left: point.x - point.size / 2, top: point.y - point.size / 2, width: point.size, height: point.size,
              transform: `translate(${target.x - point.x}px, ${target.y - point.y}px) scale(${scale})`,
              "--spread-scale": scale,
              "--spawn-x": `${origin.x - point.x}px`, "--spawn-y": `${origin.y - point.y}px`,
              "--bubble-delay": `${index * 45}ms`, "--float-duration": `${5.8 + index * .7}s`, "--float-delay": `${-index * .8}s`,
            } as CSSProperties;
            return <button key={kid.id} className="recipient-bubble" style={style}
              aria-label={`ดูโปรไฟล์เบื้องต้นของ ${kid.displayName}`}
              data-recipient-id={kid.id} aria-pressed={studentId === kid.id} onClick={(event) => select(event, kid.id)}>
              <span className="bubble-arrival"><span className="bubble-float">
                <span className="recipient-orb"><CardImage allowLocal key={kid.avatarUrl} url={kid.avatarUrl} initials={initialsFor(kid.displayName)} /></span>
                <span className="recipient-bubble__name">{kid.nickname || kid.displayName}</span>
              </span></span>
            </button>;
          })}
        </div>
        {award.recipients.length > 5 && <button className="discovery-all" aria-expanded={showAll}
          aria-controls="all-recipients" onClick={props.onShowAll}>
          {showAll ? "ซ่อนรายชื่อทั้งหมด" : `ดูทั้งหมด ${award.recipients.length} คน`} <span aria-hidden="true">↗</span>
        </button>}
        {showAll && <ul id="all-recipients" className="recipient-list" aria-label="รายชื่อทั้งหมด">
          {award.recipients.map((kid) => <li key={kid.id}><button aria-pressed={studentId === kid.id}
            aria-label={`ดูโปรไฟล์เบื้องต้นของ ${kid.displayName}`}
            data-recipient-id={kid.id} onClick={(event) => select(event, kid.id)}>
            <span className="recipient-portrait"><CardImage allowLocal key={kid.avatarUrl} url={kid.avatarUrl} initials={initialsFor(kid.displayName)} /></span>
            <span>{kid.displayName}</span><span aria-hidden="true">→</span>
          </button></li>)}
        </ul>}
      </section>
      {student && <StudentPreview key={student.id} kid={student} award={award} onBack={props.onBack} presentationUrl={props.presentationUrl}
        portraitUrl={props.portraitUrl} fictional={props.fictional}
        layout={bounds} sourceBounds={sourceBounds ?? undefined}
        source={props.previewSource} closing={props.previewClosing} animate={props.previewAnimate} onClosed={props.onPreviewClosed} />}
    </div>
  );
}
