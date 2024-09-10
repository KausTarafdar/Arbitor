import { FlagServiceRepository, ServiceRepository } from "../models/dbAccess.js";
import ServiceRegistry from "../services/service_registry/serviceRegistry.js";
import Supervisor from "../services/health_checker/supervisor.js";

export default async function cleanUpRegistry(req, res, next) {
  console.log("hello");
  const supervisor = new Supervisor(
    new ServiceRegistry({
    service: new ServiceRepository(),
    flagService: new FlagServiceRepository()
    })
  )
  let intervalId;

  function repeatFunc() {
    intervalId = setInterval(async () => {
      await supervisor.janitor();
    }, 75);
  }

  repeatFunc();

  setTimeout(() => {
    clearInterval(intervalId)
  }, 150);

  next();
}