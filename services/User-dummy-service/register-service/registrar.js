import { gatewayUrl, apiData, routes } from "./.config.js";

class Registrar {
  _gatewayUrl;
  _apiData;
  _routes
  constructor() {
    this._gatewayUrl = gatewayUrl;
    this._apiData = apiData;
    this._routes = routes;
  }

  registerToGateway() {
    for (let i = 0; i<this._routes.length; i++){
      fetch(gatewayUrl, {
        //Set method
        method: "POST",
        //Set boyd to be passed
        body: JSON.stringify({...this._apiData, ...this._routes[i]}),
        //Set headers for request sent
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }

      })
      .then(response => response.json())
      .then(json => (json.res) ? console.log(json.res) : console.log(json.error))
      .catch(error => console.log("Failed to register service : Check the gateway status and restart the service"))
    }
  }
}


export default function registrar() {
  return new Registrar();
}