import express from "express";
import axios from "axios";

const PORT = 3000;
const URL = "http://localhost";

const app = express();

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