import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { AwardGroup, RecipientAward } from "../data/demoAwards";
import { provinceRecipients } from "../data/provinceRecipients";
import type { AwardSelection } from "../scene/ThailandMap";
import { provinceNames } from "../geo/provinces";
import { CardImage, initialsFor } from "./PinCard";
import { StudentPreview } from "./StudentPreview";
import { ProvinceRecipients } from "./ProvinceRecipients";
import { studentCompetitions } from "../data/studentCompetitions";
import { bubbleLayout, isLandscapePhone, profileLayout, presentationLayout, spreadBubbles, thoughtTrail, type BubblePoint, type BubbleRect } from "./bubbleLayout";
import { useDiscoveryMotion } from "./useDiscoveryMotion";
import { useAllBubbleFeedback } from "./useAllBubbleFeedback";

type Props = {
  group: AwardGroup;
  studentId: string | null;
  competitionId?: string | null;
  onCompetition?: (id: string | null) => void;
  showAll: boolean;
  anchor: AwardSelection | null;
  previewSource: HTMLElement | null;
  previewClosing: boolean;
  previewAnimate: boolean;
  portraitUrl?: string;
  fictional?: boolean;
  closing: boolean;
  onClosed: () => void;
  onPreviewClosed: () => void;
  onStudent: (id: string, button: HTMLButtonElement, animate: boolean) => void;
  onShowAll: () => void;
  onBubbleFeedback?: (forming: boolean) => void;
  onTypeTick?: () => void;
  onBack: (animate?: boolean) => void;
  onClose: (animate: boolean) => void;
};

