import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { loadProvinces, type ProvinceFeature } from "../geo/provinces";
import { createDiscoveryDemo } from "../mock/discovery";
import { parseLocalPreview } from "../data/localPreview";
import type { AwardSelection } from "../scene/ThailandMap";
import { MapBoundary } from "./MapBoundary";
import { AwardDiscovery } from "./AwardDiscovery";
import { AwardDirectory } from "./AwardDirectory";
import { useBubbleSound } from "./useBubbleSound";
import "./discovery.css";

const ThailandMap = lazy(() => import("../scene/ThailandMap"));
const publicReview = import.meta.env.VITE_PUBLIC_REVIEW === 'true';

export function MapPreview() {
  const [features, setFeatures] = useState<ProvinceFeature[]>([]);
  const [failed, setFailed] = useState(false);
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
  const mapKids = useMemo(() => kids.filter((kid) => groups.some((g) => g.leadKidId === kid.id)), [kids, groups]);
  const [anchor, setAnchor] = useState<AwardSelection | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [awardId, setAwardId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [previewClosing, setPreviewClosing] = useState(false);
  const [previewAnimate, setPreviewAnimate] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [groupClosing, setGroupClosing] = useState(false);
  const pendingGroupClose = useRef(false);
  const sound = useBubbleSound();
  const [dismissal, setDismissal] = useState({ request: 0, animate: false });
  const currentGroup = useRef<string | null>(null);
  const groupInvoker = useRef<HTMLElement | null>(null);
  const recipientInvoker = useRef<HTMLButtonElement | null>(null);
  const restoreRecipientFocus = useRef(false);
  const listButton = useRef<HTMLButtonElement>(null);
  const group = groups.find((item) => item.id === groupId);
  const award = group?.awards.find((item) => item.id === awardId) ?? group?.awards[0];
  const clear = useCallback(() => {
    currentGroup.current = null;
    setGroupId(null);
    setAnchor(null);
    setStudentId(null);
    setPreviewClosing(false);
    restoreRecipientFocus.current = false;
    setAwardId(null);
    setShowAll(false);
    setGroupClosing(false);
    pendingGroupClose.current = false;
  }, []);
  const onSelection = useCallback((selection: AwardSelection | null) => {
    if (!selection) { clear(); return; }
    const next = groups.find((item) => item.leadKidId === selection.kidId);
    if (!next) { clear(); return; }
    if (currentGroup.current !== next.id) {
      groupInvoker.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      currentGroup.current = next.id;
      setGroupId(next.id);
      setAwardId(null);
      setStudentId(null);
      setPreviewClosing(false);
      setShowAll(false);
      setGroupClosing(false);
      pendingGroupClose.current = false;
    }
    setAnchor(selection);
  }, [groups, clear]);
  useEffect(() => {
    let active = true;
    loadProvinces().then(
      (data) => { if (active) setFeatures(data); },
      () => { if (active) { setFailed(true); setList(true); } },
    );
    return () => { active = false; };
  }, []);
  const completeGroupClose = useCallback((animate: boolean) => {
    clear();
    if (!list && !failed) setDismissal((value) => ({ request: value.request + 1, animate }));
    else (groupInvoker.current?.isConnected ? groupInvoker.current : listButton.current)?.focus({ preventScroll: true });
  }, [clear, list, failed]);
  const finishGroup = useCallback(() => completeGroupClose(true), [completeGroupClose]);
  const beginGroupClose = useCallback(() => {
    (groupInvoker.current?.isConnected ? groupInvoker.current : listButton.current)?.focus({ preventScroll: true });
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
    if (!animate) { completeGroupClose(false); return; }
    if (groupClosing || pendingGroupClose.current) return;
    if (studentId) {
      pendingGroupClose.current = true;
      closeStudent(animate);
    } else beginGroupClose();
  };
  const fail = () => { setFailed(true); setList(true); setAnchor(null); };
  return (
    <main className={`map-preview ${list ? "is-directory" : ""} ${group ? "is-discovering" : ""}`}
      aria-label="Hall of Fame map preview" lang="th"
      onKeyDownCapture={(event) => {
        if (event.key !== "Escape" || !group) return;
        event.preventDefault();
        event.stopPropagation();
        if (studentId) closeStudent(false); else closeGroup(false);
      }}>
      <header className="discovery-intro">
        <p className="discovery-eyebrow">HAMSTERHUB <span aria-hidden="true">/</span> HALL OF FAME</p>
        <h1>เบื้องหลังรางวัล คือไอเดียของใคร?</h1>
        <p>เลือกรางวัลบนแผนที่ แล้วมารู้จักเจ้าของผลงาน</p>
      </header>
      <button ref={listButton} className="discovery-view" aria-pressed={list}
        onClick={() => { clear(); setList((value) => !value); }} disabled={failed && list}>
        {list ? "◈ ดูแผนที่" : "☷ ดูรายชื่อ"}
      </button>
      <button className="discovery-sound" aria-label={sound.muted ? "เปิดเสียงฟองสบู่" : "ปิดเสียงฟองสบู่"}
        aria-pressed={!sound.muted} onClick={sound.toggle}>{sound.muted ? "เสียง: ปิด" : "เสียง: เปิด"}</button>
      {localFixture && !localData ? <p className="preview-message" role="status">
        {localError ? (publicReview ? "โหลดข้อมูลทดสอบไม่สำเร็จ กรุณาลองรีเฟรชหน้า" : "ข้อมูลทดสอบส่วนตัวไม่พร้อมใช้งาน กรุณาเปิดผ่านเซิร์ฟเวอร์พัฒนาและตรวจสอบไฟล์ในเครื่อง")
          : publicReview ? "กำลังโหลดข้อมูลทดสอบ…" : "กำลังโหลดข้อมูลทดสอบในเครื่อง…"}
      </p> : list ? <AwardDirectory groups={groups} failed={failed} onSelect={(id, selectedAward, button) => {
        groupInvoker.current = button;
        currentGroup.current = id;
        setGroupId(id);
        setAwardId(selectedAward);
        setStudentId(null);
        setPreviewClosing(false);
        setGroupClosing(false);
        pendingGroupClose.current = false;
        setShowAll(false);
      }} /> : features.length ? (
        <MapBoundary onFailure={fail}>
          <Suspense fallback={<p className="preview-message" role="status">กำลังเตรียมแผนที่…</p>}>
            <ThailandMap kids={mapKids} features={features} preview previewArtwork={previewArtwork}
              onSelect={() => {}} onCluster={() => {}} onFailure={fail}
              onAwardSelection={onSelection} onAwardDismissRequest={closeGroup} awardDismissal={dismissal} />
          </Suspense>
        </MapBoundary>
      ) : <p className="preview-message" role="status">กำลังโหลดแผนที่ประเทศไทย…</p>}
      {group && award && <AwardDiscovery key={group.id} group={group} award={award}
        localPreview={localFixture}
        presentationUrl={localData ? new URL('/__local-preview/presentation.pdf', location.origin).href : undefined}
        portraitUrl={localData ? '/__local-preview/portrait.png' : undefined}
        studentId={studentId} showAll={showAll} anchor={anchor}
        closing={groupClosing} onClosed={finishGroup}
        previewSource={recipientInvoker.current} previewClosing={previewClosing} previewAnimate={previewAnimate} onPreviewClosed={finishStudent}
        onAward={(id) => { setAwardId(id); setStudentId(null); setPreviewClosing(false); setShowAll(false); }}
        onStudent={(id, button, animate) => {
          sound.play(false);
          recipientInvoker.current = button; setPreviewAnimate(animate); setPreviewClosing(false); setStudentId(id);
        }}
        onShowAll={() => setShowAll((value) => !value)} onBack={closeStudent} onClose={closeGroup} />}
      <details className="preview-credit">
        <summary>{publicReview ? "เวอร์ชันทดสอบ" : localFixture ? "ข้อมูลทดสอบในเครื่อง" : "ข้อมูลตัวอย่าง"} · ที่มาแผนที่</summary>
        <p>{publicReview ? "เจ้าของข้อมูลอนุญาตให้ใช้สำหรับทดสอบ รูปรางวัลใช้ประกอบการแสดงผล ไม่ระบุอันดับรางวัล"
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
