const fs = require("fs");
const path = require("path");

/**
 * @param {string} targetRoot
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
 * @returns {Array.<{key: Number, relativePath: String}>}
 */
function walkDir(dir, baseDir) {
  if (!baseDir) baseDir = dir;
  const pwd = process.cwd();
  const files = fs.readdirSync(dir);
  const filelist = [];
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist.push(...walkDir(filePath, baseDir));
    } else {
      filelist.push({
        key: path.relative(baseDir, filePath),
        relativePath: path.relative(pwd, filePath)
      });
    }
  });
  return filelist;
}

/**
 * @param {string} path
 */
async function readFile(path) {
  return fs.promises.readFile(path);
}

module.exports = {
  getFileWriter,
  readFile,
  walkDir
};
