/**
 * validateBody checks if body is valid.
 * @param {Object} body - Takes the body from request.
 * @param {Array[*]} checkKeys - Takes the a array of keys to check body for.
 * @param {Function} extravalidate - Takes any addition evaluatio function, DEFAULT => TRUE.
 * @returns {Boolean} - true
 * @throws Internal gateway error
 */

export default function validateBody(body, checkKeys, extraValidate = true) {
  const bodyKeys = Object.keys(body);
  const bodyValues = Object.values(body);
  var validFlag = false
  //Check all keys present, set flag
  checkKeys.forEach(key => {
    if(bodyKeys.includes(key)) validFlag = true;
  })
  //Check all values present, set flag
  bodyValues.forEach(value => {
    if(!(/^(?!\s*$).+/.test(value.toString()))) validFlag = false;
  })
  //Fix bugs =>
  if (validFlag){
    if(typeof(extraValidate) == "boolean") return true;
    if(extraValidate(body) == true) return true;
    throw new Error("Request body error");
  }
  else {
    throw new Error("Request body error");
  }
}
