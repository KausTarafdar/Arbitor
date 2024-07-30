import { createServiceWithInfo } from "../DB/QueryServiceDB.js";
import checkEmptyBody from "../utils/checkEmptyBody.js";
import validateBody from "../utils/validateBody.js";
export async function handleCreateService(req, res) {
  try {
    if(
      checkEmptyBody(req) &&
      validateBody(req.body, ['serviceName', 'port', 'method', 'endpoint', 'access'], portIntCheck)
    ){
      return res.status(200).json(req.body);
    }

    return res.status(400).json({ Error: "Request body invalid" });
  
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
}

//Extra validation to check if port is an Integer value.
function portIntCheck(body) {
  const port = body.port;
  return Number.isInteger(port) ? true : false;
}