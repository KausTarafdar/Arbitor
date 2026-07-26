import express from 'express';

import callRouter from './call/index.js';
import registerRouter from './register/index.js';
import logsRouter from './logs/index.js';
import authRouter from './auth/index.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/api', callRouter);
router.use('/auth', authRouter);
// Log data is operational/admin info, so it's always behind auth (unlike
// registered services, which are only gated when access_type is "private").
router.use('/_logs', requireAuth, logsRouter);

export default router;