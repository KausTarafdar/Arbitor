import { test } from 'node:test';
import assert from 'node:assert/strict';

import generateQueryString from '../../src/utils/generateQueryString.js';

test('builds a query string from an object', () => {
  assert.equal(generateQueryString({ a: '1', b: '2' }), '?a=1&b=2');
});

test('returns just "?" for an empty object', () => {
  assert.equal(generateQueryString({}), '?');
});

test('replaces spaces in values with +', () => {
  assert.equal(generateQueryString({ q: 'hello world' }), '?q=hello+world');
});
