import { deleteService, fetchServiceInfo } from "../DB/QueryServiceDB.js";

export async function handleDeleteService(req, res) {
  try {
    if(
      req.params.serviceId &&
      await checkExistence(req.params.serviceId)
    ) {
      return res.status(200).json({ Name: req.params.serviceId });
    }
    return res.status(400).json({ Error: "Service ID invalid" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
}

async function checkExistence(serviceName) {
  try {
    await fetchServiceInfo(serviceName);
    return true;
  } catch (err) {
    return false;
  }
}