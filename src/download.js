/**
 * Create a Node.js ES6 module to download all objects in a given S3 bucket recursively, and save them locally, maintaining directory structure.
Control concurrency to keep at most four parallel downloads in progress. Hint: You can use Bluebird promise library.
Write a unit test to verify the functionality of your library by mocking AWS S3 API.
Write a unit test to demonstrate the validity of controlled concurrency.
Get a code coverage report for your test suite.
Create a second module to encrypt all downloaded objects using KMS with a user-defined CMK and upload them to a second S3 bucket.
Write an integration test to demonstrate full functionality of both modules
 */

const { getFileWriter } = require("./fs");
const { getS3Downloader, getS3Keys } = require("./s3");

const DEFAULT_CONCURRENCY = 4;

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
