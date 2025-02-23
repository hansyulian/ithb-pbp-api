import { sortValidationExceptionDetails } from "~/utils/sortValidationExceptionDetails";
import { BlueprintValidationExceptionDetail } from "~/exceptions/BlueprintValidationExceptions";

describe("utils: sortValidationExceptionDetails", () => {
  it("should sort the details by the `key` property in ascending order", () => {
    const unsortedDetails: BlueprintValidationExceptionDetail[] = [
      { type: "required", key: "zField" },
      {
        type: "invalidType",
        key: "aField",
        value: "value",
        expected: "string",
        actual: "number",
      },
      { type: "invalidValue", key: "mField", value: 42 },
      { type: "required", key: "cField" },
    ];

    const expectedSortedDetails: BlueprintValidationExceptionDetail[] = [
      {
        type: "invalidType",
        key: "aField",
        value: "value",
        expected: "string",
        actual: "number",
      },
      { type: "required", key: "cField" },
      { type: "invalidValue", key: "mField", value: 42 },
      { type: "required", key: "zField" },
    ];

    const sortedDetails = sortValidationExceptionDetails(unsortedDetails);
    expect(sortedDetails).toEqual(expectedSortedDetails);
  });

  it("should handle an empty array without errors", () => {
    const emptyDetails: BlueprintValidationExceptionDetail[] = [];
    const sortedDetails = sortValidationExceptionDetails(emptyDetails);
    expect(sortedDetails).toEqual([]);
  });

  it("should handle an already sorted array", () => {
    const sortedDetails: BlueprintValidationExceptionDetail[] = [
      { type: "required", key: "aField" },
      { type: "required", key: "bField" },
      { type: "required", key: "cField" },
    ];

    const result = sortValidationExceptionDetails(sortedDetails);
    expect(result).toEqual(sortedDetails);
  });

  it("should correctly handle details with identical keys", () => {
    const duplicateKeysDetails: BlueprintValidationExceptionDetail[] = [
      { type: "invalidValue", key: "fieldA", value: "value1" },
      { type: "required", key: "fieldA" },
    ];

    const sortedDetails = sortValidationExceptionDetails(duplicateKeysDetails);
    expect(sortedDetails).toEqual(duplicateKeysDetails); // Order should remain stable
  });

  it("should not mutate the original array", () => {
    const originalDetails: BlueprintValidationExceptionDetail[] = [
      { type: "required", key: "zField" },
      { type: "invalidValue", key: "aField", value: 42 },
    ];

    const originalCopy = [...originalDetails];
    sortValidationExceptionDetails(originalDetails);

    expect(originalDetails).toEqual(originalCopy); // Original array should remain unchanged
  });
});
