/** Thrown for malformed/missing request data (maps to HTTP 400). */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

/** Thrown when a lookup finds nothing (maps to HTTP 404). */
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

/** Thrown when a request lacks a valid bearer token (maps to HTTP 401). */
export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

/** Thrown when every target service instance is unreachable (maps to HTTP 503). */
export class ServiceUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServiceUnavailableError";
    this.statusCode = 503;
  }
}

/**
 * Sends a structured { error: { message } } response. Errors without a
 * statusCode are treated as unexpected internal errors: their real message
 * is logged (by the caller, via logError) but not leaked to the client.
 */
export function sendError(res, err) {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal Server Error" : err.message;
  return res.status(statusCode).json({ error: { message } });
}
