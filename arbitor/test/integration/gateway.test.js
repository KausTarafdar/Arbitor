import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';

const execFileAsync = promisify(execFile);

// Real Postgres required: `docker-compose up -d postgres` (exposes 5432 on
// the host) or any Postgres reachable with these credentials.
const DB_USER = process.env.DB_USER || 'arbitor';
const DB_PASSWORD = process.env.DB_PASSWORD || 'arbitor';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_NAME = process.env.DB_NAME || 'arbitor';
const DATABASE_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const GATEWAY_PORT = process.env.TEST_GATEWAY_PORT || '5999';
const GATEWAY_URL = `http://localhost:${GATEWAY_PORT}`;
// User-dummy-service hardcodes its own listen port (unlike Auth-dummy-service,
// which is env-configurable) - this must match services/User-dummy-service/server.js.
const SERVICE_PORT = '3002';

const ARBITOR_DIR = fileURLToPath(new URL('../../', import.meta.url));
const SERVICES_DIR = path.join(ARBITOR_DIR, '..', 'services');

let gatewayProcess;
let serviceProcess;
let dbClient;

async function waitForResponse(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let lastErr;
  while (Date.now() < deadline) {
    try {
      await fetch(url);
      return;
    } catch (err) {
      lastErr = err;
      await sleep(200);
    }
  }
  throw new Error(`Timed out waiting for ${url}: ${lastErr?.message}`);
}

async function login() {
  const res = await fetch(`${GATEWAY_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'arbitor' }),
  });
  const { token } = await res.json();
  return token;
}

before(async () => {
  await execFileAsync('npx', ['node-pg-migrate', 'up'], {
    cwd: ARBITOR_DIR,
    env: { ...process.env, DATABASE_URL },
  });

  dbClient = new pg.Client({ user: DB_USER, password: DB_PASSWORD, host: DB_HOST, port: DB_PORT, database: DB_NAME });
  await dbClient.connect();
  await dbClient.query('TRUNCATE services, flagged_services, logs, sessions RESTART IDENTITY');

  gatewayProcess = spawn('node', ['src/gateway.js'], {
    cwd: ARBITOR_DIR,
    env: {
      ...process.env,
      PORT: GATEWAY_PORT,
      URL: 'http://localhost',
      DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME,
      ARBITOR_ADMIN_USER: 'admin',
      ARBITOR_ADMIN_PASSWORD: 'arbitor',
    },
    stdio: 'ignore',
  });
  await waitForResponse(GATEWAY_URL);

  serviceProcess = spawn('node', ['User-dummy-service/server.js'], {
    cwd: SERVICES_DIR,
    env: {
      ...process.env,
      PORT: SERVICE_PORT,
      SERVICE_BASE_URL: 'http://localhost',
      GATEWAY_URL: `${GATEWAY_URL}/register`,
    },
    stdio: 'ignore',
  });

  // Give the dummy service time to boot and self-register all its routes.
  await sleep(1500);
});

after(async () => {
  gatewayProcess?.kill();
  serviceProcess?.kill();
  await dbClient?.end();
});

test('a self-registered service is reachable through the gateway', async () => {
  const res = await fetch(`${GATEWAY_URL}/api/proto_user/health`);
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.ok(body.res);
});

test('calling an unregistered service returns 404 with a structured error body', async () => {
  const res = await fetch(`${GATEWAY_URL}/api/does_not_exist/nope`);
  assert.equal(res.status, 404);

  const body = await res.json();
  assert.equal(body.error.message, 'No matched api');
});

test('registering a duplicate route is a no-op, not an error', async () => {
  const payload = {
    api_name: 'proto_user',
    api_key: '/health',
    endpoint: '/health',
    base_url: 'http://localhost',
    port: SERVICE_PORT,
    access_type: 'public',
  };
  const res = await fetch(`${GATEWAY_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.match(body.res, /already exists/);
});

test('registering with a malformed body returns a 400 validation error', async () => {
  const res = await fetch(`${GATEWAY_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_name: 'incomplete' }),
  });
  assert.equal(res.status, 400);
});

test('login issues a token; the token authorizes /_logs; logout revokes it', async () => {
  const unauthed = await fetch(`${GATEWAY_URL}/_logs`);
  assert.equal(unauthed.status, 401);

  const badLogin = await fetch(`${GATEWAY_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrong' }),
  });
  assert.equal(badLogin.status, 401);

  const token = await login();
  assert.ok(token);

  const authed = await fetch(`${GATEWAY_URL}/_logs`, { headers: { Authorization: `Bearer ${token}` } });
  assert.equal(authed.status, 200);
  const { logs } = await authed.json();
  assert.ok(Array.isArray(logs) && logs.length > 0);

  const logoutRes = await fetch(`${GATEWAY_URL}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(logoutRes.status, 200);

  const afterLogout = await fetch(`${GATEWAY_URL}/_logs`, { headers: { Authorization: `Bearer ${token}` } });
  assert.equal(afterLogout.status, 401);
});

test('a "private" route requires auth; a "public" one does not', async () => {
  await fetch(`${GATEWAY_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_name: 'secret_service',
      api_key: '/secret-health',
      endpoint: '/health',
      base_url: 'http://localhost',
      port: SERVICE_PORT,
      access_type: 'private',
    }),
  });

  const unauthed = await fetch(`${GATEWAY_URL}/api/secret_service/secret-health`);
  assert.equal(unauthed.status, 401);

  const token = await login();
  const authed = await fetch(`${GATEWAY_URL}/api/secret_service/secret-health`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(authed.status, 200);
});

test('failover: a call still succeeds when one of two registered instances is dead', async () => {
  await dbClient.query('DELETE FROM services WHERE api_name = $1', ['failover_test']);
  await fetch(`${GATEWAY_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_name: 'failover_test', api_key: '/ping', endpoint: '/health',
      base_url: 'http://localhost', port: SERVICE_PORT, access_type: 'public',
    }),
  });
  await fetch(`${GATEWAY_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Nothing listens on this port - simulates a dead instance.
      api_name: 'failover_test', api_key: '/ping', endpoint: '/health',
      base_url: 'http://localhost', port: '6099', access_type: 'public',
    }),
  });

  const res = await fetch(`${GATEWAY_URL}/api/failover_test/ping`);
  assert.equal(res.status, 200);
});
