import express from "express";

import registrar from "./register-service/registrar.js";

const PORT = 3000;
const URL = "http://localhost";

const app = express();
const service = registrar();

app.get("/health", (req,res) => {
  console.log(req.query)
  return res.status(200).json({res: "Login Service is running is running"});
})

app.post("/login", (req, res) => {
  const received = {
    data : req.body.data,
  }
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
