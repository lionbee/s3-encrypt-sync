const { promiseMap } = require("./concurrency");

describe("Conccurency tests", () => {
  jest.useFakeTimers();
  const values = [1, 2, 4, 5, 6];

  it("Call function for all values", async () => {
    const fn = jest.fn();
    await promiseMap(values, fn, values.length);

    expect(fn).toBeCalledTimes(values.length);
  });

  it("Correct number of values are returned", async () => {
    const fn = jest.fn().mockResolvedValue("test");
    const result = await promiseMap(values, fn, values.length);

    expect(result.length).toBe(values.length);
  });

  it("Errors are thrown", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce("dead")
      .mockResolvedValue("test");

    expect(promiseMap(values, fn, values.length)).rejects.toBe("dead");
  });

  it("Promises are throttled", async () => {
    const concurrencyLimit = 3;
    const timeout = 1000;
    const mockFn = jest.fn();

    async function sleepFn(value) {
      setTimeout(() => {
        mockFn(value);
      }, timeout);
    }

    promiseMap(values, sleepFn, concurrencyLimit);

    // Kick first promises
    jest.advanceTimersByTime(timeout);
    await Promise.resolve();

    // Wait for them to complete
    jest.advanceTimersByTime(timeout);
    await Promise.resolve();
    expect(mockFn).toBeCalledTimes(concurrencyLimit);

    // Kick the next batch
    jest.advanceTimersByTime(timeout);
    await Promise.resolve();

    // Wait for them to complete
    jest.advanceTimersByTime(timeout);
    await Promise.resolve();
    expect(mockFn).toBeCalledTimes(values.length);
  });

  it("simpleTimer", async () => {
    jest.useFakeTimers();
    async function simpleTimer(callback) {
      await callback();
      setTimeout(() => {
        simpleTimer(callback);
      }, 1000);
    }

    const callback = jest.fn();
    await simpleTimer(callback);
    for (let i = 0; i < 8; i++) {
      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run
    }
    expect(callback).toHaveBeenCalledTimes(9); // SUCCESS
  });
});
