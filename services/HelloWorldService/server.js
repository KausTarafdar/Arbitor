import express from "express";

const PORT = 3000;
const URL = "http://localhost";

const app = express();

app.get("/", (req,res) => {
  return res.status(200).json({res: "Hello from HelloWorldService"});
})

app.listen(PORT, () => {
  console.log(`Service listening at ${URL}:${PORT}`);
})
