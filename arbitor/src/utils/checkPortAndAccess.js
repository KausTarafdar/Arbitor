/**
 * Checks if port is integer and access accurately inputed
 * @param {String} port - takes in the port of the API
 * @param {String} access - takes one of 3 values - all, user, admin
 * @returns {Boolean} true
 * @throws Internal gateway error
 */
export default function checkPortAndAccess(body) {
  if (
    !(typeof(body.port) === "string")
  ) {
    throw new Error("Check port type. Gateway accepts port type to be a string.");
  }
  else if (
    !(["private", "public"].includes(body.access_type))
  ) {
    throw new Error("Check access_type value. Gateway accepts 'public' or 'private' values.");
  }
  else {
    return true;
  }
}
