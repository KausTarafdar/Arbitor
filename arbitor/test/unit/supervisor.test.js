import { test } from 'node:test';
import assert from 'node:assert/strict';

import Supervisor from '../../src/services/health_checker/supervisor.js';

function makeRegistry(overrides = {}) {
  return {
    getTopFlaggedService: async () => [],
    deleteFlaggedService: async () => true,
    deleteApiInstance: async () => true,
    flagService: async (flaggedService) => flaggedService,
    ...overrides,
  };
}

test('janitor is a no-op when nothing is flagged', async () => {
  const registry = makeRegistry({ getTopFlaggedService: async () => [] });
  const supervisor = new Supervisor(registry, async () => { throw new Error('httpClient should not be called'); });

  const result = await supervisor.janitor();

  assert.equal(result, 0);
});

test('janitor restores a flagged service that answers healthy', async () => {
  let flagRemoved = false;
  const registry = makeRegistry({
    getTopFlaggedService: async () => [{ api_name: 'x', base_url: 'http://x', port: '3000' }],
    deleteFlaggedService: async () => { flagRemoved = true; return true; },
  });
  const supervisor = new Supervisor(registry, async () => ({ status: 200 }));

  await supervisor.janitor();

  assert.equal(flagRemoved, true);
});

// Regression test for a real bug: the janitor used to only deregister on
// error.code === "ECONNREFUSED", so a fully-stopped/removed container
// (which fails with ENOTFOUND instead) was never deregistered.
test('janitor deregisters a flagged service on any httpClient failure, not just ECONNREFUSED', async () => {
  let instanceDeleted = false;
  let flagRemoved = false;
  const registry = makeRegistry({
    getTopFlaggedService: async () => [{ api_name: 'x', base_url: 'http://x', port: '3000' }],
    deleteApiInstance: async () => { instanceDeleted = true; return true; },
    deleteFlaggedService: async () => { flagRemoved = true; return true; },
  });
  const enotfoundError = Object.assign(new Error('getaddrinfo ENOTFOUND x'), { code: 'ENOTFOUND' });
  const supervisor = new Supervisor(registry, async () => { throw enotfoundError; });

  await supervisor.janitor();

  assert.equal(instanceDeleted, true);
  assert.equal(flagRemoved, true);
});

test('surveyor flags a service via the registry', async () => {
  let flaggedName;
  const registry = makeRegistry({
    flagService: async (flaggedService) => { flaggedName = flaggedService.serviceName; return flaggedService; },
  });
  const supervisor = new Supervisor(registry);

  await supervisor.surveyor({ id: 1, api_name: 'proto_login', base_url: 'http://auth-1', port: '3000' });

  assert.equal(flaggedName, 'proto_login');
});
