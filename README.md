# S3 KMS sync

## The stack

### The project

I used vanilla ES6 and BlueBird (Mostly because it was recommended in the project). I used JsDoc only to get better IDE support, since TypeScript will honour JsDoc. At the same time, JsDoc did have some challenges around closures.

### The tests

I used Jest, since it has been my prefered testing library for the past 3 years and aws-sdk-mock since I use it almost daily. Mocking AWS modules directly using Jest mock is also weirdly difficult. I also included the Ject typing in the project for better IDE support.

Testing of index.js is perhaps controversial and honestly the first time I did it. Normally it is excluded from coverage, but since it is easy to verify, why not.

Test are enfored at commit time using Husky pre-commit hooks.

#### Coverage

<!-- prettier-ignore-start -->
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----            |---      |---       |---      |---      |---                
All files       |     100 |      100 |     100 |     100 |                   
 concurrency.js |     100 |      100 |     100 |     100 |                   
 download.js    |     100 |      100 |     100 |     100 |                   
 encUpload.js   |     100 |      100 |     100 |     100 |                   
 fs.js          |     100 |      100 |     100 |     100 |                   
 index.js       |     100 |      100 |     100 |     100 |                   
 kms.js         |     100 |      100 |     100 |     100 |                   
 s3.js          |     100 |      100 |     100 |     100 |                   
<!-- prettier-ignore-end -->

### Linting and style

Enfored linting and styling using EsLint and Prettier. Pretter's compact table format for Markdown is really ugly. Husky and lint-stages is used to ensure proper formatting of files.

## Usage

After installing the module

```javascript
const { downloadS3Content, encryptAndUpload } = require("s3-encrypt-sync");

const bucket = "leon.upload.test";
const dir = "/Users/leon/temp";
const kmsArn = "some key";

downloadS3Content(bucket, dir)
  .then(() => encryptAndUpload(dir, bucket, kmsArn))
  .catch(console.error);
```
