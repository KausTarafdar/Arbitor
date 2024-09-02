import express from 'express';
import handleRegister from './controller.js';

const registerRouter = express.Router();

registerRouter.post('/', handleRegister);

export default registerRouter;