const bluebird = require("bluebird");

/**
 * process values and rutn promise.
 *
 * @callback processValue
 * @param {*} value
 * @return @return {Promise}
 */

/**
 *
 * @param {*[]} values
 * @param {processValue} fn
 * @param {number} concurrency
 */
async function promiseMap(values, fn, concurrency) {
  return bluebird.Promise.map(values, fn, { concurrency });
}

module.exports = {
  promiseMap
};
