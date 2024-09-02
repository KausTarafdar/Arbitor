import express from 'express';

import callRouter from './call/index.js';
import registerRouter from './register/index.js';

const router = express.Router();

router.use('/call', callRouter);
router.use('/register',registerRouter);

export default router;