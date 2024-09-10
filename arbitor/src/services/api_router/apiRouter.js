import crypto from 'node:crypto';
import axios from 'axios';

import countNums from '../../utils/countNums.js';

/** Class representing the load balancer and the service calling*/
export default class API_routing {
  services;
  userIp;
  request;
  targetServices;

  constructor(data) {
    this.services = data.services;
    this.userIp = data.userIp;
    this.request = data.request;
    this.targetServices = '';
  }

  /**
   * @property {Function} Server list based on the hash function load balancing
   * @returns {void}
   */
  loadBalancer() {
    var _targetList = []; //Hash arranged list of servers
    var _serverList = [...this.services]; //Server list copy of for functional use
    var _mappedVal; //Mapped value of server from the hash of user
    var _hash = crypto.hash('sha1', this.userIp); //Initial ip hash
    var _numCount = countNums(_hash); //Count of the numbers in hash

    while (_serverList.length !== 0) {
      //Get the mapped value for hash value
      _mappedVal = _numCount % _serverList.length;
      //Update mirrorList with the mapped value
      _targetList.push(_serverList[_mappedVal]);
      //Remove server from the server list
      _serverList.splice(_mappedVal,1);
      //Get the next hash
      _hash = crypto.hash('sha1', _hash);
      //Count numbers in hash
      _numCount = countNums(_hash);
    }

    this.targetServices = _targetList;
  }

  /**
   * @property {Function} Forwards request to an instance of the service called
   * @param {Object} Takes a supervisor service class object
   * @returns {Object} Returns service object
   */
  async callService(supervisor) {
    let response;

    if (['POST', 'PUT', 'PATCH'].includes(this.request.req_method)){
      for(var i=0; i<this.targetServices.length; i++){
        response = await this._callWithBody(this.targetServices[i]);
        if (response === "ECONNREFUSED") {
          await supervisor.surveyor(this.targetServices[i]);
        }
        else {
          break;
        }
      }

      return response
    }
    else if (['GET', 'DELETE'].includes(this.request.req_method)) {
      for(var i=0; i<this.targetServices.length; i++){
        response = await this._callWithoutBody(this.targetServices[i]);
        if (response === "ECONNREFUSED") {
          await supervisor.surveyor(this.targetServices[i]);
        }
        else {
          break;
        }
      }

      return response
    }
  }

  async _callWithBody(targetService) {
    const callMethod = this.request.req_method;
    const targetUrl = `${targetService.base_url}:${targetService.port}${targetService.endpoint}`
    const callBody = this.request.req_body;

    try {
      const axiosRes = await axios({
        method: callMethod,
        url: targetUrl,
        data: callBody
      });
      return axiosRes;
    } catch (err) {
      return err.code;
    }
  }

  async _callWithoutBody(targetService) {
    const callMethod = this.request.req_method;
    const targetUrl = `${targetService.base_url}:${targetService.port}${targetService.endpoint}${this.request.req_params}`

    try {
      const axiosRes = await axios({
        method: callMethod,
        url: targetUrl
      });
      return axiosRes
    } catch (err) {
      return err.code;
    }
  }
}