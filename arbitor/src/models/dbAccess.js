import { client } from "../DB/index.js";

/** Class for the database layer interactions for services database*/
export class ServiceRepository {

  /**
   * @property {Function} _insertNewService - To insert a service into
   * @param {Object} service
   * @returns {Array} Array of row objects
   */
  async _insertNewService(service) {
    const query = "INSERT INTO services(api_name, api_key, endpoint, base_url, port, access_type) VALUES ($1, $2, $3, $4, $5, $6) returning id, api_name, api_key, created_at";
    const values = [
      service.api_name,
      service.api_key,
      service.endpoint,
      service.base_url,
      service.port,
      service.access_type
    ];

    const createServiceQuery = await client.query(query, values);
    return createServiceQuery.rows;
  }

  /**
   * @property {Function} _deleteService - To delete an existing service instance
   * @param {Object} serviceDelete
   * @returns {Array} contains "success" if success
   */
  async _deleteService(serviceDelete) {
    const query = "DELETE FROM services WHERE api_name = $1 AND base_url = $2 AND port = $3";
    const values = [
      serviceDelete.api_name,
      serviceDelete.base_url,
      serviceDelete.port
    ];

    const deleteServiceQuery = await client.query(query, values);

    return [
      deleteServiceQuery,
      "Success"
    ]
  }

  /**
   * @property {Function} _callService - To call a service based on service Name and key
   * @param {Object} serviceCall
   * @returns {Array} Array of row objects
   */
  async _callService(serviceCall) {
    const query = "SELECT * FROM services WHERE api_name = $1 AND api_key = $2";
    const values = [
      serviceCall.api_name,
      serviceCall.api_key
    ];

    const callServiceQuery = await client.query(query, values);

    return callServiceQuery.rows;
  }

  /**
   * @property {Function} _findService - To call and find a service in the services DB
   * @param {Object} service
   * @returns {Array} Array of row objects
   */
  async _findService(service) {
    const query = "SELECT * FROM services WHERE api_name = $1 AND api_key = $2 AND base_url = $3 AND endpoint = $4 AND port = $5";
    const value = [
      service.api_name,
      service.api_key,
      service.base_url,
      service.endpoint,
      service.port
    ]
    const checkServiceExistsQuery = await client.query(query, value);
    return checkServiceExistsQuery.rows;
  }
}

/** Class for database layer interactions for flagged_services database */
export class FlagServiceRepository {

  /**
   * Inserts service into the flagged_services table
   * @param {Object} flaggedService
   * @returns {Array} Array of row objects
   */
  async _flagService(flaggedService) {
    const query = "INSERT INTO flagged_services (api_name, base_url, port) VALUES ($1, $2, $3) RETURNING api_name, base_url, port";
    const values = [
      flaggedService.serviceName,
      flaggedService.baseURL,
      flaggedService.port
    ]

    const callFlagQuery = await client.query(query, values);

    return callFlagQuery.rows;
  }

  /**
   * Delets an api instance from the flagged_services table
   * @param {Object} flaggedServices
   * @returns {Array} returns "success" if success
   */
  async _deleteFlaggedService(flaggedService) {
    const query = "DELETE FROM flagged_services WHERE id = $1";
    const values = [
      flaggedService.id,
    ]

    const deleteFlaggedService = await client.query(query, values);

    return deleteFlaggedService;
  }

  async _findFlaggedService(flaggedService) {
    const query = "SELECT * FROM flagged_services WHERE api_name = $1 AND base_url = $2 AND port = $3";
    const values = [
      flaggedService.serviceName,
      flaggedService.baseURL,
      flaggedService.port,
    ]

    const findFlaggedServiceQuery = await client.query(query, values);
    return findFlaggedServiceQuery.rows;
  }

  async _topFlaggedService() {
    const query = "SELECT * FROM flagged_services LIMIT 1";

    const getOneQuery = await client.query(query);
    return getOneQuery.rows;
  }
}