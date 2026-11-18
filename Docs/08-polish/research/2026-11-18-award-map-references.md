# Award map reference study — 2026-11-18

**Recommendation for review:** a sculpted Thailand map on the existing Hamsterhub navy, with warm gold, cool silver and copper-bronze medals. Give special awards a recognizable trophy silhouette. Let selecting an award move the camera toward it and finish with a short highlight.

This is research and a proposed direction, not an approved specification or an implemented feature. The request is a bounded design study of the existing map. Production source and the `Kid` contract have not changed. Exactly three fictional students remain the default.

## Three directions

| Direction | Map and awards | Strength | Trade-off |
|---|---|---|---|
| **A. Navy award landscape — recommended** | Navy background, softly lit blue land, darker extruded sides and fine province seams. Gold/silver/bronze medals with blue ribbons; a cup-shaped special award. | Strong contrast makes the whole map striking, then makes each award worth approaching. Uses colors already recorded from Hamsterhub. | A dark treatment needs explicit review against the host site; bronze needs a lighter rim so it remains visible. |
| **B. Daylight enamel map** | Pale blue surroundings, porcelain-like provinces, crisp enamel medals and restrained shadows. | Closest to the existing demo and its bright host palette. Clear, friendly and inexpensive to refine. | Less dramatic. Material, depth and framing must do more of the work. |
| **C. Miniature trophy landscape** | Small sculptural trophies and medals physically mounted above province anchors, with consistent lighting and contact shadows. | Strongest sense of a collectible 3D world. Award shape remains meaningful while orbiting. | Geometry, materials, model licensing, instancing and occlusion make this a larger scene change. Do not assume downloaded models meet the performance budget. |

Do not mix all three treatments. A coherent land material, a single light direction and a consistent award family will read better than unrelated asset packs.

## What was actually browsed

All live pages below were opened through Computer Use on 2026-11-18, one page at a time. Screenshots were visually inspected for the map, Spark Badge, the IconScout grid and bronze detail, Lucide trophy, and Magic UI Shine Border. No assets were downloaded, bought or incorporated; no catalogue integration or package was installed.

