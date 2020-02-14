# S3 + KMS

I opted for this since I write Lambda functions on a daily basis and thought it would be interesting doing something not Lambda related :D

## The stack

### The project

I used vanilla ES6 and BlueBird (Mostly because it was recommended in the project). I used JsDoc only to get better IDE support, since TypeScript will honour JsDoc. At the same time, JsDoc did have some challenges around closures that

### The tests

I used Jest, since it has been my prefered testing library for the past 3 years and aws-sdk-mock since I use it almost daily. Mocking AWS modules directly using Jest mock is also weirdly difficult. I also included the Ject typing in the project for better IDE support.

Testing of index.js is perhaps controversial and honestly the first time I did it. Normally it is excluded from coverage, but since it is easy to verify, why not.

Test are enfored at commit time using Husky pre-commit hooks.

#### Coverage

----------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------|---------|----------|---------|---------|-------------------
All files | 100 | 100 | 100 | 100 |  
 concurrency.js | 100 | 100 | 100 | 100 |  
 download.js | 100 | 100 | 100 | 100 |  
 encUpload.js | 100 | 100 | 100 | 100 |  
 fs.js | 100 | 100 | 100 | 100 |  
 index.js | 100 | 100 | 100 | 100 |  
 kms.js | 100 | 100 | 100 | 100 |  
 s3.js | 100 | 100 | 100 | 100 |  
----------------|---------|----------|---------|---------|-------------------

### Linting and style

Enfored linting and styling using EsLint and Prettier. Pretter's compact table format for Markdown is really ugly.
