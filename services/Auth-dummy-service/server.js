import express from "express";
import axios from "axios";

const PORT = 3000;
const URL = "http://localhost";

const app = express();

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
  register();
})

async function register() {
  await axios.post( 'http://localhost:5000/api/register',{
      api_name: "dummy_service_1",
      api_key: "/get",
      endpoint: "/health",
      base_url: "http://localhost",
      port: 3000,
      access_type: "all"
  }, {
    headers: {
      'Content-type': 'application/json'
    }
  }).catch((error) => {
    console.log(error);
  })
}

function unregister() {

}