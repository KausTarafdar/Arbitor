import express from 'express';
import handleApiCall from './controller.js';

const callRouter = express.Router();

// http://baseURL/api/call?filter=1+2&filter=3+4...

//Check routing issue
callRouter.all('/:api_name/:api_key', handleApiCall);

export default callRouter;