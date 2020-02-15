const { getFileWriter } = require("./fs");
const { getS3Downloader, getS3Keys } = require("./s3");

const DEFAULT_CONCURRENCY = 4;

/**
 * @param {string} Bucket
 * @param {string} targetRoot
 * @param {number} concurrency
 */
async function downloadS3Content(Bucket, targetRoot, concurrency) {
  const fileWriter = getFileWriter(targetRoot);
  const downloadFromS3 = getS3Downloader(
    fileWriter,
    concurrency || DEFAULT_CONCURRENCY
  );

  return getS3Keys({
    Bucket
  }).then(keys => downloadFromS3(Bucket, keys));
}

module.exports = {
  downloadS3Content
};
