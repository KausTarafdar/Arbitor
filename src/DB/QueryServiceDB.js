import { client } from "./ServiceDBConnection.js";

// Function to fetch service info from DB
export async function fetchServiceInfo(serviceName) {
  const query = await client.query(`SELECT * FROM ${serviceName} WHERE ENABLED='y' LIMIT 1`);
  return query.rows;
}

//Function to create a service table and create an instance of the service
export async function createService(service) {
  const createQuery = await client.query(
    `CREATE TABLE ${service.serviceName}(
      s_id SERIAL UNIQUE,
      serviceName VARCHAR NOT NULL,
      port INT NOT NULL,
      method VARCHAR NOT NULL,
      endpoint VARCHAR default '/',
      access CHAR(1) NOT NULL,
      enabled CHAR(1) DEFAULT 'n',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(port, method, endpoint)
    )`);
  
  const text = `INSERT INTO ${service.serviceName}(serviceName, port, method, endpoint, access) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [
    service.serviceName,
    service.port,
    service.method,
    service.endpoint,
    service.access
  ];
  const insertQuery = await client.query(text, values);
  return insertQuery;
}

//Function to delete a service
export async function deleteService(serviceName) {
  const query = await client.query(`DROP TABLE ${serviceName}`);
  return query;
} 

//function to change the status of a service instance to enable
export async function enableServiceInstance(instanceInfo) {
  const text = `UPDATE ${instanceInfo.serviceName} SET enabled='y' WHERE serviceName=$1 AND port=$2 AND method=$3 AND endpoint=$4 RETURNING *`;
  const values = [
    instanceInfo.serviceName,
    instanceInfo.instanceName,
    instanceInfo.port,
    instanceInfo.method,
    instance.endpoint
  ];
  const query = await client.query(text, values);
  return query;
} 

//Function to change the status of a service to disable
export async function disableServiceInstance(instanceInfo){
  const text = `UPDATE ${instanceInfo.serviceName} SET enabled='n' WHERE serviceName=$1 AND port=$2 AND method=$3 AND endpoint=$4 RETURNING *`;
  const values = [
    instanceInfo.serviceName,
    instanceInfo.instanceName,
    instanceInfo.port,
    instanceInfo.method,
    instance.endpoint
  ];
  const query = await client.query(text, values);
  return query; 
}