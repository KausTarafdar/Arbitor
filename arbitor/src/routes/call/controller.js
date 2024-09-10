import { ServiceCall } from "../../dto/api.js";
import { ServiceRepository, FlagServiceRepository } from "../../models/dbAccess.js";
import API_routing from "../../services/api_router/apiRouter.js";
import Supervisor from "../../services/health_checker/supervisor.js";
import ServiceRegistry from "../../services/service_registry/serviceRegistry.js";
import generateQueryString from "../../utils/generateQueryString.js";
import parseRequest from "../../utils/pathParser.js";


const serviceRepository = new ServiceRepository();
const flagServiceRepository = new FlagServiceRepository();
const serviceRegistry = new ServiceRegistry({
  service : serviceRepository,
  flagService : flagServiceRepository,
});

export default async function handleApiCall(req, res) {
  try {
    const path = parseRequest(req.path)
    const serviceCall = new ServiceCall({
      api_name : path.api_name,
      api_key : path.api_key,
      method : req.method,
      params : generateQueryString(req.query),
      body : req.body
    });
    const callRes = await serviceRegistry.searchApi(serviceCall);

    //Get the target service and call particular service
    const serviceRouter = new API_routing({
      services : callRes,
      userIp : (req.ip === '::1') ? '127.0.0.1' : req.ip,
      request : serviceCall,
    });

    serviceRouter.loadBalancer();
    const response = await serviceRouter.callService(new Supervisor(serviceRegistry));
    return res.status(200).json(response.data);

  } catch (err) {
    console.log("")
    console.log(err.message)
    return res.status(500).json({
      Error : "Internal Server Error"
    })
  }
}
