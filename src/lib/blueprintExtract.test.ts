import { optional, options } from "~/lib/blueprint";
import { blueprintExtract } from "~/lib/blueprintExtract";

describe("blueprintExtract", () => {
  it("should correctly map simple types based on blueprint", () => {
    const sampleBlueprint = {
      a: String,
      b: Number,
    };

    const data = {
      a: 123,
      b: "123",
      shouldBeGone: true, // This should be ignored
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      a: "123", // stringified version of number 123
      b: 123, // number 123
    });
  });
  it("should correctly map enum types based on blueprint", () => {
    const sampleBlueprint = {
      a: options(["active", "passive"] as const),
    };

    const data = {
      a: "active",
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      a: "active",
    });
  });
  it("should correctly map date types based on blueprint", () => {
    const sampleBlueprint = {
      a: Date,
    };

    const data = {
      a: 12312323,
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result.a.constructor).toEqual(Date);
  });

  it("should handle optional fields", () => {
    const sampleBlueprint = {
      a: String,
      b: optional(Number),
    };

    const data = {
      a: "test",
      // b is missing, so it should not appear in the result
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      a: "test",
    });
  });

  it("should handle arrays with single typing", () => {
    const sampleBlueprint = {
      arr: [Number],
    };

    const data = {
      arr: ["1", "2", "3"],
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      arr: [1, 2, 3], // Array values converted to numbers
    });
  });

  it("should handle nested objects", () => {
    const sampleBlueprint = {
      a: String,
      nested: {
        x: Number,
        y: optional(String),
      },
    };

    const data = {
      a: "hello",
      nested: {
        x: "123",
        // y is missing, should not appear in the result
      },
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      a: "hello",
      nested: {
        x: 123, // number parsed from string
      },
    });
  });

  it("should return undefined for invalid number parsing", () => {
    const sampleBlueprint = {
      a: Number,
    };

    const data = {
      a: "invalid", // cannot be parsed to a number
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      a: undefined, // should return undefined due to invalid parsing
    });
  });
  it("should return undefined for invalid date parsing", () => {
    const sampleBlueprint = {
      a: Date,
    };

    const data = {
      a: "invalid", // cannot be parsed to a number
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      a: undefined, // should return undefined due to invalid parsing
    });
  });

  it("should return original values for Object type", () => {
    const sampleBlueprint = {
      obj: Object,
    };

    const data = {
      obj: { key: "value" },
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      obj: { key: "value" }, // object remains unchanged
    });
  });
  it("should handle array of object", () => {
    const sampleBlueprint = {
      obj: [
        {
          a: Number,
          b: String,
        },
      ],
    };

    const data = {
      obj: [
        { a: "123", b: 123, key: "value" },
        {
          a: 234,
          b: "234",
        },
      ],
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      obj: [
        {
          a: 123,
          b: "123",
        },
        {
          a: 234,
          b: "234",
        },
      ],
    });
  });

  it("should handle missing properties", () => {
    const sampleBlueprint = {
      a: String,
      b: Number,
      c: optional(Boolean),
    };

    const data = {
      a: "hello",
      b: 42,
      // c is missing, so it should be undefined
    };

    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      a: "hello",
      b: 42,
      c: undefined, // optional field missing
    });
  });

  it("should not fail the checking for nested under undefined", () => {
    const sampleBlueprint = {
      obj: {
        a: String,
        b: Number,
      },
    };
    const data = {};
    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({});
  });
  it("should extract array of enum correctly", () => {
    const sampleBlueprint = {
      a: [options(["enum1", "enum2", "enum3"] as const)],
    };
    const data = {
      a: ["enum2", "enum3"],
    };
    const result = blueprintExtract(sampleBlueprint, data);
    expect(result).toEqual({
      a: ["enum2", "enum3"],
    });
  });

  it("should turn to array if the value isn't array but blueprint is array with looseArray", () => {
    const sampleBlueprint = {
      a: [String],
    };
    const data = {
      a: "none",
    };
    const result = blueprintExtract(sampleBlueprint, data, {
      looseArray: true,
    });
    expect(result).toEqual({ a: ["none"] });
  });
  it("should return empty object if data is empty", () => {
    const sampleBlueprint = {
      a: [String],
    };
    const data = undefined;
    const result = blueprintExtract(sampleBlueprint, data as any);
    expect(result).toEqual({});
  });
});
