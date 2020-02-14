const mockFs = {
  readFile: jest.fn(),
  walkDir: jest.fn()
};

const mockKms = {
  encrypt: jest.fn()
};

const mockS3 = {
  uploadS3Object: jest.fn()
};

jest.mock("./fs", () => mockFs);
jest.mock("./kms", () => mockKms);
jest.mock("./s3", () => mockS3);

const { encryptAndUpload } = require("./encUpload");

describe("Encrypt and upload tests", () => {
  beforeEach(jest.resetAllMocks);

  it("Integration", async () => {
    mockFs.walkDir.mockResolvedValueOnce([
      {
        key: "test.txt",
        relativePath: "test.txt"
      },
      {
        key: "/more/another.txt",
        relativePath: "/more/another.txt"
      }
    ]);
    mockFs.readFile
      .mockResolvedValueOnce("test content 1")
      .mockResolvedValueOnce("test content 2");
    mockKms.encrypt
      .mockResolvedValueOnce("encrypted 1")
      .mockResolvedValueOnce("encrypted 2");
    mockS3.uploadS3Object.mockResolvedValue("");

    await encryptAndUpload("./testDir", "TestBucket", "EncKey");

    expect(mockFs.walkDir).toBeCalledWith("./testDir");

    expect(mockFs.readFile).toBeCalledWith("test.txt");
    expect(mockFs.readFile).toBeCalledWith("/more/another.txt");

    expect(mockKms.encrypt).toBeCalledWith("EncKey", "test content 1");
    expect(mockKms.encrypt).toBeCalledWith("EncKey", "test content 2");

    expect(mockS3.uploadS3Object).toBeCalledWith(
      expect.objectContaining({
        Bucket: "TestBucket",
        Key: "test.txt"
      }),
      "encrypted 1"
    );
    expect(mockS3.uploadS3Object).toBeCalledWith(
      expect.objectContaining({
        Bucket: "TestBucket",
        Key: "/more/another.txt"
      }),
      "encrypted 2"
    );
  });
});
