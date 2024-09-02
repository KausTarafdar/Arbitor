import { client } from "../DB/index.js";

/** Class for the database layer interactions */
export default class ServiceRepository {
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
    const query = "DELETE FROM services WHERE id = $1";
    const values = [serviceDelete.id];

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
}