| Source | Observed evidence | Useful contribution | Reuse status |
|---|---|---|---|
| [MapTiler Xmas showcase](https://www.maptiler.com/showcase/xmas/) | Angled pale terrain against a deep navy sea, readable labels, a small 3D character, compact controls and a showcase panel. This visit rendered southern Vietnam. | Geographic depth, a quiet surrounding field and one clear subject within the map. Keep Thailand's existing silhouette and province geometry. | Visual inspiration only. No tile, artwork or character reuse. Walking and camera easing were not measured. |
| [21st.dev badge catalogue](https://21st.dev/community/components?q=badge), especially [Spark Badge by ThreeUI](https://21st.dev/@mengto/components/spark-badge) | The live preview rendered a black rain/particle field inside an oversized scrolling frame. The page described an animated credential badge. Other catalogue results included Animated Badge and Streak Badge. | Useful discovery source for interaction ideas, but this particular preview did not provide a suitable medal treatment. | Do not import this effect. Individual component licenses were not verified. A catalogue listing does not grant permission to reuse all entries. |
| [IconScout medal catalogue](https://iconscout.com/3d-icons/gold-silver-bronze-medals) | The rendered grid included gold, silver and bronze medals, rosettes, trophies and podiums. Thick rims and simple star centers remained clear at thumbnail size. | Beveled metal, broad highlights, compact silhouettes and a distinct cup shape. Avoid numbers and podiums until ranking semantics are approved. | Asset options include free and premium items; the search-page heading is not proof that a chosen item is free. |
| [Bronze Medal by Barudak Lier](https://iconscout.com/3d-icon/bronze-medal-3d-icon_14056580), from [Achievement Badge pack](https://iconscout.com/3d-icon-pack/achievement-badge-3d-icon-pack_395608) | Detail preview showed a copper-bronze star medal with a scalloped edge and red/white hanging ribbon. The pack lists Gold Medal and Silver Medal siblings. Subscription download and a separate free **watermarked** PNG were shown. | Strong reference for the metal rim and recessed center. Our small map pins should use shorter ribbons and simpler detail. | Paid candidate, not acquired. [Digital License](https://iconscout.com/licenses#iconscout) permits website use, limits a license to one end product and forbids standalone/source redistribution. Review the selected deliverable before adding licensed files to Git. |
| [Lucide trophy](https://lucide.dev/icons/trophy) | A clear two-handled cup with stem and base; SVG/JSX export controls and size/stroke customizers. | A reliable silhouette reference or a lightweight SVG base for a special-award marker. Flat outline alone would need material styling to suit the scene. | [ISC license](https://lucide.dev/license), with copyright and permission notice retained if copied. No new runtime dependency is necessary for a single SVG. |
| [Magic UI Shine Border](https://magicui.design/docs/components/shine-border) | A narrow pink/purple shine around a login-card demo; docs expose color, width and duration. | Borrow the idea of a thin traveling highlight for the **selected** medal. Adapt the visual idea to one brief metallic glint. | Inspiration only. No component copied and its license was not inspected. Do not install a UI stack for this small effect. |

The sources answer different questions: MapTiler informs composition; IconScout informs materials; Lucide informs shape; Magic UI informs selection feedback. None supplies an approved Hamsterhub award system.

## Proposed visual treatment

Use the recorded navy `#16325b`, blues `#3894ff` / `#1b77ee` and yellow `#ffdc50` as the starting palette, not new brand tokens. Navy surrounds the land; lighter top faces and darker sides establish extrusion. Province seams stay quieter than awards. A soft static shadow grounds the map without requiring an animated ocean or full-screen postprocessing.

The award family shares thickness, ribbon proportions, light direction and outline weight:

| Artwork sample | Proposed distinction | Readability rule |
|---|---|---|
| Gold | Warm yellow metal, broad pale highlight, simple star center | Dark inner outline and blue ribbon |
| Silver | Cool light metal, slate recess and a different center engraving | Preserve an outline against pale land |
| Bronze | Copper-brown body, bright warm rim and a simple laurel center | Keep the rim bright against navy |
| Trophy | Two handles, a bowl, stem and compact base | Distinguish by silhouette, not extra glow or larger hit area |

Color alone must not convey the variant: use shape/engraving and an accessible name. Do not add “1”, “2”, “3”, winner labels, rank order or award eligibility based on student index or province.

For design demonstration, the three existing fictional students can show gold/silver/bronze **sample artwork** through a deterministic preview-only mapping. A separate explicit fixture may replace one sample with the trophy, retaining the same three students. Production records must continue to use the neutral decorative marker until real award meaning and data ownership are confirmed. The trophy is not a fourth student or an unearned status.

## Proposed click-to-award experience

1. **Overview:** Thailand fills the available viewport with generous edge clearance. Awards are easy to locate. Any ambient decoration uses the existing pause, visibility and reduced-motion rules; the land remains legible without it.
2. **Hover or keyboard focus:** show the existing student name, brighten the outline and lift only the inner artwork by a few pixels. Keep the clickable target stationary and at least 44px. These are proposed dimensions, not current measurements.
3. **Activate:** retain the selected identity, translate camera and target together toward its existing province-derived world position, and increase orthographic zoom. Preserve angle so the user understands where they moved. Reuse the current 240ms cubic ease-out first; tune only after observing the actual interaction. Drag, wheel, reset or another selection must cancel the preceding move.
4. **Arrive:** center the award with space for its name and controls. Land enlarges; separately scale only selected artwork modestly because current DOM badges do not grow with camera zoom. Show one short rim/glint accent, then settle. No card, avatar, sidebar or project panel appears in this slice.
5. **Explore or return:** another award retargets immediately. Repeated activation of the same award keeps its framing stable. Escape or background click clears selection without suddenly moving the camera; the existing reset control returns to the overview and clears selection.

Reduced motion applies the final camera state immediately and omits lift/glint animation. Keyboard activation uses the same destination without an animated flight. Keep focus associated with the selected award; camera completion must not steal modal focus in the separate explorer.

Clusters retain their count and existing zoom/fan-out behavior. When a fanned award is selected, target the underlying province-derived anchor, not its temporary screen offset. If travel collapses that fan, preserve selection and reveal the member again after arrival. Unknown, filtered or opted-out IDs must never create a focus destination.

## Feasibility and limits

[Camera source review](2026-11-18-camera-feasibility.md) found existing cancelable camera travel, zoom bounds of 1–8, dirty rendering, and clustering/fan-out. Individual selection currently changes the badge only. Orthographic zoom and viewport-aware framing are necessary; moving the camera closer alone will not enlarge the map. Dense fan-out and focus retention are the main correctness risks.

The smallest follow-up uses the existing scene, DOM award targets and local SVG/CSS artwork. It does not need MapTiler SDK, React Three Fiber, a shader package or an animation dependency. Actual 3D award models are direction C and need a separate scope decision. Presentation-only samples do not require a production `Kid` contract change; real awards do.

Future verification should cover a 320px viewport and desktop framing, repeated activation, interruption, Escape/reset, keyboard focus, reduced motion, dense fan-out, opt-out filtering and explorer regressions. This research did not run app tests, a development server or performance benchmarks. No new runtime result or visual parity is claimed.

## Handoff

- Branch: `research/award-map-direction`, based on `c65fbff`.
- Coordinator owns this reference note; the camera researcher wrote only its source-review file. No concurrent production writers are assigned.
- Claude is the designated scene/shared-file lead. Earlier bridge attempts failed with `ECONNREFUSED`; this study has no successful Claude review. Do not describe the proposed direction as lead-approved.
- Review question: choose A, B or C. Recommendation A keeps medals as clear screen-facing artwork; C explicitly adds true 3D award geometry.
- The user-invoked brainstorming skill requires approval of the short in-chat design before implementation. These notes preserve findings, not an implementation plan or an accepted product decision.
