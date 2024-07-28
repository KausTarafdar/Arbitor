import express from "express";
import dotenv from "dotenv";

import router from "./routes/index.js";
import { logHandler } from "./logger/loggerHelper.js";
import { ConnectToDB } from "./DB/ServiceDBConnection.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const URL = process.env.URL;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', logHandler, router);

app.listen(PORT, async () => {
  console.log(`Gateway listening at ${URL}:${PORT}`);
  ConnectToDB();
})