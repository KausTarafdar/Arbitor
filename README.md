# API-Gateway-project (Arbitor)

#### A homebrew api gateway for microservice management

This project is an attempt at understanding the programming paradigms behind an API Gateway and to design a homebrew version capable of fulfilling those paradigms.

An API gateway acts as an intermediary between clients and a collection of backend services. **Arbitor** acts as the Single Point Of Access (SPOA) between itself and the backend service as well as a loadbalancer among mutiple instances of services.

## Usage Reference

### Add an service

Add the `register-service` directory in the service. In the `regiser-service`, edit the `.config.js` according to your service. The guidelines are as follows:
```js
export const gatewayUrl = "http://localhost:5000/register"
```
- gatewayUrl : replace with the base_url of the gateway host `_base-url_/register`.

```js
export const apiData = {
    "api_name" : "proto_login",
    "base_url" : "http://localhost",
    "port"     : "3000",
}
```
| Parameter  | Type     | Description                                          |
| :--------  | :------- | :----------------------------------------------------|
| `api_name` | `string` | **Required**. Service_name identifier of the service |
| `base_url` | `string` | **Required**. Base_url for the service hosting.      |
| `port`     | `string` | **Required**. Port number for the service.           |

```js
export const routes = {
    {
        "api_key"     : "/health",
        "endpoint"    : "/health",
        "access_type" : "public",
    },
    {
        "api_key"     : "/login",
        "endpoint"    : "/login/user",
        "access_type" : "public",
    },
}
```
| Parameter  | Type     | Description                                |
| :--------  | :------- | :--------------------------------------------------------|
| `api_key`     | `string` | **Required**. Key your endpoint to be acknowledged as |
| `endpoint`    | `string` | **Required**. Endpoint in your service.               |
| `access_type` | `string` | **Required**. *private* or *public* endpoint          |
> [Note!]
>> The /health route is required for the gateway to be able to remove the service from service registry when the service goes down. removing it or not providing it in the service may cause issues.

In the service main file, create a `registrar` instance. Example code here uses the express framework to run server.
```js
import express from 'express';
import registrar from './register-service/registrar.js';

const app = express();
const registrar = reggistrar(); //Initiate an instance

app.listen(3000, () => {
  console.log(`Starting the app..`);
  regsitrar.registerToGateway(); //Registering to the gatewya on start.
})
```
Upon running the service with the API gateway running, the service wiill register itself to the gateway.

### Calling a registered service

```http
ALL /:service_name/:service_key
```
|     Parameter    |                     Description                         |
|:-----------------|:--------------------------------------------------------|
| **service_name** | The name under which the service is registered          |
| **service_key**  | The key for URI in the Service, register to the gateway |

**Naming limitations**

The gateway, so far cannot parse paramaters in the URL path, it is suggested to pass any parameters as query strings as those are fed forward. Later versions of the application will look to solve this issue.

### Deleting a registered service

The gateway is capable of performing health checks for each of the services registered to it and will periodically remove the service. If a service goes down, it will be unregistered by the `health-checker`. Upon restarting the service, it is expected that the service re-registers itself.

### Migrations

This project uses node-pg-migrate for database migrations. The following commands are available to be run inside the ```/arbitor``` dir :

- ```npm run migrate create```: Creates a new migration file.
- ```npm run migrate up```: Applies pending migrations to the database.
- ```npm run migrate down```: Reverts the latest migration applied to the database.
> [Note!]
>>You will need to set the DATABASE environment variable before running any migration commands.

### Technologies

- JavaScript + DocStrings for type definitions.
- Express.js: A popular Node.js web framework for building web applications and APIs.
- node-pg: A Node.js library for interacting with PostgreSQL databases.
- node-pg-migrate: A library for managing database migrations with PostgreSQL.

## Installation

#### Steps for local usage

1. Clone this repository:

```sh
git clone https://github.com/KausTarafdar/arbitor.git
```

2. Install dependencies:

Inside the ```/arbitor``` run :
```sh
npm install
```

3. Usage:
- Create a `.env` file in the root directory and add the following :-

```env
##Server Info
PORT=
URL=

##Database Info
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
```
- To start in production mode run :-

```sh
npm run start-dev
```
Starts the server using **nodemon** allowing the server to run constantly tracking file changes.

- To start in deployment run :-

```sh
npm start
```
