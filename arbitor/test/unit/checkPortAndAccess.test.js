import { test } from 'node:test';
import assert from 'node:assert/strict';

import checkPortAndAccess from '../../src/utils/checkPortAndAccess.js';
import { ValidationError } from '../../src/utils/errors.js';

test('accepts a string port with a public or private access_type', () => {
  assert.equal(checkPortAndAccess({ port: '3000', access_type: 'public' }), true);
  assert.equal(checkPortAndAccess({ port: '3000', access_type: 'private' }), true);
});

test('rejects a non-string port', () => {
  assert.throws(() => checkPortAndAccess({ port: 3000, access_type: 'public' }), ValidationError);
});

test('rejects an invalid access_type', () => {
  assert.throws(() => checkPortAndAccess({ port: '3000', access_type: 'admin' }), ValidationError);
});
