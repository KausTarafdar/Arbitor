/**
 * checkEmptyBody checks if body is exists and is NOT empty.
 * @param {Object} req - Takes the request.
 * @returns {Boolean} 
 */

export default function checkEmptyBody(req) {
  if(!req.body.serviceName) {
    return false;
  }
  else {
    return true;
  }
}