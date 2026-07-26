import { isValidToken } from "../services/auth/authService.js";

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
  return res.status(401).json({ Error: "Unauthorized" });
}
