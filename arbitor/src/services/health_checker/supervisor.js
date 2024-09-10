import chalk from 'chalk';
import axios from 'axios';

import { FlaggedService, ServiceDelete } from '../../dto/api.js';

export default class Supervisor {
  serviceRegistry
  constructor(registry) {
    this.serviceRegistry = registry;
  }

  async janitor() {
    const flaggedService = (await this.serviceRegistry.getTopFlaggedService())[0];
    if (flaggedService === undefined) {
      return 0;
    }
    try {
      const axiosRes = await axios({
        method: "GET",
        url: `${flaggedService.base_url}:${flaggedService.port}/health`
      })
      if (axiosRes.status === 200) {
        const removeFlagged = await this.serviceRegistry.deleteFlaggedService(flaggedService);
        if (removeFlagged) {
          console.log(chalk.green(`Log : || ${flaggedService.api_name} || restored`));
        }
      }
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        const serviceDelete = new ServiceDelete({
          api_name: flaggedService.api_name,
          base_url: flaggedService.base_url,
          port: flaggedService.port,
        });
        const removeInstance = await this.serviceRegistry.deleteApiInstance(serviceDelete);
        const removeFlagged = await this.serviceRegistry.deleteFlaggedService(flaggedService);
        if (removeFlagged && removeInstance) {
          console.log(chalk.red(`Log : || ${serviceDelete.api_name} || removed from registry`))
        }
      }
    }
  }

  async surveyor (service) {
    const flaggedService = new FlaggedService({
      id: service.id,
      serviceName: service.api_name,
      baseURL: service.base_url,
      port: service.port
    });
    try {
      await this.serviceRegistry.flagService(flaggedService);
      console.log(chalk.cyan(`Log : || ${flaggedService.serviceName} || flagged for connection`))
    } catch (error) {
      return {
        "Error": "Internal error",
        "ErrorInfo": "Error occured while flagging service",
      }
    }
  }
}