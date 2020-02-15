const { promiseMap } = require("./concurrency");
const { readFile, walkDir } = require("./fs");
const { encrypt } = require("./kms");
const { uploadS3Object } = require("./s3");

/**
 * @param {string} srcDir
 * @param {string} Bucket
 * @param {string} kmskeyId
 */
async function encryptAndUpload(srcDir, Bucket, kmskeyId) {
  const filePaths = await walkDir(srcDir);

  await promiseMap(
    filePaths,
    async p => {
      const content = await readFile(p.relativePath);
      const encryptedContent = await encrypt(kmskeyId, content);
      await uploadS3Object({ Bucket, Key: p.key }, encryptedContent);
    },
    4
  );
}

module.exports = {
  encryptAndUpload
};
