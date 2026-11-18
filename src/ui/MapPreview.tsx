import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { loadProvinces, type ProvinceFeature } from "../geo/provinces";
import { createDiscoveryDemo } from "../mock/discovery";
import type { AwardSelection } from "../scene/ThailandMap";
import { MapBoundary } from "./MapBoundary";
import { AwardDiscovery } from "./AwardDiscovery";
import { AwardDirectory } from "./AwardDirectory";
import "./discovery.css";

const ThailandMap = lazy(() => import("../scene/ThailandMap"));

export function MapPreview() {
  const [features, setFeatures] = useState<ProvinceFeature[]>([]);
  const [failed, setFailed] = useState(false);
  const [list, setList] = useState(() => new URLSearchParams(location.search).get("view") === "recipients");
  const groupFixture = new URLSearchParams(location.search).get("fixture") === "group";
  const { kids, groups } = useMemo(() => createDiscoveryDemo(groupFixture), [groupFixture]);
  const mapKids = useMemo(() => kids.filter((kid) => groups.some((g) => g.leadKidId === kid.id)), [kids, groups]);
  const [anchor, setAnchor] = useState<AwardSelection | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [awardId, setAwardId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [previewClosing, setPreviewClosing] = useState(false);
  const [previewAnimate, setPreviewAnimate] = useState(false);
  const [showAll, setShowAll] = useState(false);
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
      setShowAll(false);
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
  const closeGroup = (animate: boolean) => {
    clear();
    if (!list && !failed) setDismissal((value) => ({ request: value.request + 1, animate }));
    else (groupInvoker.current?.isConnected ? groupInvoker.current : listButton.current)?.focus({ preventScroll: true });
  };
  const finishStudent = useCallback(() => {
    restoreRecipientFocus.current = true;
    setStudentId(null);
    setPreviewClosing(false);
  }, []);
  useLayoutEffect(() => {
    if (!studentId && restoreRecipientFocus.current) {
      restoreRecipientFocus.current = false;
      recipientInvoker.current?.focus({ preventScroll: true });
    }
  }, [studentId]);
  const closeStudent = (animate = true) => {
    if (previewClosing) return;
    setPreviewAnimate(animate);
    setPreviewClosing(true);
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
      {list ? <AwardDirectory groups={groups} failed={failed} onSelect={(id, selectedAward, button) => {
        groupInvoker.current = button;
        currentGroup.current = id;
        setGroupId(id);
        setAwardId(selectedAward);
        setStudentId(null);
        setShowAll(false);
      }} /> : features.length ? (
        <MapBoundary onFailure={fail}>
          <Suspense fallback={<p className="preview-message" role="status">กำลังเตรียมแผนที่…</p>}>
            <ThailandMap kids={mapKids} features={features} preview
              onSelect={() => {}} onCluster={() => {}} onFailure={fail}
              onAwardSelection={onSelection} awardDismissal={dismissal} />
          </Suspense>
        </MapBoundary>
      ) : <p className="preview-message" role="status">กำลังโหลดแผนที่ประเทศไทย…</p>}
      {group && award && <AwardDiscovery key={group.id} group={group} award={award}
        studentId={studentId} showAll={showAll} anchor={anchor}
        previewSource={recipientInvoker.current} previewClosing={previewClosing} previewAnimate={previewAnimate} onPreviewClosed={finishStudent}
        onAward={(id) => { setAwardId(id); setStudentId(null); setPreviewClosing(false); setShowAll(false); }}
        onStudent={(id, button, animate) => {
          recipientInvoker.current = button; setPreviewAnimate(animate); setPreviewClosing(false); setStudentId(id);
        }}
        onShowAll={() => setShowAll((value) => !value)} onBack={closeStudent} onClose={closeGroup} />}
      <details className="preview-credit">
        <summary>ข้อมูลตัวอย่าง · ที่มาแผนที่</summary>
        <p>นักเรียน รางวัล และภาพประกอบเป็นตัวอย่างสมมติ ลิงก์โปรไฟล์และผลงานยังเป็นลิงก์ตัวอย่าง</p>
        <p><a href={groupFixture ? "?" : "?fixture=group"}>
          {groupFixture ? "กลับไปตัวอย่างนักเรียน 3 คน" : "ทดลองกลุ่มผู้ได้รับรางวัล 8 คน"}
        </a> · <a href={`?view=recipients${groupFixture ? "&fixture=group" : ""}`}>เปิดรายชื่อโดยตรง</a></p>
        <p>Boundaries: <a href="https://github.com/GeoThai/boundaries">GeoThai</a>, OCHA COD-AB / Royal Thai Survey Department.</p>
        <p><a href="https://creativecommons.org/licenses/by/3.0/igo/">Geometry: CC BY 3.0 IGO</a>
          {" · "}<a href="https://creativecommons.org/licenses/by/4.0/">Names/codes: CC BY 4.0</a></p>
      </details>
    </main>
  );
}
