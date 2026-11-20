import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { loadProvinces, type ProvinceFeature } from "../geo/provinces";
import { createDiscoveryDemo } from "../mock/discovery";
import { parseLocalPreview } from "../data/localPreview";
import { provinceRecipients } from "../data/provinceRecipients";
import type { AwardSelection } from "../scene/ThailandMap";
import type { MapFailure } from "../scene/mapFailure";
import { MapBoundary } from "./MapBoundary";
import { AwardDiscovery } from "./AwardDiscovery";
import { AwardDirectory } from "./AwardDirectory";
import { useBubbleSound } from "./useBubbleSound";
import "./discovery.css";

const ThailandMap = lazy(() => import("../scene/ThailandMap"));
const publicReview = import.meta.env.VITE_PUBLIC_REVIEW === 'true';

export function MapPreview() {
  const [features, setFeatures] = useState<ProvinceFeature[]>([]);
  const [failed, setFailed] = useState<MapFailure | null>(null);
  const [mapAttempt, setMapAttempt] = useState(0);
  const [list, setList] = useState(() => new URLSearchParams(location.search).get("view") === "recipients");
  const groupFixture = new URLSearchParams(location.search).get("fixture") === "group";
  const localFixture = publicReview || new URLSearchParams(location.search).get("fixture") === "local";
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
  const listButton = useRef<HTMLButtonElement>(null);
  const currentGroup = useRef<string | null>(null);
  const group = groups.find((item) => item.id === groupId);
  const previewMedia = studentId ? localData?.previews[studentId] : undefined;
  const legacyOwner = localData?.kids.length === 1 && localData.kids[0]?.id === studentId;
  const presentation = previewMedia?.presentationUrl ?? (legacyOwner ? '/__local-preview/presentation.pdf' : undefined);
  const presentationUrl = useMemo(() => {
    try { return presentation ? new URL(presentation, location.origin).href : undefined; }
    catch { return undefined; }
  }, [presentation]);
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
    setList(true);
    setAnchor(null);
    setShowAll(true);
  }, []);
  useEffect(() => {
    if (features.length || list) return;
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
  }, [features.length, list, mapAttempt, fail]);
  useLayoutEffect(() => {
    if (mapAttempt && !failed && !list) listButton.current?.focus({ preventScroll: true });
  }, [mapAttempt, failed, list]);
  const retryMap = () => {
    // A failed lazy module can stay cached until navigation reloads its URL.
    if (failed === "scene") { location.reload(); return; }
    clear();
    setDismissal({ request: 0, animate: false });
    setFailed(null);
    setList(false);
    setMapAttempt((attempt) => attempt + 1);
  };
  const completeGroupClose = useCallback((animate: boolean) => {
    clear();
    if (!list && !failed) setDismissal((value) => ({ request: value.request + 1, animate }));
    else (groupInvoker.current?.isConnected ? groupInvoker.current
      : document.querySelector<HTMLButtonElement>(".directory-award") ?? listButton.current)?.focus({ preventScroll: true });
  }, [clear, list, failed]);
  const finishGroup = useCallback(() => completeGroupClose(true), [completeGroupClose]);
  const beginGroupClose = useCallback(() => {
    (groupInvoker.current?.isConnected ? groupInvoker.current : listButton.current)?.focus({ preventScroll: true });
    setShowAll(false);
    setGroupClosing(true);
  }, []);
  const finishStudent = useCallback(() => {
    restoreRecipientFocus.current = !pendingGroupClose.current;
    setStudentId(null);
    setPreviewClosing(false);
    if (pendingGroupClose.current) { pendingGroupClose.current = false; beginGroupClose(); }
  }, [beginGroupClose]);
  useLayoutEffect(() => {
    if (!studentId && restoreRecipientFocus.current) {
      restoreRecipientFocus.current = false;
      recipientInvoker.current?.focus({ preventScroll: true });
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
    if (!animate || list || failed) { completeGroupClose(false); return; }
    if (groupClosing || pendingGroupClose.current) return;
    if (studentId) { pendingGroupClose.current = true; closeStudent(animate); }
    else beginGroupClose();
  };
  return (
    <main className={`map-preview province-preview ${list ? "is-directory" : ""} ${group ? "is-discovering" : ""}`}
      data-map-failure={failed ?? undefined}
      aria-label="Hall of Fame map preview" lang="th"
      onKeyDownCapture={(event) => {
        if (event.key !== "Escape" || !group) return;
        event.preventDefault();
        event.stopPropagation();
        if (studentId) closeStudent(false);
        else if (showAll && !list) setShowAll(false);
        else closeGroup(false);
      }}>
      <header className="discovery-intro">
        <p className="discovery-eyebrow">HAMSTERHUB <span aria-hidden="true">/</span> HALL OF FAME</p>
        <h1>เบื้องหลังรางวัล คือไอเดียของใคร?</h1>
        <p>เลือกเหรียญประจำจังหวัด แล้วมารู้จักเจ้าของผลงาน</p>
      </header>
      <button ref={listButton} className="discovery-view" aria-pressed={list}
        onClick={() => { clear(); setList((value) => !value); }} disabled={Boolean(failed && list)}>
        {list ? "◈ ดูแผนที่" : "☷ ดูรายชื่อ"}
      </button>
      <button className="discovery-sound" aria-label={sound.muted ? "เปิดเสียงฟองสบู่" : "ปิดเสียงฟองสบู่"}
        aria-pressed={!sound.muted} onClick={sound.toggle}>{sound.muted ? "เสียง: ปิด" : "เสียง: เปิด"}</button>
      {localFixture && !localData ? <p className="preview-message" role="status">
        {localError ? (publicReview ? "โหลดข้อมูลทดสอบไม่สำเร็จ กรุณาลองรีเฟรชหน้า" : "ข้อมูลทดสอบส่วนตัวไม่พร้อมใช้งาน กรุณาเปิดผ่านเซิร์ฟเวอร์พัฒนาและตรวจสอบไฟล์ในเครื่อง")
          : publicReview ? "กำลังโหลดข้อมูลทดสอบ…" : "กำลังโหลดข้อมูลทดสอบในเครื่อง…"}
      </p> : list ? <AwardDirectory groups={groups} failed={Boolean(failed)} onRetry={retryMap} onSelect={(id, button) => {
        groupInvoker.current = button;
        currentGroup.current = id;
        setGroupId(id);
        setStudentId(null);
        setShowAll(true);
        setPreviewClosing(false);
        setGroupClosing(false);
        pendingGroupClose.current = false;
      }} /> : features.length ? (
        <MapBoundary key={mapAttempt} onFailure={fail}>
          <Suspense fallback={<p className="preview-message" role="status">กำลังเตรียมแผนที่…</p>}>
            <ThailandMap kids={mapKids} features={features} preview previewArtwork={previewArtwork}
              previewRecipientCounts={previewRecipientCounts}
              onSelect={() => {}} onCluster={() => {}} onFailure={fail}
              onAwardSelection={onSelection} onAwardDismissRequest={closeGroup} awardDismissal={dismissal} />
          </Suspense>
        </MapBoundary>
      ) : <p className="preview-message" role="status">กำลังโหลดแผนที่ประเทศไทย…</p>}
      {group && <AwardDiscovery key={group.id} group={group} studentId={studentId}
        showAll={showAll} anchor={anchor} closing={groupClosing} onClosed={finishGroup}
        previewSource={recipientInvoker.current} previewClosing={previewClosing}
        previewAnimate={previewAnimate} onPreviewClosed={finishStudent}
        onStudent={(id, button, animate) => {
          sound.play(false);
          pendingGroupClose.current = false;
          recipientInvoker.current = button;
          setPreviewAnimate(animate); setPreviewClosing(false); setStudentId(id);
        }}
        onShowAll={() => { if (list) closeGroup(false); else setShowAll((value) => !value); }}
        onBack={closeStudent} onClose={closeGroup}
        presentationUrl={presentationUrl}
        portraitUrl={previewMedia?.portraitUrl ?? (legacyOwner ? '/__local-preview/portrait.png' : undefined)}
        fictional={previewMedia?.fictional} />}
      <details className="preview-credit">
        <summary>{publicReview ? "เวอร์ชันทดสอบ" : localFixture ? "ข้อมูลทดสอบในเครื่อง" : "ข้อมูลตัวอย่าง"} · ที่มาแผนที่</summary>
        <p>{publicReview ? "เจ้าของข้อมูลอนุญาตให้ใช้สำหรับทดสอบ พร้อมตัวละครสมมติ 6 คน การจับคู่การแข่งขันเป็นข้อมูลทดสอบ ไม่ระบุอันดับรางวัล"
          : localFixture ? "ข้อมูลส่วนตัวสำหรับทดสอบในเครื่อง รูปรางวัลใช้ประกอบการแสดงผล ไม่ระบุอันดับรางวัล" : "นักเรียน รางวัล และภาพประกอบเป็นตัวอย่างสมมติ ลิงก์โปรไฟล์และผลงานยังเป็นลิงก์ตัวอย่าง"}</p>
        <p>{!publicReview && <><a href={groupFixture ? "?" : "?fixture=group"}>
          {groupFixture ? "กลับไปตัวอย่างนักเรียน 3 คน" : "ทดลองกลุ่มผู้ได้รับรางวัล 8 คน"}
        </a> · </>}<a href={`?view=recipients${localFixture && !publicReview ? "&fixture=local" : groupFixture && !publicReview ? "&fixture=group" : ""}`}>เปิดรายชื่อโดยตรง</a></p>
        <p>Boundaries: <a href="https://github.com/GeoThai/boundaries">GeoThai</a>, OCHA COD-AB / Royal Thai Survey Department.</p>
        <p><a href="https://creativecommons.org/licenses/by/3.0/igo/">Geometry: CC BY 3.0 IGO</a>
          {" · "}<a href="https://creativecommons.org/licenses/by/4.0/">Names/codes: CC BY 4.0</a></p>
      </details>
    </main>
  );
}
