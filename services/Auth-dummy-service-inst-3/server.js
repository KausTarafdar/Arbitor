import express from "express";

import registrar from "./register-service/registrar.js";

const PORT = 3004;
const URL = "http://localhost";

const app = express();
const service = registrar();

app.use(express.json());

app.get("/health", (req,res) => {
  console.log(req.path);
  return res.status(200).json({res: "Login Service is running is running"});
})

app.post("/login", (req, res) => {
  console.log(req.path);
  const received = req.body;

  return res.status(200).json({
    res: "User logged in",
    data: received,
  })
})

app.get("/logout/:id", (req, res) => {
  return res.status(200).json({
    res: "User logged out",
    data: req.params.id,
  })
})

app.listen(PORT, () => {
  console.log(`Service listening at ${URL}:${PORT}`);
  service.registerToGateway();
})
