import { cleanUndefined } from "~/utils/cleanUndefined";

describe("utils: cleanUndefined", () => {
  it("should return an empty object when input is empty", () => {
    const input = {};
    const result = cleanUndefined(input);
    expect(result).toEqual({});
  });

  it("should remove keys with undefined values", () => {
    const input = {
      a: 1,
      b: undefined,
      c: "string",
      d: null,
    };
    const result = cleanUndefined(input);
    expect(result).toEqual({
      a: 1,
      c: "string",
      d: null, // Null is not removed
    });
  });

  it("should return the same object if no undefined values are present", () => {
    const input = {
      a: 1,
      b: "value",
      c: true,
    };
    const result = cleanUndefined(input);
    expect(result).toEqual(input);
  });

  it("should handle nested objects while removing inner undefined values", () => {
    const input = {
      a: 1,
      b: undefined,
      c: {
        d: undefined,
        e: "nested value",
      },
    };
    const result = cleanUndefined(input);
    expect(result).toStrictEqual({
      a: 1,
      c: {
        e: "nested value", // Inner undefined is retained
      },
    });
  });

  it("should handle arrays and not remove undefined values inside them", () => {
    const input = {
      a: [1, undefined, 3],
      b: undefined,
      c: "value",
    };
    const result = cleanUndefined(input);
    expect(result).toEqual({
      a: [1, undefined, 3], // Undefined in array is retained
      c: "value",
    });
  });

  it("should handle special cases like null, 0, false correctly", () => {
    const input = {
      a: null,
      b: 0,
      c: false,
      d: undefined,
    };
    const result = cleanUndefined(input);
    expect(result).toEqual({
      a: null,
      b: 0,
      c: false, // Falsy values are not removed
    });
  });

  it("should not reprocess Date type", () => {
    const input = {
      a: new Date(),
    };
    const result = cleanUndefined(input);
    expect(input).toStrictEqual(result);
  });
  it("should not reprocess Date type in array", () => {
    const input = {
      a: [new Date()],
    };
    const result = cleanUndefined(input);
    expect(input).toStrictEqual(result);
  });
});
