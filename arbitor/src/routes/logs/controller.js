import { LogRepository } from "../../models/dbAccess.js";
import { logError } from "../../services/logger/index.js";
import { sendError } from "../../utils/errors.js";

const logRepository = new LogRepository();

export default async function handleGetLogs(req, res) {
  try {
    const level = ["access", "error"].includes(req.query.level) ? req.query.level : undefined;
    const limitParam = parseInt(req.query.limit, 10);
    const limit = Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 500 ? limitParam : 50;

    const logs = await logRepository._list({ level, limit });

    return res.status(200).json({ count: logs.length, logs });
  } catch (err) {
    await logError(err, req);
    return sendError(res, err);
  }
}
