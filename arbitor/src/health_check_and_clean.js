import { FlagServiceRepository, ServiceRepository } from "./models/dbAccess.js";
import Supervisor from "./services/health_checker/supervisor.js";
import ServiceRegistry from "./services/service_registry/serviceRegistry.js";

import cron from "node-cron";

const supervisor = new Supervisor(
  new ServiceRegistry({
  service: new ServiceRepository(),
  flagService: new FlagServiceRepository()
  })
)

async function asyncCall () {
  await supervisor.janitor();
}

cron.schedule('* * * * * *', async () => {
  try {
    await asyncCall()
  } catch (err) {
    console.log(err.message);
  }
})

// var max_clear

// var flag_clear
// setInterval(async () => {
//   max_clear = 2;
//   flag_clear = 1;
//   while (flag_clear !== 0 || max_clear !== 0) {
//     console.log("Hello")
//     flag_clear = await supervisor.janitor();
//     max_clear--;
//   }
// }, 1000);