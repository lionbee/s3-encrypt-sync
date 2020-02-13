const fs = require("fs");
const path = require("path");

/**
 * @param {string} targetRoot 
 * @returns {getFileWriter~fileWriter}
 */
function getFileWriter(targetRoot) {
  /**
   * @param {string} key
   * @param {string} body
   * @returns {Promise<string>}
   */
  return async function fileWriter(key, body) {
    const targetPath = path.join(targetRoot, key);
    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.promises.writeFile(targetPath, body);
    return targetPath;
  };
}

module.exports = {
  getFileWriter
};
