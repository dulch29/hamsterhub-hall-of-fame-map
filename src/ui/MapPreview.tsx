import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { loadProvinces, type ProvinceFeature } from "../geo/provinces";
import { createDiscoveryDemo } from "../mock/discovery";
import { parseLocalPreview } from "../data/localPreview";
import { provinceRecipients } from "../data/provinceRecipients";
import { provinceNames } from "../geo/provinces";
import type { AwardSelection } from "../scene/ThailandMap";
import type { MapFailure } from "../scene/mapFailure";
import { MapBoundary } from "./MapBoundary";
import { AwardDiscovery } from "./AwardDiscovery";
import { useBubbleSound } from "./useBubbleSound";
import { CharacterGuides } from "./CharacterGuides";
import { guideNavigation } from '../guide/navigation';
import type { GuideDataset } from '../guide/contract';
import "./discovery.css";

const ThailandMap = lazy(() => import("../scene/ThailandMap"));
const publicReview = import.meta.env.VITE_PUBLIC_REVIEW === 'true';

export function MapPreview() {
  const [features, setFeatures] = useState<ProvinceFeature[]>([]);
  const [failed, setFailed] = useState<MapFailure | null>(null);
  const [mapAttempt, setMapAttempt] = useState(0);
  // direct: a profile opened without the map camera (Guide result button, or the map failed); there are no bubbles to return to.
  const [direct, setDirect] = useState(false);
  const groupFixture = new URLSearchParams(location.search).get("fixture") === "group";
  const localFixture = publicReview || new URLSearchParams(location.search).get("fixture") === "local";
  const guideDataset: GuideDataset = localFixture ? 'review' : groupFixture ? 'group' : 'default';
  const [localData, setLocalData] = useState<ReturnType<typeof parseLocalPreview> | null>(null);
  const [localError, setLocalError] = useState(false);
  const demo = useMemo(() => createDiscoveryDemo(groupFixture), [groupFixture]);
  const empty = useMemo(() => ({ kids: [], groups: [] }), []);
  const { kids, groups } = localFixture ? localData ?? empty : demo;
  const previewArtwork = useMemo(() => Object.fromEntries(groups.map((g) =>
    [g.leadKidId, g.awards.map((a) => a.style)])), [groups]);
  const previewRecipientCounts = useMemo(() => Object.fromEntries(groups.map((group) =>
    [group.leadKidId, provinceRecipients(group).length])), [groups]);
  const mapKids = useMemo(() => kids.filter((kid) => groups.some((g) => g.leadKidId === kid.id)), [kids, groups]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [competitionId, setCompetitionId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<AwardSelection | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [previewClosing, setPreviewClosing] = useState(false);
  const [previewAnimate, setPreviewAnimate] = useState(false);
  const [groupClosing, setGroupClosing] = useState(false);
  const pendingGroupClose = useRef(false);
  const recipientInvoker = useRef<HTMLButtonElement | null>(null);
  const restoreRecipientFocus = useRef(false);
  const sound = useBubbleSound();
  const [dismissal, setDismissal] = useState({ request: 0, animate: false });
  const groupInvoker = useRef<HTMLElement | null>(null);
  const currentGroup = useRef<string | null>(null);
  const group = groups.find((item) => item.id === groupId);
  const previewMedia = studentId ? localData?.previews[studentId] : undefined;
  const legacyOwner = localData?.kids.length === 1 && localData.kids[0]?.id === studentId;
  useEffect(() => {
    if (!localFixture) return;
    if (!import.meta.env.DEV && !publicReview) { setLocalError(true); return; }
    const controller = new AbortController();
    void fetch('/__local-preview/data.json', { signal: controller.signal, cache: 'no-store' })
      .then((response) => { if (!response.ok) throw new Error('Local preview unavailable'); return response.json(); })
      .then((value: unknown) => { if (!controller.signal.aborted) setLocalData(parseLocalPreview(value)); })
      .catch(() => { if (!controller.signal.aborted) setLocalError(true); });
    return () => controller.abort();
  }, [localFixture]);
  const clear = useCallback(() => {
    currentGroup.current = null;
    setGroupId(null);
    setStudentId(null);
    setCompetitionId(null);
    setAnchor(null);
    setShowAll(false);
    setPreviewClosing(false);
    setGroupClosing(false);
    pendingGroupClose.current = false;
    restoreRecipientFocus.current = false;
  }, []);
  const onSelection = useCallback((selection: AwardSelection | null) => {
    if (!selection) { clear(); return; }
    const next = groups.find((item) => item.leadKidId === selection.kidId);
    if (!next) { clear(); return; }
    if (currentGroup.current !== next.id) {
      groupInvoker.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      currentGroup.current = next.id;
      setGroupId(next.id);
      setStudentId(null);
      setCompetitionId(null);
      setShowAll(false);
      setPreviewClosing(false);
      setGroupClosing(false);
      pendingGroupClose.current = false;
    }
    setAnchor(selection);
  }, [groups, clear]);
  const fail = useCallback((reason: MapFailure) => {
    console.warn("[map] unavailable:", reason);
    setFailed(reason);
    setDirect(true);
    setAnchor(null);
    setShowAll(true);
  }, []);
  useEffect(() => {
    if (features.length || failed) return;
    const controller = new AbortController();
    void (async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const data = await loadProvinces(controller.signal);
          if (!controller.signal.aborted) setFeatures(data);
          return;
        } catch {
          if (controller.signal.aborted) return;
          if (attempt === 1) fail("geometry");
        }
      }
    })();
    return () => controller.abort();
  }, [features.length, failed, mapAttempt, fail]);
  const retryMap = () => {
    // A failed lazy module can stay cached until navigation reloads its URL.
    if (failed === "scene") { location.reload(); return; }
    clear();
    setDismissal({ request: 0, animate: false });
    setFailed(null);
    setDirect(false);
    setMapAttempt((attempt) => attempt + 1);
  };
  const completeGroupClose = useCallback((animate: boolean) => {
    clear();
    setDirect(false);
    if (!direct && !failed) setDismissal((value) => ({ request: value.request + 1, animate }));
    else (groupInvoker.current?.isConnected ? groupInvoker.current
      : document.querySelector<HTMLElement>(".map-failure__province, .map-marker, .guide-launcher"))?.focus({ preventScroll: true });
  }, [clear, direct, failed]);
  useLayoutEffect(() => {
    // After a successful retry the Retry button is gone; keep keyboard focus on the page's persistent entry point.
    if (mapAttempt && !failed) document.querySelector<HTMLElement>(".guide-launcher")?.focus({ preventScroll: true });
  }, [mapAttempt, failed]);
  const finishGroup = useCallback(() => completeGroupClose(true), [completeGroupClose]);
  const beginGroupClose = useCallback(() => {
    (groupInvoker.current?.isConnected ? groupInvoker.current : document.querySelector<HTMLElement>(".map-failure__province, .map-marker, .guide-launcher"))?.focus({ preventScroll: true });
    setShowAll(false);
    setGroupClosing(true);
  }, []);
  const finishStudent = useCallback(() => {
    restoreRecipientFocus.current = !pendingGroupClose.current;
    setStudentId(null);
    setCompetitionId(null);
    setPreviewClosing(false);
    if (pendingGroupClose.current) { pendingGroupClose.current = false; beginGroupClose(); }
  }, [beginGroupClose]);
  useLayoutEffect(() => {
    if (!studentId && restoreRecipientFocus.current) {
      restoreRecipientFocus.current = false;
      const source = recipientInvoker.current;
      const visibleRow = [...document.querySelectorAll<HTMLButtonElement>(".province-recipient")]
        .find((button) => button.dataset.recipientId === source?.dataset.recipientId);
      const target = source?.isConnected && source.checkVisibility() && !source.closest("[inert]") ? source
        : visibleRow ?? document.querySelector<HTMLElement>(".province-recipients h2");
      target?.focus({ preventScroll: true });
    }
  }, [studentId]);
  const closeStudent = (animate = true) => {
    if (previewClosing) {
      if (!animate) setPreviewAnimate(false);
      return;
    }
    sound.play(true);
    setPreviewAnimate(animate);
    setPreviewClosing(true);
  };
  const closeGroup = (animate: boolean) => {
    if (!animate || direct || failed) { completeGroupClose(false); return; }
    if (groupClosing || pendingGroupClose.current) return;
    if (studentId) { pendingGroupClose.current = true; closeStudent(animate); }
    else beginGroupClose();
  };
  return (
    <main className={`map-preview province-preview ${group ? "is-discovering" : ""}`}
      data-map-failure={failed ?? undefined}
      aria-label="Hall of Fame map preview" lang="th"
      onKeyDownCapture={(event) => {
        if (event.target instanceof Element && event.target.closest(".guide-panel")) return;
        if (event.key !== "Escape" || !group) return;
        event.preventDefault();
        event.stopPropagation();
        if (competitionId) setCompetitionId(null);
        else if (studentId) closeStudent(false);
        else if (showAll && !direct) setShowAll(false);
        else closeGroup(false);
      }}>
      <h1 className="visually-hidden">Hamsterhub Hall of Fame</h1>
      <div className="brand-mark">
        <img src="/hamsterhub-logo.png" alt="" width="44" height="44"
          onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <span className="brand-mark__text">Hamster Hub</span>
      </div>
      <button className="discovery-sound" aria-label={sound.muted ? "เปิดเสียงฟองสบู่" : "ปิดเสียงฟองสบู่"}
        aria-pressed={!sound.muted} onClick={sound.toggle}><span aria-hidden="true">{sound.muted ? "🔇" : "🔊"}</span></button>
      <a className="credits-link" href="/credits.txt" target="_blank" rel="noopener noreferrer">ที่มาแผนที่ / Map credits</a>
      {localFixture && !localData ? <p className="preview-message" role="status">
        {localError ? (publicReview ? "โหลดข้อมูลทดสอบไม่สำเร็จ กรุณาลองรีเฟรชหน้า" : "ข้อมูลทดสอบส่วนตัวไม่พร้อมใช้งาน กรุณาเปิดผ่านเซิร์ฟเวอร์พัฒนาและตรวจสอบไฟล์ในเครื่อง")
          : publicReview ? "กำลังโหลดข้อมูลทดสอบ…" : "กำลังโหลดข้อมูลทดสอบในเครื่อง…"}
      </p> : failed ? <div className="map-failure" role="alert">
        <p>แผนที่ไม่พร้อมใช้งาน เลือกจังหวัดเพื่อดูผู้ได้รับรางวัล หรือถามแฮมสเตอร์</p>
        <ul className="map-failure__provinces" aria-label="จังหวัดที่มีผู้ได้รับรางวัล">
          {groups.filter((item) => provinceRecipients(item).length).map((item) => <li key={item.id}>
            <button className="map-failure__province" onClick={(event) => {
              groupInvoker.current = event.currentTarget; currentGroup.current = item.id;
              setGroupId(item.id); setStudentId(null); setCompetitionId(null); setShowAll(true);
              setPreviewClosing(false); setGroupClosing(false); pendingGroupClose.current = false;
            }}>{provinceNames[item.province]}<span>{provinceRecipients(item).length} คน</span></button></li>)}
        </ul>
        <button onClick={retryMap}>ลองโหลดแผนที่อีกครั้ง</button>
      </div> : features.length ? (
        <MapBoundary key={mapAttempt} onFailure={fail}>
          <Suspense fallback={<p className="preview-message" role="status">กำลังเตรียมแผนที่…</p>}>
            <ThailandMap kids={mapKids} features={features} preview previewArtwork={previewArtwork}
              previewRecipientCounts={previewRecipientCounts}
              onSelect={() => {}} onCluster={() => {}} onFailure={fail}
              onAwardSelection={onSelection} onAwardDismissRequest={closeGroup} awardDismissal={dismissal} />
          </Suspense>
        </MapBoundary>
      ) : <p className="preview-message" role="status">กำลังโหลดแผนที่ประเทศไทย…</p>}
      {group && <AwardDiscovery key={group.id} group={group} studentId={studentId} competitionId={competitionId} onCompetition={setCompetitionId}
        onBubbleFeedback={sound.play}
        showAll={showAll} anchor={anchor} closing={groupClosing} onClosed={finishGroup}
        previewSource={recipientInvoker.current} previewClosing={previewClosing}
        previewAnimate={previewAnimate} onPreviewClosed={finishStudent}
        onStudent={(id, button, animate) => {
          sound.play(false);
          pendingGroupClose.current = false;
          recipientInvoker.current = button;
          setCompetitionId(null); setPreviewAnimate(animate); setPreviewClosing(false); setStudentId(id);
        }}
        onShowAll={() => { if (direct) closeGroup(false); else setShowAll((value) => !value); }}
        onBack={competitionId ? () => setCompetitionId(null) : closeStudent} onClose={closeGroup}
        portraitUrl={previewMedia?.portraitUrl ?? (legacyOwner ? '/__local-preview/portrait.png' : undefined)}
        fictional={previewMedia?.fictional} />}
      <CharacterGuides dataset={guideDataset} onTarget={(target) => {
        const destination = guideNavigation(target, groups, guideDataset);
        if (!destination) return;
        // Result buttons open the profile directly, which also works when the map is unavailable.
        clear(); setDirect(true);
        currentGroup.current = destination.group.id;
        groupInvoker.current = document.querySelector<HTMLElement>(".guide-launcher");
        recipientInvoker.current = null;
        setGroupId(destination.group.id); setShowAll(true);
        setPreviewAnimate(false); setStudentId(destination.kidId); setCompetitionId(destination.competitionId);
      }} groups={groups} group={group} studentId={studentId} competitionId={competitionId}
        showAll={showAll} anchor={anchor} exiting={groupClosing || previewClosing} />
    </main>
  );
}
