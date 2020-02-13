const AWSMock = require("aws-sdk-mock");

const { encrypt } = require("./kms");

describe("KMS ecnryption test", () => {
  const mockEncrypt = jest.fn();
  AWSMock.mock("KMS", "encrypt", mockEncrypt);

  it("Call KMS ith expected parameters", async () => {
    mockEncrypt.mockResolvedValueOnce({
      CiphertextBlob: {
        buffer: Buffer.from("test")
      }
    });
    await encrypt("testKey", "some content");
    expect(mockEncrypt).toBeCalledWith(
      expect.objectContaining({ KeyId: "testKey", Plaintext: "some content" }),
      expect.any(Function)
    );
  });

  it("Returns expected values as base64", async () => {
    mockEncrypt.mockResolvedValueOnce({
      CiphertextBlob: {
        buffer: Buffer.from("test")
      }
    });
    const result = await encrypt("testKey", "some content");
    expect(result).toBe("dGVzdA==");
  });

  it("Errors are raised", async () => {
    mockEncrypt.mockRejectedValueOnce("dead");
    await expect(encrypt("testKey", "some content")).rejects.toBe("dead");
  });
});
