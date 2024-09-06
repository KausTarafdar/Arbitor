import checkPortAndAccess from "../utils/checkPortAndAccess.js";
import validateBody from "../utils/validateBody.js";

/** Class representing service call objects */
export class ServiceCall {

  constructor(data) {
    if (data.params === '?') data.params = '/';
    if (Object.keys(data.body).length == 0) data.body = { 0:'NA' };

    validateBody(
      data,
      [
        "api_name",
        "api_key",
        "method",
        "params",
        "body"
      ]
    );

    this.api_name = data.api_name;
    this.api_key = data.api_key;
    this.req_method = data.method;
    this.req_params = data.params;
    this.req_body = data.body;
  }
}

/** Class representing an API data transfer object */
export class Service{

  constructor(data) {
    validateBody(
      data,
      [
        "api_name",
        "api_key",
        "endpoint",
        "base_url",
        "port",
        "access_type"
      ],
        checkPortAndAccess(data)
    );

    this.api_name = data.api_name;
    this.api_key = data.api_key;
    this.endpoint = data.endpoint;
    this.base_url = data.base_url;
    this.port = data.port;
    this.access_type = data.access_type;
  }
}

/** Class representing an API delete data transfer object */
export class ServiceDelete{

  constructor(data) {
    if(typeof(data.id) === "number") {
      this.id = data.id;
    }
    else {
      throw new Error("Internal gateway error");
    }
  }
}
/** Class representing a flagged service */
export class FlaggedService {
  constructor(data) {
    this.id = data.serviceName;
    this.serviceName = data.serviceName;
    this.baseURL = data.baseURL;
    this.port = data.port;
  }
}