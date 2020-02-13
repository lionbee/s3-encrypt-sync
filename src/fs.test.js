const mkdir = jest.fn();
const writeFile = jest.fn();
const readdirSync = jest.fn();
const statSync = jest.fn();
const readFile = jest.fn();

const mockedFS = {
  promises: {
    mkdir,
    readFile,
    writeFile
  },
  readdirSync,
  statSync
};

jest.mock("fs", () => mockedFS);

const { getFileWriter, readFileBase64, walkDir } = require("./fs");

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
      expect.arrayContaining(["test/afile.txt", "test/adir/another.txt"])
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
    readFile.mockReturnValueOnce("test");
    await readFileBase64("/test/path");

    expect(readFile).toBeCalledWith("/test/path");
  });
});
