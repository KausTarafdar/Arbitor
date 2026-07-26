import express from 'express';
import handleGetLogs from './controller.js';

const logsRouter = express.Router();

// GET /_logs?level=access|error&limit=50
logsRouter.get('/', handleGetLogs);

export default logsRouter;
