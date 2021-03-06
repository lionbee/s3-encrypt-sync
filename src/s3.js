const AWS = require("aws-sdk");

const { promiseMap } = require("./concurrency");

let s3Cache;
function getS3() {
  if (!s3Cache) {
    s3Cache = new AWS.S3();
  }
  return s3Cache;
}

/**
 * @param {Object} options
 * @param {string} options.Bucket
 * @param {string} options.ContinuationToken
 * @param {number} options.MaxKeys
 */
async function getS3Keys({ Bucket, ContinuationToken, MaxKeys }) {
  const s3 = getS3();
  const response = await s3
    .listObjectsV2({
      Bucket,
      ContinuationToken,
      MaxKeys
    })
    .promise();

  const keys = response.Contents.map(objectEntry => objectEntry.Key);

  if (response.IsTruncated) {
    return keys.concat(
      await getS3Keys({
        Bucket,
        ContinuationToken: response.NextContinuationToken,
        MaxKeys
      })
    );
  }

  return keys;
}

/**
 * @param {Object} source
 * @param {string} source.Bucket
 * @param {string} source.Key
 * @param {string} targetRoot
 */
async function downloadS3Object({ Bucket, Key }, fileWriter) {
  const s3 = getS3();
  const result = await s3
    .getObject({
      Bucket,
      Key
    })
    .promise();

  return fileWriter(Key, result.Body);
}

/**
 * Finds the item by its unique id.
 * @typedef {function(string, string): Promise<string>} FileWriter
 */

/**
 * @param {FileWriter} fileWriter
 * @param {number} [concurrency=4]
 */
function getS3Downloader(fileWriter, concurrency) {
  /**
   * @param {string} Bucket
   * @param {Promise<Array<string>>} keys
   */
  return async function downloadS3Objects(Bucket, keys) {
    return promiseMap(
      keys,
      Key => downloadS3Object({ Bucket, Key }, fileWriter),
      concurrency || 4
    );
  };
}

/**
 * @param {Object} target
 * @param {string} target.Bucket
 * @param {string} target.Key
 * @param {string} base64Data
 */
async function uploadS3Object({ Bucket, Key }, base64Data) {
  const s3 = getS3();

  await s3
    .putObject({
      Bucket,
      Key,
      Body: base64Data
    })
    .promise();
}

module.exports = {
  getS3Keys,
  getS3Downloader,
  uploadS3Object
};
