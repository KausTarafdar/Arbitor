import { test } from 'node:test';
import assert from 'node:assert/strict';

import parseRequest from '../../src/utils/pathParser.js';

test('parseRequest splits a single-segment key from the service name', () => {
  assert.deepEqual(parseRequest('/proto_login/login'), {
    api_name: 'proto_login',
    api_key: '/login',
  });
});

test('parseRequest joins multi-segment keys back with slashes', () => {
  assert.deepEqual(parseRequest('/proto_user/user/exit/group'), {
    api_name: 'proto_user',
    api_key: '/user/exit/group',
  });
});

test('parseRequest falls back to "/" when there is no key segment', () => {
  assert.deepEqual(parseRequest('/proto_login'), {
    api_name: 'proto_login',
    api_key: '/',
  });
});
