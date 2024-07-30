import axios from "axios";
import { fetchServiceInfo } from "../DB/QueryServiceDB.js";

export async function handleServiceCall (req, res) {
  try {
    const serviceID = req.params.serviceId; 
    let data = undefined;
    
    if(!serviceID){
      return res.status(300).json({ Error: "Service id not provided" });
    }

    const serviceInfo = await fetchServiceInfo(serviceID);
    
    if(req.body && serviceInfo[0].method === "post"){
      data = req.body;
    }
    const response = await requestForwarding(serviceInfo[0], data);
    res.status(200).json(response.data); 
  } catch(err) {
    console.log(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
}

async function requestForwarding(serviceInfo, data) {
  const response = await axios({
    method: serviceInfo.method,
    url: "http://localhost:" + serviceInfo.port + "/",
    data: data,
  });
  return response;
}