/**
 * Checks if port is integer and access accurately inputed
 * @param {Number} port - takes in the port of the API
 * @param {String} access - takes one of 3 values - all, user, admin
 * @returns {Boolean} true
 * @throws Internal gateway error
 */
export default function checkPortAndAccess(body) {
  if (
    !(typeof(body.port) === "number") ||
    !(['all', 'user', 'admin'].includes(body.access_type))
  ) {
    throw new Error("Check port or access_type");
  }
  else {
    return true;
  }
}
