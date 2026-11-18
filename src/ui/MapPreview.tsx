import { lazy, Suspense, useEffect, useState } from "react";
import { prepareKids } from "../data/prepareKids";
import { loadProvinces, type ProvinceFeature } from "../geo/provinces";
import { generateMockKids } from "../mock/generate";
import { MapBoundary } from "./MapBoundary";

const ThailandMap = lazy(() => import("../scene/ThailandMap"));
const kids = prepareKids(generateMockKids());

export function MapPreview() {
  const [features, setFeatures] = useState<ProvinceFeature[]>([]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    loadProvinces().then(
      (data) => { if (active) setFeatures(data); },
      () => { if (active) setFailed(true); },
    );
    return () => { active = false; };
  }, []);

  return (
    <main className="map-preview" aria-label="Hall of Fame map preview">
      <h1 className="visually-hidden">Hall of Fame · Thailand</h1>
      {!failed && <a className="preview-skip" href="?view=explorer#student-list">Open student list</a>}
      {failed ? (
        <div className="preview-message" role="status">
          <p>The map could not load.</p>
          <a href="?view=explorer#student-list">Open student list</a>
        </div>
      ) : features.length ? (
        <MapBoundary onFailure={() => setFailed(true)}>
          <Suspense fallback={<p className="preview-message" role="status">Loading Thailand…</p>}>
            <ThailandMap kids={kids} features={features} preview
              onSelect={() => {}} onCluster={() => {}} onFailure={() => setFailed(true)} />
          </Suspense>
        </MapBoundary>
      ) : <p className="preview-message" role="status">Loading Thailand…</p>}
      <details className="preview-credit">
        <summary>Map credits</summary>
        <p>Boundaries: <a href="https://github.com/GeoThai/boundaries">GeoThai</a>, from OCHA
          COD-AB and the Royal Thai Survey Department. Properties normalized for this demo.</p>
        <p><a href="https://creativecommons.org/licenses/by/3.0/igo/">Geometry: CC BY 3.0 IGO</a>
          {" · "}<a href="https://creativecommons.org/licenses/by/4.0/">Names/codes: CC BY 4.0</a></p>
        <p>Three fictional students. Trophy and medal combinations are sample artwork.
          Larger awards lead each group; nearby stars celebrate every participant.</p>
      </details>
    </main>
  );
}
