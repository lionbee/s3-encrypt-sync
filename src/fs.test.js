const mkdir = jest.fn();
const writeFile = jest.fn();

const mockPromises = {
  mkdir,
  writeFile
};

jest.mock("fs", () => ({
  promises: mockPromises
}));

const { getFileWriter } = require("./fs");

describe("fs tests", () => {
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
