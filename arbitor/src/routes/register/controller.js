import { Service } from "../../dto/api.js";
import ServiceRepository from "../../models/dbAccess.js";
import ServiceRegistry from "../../services/service_registry/serviceRegistry.js";

const serviceRepository = new ServiceRepository();
const serviceRegistry = new ServiceRegistry(serviceRepository);

export default async function handleRegister(req, res) {

  try {
    const service = new Service(req.body);

    const createRes = await serviceRegistry.createApiInstance(service);

    console.log(createRes);
    return res.status(200).json({
      res: createRes,
    });

  } catch (err) {

    console.log(err.message);
    return res.status(500).json({
      error: "Internal server error"
    })
  }
}