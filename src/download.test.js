const mockFileWriter = jest.fn();
const mockS3Downloader = jest.fn();
const mockGetFileWriter = jest.fn();
const mockGetS3Downloader = jest.fn();
const mockGetS3Keys = jest.fn();
jest.mock("./fs", () => ({
  getFileWriter: mockGetFileWriter
}));

jest.mock("./s3", () => ({
  getS3Keys: mockGetS3Keys,
  getS3Downloader: mockGetS3Downloader
}));

const { downloadS3Content } = require("./download");

describe("download tests", () => {
  beforeEach(jest.resetAllMocks);

  it("Download integration test", async () => {
    const Bucket = "TEST";
    const targetRoot = "some/target";
    const keys = ["test1", "test2", "test3"];

    mockGetS3Keys.mockResolvedValue(keys);
    mockGetS3Downloader.mockReturnValue(mockS3Downloader);
    mockGetFileWriter.mockReturnValue(mockFileWriter);
    mockS3Downloader.mockResolvedValue("done");
    mockFileWriter.mockResolvedValue("done");

    await downloadS3Content("TEST", "some/target");

    expect(mockGetS3Keys).toBeCalledWith(expect.objectContaining({ Bucket }));
    expect(mockGetFileWriter).toBeCalledWith(targetRoot);
    expect(mockGetS3Downloader).toBeCalledWith(
      mockFileWriter,
      expect.any(Number)
    );
    expect(mockS3Downloader).toBeCalledWith(Bucket, keys);
  });
});
