/** Class representing the service registry for API discovery */
export default class ServiceRegistry {
  serviceRepository
  flagServiceRepository
  constructor(repositories) {
    this.serviceRepository = repositories.service || null;
    this.flagServiceRepository = repositories.flagService || null;
  }

  //##########################################################################################//
  /**
   * @property {Function} callApi - calls a stored active API based on request
   * @param {ServiceCall} serviceCall - takes a ServiceCall object
   * @returns callAPI results
   */
  async searchApi(serviceCall) {
    const callAPI = await this.serviceRepository._callService(serviceCall);
    if (callAPI.length === 0) throw new Error("No matched api");
    return callAPI;
  }

  /**
   * @property {Function} createApiInstance - creates a new API instance
   * @param {ServiceCall} service - takes a Service object
   * @returns createAPI results
   */
  async createApiInstance(service) {
    const findAPI = await this.serviceRepository._findService(service);

    if (findAPI.length !== 0) {
      return {
        res: `Service already exists : ${service.api_name}`
      }
    }

    else {
      const createAPI = await this.serviceRepository._insertNewService(service);
      return {
        res: `Added new service : ${createAPI[0].api_name}`
      };
    }

  }

  /**
   * @property {Function} deleteApiInstance - deletes an existing api instance
   * @param {ServiceCall} serviceDelete - takes a ServiceDelete object
   * @returns deleteAPI results
   */
  async deleteApiInstance(serviceDelete) {
    const deleteAPI = await this.serviceRepository._deleteService(serviceDelete);

    return deleteAPI;
  }

  //############################################################################################//
  /**
   * @property {Function} flagService - adds a flagged api to the collection
   * @param {Object} flaggedService - takes a flaggedService object
   * @returns flagAPI results
   */
  async flagService(flaggedService) {
    const findFlaggedAPI = await this.flagServiceRepository._findFlaggedService(flaggedService);

    if (findFlaggedAPI.length === 0) {
      const flagApi = await this.flagServiceRepository._flagService(flaggedService)

      return flagApi;
    }

    return findFlaggedAPI[0];
  }

  /**
   * @property {Function} deleteFlaggedService - deletes a flagged service from collection
   * @param {Object} flaggedService = takes a flaggedService object
   * @returns deletion results
  */
  async deleteFlaggedService(flaggedService) {
    const deleteFlaggedService = await this.flagServiceRepository._deleteFlaggedService(flaggedService);

    return deleteFlaggedService;
  }

  async getTopFlaggedService() {
    const getTopFlaggedService = await this.flagServiceRepository._topFlaggedService();

    return getTopFlaggedService;
  }
}