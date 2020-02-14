describe("Index tests", () => {
  it("Verify re-exports count", () => {
    const all = require("./index");
    expect(Object.keys(all).length).toBe(2);
  });

  it("Verify functions", () => {
    const { downloadS3Content } = require("./download");
    const { encryptAndUpload } = require("./encUpload");
    const all = require("./index");

    expect(all.downloadS3Content).toBe(downloadS3Content);
    expect(all.encryptAndUpload).toBe(encryptAndUpload);
  });
});
