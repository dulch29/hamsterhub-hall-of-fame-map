import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { generateMockKids, MOCK_PROVINCE_NAMES } from "./mock/generate";
import { createLongNameKid, createOptedOutKid } from "./mock/fixtures";
import { prepareKids } from "./data/prepareKids";
import { loadProvinces, provinceNames } from "./geo/provinces";
import type { ProvinceFeature } from "./geo/provinces";
import { PinCard, initialsFor } from "./ui/PinCard";
import "./ui/PinCard.css";
import { MapBoundary } from "./ui/MapBoundary";
const ThailandMap = lazy(() => import("./scene/ThailandMap"));
type Mode = "starter" | "spread" | "dense" | "group" | "edges";
export default function App() {
  const [mode, setMode] = useState<Mode>("starter");
  const [view, setView] = useState<"map" | "list">("map");
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [features, setFeatures] = useState<ProvinceFeature[]>([]);
  const [mapError, setMapError] = useState("");
  const [members, setMembers] = useState<string[] | null>(null);
  useEffect(() => {
    let active = true;
    loadProvinces()
      .then((data) => {
        if (active) setFeatures(data);
      })
      .catch(() => {
        if (active) {
          setMapError(
            "Map data could not load. You can still explore every student below.",
          );
          setView("list");
        }
      });
    return () => {
      active = false;
    };
  }, []);
  const names = useMemo(
    () =>
      Object.fromEntries(
        features.map((f) => [f.properties.code, f.properties.name]),
      ),
    [features],
  );
  const kids = useMemo(() => {
    const raw = generateMockKids({
      count:
        mode === "group" ? 8 : mode === "spread" || mode === "dense" ? 500 : 3,
    });
    if (mode === "dense" || mode === "group")
      raw.forEach((kid) => {
        kid.province = "TH-10";
      });
    if (mode === "edges") raw.push(createLongNameKid(), createOptedOutKid());
    return prepareKids(raw);
  }, [mode]);
  const filtered = useMemo(
    () =>
      kids.filter(
        (kid) =>
          (!province || kid.province === province) &&
          kid.displayName
            .normalize("NFC")
            .toLocaleLowerCase()
            .includes(query.trim().normalize("NFC").toLocaleLowerCase()),
      ),
    [kids, query, province],
  );
  const selected = filtered.find((kid) => kid.id === selectedId);
  const provinces = [...new Set(kids.map((kid) => kid.province))].sort((a, b) =>
    (names[a] ?? a).localeCompare(names[b] ?? b),
  );
  const provinceName = (code: string) =>
    names[code] ??
    provinceNames[code as keyof typeof provinceNames] ??
    MOCK_PROVINCE_NAMES[code as keyof typeof MOCK_PROVINCE_NAMES] ??
    code;
  const changeMode = (next: Mode) => {
    setMode(next);
    setQuery("");
    setProvince("");
    setMembers(null);
    setSelectedId(null);
  };
  const visibleKids = members
    ? filtered.filter((kid) => members.includes(kid.id))
    : filtered;
  return (
    <>
      <header className="site-header">
        <a
          className="wordmark"
          href="https://www.hamsterhub.co/"
          aria-label="Hamsterhub home"
        >
          <span className="hamster-mark" aria-hidden="true">
            🐹
          </span>
          <span>
            Hamster<span className="wordmark-blue">hub</span>
          </span>
        </a>
        <span className="header-divider" />
        <span className="header-title">Hall of fame</span>
        <span className="demo-badge">Test playground</span>
      </header>
      <main>
        <section className="intro">
          <div className="intro-copy">
            <p className="intro-kicker">
              <span aria-hidden="true">✦</span> Little makers. Big
              possibilities.
            </p>
            <h1>
              A whole country
              <br />
              of bright ideas.
            </h1>
            <p>
              Meet the next generation of creators. Explore Thailand, find a
              maker, and discover what they’re building.
            </p>
          </div>
          <div className="intro-note">
            <span className="note-star" aria-hidden="true">
              ✳
            </span>
            <p>
              Every great project
              <br />
              starts with a little curiosity.
            </p>
            <span className="note-line">Let’s explore ↓</span>
          </div>
        </section>
        <section className="explorer" aria-label="Explore student projects">
          <a className="skip-list" href="#student-list">
            Skip to student list
          </a>
          <div className="explorer-toolbar">
            <div className="view-switch" aria-label="Explorer view">
              <button
                aria-pressed={view === "map"}
                onClick={() => setView("map")}
                disabled={!!mapError}
              >
                ◈ Map
              </button>
              <button
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                ☷ List
              </button>
            </div>
            <label className="search">
              <span aria-hidden="true">⌕</span>
              <span className="visually-hidden">Search by student name</span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setMembers(null);
                }}
                placeholder="Find a maker…"
                type="search"
              />
            </label>
            <label className="province-filter">
              <span className="visually-hidden">Filter by province</span>
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setMembers(null);
                }}
              >
                <option value="">All provinces</option>
                {provinces.map((code) => (
                  <option key={code} value={code}>
                    {provinceName(code)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {mapError && (
            <p className="fallback-message" role="status">
              {mapError}
            </p>
          )}
          <div className={`explorer-body ${view === "list" ? "is-list" : ""}`}>
            {view === "map" && (
              <div className="map-panel">
                <div className="map-caption">
                  <span className="live-dot" /> Thailand’s maker map{" "}
                  <span>Province-level locations</span>
                </div>
                {features.length ? (
                  <MapBoundary
                    onFailure={() => {
                      setMapError(
                        "The map could not start. Explore every student in the list.",
                      );
                      setView("list");
                    }}
                  >
                    <Suspense
                      fallback={
                        <div className="map-loading" role="status">
                          Preparing your map…
                        </div>
                      }
                    >
                      <ThailandMap
                        kids={filtered}
                        features={features}
                        onSelect={setSelectedId}
                        onCluster={(ids) => setMembers(ids.length ? ids : null)}
                        onFailure={() => {
                          setMapError(
                            "3D is unavailable in this browser. Explore the same students in the list.",
                          );
                          setView("list");
                        }}
                      />
                    </Suspense>
                  </MapBoundary>
                ) : (
                  <div className="map-loading" role="status">
                    Loading Thailand…
                  </div>
                )}
                <div className="map-legend">
                  <span className="legend-pin" /> A maker{" "}
                  <span className="legend-cluster">3</span> A group of makers
                </div>
              </div>
            )}
            <aside
              id="student-list"
              tabIndex={-1}
              className="makers-panel"
              aria-label="Student list"
            >
              <div className="makers-heading">
                <div>
                  <h2>
                    {members ? "Makers in this group" : "Meet the makers"}
                  </h2>
                  <p aria-live="polite">
                    {visibleKids.length}{" "}
                    {visibleKids.length === 1 ? "maker" : "makers"} to discover
                  </p>
                </div>
                <span aria-hidden="true">✦</span>
              </div>
              {members && (
                <button
                  className="text-button"
                  onClick={() => setMembers(null)}
                >
                  Show all results
                </button>
              )}
              {visibleKids.length === 0 ? (
                <div className="empty-state">
                  <span aria-hidden="true">⌕</span>
                  <h3>No makers found</h3>
                  <p>Try another name or explore all provinces.</p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setProvince("");
                      setMembers(null);
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <ul className="maker-list">
                  {visibleKids.map((kid, index) => (
                    <li key={kid.id}>
                      <button
                        className="maker-row"
                        data-kid-id={kid.id}
                        aria-haspopup="dialog"
                        onClick={() => setSelectedId(kid.id)}
                      >
                        <span
                          className={`maker-avatar avatar-${index % 3}`}
                          aria-hidden="true"
                        >
                          {initialsFor(kid.displayName)}
                        </span>
                        <span className="maker-info">
                          <strong>{kid.displayName}</strong>
                          <span>{provinceName(kid.province)}</span>
                          <span className="project-title">
                            {kid.featuredProject?.title ??
                              "A new idea is on its way"}
                          </span>
                        </span>
                        <span className="row-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="province-note">
                <span aria-hidden="true">♡</span>
                <p>
                  A place for ideas to grow.
                  <br />
                  Pins show a province, never a home.
                </p>
              </div>
            </aside>
          </div>
          <div className="explorer-footer">
            <span>
              <strong>{filtered.length}</strong> makers ·{" "}
              <strong>{new Set(filtered.map((k) => k.province)).size}</strong>{" "}
              provinces
            </span>
            <span>Made with curiosity, across Thailand.</span>
          </div>
        </section>
        <p className="map-attribution">
          Boundaries:{" "}
          <a href="https://github.com/GeoThai/boundaries">GeoThai</a>, from OCHA
          COD-AB and the Royal Thai Survey Department.{" "}
          <a href="https://creativecommons.org/licenses/by/3.0/igo/">
            Geometry: CC BY 3.0 IGO
          </a>{" "}
          ·{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">
            Names/codes: CC BY 4.0
          </a>
          . Properties normalized for this demo.
        </p>
        <section className="test-controls" aria-label="Demo settings">
          <div>
            <strong>Your test playground</strong>
            <p>
              Fictional students only. No login enforcement. Profile and project
              links are placeholders.
            </p>
          </div>
          <label>
            Test dataset
            <select
              value={mode}
              onChange={(e) => changeMode(e.target.value as Mode)}
            >
              <option value="starter">3 makers · first look</option>
              <option value="spread">500 makers · across Thailand</option>
              <option value="group">8 makers · small group</option>
              <option value="dense">500 makers · Bangkok cluster</option>
              <option value="edges">Edge cases · long name & opt-out</option>
            </select>
          </label>
        </section>
      </main>
      <footer className="site-footer">
        <span>Hamsterhub · A home for curious minds.</span>
        <a href="https://www.hamsterhub.co/">Visit Hamsterhub ↗</a>
      </footer>
      {selected && (
        <PinCard
          key={selected.id}
          kid={selected}
          onClose={() => setSelectedId(null)}
          restoreFocus={() =>
            document
              .querySelector<HTMLButtonElement>(
                `[data-kid-id="${CSS.escape(selected.id)}"]`,
              )
              ?.focus()
          }
        />
      )}
    </>
  );
}
