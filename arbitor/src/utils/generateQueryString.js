/**
 * Converts the query obj in request to a query string
 * @param {Object} queryObj
 * @returns {String} queryString
 */
export default function generateQueryString(queryObj) {
  const _keys = Object.keys(queryObj);
  const _values = Object.values(queryObj);
  var queryString = '?'

  for (let i=0; i<_keys.length; i++) {
    queryString = queryString + _keys[i] + '=' + _values[i].split(' ').join('+');
    if(i!== _keys.length-1) queryString = queryString + '&';
  }

  return queryString
}