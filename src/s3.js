const AWS = require('aws-sdk');

const { promiseMap } = require('./concurrency');

let s3Cache;
function getS3() {
    if (!s3Cache) {
        s3Cache = new AWS.S3();
    }
    return s3Cache;
}

async function getS3Keys({ Bucket, ContinuationToken, MaxKeys }) {
    const s3 = getS3();
    const response = await s3.listObjectsV2({
        Bucket,
        ContinuationToken,
        MaxKeys,
    }).promise()

    const keys = response.Contents.map(objectEntry => objectEntry.Key);

    if (response.IsTruncated) {
        return keys.concat(await getS3Keys({
            Bucket,
            ContinuationToken: response.NextContinuationToken,
            MaxKeys,
        }))
    }

    return keys
}

/**
 * @param {Object} source
 * @param {string} source.Bucket
 * @param {string} source.Key
 * @param {string} targetRoot 
 */
async function downloadS3Object({ Bucket, Key }, fileWriter) {
    const s3 = getS3();
    const result = await s3.getObject({
        Bucket,
        Key
    }).promise();

    return await fileWriter(Key, result.Body);
}

/**
 * Finds the item by its unique id.
 * @typedef {function(string, string): Promise<string>} FileWriter
 */

/**
 * @param {FileWriter} fileWriter
 * @param {number} [concurrency=4] 
 * @returns {getS3Downloader~downloadS3Objects}
 */
function getS3Downloader(fileWriter, concurrency) {
    /** 
    * @param {string} Bucket
    * @param {string[]} keys
    */
    return async function downloadS3Objects(Bucket, keys) {
        return promiseMap(keys, Key => downloadS3Object({ Bucket, Key }, fileWriter), concurrency || 4);
    }
}

module.exports = {
    getS3Keys,
    getS3Downloader,
};