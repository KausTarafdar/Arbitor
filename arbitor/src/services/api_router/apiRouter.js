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
   * @returns {Object} Returns service object
   */
  async callService() {
    if (['POST', 'PUT', 'PATCH'].includes(this.request.req_method)){
      
    }
    else if (['GET', 'DELETE'].includes(this.request.req_method)) {

    }
  }

  async _callWithBody() {
    const callMethod = this.request.method;
    const targetUrl = `${this.targetService.base_url}:${this.targetService.port}${this.targetService.endpoint}`
    const callBody = this.request.req_body;


    try {
      const axiosRes = await axios({
        method: callMethod,
        url: targetUrl,
        data: callBody
      });
      return axiosRes;
    } catch (err) {
      return err.cause.code;
    }
  }

  async _callWithoutBody() {
    const callMethod = this.request.method;
    const targetUrl = `${this.targetService.base_url}:${this.targetService.port}${this.targetService.endpoint}${this.request.req_params}`

    try {
      const axiosRes = await axios({
        method: callMethod,
        url: targetUrl
      });
      return axiosRes
    }
    catch (err) {
      return err.cause.code;
    }
  }
}