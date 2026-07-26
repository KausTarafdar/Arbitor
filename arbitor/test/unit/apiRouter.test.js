import { test } from 'node:test';
import assert from 'node:assert/strict';

import API_routing from '../../src/services/api_router/apiRouter.js';

function makeServices(n) {
  return Array.from({ length: n }, (_, i) => ({ id: i, base_url: `http://svc-${i}`, port: '3000' }));
}

test('loadBalancer includes every service exactly once', () => {
  const router = new API_routing({ services: makeServices(5), userIp: '10.0.0.1', request: {} });
  router.loadBalancer();

  assert.equal(router.targetServices.length, 5);
  assert.deepEqual(router.targetServices.map((s) => s.id).sort(), [0, 1, 2, 3, 4]);
});

test('loadBalancer is deterministic for the same IP and service list', () => {
  const router1 = new API_routing({ services: makeServices(5), userIp: '10.0.0.1', request: {} });
  router1.loadBalancer();

  const router2 = new API_routing({ services: makeServices(5), userIp: '10.0.0.1', request: {} });
  router2.loadBalancer();

  assert.deepEqual(
    router1.targetServices.map((s) => s.id),
    router2.targetServices.map((s) => s.id)
  );
});

test('loadBalancer spreads different client IPs across different primary targets', () => {
  const ips = Array.from({ length: 20 }, (_, i) => `10.0.0.${i + 1}`);
  const primaries = ips.map((ip) => {
    const router = new API_routing({ services: makeServices(3), userIp: ip, request: {} });
    router.loadBalancer();
    return router.targetServices[0].id;
  });

  // With 20 distinct IPs over 3 instances, seeing only one primary target
  // the whole time would indicate the hash ring isn't actually distributing load.
  assert.ok(new Set(primaries).size > 1, `expected more than one primary target, got ${JSON.stringify(primaries)}`);
});

test('loadBalancer handles a single service', () => {
  const router = new API_routing({ services: makeServices(1), userIp: '10.0.0.1', request: {} });
  router.loadBalancer();

  assert.deepEqual(router.targetServices.map((s) => s.id), [0]);
});
