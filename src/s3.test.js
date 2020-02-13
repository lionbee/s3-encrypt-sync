const AWSMock = require("aws-sdk-mock");

const { getS3Downloader, getS3Keys } = require("./s3");

describe("Tests for s3 keys", () => {
  const mockListKeys = jest.fn();
  AWSMock.mock("S3", "listObjectsV2", mockListKeys);

  beforeEach(jest.resetAllMocks);

  const createMockContents = range => {
    const Contents = [];
    for (let i = 1; i <= range; i++) {
      Contents.push({ Key: `test${i}` });
    }
    return {
      Contents
    };
  };

  it("List contents returns expected values", async () => {
    mockListKeys.mockResolvedValueOnce(createMockContents(3));
    const result = await getS3Keys({ Bucket: "test" });

    expect(result).toEqual(expect.arrayContaining(["test1", "test2", "test3"]));
  });

  it("Continuation token are honoured", async () => {
    const { Contents } = createMockContents(3);

    mockListKeys
      .mockResolvedValueOnce({
        Contents: [Contents[2]],
        IsTruncated: true,
        NextContinuationToken: "1"
      })
      .mockResolvedValueOnce({
        Contents: [Contents[1]],
        IsTruncated: true,
        NextContinuationToken: "2"
      })
      .mockResolvedValueOnce({ Contents: [Contents[0]] });

    const result = await getS3Keys({ Bucket: "test" });

    expect(mockListKeys).toBeCalledTimes(3);
    expect(result).toEqual(expect.arrayContaining(["test1", "test1", "test1"]));
  });
});

describe("Tests for s3 download", () => {
  const mockGetObject = jest.fn();
  AWSMock.mock("S3", "getObject", mockGetObject);

  beforeEach(jest.resetAllMocks);

  it("Can create an s3 downloader", () => {
    expect(getS3Downloader(jest.fn())).toBeDefined();
  });

  it("Downloader writes expected files", async () => {
    const fileWriter = jest.fn();
    fileWriter.mockResolvedValue("test");
    mockGetObject.mockResolvedValue("test");

    const s3Download = getS3Downloader(fileWriter);
    await s3Download("TestBucket", ["/key/1", "/key/2"]);

    expect(mockGetObject).toBeCalledTimes(2);
  });

  it("Correct params are passed to file writer", async () => {
    const testBody = "bla bla bla";
    const testKey = "ket/1";
    const fileWriter = jest.fn();
    fileWriter.mockResolvedValue("test");
    mockGetObject.mockResolvedValue({ Body: testBody });

    const s3Download = getS3Downloader(fileWriter);
    await s3Download("TestBucket", [testKey]);

    expect(fileWriter).toBeCalledWith(testKey, testBody);
  });
});
