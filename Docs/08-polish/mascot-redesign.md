# Mascot redesign - phased plan (2026-11-21)

Owner brief (paraphrased): the plain map view (`map-preview province-preview`, not the list page) shows only the map,
the Hamster Hub brand mark and the mascots. Two 2D hamsters from the supplied turnaround sheets: **Guide** (orange, image 2)
and **Explainer** (grey with yellow cap, image 3). Front/side/back are flipped or swapped for walking.
The `is-directory` list page is deleted. Owner is away; after each phase: inspect, find polish spots, polish, inspect again.

## Phase 1 - done (commit 84710f4, polish e9f58ee)
- Only map + brand mark + Guide hamster on screen. Pause, zoom, rotate, mute, narration and credits stay in the DOM, shown on focus.
- Guide chat is a charcoal pill bar with a tail over the hamster, bent-arrow send button, empty-space click closes it, no clear button.
- Guide hamster wanders along the bottom with a two-frame walk and walks home when the chat opens.
- List page deleted; a failed map shows a province list with retry (`map-failure`).
- Decision recorded: map credits (CC BY) moved to `public/credits.txt`, linked from a focus-only link, because CC BY needs attribution.

## Phase 2 - Explainer and the student take over (this phase)
1. Explainer uses the cut-out sprites (`public/demo/explainer-*.png`): two walk frames while travelling, mirrored by travel direction.
2. Caption becomes a chat bubble with a typing effect (`useTypewriter`), a soft tick SFX that follows the existing mute and
   reduced-motion rules, and a small pop VFX when a line completes. Reduced motion shows the full line at once.
3. Text content comes only from catalog data (province name, recipient count, award titles). No invented province facts.
4. Flow: click a province -> Explainer walks in and says the general line -> bubbles/View all show the people ->
   click a person -> the student's portrait takes the Explainer's place and types the project description.
5. Guide asks before opening: when a chat reply carries a target the Guide says it will open it and the button appears;
   the user confirms with one tap (rule kept: nothing navigates without the user).

## Phase 3 - Guide and Explainer rivalry (not started)
- Guide opens the tour and walks to a medal. For awards/profiles Explainer "steals the scene" and the two argue.
- At the project step the student jumps between them and explains alone.
- On each new project click, both run to the province and a random one wins the explanation.

## Open decisions for the owner
- Fight scene content: whether the argument has text lines or is mime only.
- Sprite quality: sheets are 1536x1024 raster, so cut-outs have a thin light fringe; vector redraw is an option.
- Whether voice narration (Thai device speech) should read typed lines.
