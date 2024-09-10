import express from 'express';
import handleApiCall from './controller.js';
import cleanUpRegistry from '../../middleware/cleanUpServerRegistry.js';

const callRouter = express.Router();

// http://baseURL/api/:service-name/:service-key..../service-key-n?filter=1+2&filter=3+4...

callRouter.all('/*', cleanUpRegistry, handleApiCall);

export default callRouter;