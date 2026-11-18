# Original sculpted award set

Task 022, 2026-11-18. Source: `src/scene/awards.ts`.

The user approved a cohesive, chunky 3D set with rounded gold trophies,
beveled navy-enamel medals, embossed symbols and shaped ribbons. The current
sample data continues to show one trophy and gold/silver/bronze medals.

## Modeling and provenance

All shapes are original procedural geometry in this repository. No third-party
model, texture, logo or font is imported. Three.js and its bundled geometry
utilities use the existing locked dependency and license.

A focused asset search found a purported free stylized trophy pack on CGTrader.
Opening its result returned a 404, so availability and redistribution rights
could not be verified. It was not downloaded or incorporated. The original
set avoids an external asset dependency and matches the existing navy/metal map.

The trophy uses a smoothed lathe profile, rolled lip, curved tubular handles,
shaped stem, rounded navy plinth and gold plaque. Its enamel star seal follows
the sampled cup surface, preserving visible detail above/below the center.
Medals use beveled bodies, double rims, inset navy enamel, raised front stars,
modeled reverses and curved notched ribbon tails. Ribbon colors are baked into
vertex colors; the ribbons are stylized geometry, not simulated fabric.

## Cost and behavior

Gold/silver/bronze share two geometries. The trophy adds two more, for four
unique geometries and 7024 stored triangles across the set. Eight instanced
shape/material batches remain. There are no model fetches, texture fetches,
new runtime dependencies or new animation loops. Unique geometry is disposed
once, while instance buffers and owned materials are disposed individually.

The 15-degree rest, 280ms hover/tap turns, floating mains, compact inclined
companion orbits, pause/reduced motion, landing, province batching and existing
selection/accessible names remain. Sample artwork does not define real ranks.

See [the review record](../agents/exchanges/2026-11-18-premium-award-models.md)
for actual checks, visual evidence and review limitations.
