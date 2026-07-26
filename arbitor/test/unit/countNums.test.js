import { test } from 'node:test';
import assert from 'node:assert/strict';

import countNums from '../../src/utils/countNums.js';

test('countNums counts digit characters', () => {
  assert.equal(countNums('abc123'), 3);
  assert.equal(countNums('1a2b3c4d5e'), 5);
});

test('countNums returns 0 when there are no digits', () => {
  assert.equal(countNums('no digits here'), 0);
  assert.equal(countNums(''), 0);
});
