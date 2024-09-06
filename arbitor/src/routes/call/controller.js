import { ServiceCall } from "../../dto/api.js";
import ServiceRepository from "../../models/dbAccess.js";
import API_routing from "../../services/api_router/apiRouter.js";
import ServiceRegistry from "../../services/service_registry/serviceRegistry.js";
import generateQueryString from "../../utils/generateQueryString.js";


const serviceRepository = new ServiceRepository();
const serviceRegistry = new ServiceRegistry({
  service : serviceRepository,
});

export default async function handleApiCall(req, res) {

  try {
    //Get the exact service called for
    const serviceCall = new ServiceCall({
      api_name : req.params.api_name,
      api_key : `/${req.params.api_key}`,
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
    const response = serviceRouter.callService();

    console.log(response);
    return res.status(200).json({
      res: response
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      Error : "Internal server error"
    })
  }
}
