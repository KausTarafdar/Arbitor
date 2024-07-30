/**
 * validateBody checks if body is valid.
 * @param {Object} body - Takes the body from request.
 * @param {Array[*]} checkKeys - Takes the a array of keys to check body for.
 * @param {Function} extravalidate - Takes any addition evaluatio function, DEFAULT => TRUE.
 * @returns {Boolean} 
 */

export default function validateBody(body, checkKeys, extraValidate = true) {
  const bodyKeys = Object.keys(body);
  const bodyValues = Object.values(body);
  //Check whether the body has all necessary fields filled in and port is an integer
  if (bodyKeys.every(key => checkKeys.includes(key)) && bodyValues.every(value => value !== "")){
    if(typeof(extraValidate) == "boolean") return true;
    return extraValidate(body) ? true : false;
  }
}