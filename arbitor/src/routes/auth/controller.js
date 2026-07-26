import { login, logout } from "../../services/auth/authService.js";
import { logError } from "../../services/logger/index.js";
import { sendError } from "../../utils/errors.js";

export async function handleLogin(req, res) {
  try {
    const { username, password } = req.body || {};
    const session = await login(username, password);
    return res.status(200).json({ res: "Logged in", ...session });
  } catch (err) {
    await logError(err, req);
    return sendError(res, err);
  }
}

export async function handleLogout(req, res) {
  try {
    const header = req.headers['authorization'] || '';
    const [, token] = header.split(' ');
    await logout(token);
    return res.status(200).json({ res: "Logged out" });
  } catch (err) {
    await logError(err, req);
    return sendError(res, err);
  }
}
