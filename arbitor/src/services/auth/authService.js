import crypto from 'node:crypto';

import { SessionRepository } from "../../models/dbAccess.js";

const sessionRepository = new SessionRepository();
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

const ADMIN_USER = process.env.ARBITOR_ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ARBITOR_ADMIN_PASSWORD || "arbitor";

/**
 * Minimal, opt-in gateway auth: a single admin credential pair (configurable
 * via env) that issues opaque bearer tokens. This is demo-grade auth - there
 * is no user table, password hashing, or rate limiting - meant to show how a
 * gateway could gate access to "private" services and admin endpoints, not
 * to be a production identity system.
 */
export async function login(username, password) {
  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    throw new Error("Invalid credentials");
  }

  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await sessionRepository._createSession(token, expiresAt);

  return { token, expires_at: expiresAt };
}

export async function logout(token) {
  if (!token) throw new Error("Missing token");
  await sessionRepository._deleteSession(token);
}

export async function isValidToken(token) {
  if (!token) return false;
  const session = await sessionRepository._findValidSession(token);
  return session.length > 0;
}
