import { indexMap } from "./indexMap";

describe("indexMap", () => {
  it("should map objects by the default id key", () => {
    const data = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
      { id: "3", name: "Charlie" },
    ];

    const result = indexMap(data);

    expect(result).toEqual({
      "1": { id: "1", name: "Alice" },
      "2": { id: "2", name: "Bob" },
      "3": { id: "3", name: "Charlie" },
    });
  });

  it("should map objects using a custom key extractor", () => {
    const data = [
      { id: "1", name: "Alice", customKey: "key1" },
      { id: "2", name: "Bob", customKey: "key2" },
      { id: "3", name: "Charlie", customKey: "key3" },
    ];

    const result = indexMap(data, (value) => value.customKey);

    expect(result).toEqual({
      key1: { id: "1", name: "Alice", customKey: "key1" },
      key2: { id: "2", name: "Bob", customKey: "key2" },
      key3: { id: "3", name: "Charlie", customKey: "key3" },
    });
  });

  it("should handle an empty array", () => {
    const data: any[] = [];

    const result = indexMap(data);

    expect(result).toEqual({});
  });

  it("should override values with the same key", () => {
    const data = [
      { id: "1", name: "Alice" },
      { id: "1", name: "Bob" }, // Duplicate key
    ];

    const result = indexMap(data);

    expect(result).toEqual({
      "1": { id: "1", name: "Bob" }, // Last value wins
    });
  });

  it("should work with non-object values", () => {
    const data = ["apple", "banana", "cherry"];

    const result = indexMap(data, (value) => value[0]);

    expect(result).toEqual({
      a: "apple",
      b: "banana",
      c: "cherry",
    });
  });
});
