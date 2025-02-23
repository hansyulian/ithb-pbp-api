import { calculateRangeIntersection } from "./calculateRangeIntersection";

describe("Utils: calculateRangeIntersection", () => {
  test("should return the correct intersection when ranges overlap", () => {
    const a = { start: 1, end: 10 };
    const b = { start: 5, end: 15 };

    const result = calculateRangeIntersection(a, b);

    // Expected intersection is from 5 to 10, which is 5 units
    const expectedResult = 10 - 5;

    expect(result).toBe(expectedResult);
  });

  test("should return 0 when ranges do not overlap", () => {
    const a = { start: 1, end: 5 };
    const b = { start: 6, end: 10 };

    const result = calculateRangeIntersection(a, b);

    // No overlap, so result should be 0
    expect(result).toBe(0);
  });

  test("should return the correct intersection when one range is fully inside another", () => {
    const a = { start: 1, end: 10 };
    const b = { start: 3, end: 7 };

    const result = calculateRangeIntersection(a, b);

    // Intersection is from 3 to 7, which is 4 units
    const expectedResult = 7 - 3;

    expect(result).toBe(expectedResult);
  });

  test("should return the correct intersection when ranges are exactly the same", () => {
    const a = { start: 1, end: 10 };
    const b = { start: 1, end: 10 };

    const result = calculateRangeIntersection(a, b);

    // Intersection is the whole range, which is 10 units
    const expectedResult = 10 - 1;

    expect(result).toBe(expectedResult);
  });

  test("should return 0 if one range ends before the other starts", () => {
    const a = { start: 1, end: 5 };
    const b = { start: 6, end: 10 };

    const result = calculateRangeIntersection(a, b);

    // No overlap, so result should be 0
    expect(result).toBe(0);
  });

  test("should handle negative numbers correctly", () => {
    const a = { start: -10, end: -5 };
    const b = { start: -7, end: -3 };

    const result = calculateRangeIntersection(a, b);

    // Intersection is from -7 to -5, which is 2 units
    const expectedResult = -5 - -7;

    expect(result).toBe(expectedResult);
  });

  test("should handle cases where start and end are the same", () => {
    const a = { start: 5, end: 5 };
    const b = { start: 5, end: 5 };

    const result = calculateRangeIntersection(a, b);

    // The ranges only intersect at point 5, so the intersection is 0
    const expectedResult = 0;

    expect(result).toBe(expectedResult);
  });
});
