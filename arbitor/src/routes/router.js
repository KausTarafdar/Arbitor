import express from 'express';

import callRouter from './call/index.js';
import registerRouter from './register/index.js';
import cleanUpRegistry from '../middleware/cleanUpServerRegistry.js';

const router = express.Router();

router.use('/', cleanUpRegistry, callRouter);
router.use('/register', registerRouter);

export default router;