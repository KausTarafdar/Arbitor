import chalk from "chalk";

import { LogRepository } from "../../models/dbAccess.js";

const logRepository = new LogRepository();

function normalizeIp(rawIp) {
  if (typeof rawIp !== "string") return rawIp;
  if (rawIp.startsWith("::ffff:")) return rawIp.slice(7);
  if (rawIp === "::1") return "localhost";
  return rawIp;
}

async function persist(entry) {
  try {
    await logRepository._insertLog(entry);
  } catch (err) {
    // Logging must never be the reason a request fails.
    console.log(chalk.red(`Log persistence failed: ${err.message}`));
  }
}

/** Logs every request to the console and, once it finishes, to the queryable `logs` table. */
export function logMiddleware(req, res, next) {
  const ip = normalizeIp(req.ip);
  const start = process.hrtime.bigint();

  console.log(chalk.greenBright('\nRequest Logged'));
  console.log(chalk.blueBright(`${req.method} :: ${ip}${req.path} :: ${new Date().toUTCString()}`));
  console.log(chalk.magenta('user agent: ', chalk.yellowBright(req.headers['user-agent'])));

  res.on('finish', () => {
    const durationMs = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
    persist({
      level: 'access',
      method: req.method,
      path: req.originalUrl,
      status_code: res.statusCode,
      ip,
      duration_ms: durationMs,
      message: null,
    });
  });

  next();
};

/** Logs a caught error to the console and to the queryable `logs` table. */
export async function logError(err, req) {
  console.log(chalk.redBright(`\nError: ${err.message}`));
  await persist({
    level: 'error',
    method: req?.method ?? null,
    path: req?.originalUrl ?? null,
    status_code: null,
    ip: normalizeIp(req?.ip),
    duration_ms: null,
    message: err.message,
  });
}
