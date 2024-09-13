import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import router from "./routes/router.js";
import { connectToDB } from "./DB/index.js";
import { logMiddleware } from "./services/logger/index.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const URL = process.env.URL;

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logMiddleware);
app.use('/', router);

app.listen(PORT, async () => {
  console.log(`Gateway listening at ${URL}:${PORT}`);
  await connectToDB();
})