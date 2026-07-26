import { isValidToken } from "../services/auth/authService.js";
import { UnauthorizedError, sendError } from "../utils/errors.js";

function extractToken(req) {
  const header = req.headers['authorization'] || '';
  const [scheme, token] = header.split(' ');
  return (scheme === 'Bearer' && token) ? token : null;
}

/** @returns {Promise<Boolean>} whether the request carries a valid bearer token */
export async function isAuthenticated(req) {
  return isValidToken(extractToken(req));
}

/** Express middleware form of isAuthenticated, for routes that always require auth. */
export default async function requireAuth(req, res, next) {
  if (await isAuthenticated(req)) return next();
  return sendError(res, new UnauthorizedError("Unauthorized"));
}
