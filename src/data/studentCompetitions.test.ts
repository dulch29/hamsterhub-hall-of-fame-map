import assert from "node:assert/strict";
import { test } from "node:test";
import { generateMockKids } from "../mock/generate";
import { DEMO_AWARDS, resolveAwardGroups, type AwardAssociation } from "./demoAwards";
import { studentCompetitions } from "./studentCompetitions";
import { createReviewScaleFixture } from "../mock/reviewScale";
import { parseLocalPreview } from "./localPreview";

test("competition order uses explicit featured and manual priority, independently of definition order", () => {
  const kids = generateMockKids();
  const entries: AwardAssociation[] = [
    { kidId: kids[0]!.id, awardId: "creative", priority: 9 },
    { kidId: kids[0]!.id, awardId: "maker", priority: 1 },
    { kidId: kids[0]!.id, awardId: "explorer", featured: true, priority: 20 },
  ];
  for (const definitions of [DEMO_AWARDS, [...DEMO_AWARDS].reverse()]) {
    const group = resolveAwardGroups(kids, definitions, entries)[0]!;
    assert.deepEqual(studentCompetitions(group, kids[0]!.id).map((entry) => entry.award.id), ["explorer", "maker", "creative"]);
  }
});

test("project and ordered media use only the student's explicit competition association", () => {
  const kids = generateMockKids();
  const entries = [{ kidId: kids[0]!.id, awardId: "creative", projectId: kids[0]!.projects[0]!.id,
    slides: [{ url: "/demo/project-2.svg", alt: "Second image first" }, { url: "/demo/project-1.svg", alt: "First image second" }],
    presentationUrl: "https://example.invalid/presentation.pdf" }];
  const group = resolveAwardGroups(kids, DEMO_AWARDS, entries)[0]!;
  const [entry] = studentCompetitions(group, kids[0]!.id);
  assert.equal(entry?.project?.id, kids[0]!.projects[0]!.id);
  assert.deepEqual(entry?.slides, entries[0]!.slides);
  assert.equal(entry?.presentationUrl, entries[0]!.presentationUrl);
});

test("missing, stale and cross-student project links never fall back to featured projects", () => {
  const kids = generateMockKids();
  const group = resolveAwardGroups(kids, DEMO_AWARDS, [
    { kidId: kids[0]!.id, awardId: "creative" },
    { kidId: kids[0]!.id, awardId: "maker", projectId: "deleted" },
    { kidId: kids[0]!.id, awardId: "explorer", projectId: kids[1]!.projects[0]!.id },
  ])[0]!;
  const entries = studentCompetitions(group, kids[0]!.id);
  assert.equal(entries.length, 3);
  assert.ok(entries.every((entry) => entry.project === null));
});

test("duplicate curation stays unset and unknown, hidden or other-province people cannot borrow a competition", () => {
  const kids = generateMockKids();
  const group = resolveAwardGroups(kids, DEMO_AWARDS, [
    { kidId: kids[0]!.id, awardId: "creative", projectId: kids[0]!.projects[0]!.id },
    { kidId: kids[0]!.id, awardId: "creative", projectId: "conflict", priority: 1 },
  ])[0]!;
  assert.equal(studentCompetitions(group, kids[0]!.id)[0]?.project, null);
  assert.deepEqual(studentCompetitions(group, kids[1]!.id), []);
  assert.deepEqual(studentCompetitions(group, "missing"), []);
  kids[0]!.showOnMap = false;
  assert.deepEqual(studentCompetitions(group, kids[0]!.id), []);
});

test("unset priorities have deterministic ID order and resolution does not mutate its input", () => {
  const kids = generateMockKids();
  const group = resolveAwardGroups(kids, [...DEMO_AWARDS].reverse(), [
    { kidId: kids[0]!.id, awardId: "maker" }, { kidId: kids[0]!.id, awardId: "creative" },
  ])[0]!;
  const before = structuredClone(group);
  assert.deepEqual(studentCompetitions(group, kids[0]!.id).map((entry) => entry.award.id), ["creative", "maker"]);
  assert.deepEqual(group, before);
});

test("identical duplicate memberships preserve explicit curation", () => {
  const kids = generateMockKids();
  const entry = { kidId: kids[0]!.id, awardId: "creative", projectId: kids[0]!.projects[0]!.id };
  const group = resolveAwardGroups(kids, DEMO_AWARDS, [entry, { ...entry }])[0]!;
  assert.equal(studentCompetitions(group, kids[0]!.id)[0]?.project?.id, entry.projectId);
});

test("review export and reparse retain supplied owner competitions and media without inventing links", () => {
  const kids = generateMockKids();
  const associations = [{ kidId: kids[0]!.id, awardId: "creative", priority: 2 },
    { kidId: kids[0]!.id, awardId: "maker", featured: true, priority: 0,
      projectId: kids[0]!.projects[0]!.id, slides: [{ url: "/supplied.svg", alt: "Supplied" }], presentationUrl: "/supplied.pdf" }];
  const fixture = createReviewScaleFixture(kids[0]!, DEMO_AWARDS[0]!, associations, DEMO_AWARDS);
  const parsed = parseLocalPreview(fixture);
  const exported = parseLocalPreview({ kids: parsed.kids, awards: fixture.awards,
    associations: parsed.groups.flatMap((group) => group.competitionEntries ?? []), previews: parsed.previews });
  const entries = studentCompetitions(exported.groups[0]!, kids[0]!.id);
  assert.deepEqual(entries.map((entry) => entry.award.id), ["maker", "creative"]);
  assert.deepEqual(entries[0]?.slides, associations[1]!.slides);
  assert.equal(entries[0]?.presentationUrl, "/supplied.pdf");
  assert.equal(entries[1]?.project, null);
});
