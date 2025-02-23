import { initialValueIndex } from "./initialValueIndex";

describe("initialValueIndex", () => {
  it("should create an object with initial values", () => {
    const keys = ["key1", "key2", "key3"] as const;
    const initialValue = (key: (typeof keys)[number]) => `initialValue-${key}`;
    const result = initialValueIndex(keys, initialValue);

    expect(result).toEqual({
      key1: "initialValue-key1",
      key2: "initialValue-key2",
      key3: "initialValue-key3",
    });
  });

  it("should throw an error if initial value function is not provided", () => {
    const keys = ["key1", "key2", "key3"] as const;

    expect(() => initialValueIndex(keys, undefined as any)).toThrow(TypeError);
  });
});
