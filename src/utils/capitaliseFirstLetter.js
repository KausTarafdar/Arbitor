/**
 * Makes the first letter uppercase of any string provided
 * @param {String} string - Takes a string.
 * @returns {String}
 */
export default function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}