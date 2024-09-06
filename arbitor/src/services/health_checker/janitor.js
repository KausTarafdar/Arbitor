import axios from "axios";
import { FlagServiceRepository } from "../../models/dbAccess.js";
import ServiceRegistry from "../service_registry/serviceRegistry.js";
import { FlaggedService } from "../../dto/api.js";

const flagServiceRepository = new FlagServiceRepository();
const serviceRegistry = new ServiceRegistry({
  flagService: flagServiceRepository,
})

export async function janitor (service) {

}

export async function surveyor (service) {
  const flaggedService = new FlaggedService({
    id: service.id,
    serviceName: service.serviceName,
    baseURL: service.baseURL,
    port: service.port
  });
  try {
    await serviceRegistry.flagService(flaggedService);
  } catch (error) {
    return {
      "Error": "Internal error",
      "ErrorInfo": "Error occured while flagging service",
    }
  }
}