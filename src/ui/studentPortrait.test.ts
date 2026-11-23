import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createDiscoveryDemo } from "../mock/discovery";
import { CharacterGuides } from "./CharacterGuides";
import { initialsFor } from "./PinCard";
import { resolveStudentPortrait } from "./studentPortrait";

test("resolveStudentPortrait maps demo SVGs, respects portraitUrl override, and preserves null", () => {
  const { kids } = createDiscoveryDemo();
  assert.equal(resolveStudentPortrait(kids[0]!), "/demo/student-1.svg");
  assert.equal(resolveStudentPortrait(kids[1]!), "/demo/student-2.svg");
  assert.equal(resolveStudentPortrait(kids[2]!), null);
  assert.equal(resolveStudentPortrait(kids[0]!, "/__local-preview/portrait.png"), "/__local-preview/portrait.png");
});

test("CharacterGuides keeps hamster on map during competition when student presenter is disabled", () => {
  const { kids, groups } = createDiscoveryDemo();
  const group = groups[0]!;
  const kid = kids[2]!; // avatarUrl: null
  const html = renderToStaticMarkup(createElement(CharacterGuides, {
    groups,
    group,
    studentId: kid.id,
    competitionId: "ocean",
    student: {
      id: kid.id,
      name: kid.displayName,
      portraitUrl: resolveStudentPortrait(kid),
      initials: initialsFor(kid.displayName),
      projectTitle: "Space Garden",
    },
    showAll: false,
    anchor: null,
    exiting: false,
    dataset: "default",
    onTarget() {},
  }));

  assert.match(html, /data-scene="student-solo"/);
  assert.match(html, /class="explainer" data-visible="true"/);
  assert.equal(html.includes("class=\"student-presenter\""), false);
  assert.equal(html.includes("presentation-guide-text"), false);
});
