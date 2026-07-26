import chalk from "chalk";
import { Service } from "../../dto/api.js";
import { ServiceRepository } from "../../models/dbAccess.js";
import ServiceRegistry from "../../services/service_registry/serviceRegistry.js";
import { logError } from "../../services/logger/index.js";
import { sendError } from "../../utils/errors.js";

const serviceRepository = new ServiceRepository();
const serviceRegistry = new ServiceRegistry({
  service: serviceRepository,
});

export default async function handleRegister(req, res) {
  console.log(req.path)
  try {

    const service = new Service(req.body);

    const createRes = await serviceRegistry.createApiInstance(service);

    console.log(chalk.greenBright(createRes.res));

    return res.status(200).json(createRes);

  } catch (err) {

    await logError(err, req);
    return sendError(res, err);
  }
}