# API-Gateway-project (Arbitor)

#### A homebrew api gateway for microservice management

This project is an attempt at understanding the programming paradigms behind an API Gateway and to design a homebrew version capable of fulfilling those paradigms.

An API gateway acts as an intermediary between clients and a collection of backend services. **Arbitor** acts as the Single Point Of Access (SPOA) between itself and the backend service as well as a loadbalancer among mutiple instances of services.

## Quick Demo

The fastest way to see Arbitor actually working - registration, hash-based load balancing across multiple instances of a service, and automatic failover/deregistration when an instance dies - is via Docker Compose:

```sh
git clone https://github.com/KausTarafdar/arbitor.git
cd arbitor
docker compose up -d --build
./demo.sh
```

This builds one shared image for the gateway and the 5 bundled dummy services (3 `Auth` instances, `User`, `Message`), stands up Postgres, runs migrations, starts everything, then `demo.sh` walks through:

1. What's currently registered in the service registry.
2. Calling `proto_login` from 5 different containers and showing the requests get distributed across the 3 Auth instances by the SHA1 hash-ring load balancer.
3. Killing one Auth instance mid-demo and showing the gateway transparently fails over to a healthy instance, then deregisters the dead one.
4. Logging into the gateway's optional auth and using the token to query the (otherwise 401'd) `/_logs` endpoint, showing every request/error from the run.

The gateway is published on `http://localhost:5050` (not 5000, to avoid clashing with macOS's AirPlay Receiver). Tear down with `docker compose down`.

## Usage Reference

> The steps below are for running/developing a single piece (gateway or a service) by hand, outside Docker. For just seeing the whole system work, use the Quick Demo above instead.

### Add an service

Add the `register-service` directory in your service. In the `regiser-service`, edit the `.config.js` according to your service. The guidelines are as follows:
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
>> The /health route is required for the gateway to be able to remove the service from service registry when the service goes down. Removing it or not providing it in the service may cause issues.

In the service main file, create a `registrar` instance. Example code here uses the express framework to run server.
```js
import express from 'express';
import registrar from './register-service/registrar.js';

const app = express();
const registrar = registrar(); //Initiate an instance

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

The gateway, so far cannot parse parameters in the URL path, it is suggested to pass any parameters as query strings as those are fed forward. Later versions of the application will look to solve this issue.

### Deleting a registered service

The gateway is capable of performing health checks for each of the services registered to it and will periodically remove the service. If a service goes down, it will be unregistered by the `health-checker`. Upon restarting the service, it is expected that the service re-registers itself.

### Auth (optional)

The gateway has a minimal, opt-in auth layer: a single admin credential pair (`ARBITOR_ADMIN_USER` / `ARBITOR_ADMIN_PASSWORD`, defaulting to `admin` / `arbitor`) that issues short-lived bearer tokens.

```http
POST /auth/login   { "username": "...", "password": "..." }  -> { "token": "...", "expires_at": "..." }
POST /auth/logout  Authorization: Bearer <token>
```

Two things are gated behind a valid token:
- `GET /_logs` (see below) - always requires auth, since it's operational data.
- Calling a registered service whose route was registered with `"access_type": "private"` - `"public"` routes (the default in the bundled dummy services) need no token at all, so this is purely opt-in per service.

This is demo-grade auth (no user table, hashing, or rate limiting) meant to show the pattern, not a production identity system.

### Logs

Every request and error handled by the gateway is written to a queryable `logs` table (in addition to the readable console output). Query it directly:

```http
GET /_logs?level=access|error&limit=50
Authorization: Bearer <token>
```
| Parameter | Type     | Description                                              |
| :-------- | :------- | :-------------------------------------------------------- |
| `level`   | `string` | Optional. Filter to `access` or `error` entries.          |
| `limit`   | `number` | Optional. Max entries to return (default 50, max 500).    |

### Testing

Run from inside the ```/arbitor``` dir (or via ```npm test --workspace=arbitor``` from the repo root):

- ```npm test```: Unit tests (Node's built-in test runner, no external services needed) - the hash-ring load balancer, service registry, health checker, and the small util functions, all against mocked dependencies.
- ```npm run test:integration```: Spins up the real gateway and a dummy service as child processes against a real Postgres and exercises them over HTTP - registration, calling through the gateway, 404s, validation errors, the auth login/logout flow, and failover. Needs Postgres reachable on `localhost:5432`; the easiest way is:
  ```sh
  docker-compose up -d postgres
  npm run test:integration --workspace=arbitor
  ```

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

This is an npm workspaces monorepo (`arbitor/` plus the dummy services under `services/`). One install at the repo root resolves everything:
```sh
npm install
```

3. Usage:
- Create a `.env` file in the ```/arbitor``` dir and add the following :-

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

##Auth Info (optional - defaults to admin/arbitor if unset)
ARBITOR_ADMIN_USER=
ARBITOR_ADMIN_PASSWORD=
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
