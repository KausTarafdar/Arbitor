import express from 'express';
import { handleLogin, handleLogout } from './controller.js';

const authRouter = express.Router();

// Optional gateway auth: obtain/invalidate a bearer token used to call
// "private" registered services and the /_logs admin endpoint.
authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);

export default authRouter;
