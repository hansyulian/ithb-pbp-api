import { SerializeTableFieldSpec, serializeTable } from "./serializeTable";

describe("serializeTable", () => {
  type TestData = {
    id: number;
    name: string;
    age: number;
    isActive: boolean;
  };

  const sampleData: TestData[] = [
    { id: 1, name: "Alice", age: 30, isActive: true },
    { id: 2, name: "Bob", age: 25, isActive: false },
    { id: 3, name: "Charlie", age: 35, isActive: true },
  ];

  const fields: SerializeTableFieldSpec<TestData>[] = [
    { label: "ID", getValue: (record) => record.id },
    { label: "Name", getValue: (record) => record.name },
    { label: "Age", getValue: (record) => record.age },
    { label: "Active", getValue: (record) => (record.isActive ? "Yes" : "No") },
  ];

  it("should serialize data into rows based on field specifications", () => {
    const result = serializeTable(sampleData, fields);

    expect(result).toEqual([
      [1, "Alice", 30, "Yes"],
      [2, "Bob", 25, "No"],
      [3, "Charlie", 35, "Yes"],
    ]);
  });

  it("should handle empty data array", () => {
    const result = serializeTable([], fields);

    expect(result).toEqual([]);
  });

  it("should handle empty field specifications", () => {
    const result = serializeTable(sampleData, []);

    expect(result).toEqual([[], [], []]);
  });

  it("should allow dynamic field computations", () => {
    const dynamicFields: SerializeTableFieldSpec<TestData>[] = [
      {
        label: "Name and Age",
        getValue: (record) => `${record.name} (${record.age})`,
      },
    ];

    const result = serializeTable(sampleData, dynamicFields);

    expect(result).toEqual([["Alice (30)"], ["Bob (25)"], ["Charlie (35)"]]);
  });

  it("should throw an error if getValue is not a function", () => {
    const invalidFields: any[] = [
      { label: "Invalid Field", getValue: "not-a-function" },
    ];

    expect(() => serializeTable(sampleData, invalidFields)).toThrow(TypeError);
  });
});
