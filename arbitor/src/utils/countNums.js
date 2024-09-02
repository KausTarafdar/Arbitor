/**
 * Function to count number of integers in a passed string
 * @param {String} valString
 * @returns {Number} Returns the no. of matches
 */
export default function countNums(valString) {
  const reg = /[0-9]/g;
  const matches = valString.match(reg);
  return matches ? matches.length : 0;
}