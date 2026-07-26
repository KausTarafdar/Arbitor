import express from 'express';

import callRouter from './call/index.js';
import registerRouter from './register/index.js';
import logsRouter from './logs/index.js';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/api', callRouter);
router.use('/_logs', logsRouter);

export default router;