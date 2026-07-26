import { test } from 'node:test';
import assert from 'node:assert/strict';

import ServiceRegistry from '../../src/services/service_registry/serviceRegistry.js';
import { NotFoundError } from '../../src/utils/errors.js';

function makeRegistry(overrides = {}) {
  return new ServiceRegistry({
    service: {
      _callService: async () => [],
      _findService: async () => [],
      _insertNewService: async () => [{ api_name: 'x' }],
      _deleteService: async () => ['deleted'],
      ...overrides.service,
    },
    flagService: {
      _flagService: async () => [{}],
      _findFlaggedService: async () => [],
      _deleteFlaggedService: async () => ({}),
      _topFlaggedService: async () => [],
      ...overrides.flagService,
    },
  });
}

test('searchApi returns matches when the repository finds any', async () => {
  const registry = makeRegistry({ service: { _callService: async () => [{ id: 1 }] } });
  const result = await registry.searchApi({});
  assert.deepEqual(result, [{ id: 1 }]);
});

test('searchApi throws NotFoundError when nothing matches', async () => {
  const registry = makeRegistry({ service: { _callService: async () => [] } });
  await assert.rejects(() => registry.searchApi({}), NotFoundError);
});

test('createApiInstance skips insertion when the service is already registered', async () => {
  let inserted = false;
  const registry = makeRegistry({
    service: {
      _findService: async () => [{ api_name: 'x' }],
      _insertNewService: async () => { inserted = true; return [{ api_name: 'x' }]; },
    },
  });

  const res = await registry.createApiInstance({ api_name: 'x' });

  assert.equal(inserted, false);
  assert.match(res.res, /already exists/);
});

test('createApiInstance inserts a new service when none is found', async () => {
  const registry = makeRegistry({
    service: {
      _findService: async () => [],
      _insertNewService: async () => [{ api_name: 'new-service' }],
    },
  });

  const res = await registry.createApiInstance({ api_name: 'new-service' });

  assert.match(res.res, /Added new service/);
});

test('flagService returns the existing flag instead of creating a duplicate', async () => {
  let flagCalls = 0;
  const registry = makeRegistry({
    flagService: {
      _findFlaggedService: async () => [{ id: 1 }],
      _flagService: async () => { flagCalls++; return [{ id: 1 }]; },
    },
  });

  const res = await registry.flagService({});

  assert.equal(flagCalls, 0);
  assert.deepEqual(res, { id: 1 });
});

test('flagService creates a flag when none exists yet', async () => {
  let flagCalls = 0;
  const registry = makeRegistry({
    flagService: {
      _findFlaggedService: async () => [],
      _flagService: async () => { flagCalls++; return [{ id: 2 }]; },
    },
  });

  const res = await registry.flagService({});

  assert.equal(flagCalls, 1);
  assert.deepEqual(res, [{ id: 2 }]);
});
