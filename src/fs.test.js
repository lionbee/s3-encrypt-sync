const mkdir = jest.fn();
const writeFile = jest.fn();
const readdirSync = jest.fn();
const statSync = jest.fn();
const mockReadFile = jest.fn();

const mockedFS = {
  promises: {
    mkdir,
    readFile: mockReadFile,
    writeFile
  },
  readdirSync,
  statSync
};

jest.mock("fs", () => mockedFS);

const { getFileWriter, readFile, walkDir } = require("./fs");

describe("walkDir tests", () => {
  beforeEach(jest.resetAllMocks);

  const getDirectoryIndicator = isDir => () => isDir;

  it("returns all files", () => {
    readdirSync
      .mockReturnValueOnce(["afile.txt", "adir"])
      .mockReturnValueOnce(["another.txt"]);
    statSync
      .mockReturnValueOnce({ isDirectory: getDirectoryIndicator(false) })
      .mockReturnValueOnce({ isDirectory: getDirectoryIndicator(true) })
      .mockReturnValueOnce({ isDirectory: getDirectoryIndicator(false) });

    expect(walkDir("./test")).toEqual(
      expect.arrayContaining([
        {
          key: "afile.txt",
          relativePath: "test/afile.txt"
        },
        {
          key: "adir/another.txt",
          relativePath: "test/adir/another.txt"
        }
      ])
    );
  });
});

describe("Filewriter tests", () => {
  it("Can create a fileWriter", () => {
    expect(getFileWriter("/test/path")).toBeDefined();
  });

  it("fileWriter creates the correct directory", () => {
    const fileWriter = getFileWriter("/test/path");
    fileWriter("/some/file.txt", "test");

    expect(mkdir).toBeCalledWith("/test/path/some", { recursive: true });
  });

  it("fileWriter saves to the correct path", () => {
    const fileWriter = getFileWriter("/test/path");
    fileWriter("/some/file.txt", "test");

    expect(writeFile).toBeCalledWith("/test/path/some/file.txt", "test");
  });

  it("returns path to written file", async () => {
    const fileWriter = getFileWriter("/test/path");
    await expect(fileWriter("/some/file.txt", "test")).resolves.toBe(
      "/test/path/some/file.txt"
    );
  });
});

describe("readFileBase64 tests", () => {
  it("Integration", async () => {
    mockReadFile.mockReturnValueOnce("test");
    await readFile("/test/path");

    expect(mockReadFile).toBeCalledWith("/test/path");
  });
});
