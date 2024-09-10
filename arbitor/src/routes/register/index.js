import express from 'express';
import handleRegister from './controller.js';
import cleanUpRegistry from '../../middleware/cleanUpServerRegistry.js';

const registerRouter = express.Router();

registerRouter.post('/', cleanUpRegistry, handleRegister);

export default registerRouter;