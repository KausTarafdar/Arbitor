import express from "express";

import registrar from "./register-service/registrar.js";

const PORT = 3002;
const URL = "http://localhost";

const app = express();
const service = registrar();

app.get("/health", (req,res) => {
  console.log(req.query)
  return res.status(200).json({res: "User data service is running"});
})

app.post("/friends", (req, res) => {
  const received = {
    data : req.body.data,
  }
  return res.status(200).json({
    res: received
  })
})

app.put("/groups", (req, res) => {
  const groups = {
    "Groups" : "Database array",
  }
  return res.status(200).json({
    res: "User Groups",

  })
})

app.delete("/delete/group", (req, res) => {
  return res.status(200).json({
    res: `Delete from group user ${req.query.id}`
  })
});

app.listen(PORT, () => {
  console.log(`Service listening at ${URL}:${PORT}`);
  service.registerToGateway();
})
