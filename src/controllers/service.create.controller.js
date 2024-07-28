import checkEmptyBody from "../utils/checkEmptyBody.js";

export async function handleCreateService(req, res) {
  try {
    if(checkEmptyBody(req)){
      return res.status(200).json(req.body);
    } else {
      return res.status(400).json({ Error: "Request requires a body" });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ Error: "Internal server error" });
  }
}