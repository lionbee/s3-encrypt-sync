const AWS = require("aws-sdk");

let kmsCache;
function getKMS() {
  if (!kmsCache) {
    kmsCache = new AWS.KMS();
  }
  return kmsCache;
}

/**
 * @param {string} keyId
 * @param {string} plaintext
 */
async function encrypt(keyId, plaintext) {
  const kms = getKMS();
  const result = await kms
    .encrypt({
      KeyId: keyId,
      Plaintext: plaintext
    })
    .promise();

  return result.CiphertextBlob.toString("base64");
}

module.exports = {
  encrypt
};
