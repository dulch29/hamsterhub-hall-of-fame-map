import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateMockKids } from '../mock/generate';
import { createLongNameKid } from '../mock/fixtures';
import { initialsFor, PinCard } from './PinCard';

const render = (kid = createLongNameKid()) =>
  renderToStaticMarkup(createElement(PinCard, { kid, onClose() {} }));

test('card heading labels its dialog and missing avatars use initials', () => {
  const html = render();
  const labelId = html.match(/aria-labelledby="([^"]+)"/)?.[1];
  assert.ok(labelId);
  assert.ok(html.includes(`<h2 id="${labelId}">`));
  assert.ok(html.includes(createLongNameKid().displayName));
  assert.ok(html.includes('MF</span>'));
  assert.equal(html.includes('<img'), false);
  assert.equal(initialsFor(''), '?');
  assert.equal(initialsFor('  '), '?');
  assert.equal(initialsFor('🌱 Mali'), '🌱M');
  assert.equal(initialsFor('มาลี ทดสอบ'), 'มท');
});

test('card exposes only its featured project and safe links with new-tab context', () => {
  const html = render();
  assert.equal((html.match(/<a /g) ?? []).length, 2);
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, 2);
  assert.ok(html.includes('View project'));
  assert.ok(html.includes('See more'));
  assert.ok(html.includes('opens in a new tab'));
  assert.ok(html.includes('https://projects.example.invalid/fixture-long-name'));
});

test('unsafe destinations never become card anchors or images', () => {
  for (const url of ['javascript:alert(1)', '/profile/one', 'https://user:password@example.invalid/', 'http://example.invalid/']) {
    const kid = createLongNameKid();
    kid.profileUrl = url;
    kid.avatarUrl = url;
    kid.featuredProject!.url = url;
    kid.featuredProject!.thumbnailUrl = url;
    const html = render(kid);
    assert.equal(html.includes('<a '), false);
    assert.equal(html.includes('<img'), false);
  }
});

test('safe images have decorative alt text and no-referrer policy', () => {
  const kid = createLongNameKid();
  kid.avatarUrl = 'https://images.example.invalid/avatar.png';
  kid.featuredProject!.thumbnailUrl = 'https://images.example.invalid/project.png';
  const html = render(kid);
  assert.equal((html.match(/<img /g) ?? []).length, 2);
  assert.equal((html.match(/referrerPolicy="no-referrer"/gi) ?? []).length, 2);
  assert.equal((html.match(/alt=""/g) ?? []).length, 2);
});

test('missing project keeps the profile action and explicit empty state', () => {
  const html = render(generateMockKids()[2]!);
  assert.ok(html.includes('No featured project yet'));
  assert.equal(html.includes('View project'), false);
  assert.ok(html.includes('See more'));
});
