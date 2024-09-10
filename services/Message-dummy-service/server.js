import express from "express";

import registrar from "./register-service/registrar.js";

const PORT = 3001;
const URL = "http://localhost";

const app = express();
const service = registrar();

app.get("/health", (req,res) => {
  console.log(req.query)
  return res.status(200).json({res: "Messages service is running"});
})

app.post("/message", (req, res) => {
  const message= {
    Message: req.body.message
  }
  return res.status(200).json({
    res: received,
    Message: message,
  })
})

app.get("/messages/:id", (req, res) => {
  const userID = {
    userId : req.params.id
  }
  return res.status(200).json({
    res: "Returned all messages",
    messages: "Database array",
  })
})

app.put("/message/:id", (req, res) => {
  const changes = {
    messageId : req.params.id
  }
  return res.status(200).json({
    res: "Changes message",
    messageId: changes
  })
})

app.listen(PORT, () => {
  console.log(`Service listening at ${URL}:${PORT}`);
  service.registerToGateway();
})
