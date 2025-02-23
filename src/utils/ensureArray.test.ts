import { ensureArray } from "~/utils/ensureArray";

describe("ensureArray", () => {
  it("should return an array if data is already an array", () => {
    const input = [1, 2, 3];
    const result = ensureArray(input);
    expect(result).toEqual([1, 2, 3]);
    expect(Array.isArray(result)).toBe(true); // Ensure result is still an array
  });

  it("should wrap a single value in an array if data is not an array", () => {
    const input = 1;
    const result = ensureArray(input);
    expect(result).toEqual([1]);
    expect(Array.isArray(result)).toBe(true); // Ensure result is an array
  });

  it("should handle empty arrays correctly", () => {
    const input: number[] = [];
    const result = ensureArray(input);
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true); // Ensure result is still an array
  });

  it("should handle empty values and return them in an array", () => {
    const input = undefined;
    const result = ensureArray(input);
    expect(result).toEqual([undefined]);

    const inputNull = null;
    const resultNull = ensureArray(inputNull);
    expect(resultNull).toEqual([null]);

    const inputEmptyStr = "";
    const resultEmptyStr = ensureArray(inputEmptyStr);
    expect(resultEmptyStr).toEqual([""]);
  });
});