export function AwardDiscovery(props: Props) {
  const { group, studentId, showAll, anchor } = props;
  const rows = useMemo(() => provinceRecipients(group), [group]);
  const recipients = useMemo(() => rows.map((row) => row.kid), [rows]);
  const selected = rows.find((row) => row.kid.id === studentId);
  const student = selected?.kid;
  const competitions = useMemo(() => student ? studentCompetitions(group, student.id) : [], [group, student]);
  const award: RecipientAward = competitions.find((entry) => entry.award.id === props.competitionId)?.award
    ?? selected?.featuredCompetition ?? { id: "unset", title: "", style: "gold", recipients };
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const allButton = useRef<HTMLButtonElement>(null);
  const popAll = useAllBubbleFeedback(allButton, showAll, props.closing || Boolean(studentId), props.onBubbleFeedback);
  const previousShowAll = useRef(showAll);
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
    if (!showAll && !props.closing) heading.current?.focus({ preventScroll: true });
  }, [group.id]);
  useLayoutEffect(() => {
    if (previousShowAll.current && !showAll && !props.closing) allButton.current?.focus({ preventScroll: true });
    previousShowAll.current = showAll;
  }, [showAll, props.closing]);
  const origin = anchor ?? { x: viewport.width / 2, y: viewport.height / 2 };
  const slots = useMemo(() => bubbleLayout(viewport, origin, 5, recipients.length), [viewport, origin.x, origin.y, recipients.length]);
  const positions = useMemo(() => slots.slice(0, Math.min(4, recipients.length)), [slots, recipients.length]);
  const allPoint = slots[4]!;
  const bounds = useMemo(() => {
    const next = (props.competitionId ? presentationLayout : profileLayout)(viewport, previewOrigin ?? {
      x: viewport.width / 2 - 42, y: viewport.height / 3 - 42, width: 84, height: 84,
    }, Boolean(award.logoUrl), !showAll && recipients.length > 1);
    if (viewport.width <= 700 && !isLandscapePhone(viewport)) {
      // Reserve the phone's upper controls and full identity above the card.
      next.portraitSize = Math.min(140, next.portraitSize);
      next.portraitY = -next.portraitSize * .25;
      // On short phones keep at least ~236px of card; unchanged (330) from 630px tall up.
      next.y = Math.max(next.y, Math.min(330, viewport.height - 300));
      next.height = viewport.height - next.y - 64;
    }
    return next;
  }, [viewport, previewOrigin, award.logoUrl, recipients.length, showAll, props.competitionId]);
  const spread = useMemo(() => student && !showAll ? spreadBubbles(viewport, positions,
    recipients.findIndex((kid) => kid.id === student.id), bounds) : positions,
  [viewport, positions, student, recipients, bounds, showAll]);
  const targets = props.closing && lastPositions.current.length === positions.length ? lastPositions.current : spread;
  useLayoutEffect(() => { if (!props.closing) lastPositions.current = spread; }, [spread, props.closing]);
  const first = positions[0]!;
  const select = (id: string, button: HTMLButtonElement, animate: boolean) => {
    const source = button.querySelector(".recipient-orb, .recipient-portrait") ?? button;
    const { x, y, width, height } = source.getBoundingClientRect();
    const rect = { x, y, width, height };
    if (!student) setPreviewOrigin(rect);
    setSourceBounds(rect);
    props.onStudent(id, button, animate);
  };
  return (
    <div ref={root} className={`award-discovery ${student ? "has-student" : ""} ${showAll ? "shows-all" : ""} ${props.closing ? "is-closing" : ""}`}
      data-anchor-x={origin.x} data-anchor-y={origin.y} data-state={props.closing ? "recalling" : "open"}
      data-push-motion={props.previewAnimate} inert={props.closing} lang="th">
      <section className="award-recipients" aria-label="ผู้ได้รับรางวัล" hidden={showAll}>
        <h2 ref={heading} tabIndex={-1} className="visually-hidden">ผู้ได้รับรางวัล · {provinceNames[group.province]}</h2>
        <div className="thought-trail" aria-hidden="true">
          {first && thoughtTrail(origin, first).map((dot, index) => <span className="bubble-film" key={index} style={{
            left: dot.x, top: dot.y, width: dot.size, height: dot.size,
          }} />)}
        </div>
        <div className="recipient-bubbles" role="group" aria-label="เลือกนักเรียน">
          {recipients.slice(0, 4).map((kid, index) => {
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
              aria-label={`ดูการแข่งขันของ ${kid.displayName}`}
              data-recipient-id={kid.id} aria-pressed={studentId === kid.id}
              onClick={(event) => select(kid.id, event.currentTarget, event.detail > 0)}>
              <span className="bubble-arrival"><span className="bubble-float">
                <span className="recipient-orb"><CardImage allowLocal key={kid.avatarUrl} url={kid.avatarUrl} initials={initialsFor(kid.displayName)} /></span>
                <span className="recipient-bubble__name">{kid.nickname || kid.displayName}</span>
              </span></span>
            </button>;
          })}
          <button ref={allButton} className="recipient-bubble discovery-all" aria-expanded={showAll}
            aria-label={`ดูผู้ได้รับรางวัลทั้งหมด ${recipients.length} คน`}
            aria-controls="all-recipients" onClick={() => { popAll(); props.onShowAll(); }}
            style={{
              left: allPoint.x - allPoint.size / 2, top: allPoint.y - allPoint.size / 2,
              width: allPoint.size, height: allPoint.size,
              "--spawn-x": `${origin.x - allPoint.x}px`, "--spawn-y": `${origin.y - allPoint.y}px`,
              "--bubble-delay": "180ms", "--float-duration": "7.4s", "--float-delay": "-2.4s",
            } as CSSProperties}>
            <span className="bubble-arrival"><span className="bubble-float">
              <span className="recipient-orb"><span className="discovery-all__label">
                ดูทั้งหมด<span>{recipients.length} คน</span>
              </span></span>
            </span></span>
          </button>
        </div>
      </section>
      {showAll && <ProvinceRecipients group={group} studentId={studentId}
        hidden={Boolean(student && !props.previewClosing)} onStudent={select}
        onBack={props.onShowAll} onClose={props.onShowAll} />}
      {student && <button className="province-journey__close" onClick={(event) => props.onClose(event.detail > 0)}
        aria-label="ปิดกลับแผนที่หรือรายชื่อ ×">×</button>}
      {student && <StudentPreview key={student.id} kid={student} award={award} onBack={props.onBack}
        competitions={competitions} competitionId={props.competitionId} onCompetition={(id) => props.onCompetition?.(id)}
        onTypeTick={props.onTypeTick}
        portraitUrl={props.portraitUrl} fictional={props.fictional}
        layout={bounds} sourceBounds={sourceBounds ?? undefined}
        source={props.previewSource} closing={props.previewClosing} animate={props.previewAnimate} onClosed={props.onPreviewClosed} />}
    </div>
  );
}
