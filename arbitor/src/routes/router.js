import express from 'express';

import callRouter from './call/index.js';
import registerRouter from './register/index.js';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/api', callRouter);

export default router;