import assert from 'node:assert/strict';
import test from 'node:test';
import { safeExternalUrl } from './links';

test('preserves absolute web destinations including synthetic fixture domains', () => {
  assert.equal(safeExternalUrl('https://projects.example.invalid/work?q=1#demo'), 'https://projects.example.invalid/work?q=1#demo');
  assert.equal(safeExternalUrl('http://localhost:5173/profile/one'), 'http://localhost:5173/profile/one');
  assert.equal(safeExternalUrl('http://127.0.0.1:5173/'), 'http://127.0.0.1:5173/');
  assert.equal(safeExternalUrl('http://[::1]:5173/'), 'http://[::1]:5173/');
});

test('rejects executable, relative, malformed, and credential-bearing destinations', () => {
  for (const value of [
    null, undefined, '', ' ', '/profile/one', '//example.invalid/profile',
    'javascript:alert(1)', 'java\nscript:alert(1)', 'data:text/html,test',
    'file:///C:/test', 'mailto:test@example.invalid', 'https://',
    'https://user:password@example.invalid/profile',
    'http://example.invalid/profile', 'http://localhost.example.invalid/',
  ]) {
    assert.equal(safeExternalUrl(value), null, String(value));
  }
});
