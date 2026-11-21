import { test } from "node:test";
import assert from "node:assert/strict";
import { graphemes, typedPrefix } from "./typewriter";

test("Thai vowels and tone marks stay attached to their consonant", () => {
  // "น้ำ" is three code points (น + ้ + ำ) but one user-perceived character.
  const word = "น้ำ";
  assert.equal([...word].length, 3);
  assert.deepEqual(graphemes(word), [word]);
  assert.equal(typedPrefix("น้ำใจ", 1), "น้ำ");
});

test("every prefix is a real prefix and never ends on a dangling combining mark", () => {
  const text = "ไปดูผู้ได้รับรางวัลในจังหวัดกรุงเทพมหานคร";
  const total = graphemes(text).length;
  const combining = /[ัิ-ฺ็-๎]$/; // Thai above/below vowels and tone marks
  for (let n = 1; n <= total; n++) {
    const part = typedPrefix(text, n);
    assert.ok(text.startsWith(part), `prefix ${n} is a real prefix`);
    // A combining mark may end a prefix only when its consonant is already inside the same grapheme.
    if (combining.test(part)) assert.ok(graphemes(part).length === n, `prefix ${n} keeps its marks inside a grapheme`);
  }
  assert.equal(typedPrefix(text, total + 10), text);
  assert.equal(typedPrefix(text, 0), "");
  assert.equal(typedPrefix(text, -2), "");
});

test("mixed Thai and Latin text types the Latin word one letter at a time", () => {
  const parts = graphemes("จังหวัดBangkok");
  assert.equal(parts.slice(-7).join(""), "Bangkok");
  assert.equal(parts.slice(-7).length, 7);
});
