import { nullable, optional, options } from "~/lib/blueprint";
import { blueprintValidate } from "~/lib/blueprintValidate";

describe("lib: blueprintValidate", () => {
  it("should validate required fields and types in strict mode", () => {
    const sampleBlueprint = {
      a: String,
      b: Number,
      c: optional(Boolean),
      d: options(["active", "draft"] as const),
    };

    const data = {
      a: "hello",
      b: 123,
      // c is missing, should be allowed because it is optional
      d: "active",
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([]);
  });

  it("should detect missing required fields", () => {
    const sampleBlueprint = {
      a: String,
      b: Number,
      c: optional(Boolean),
    };

    const data = {
      a: "hello",
      // b is missing, should report as missing
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([{ type: "required", key: "b" }]);
  });
  it("should skip missing required fields when using skipRequired", () => {
    const sampleBlueprint = {
      a: String,
      b: Number,
      c: optional(Boolean),
    };

    const data = {
      a: "hello",
      // b is missing, should report as missing
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
      skipRequired: true,
    });
    expect(result.errors).toEqual([]);
  });

  it("should handle loose validation for string values", () => {
    const sampleBlueprint = {
      a: String,
      b: Number,
      c: Date,
    };

    const data = {
      a: 123, // Loose mode should allow number to be converted to string
      b: "456", // Loose mode should allow string to be converted to number
      c: new Date().toString(),
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "loose",
    });
    expect(result.errors).toEqual([]);
  });

  it("should handle invalid enum values", () => {
    const sampleBlueprint = {
      status: options(["active", "inactive"] as const),
    };

    const data = {
      status: "unknown",
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([
      {
        type: "invalidValue",
        key: "status",
        value: "unknown",
        expected: ["active", "inactive"],
      },
    ]);
  });

  it("should handle nested objects with errors", () => {
    const sampleBlueprint = {
      user: {
        name: String,
        age: Number,
        address: {
          city: String,
          zip: Number,
        },
      },
    };

    const data = {
      user: {
        name: "Alice",
        age: "not a number", // Should be a number
        address: {
          city: "Wonderland",
          zip: "12345", // Should be a number
        },
      },
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([
      {
        type: "invalidType",
        key: "user.address.zip",
        actual: "string",
        expected: "number",
        value: "12345",
      },
      {
        type: "invalidType",
        key: "user.age",
        actual: "string",
        expected: "number",
        value: "not a number",
      },
    ]);
  });

  it("should handle arrays in strict mode", () => {
    const sampleBlueprint = {
      items: [Number],
    };

    const data = {
      items: [1, "2", true], // Invalid types for strict mode
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([
      {
        type: "invalidType",
        key: "items.1",
        actual: "string",
        expected: "number",
        value: "2",
      },
      {
        type: "invalidType",
        key: "items.2",
        actual: "boolean",
        expected: "number",
        value: true,
      },
    ]);
  });

  it("should handle arrays in loose mode", () => {
    const sampleBlueprint = {
      items: [Number],
    };

    const data = {
      items: [1, "2", true], // Should be valid in loose mode
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "loose",
    });
    expect(result.errors).toEqual([]);
  });

  it("should handle optional fields correctly", () => {
    const sampleBlueprint = {
      a: String,
      b: optional(Number),
    };

    const data = {
      a: "hello",
      // b is missing, should not produce an error
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([]);
  });

  it("should validate dates in strict mode", () => {
    const sampleBlueprint = {
      createdAt: Date,
    };

    const data = {
      createdAt: "not a date",
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([
      {
        type: "invalidType",
        key: "createdAt",
        actual: "string",
        expected: "date",
        value: "not a date",
      },
    ]);
  });

  it("should validate dates in loose mode", () => {
    const sampleBlueprint = {
      createdAt: Date,
    };

    const data = {
      createdAt: "2024-01-01", // Valid ISO date in loose mode
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "loose",
    });
    expect(result.errors).toEqual([]);
  });

  it("should throw invalid type if enum is filled with something else for loose validation", () => {
    const enumValues = ["a", "b", "c"];
    const sampleBlueprint = {
      enumValue: options(enumValues),
    };
    const data = {
      enumValue: {},
    };
    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "loose",
    });
    expect(result.errors).toEqual([
      {
        actual: "object",
        expected: enumValues,
        key: "enumValue",
        type: "invalidType",
        value: {},
      },
    ]);
  });
  it("should throw invalid type if enum is filled with something else for strict validation", () => {
    const enumValues = ["a", "b", "c"];
    const sampleBlueprint = {
      enumValue: options(enumValues),
    };
    const data = {
      enumValue: {},
    };
    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([
      {
        actual: "object",
        expected: enumValues,
        key: "enumValue",
        type: "invalidType",
        value: {},
      },
    ]);
  });
  it("should throw invalid type if passed null to optional and passed undefined to nullable", () => {
    const sampleBlueprint = {
      a: optional(String),
      b: nullable(String),
    };
    const data = {
      a: null,
      b: undefined,
    };

    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([
      {
        type: "required",
        key: "a",
      },
      {
        type: "required",
        key: "b",
      },
    ]);
  });
  it("should not fail the checking for nested under undefined", () => {
    const sampleBlueprint = {
      obj: {
        a: String,
        b: Number,
      },
    };
    const data = {};
    const result = blueprintValidate(sampleBlueprint, data, "", {
      mode: "strict",
    });
    expect(result.errors).toEqual([
      {
        type: "required",
        key: "obj",
      },
    ]);
  });

  it("should not fail enum nesting optional validation", () => {
    const sampleBlueprint = {
      obj: optional({
        a: options(["value1", "value2"] as const),
        b: String,
      }),
    };
    const data = {
      obj: {
        a: "value1",
        b: "4422",
      },
    };
    const result = blueprintValidate(sampleBlueprint, data, "");
    expect(result.errors).toEqual([]);
  });
  it("should fail if using non date value for date type in loose validation", () => {
    const sampleBlueprint = {
      a: Date,
      b: Date,
      c: Date,
      d: Date,
      e: Date,
    };
    const data = {
      a: true,
      b: false,
      c: {},
      d: [],
      e: "invalid",
    };
    const result = blueprintValidate(sampleBlueprint, data, "");
    expect(result.errors).toEqual([
      {
        actual: "boolean",
        expected: "date",
        key: "a",
        type: "invalidType",
        value: true,
      },
      {
        actual: "boolean",
        expected: "date",
        key: "b",
        type: "invalidType",
        value: false,
      },
      {
        actual: "object",
        expected: "date",
        key: "c",
        type: "invalidType",
        value: {},
      },
      {
        actual: "object",
        expected: "date",
        key: "d",
        type: "invalidType",
        value: [],
      },
      {
        actual: "string",
        expected: "date",
        key: "e",
        type: "invalidType",
        value: "invalid",
      },
    ]);
  });

  it("should fail if asking for array and given string", () => {
    const sampleBlueprint = {
      a: [String],
    };
    const data = {
      a: "none",
    };
    const result = blueprintValidate(sampleBlueprint, data, "");
    expect(result.errors).toEqual([
      {
        actual: "string",
        expected: "array",
        key: "a",
        type: "invalidType",
        value: "none",
      },
    ]);
  });

  it("should not fail if asking for array and given string with loose array option", () => {
    const sampleBlueprint = {
      a: [String],
    };
    const data = {
      a: "none",
    };
    const result = blueprintValidate(sampleBlueprint, data, "", {
      looseArray: true,
    });
    expect(result.errors).toEqual([]);
  });
});
