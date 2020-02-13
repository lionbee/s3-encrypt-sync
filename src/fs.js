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

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walkDir(dir) {
  const pwd = process.cwd();
  const files = fs.readdirSync(dir);
  const filelist = [];
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist.push(...walkDir(filePath));
    } else {
      filelist.push(path.relative(pwd, filePath));
    }
  });
  return filelist;
}

async function readFileBase64(path) {
  return fs.promises.readFile(path);
}

module.exports = {
  getFileWriter,
  readFileBase64,
  walkDir
};
