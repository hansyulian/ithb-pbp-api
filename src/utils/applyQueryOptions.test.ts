import { applyQueryOptions } from "~/utils/applyQueryOptions";

describe("utils: applyQueryOptions", () => {
  it("should apply sorting, skipping, and limiting when all options are provided", () => {
    const queryOptions: QueryOptions = {
      orderBy: "name",
      orderDirection: "asc",
      limit: 10,
      skip: 5,
    };

    const result = applyQueryOptions(queryOptions);

    expect(result.order).toEqual([["name", "ASC"]]);
    expect(result.offset).toBe(5);
    expect(result.limit).toBe(10);
  });

  it("should apply sorting with descending order when orderDirection is 'desc'", () => {
    const queryOptions: QueryOptions = {
      orderBy: "createdAt",
      orderDirection: "desc",
      limit: 20,
      skip: 0,
    };

    const result = applyQueryOptions(queryOptions);

    expect(result.order).toEqual([["createdAt", "DESC"]]);
    expect(result.offset).toBe(0);
    expect(result.limit).toBe(20);
  });

  it("should skip sorting when orderBy is not provided", () => {
    const queryOptions: QueryOptions = {
      limit: 15,
      skip: 3,
    };

    const result = applyQueryOptions(queryOptions);

    expect(result.order).toBeUndefined();
    expect(result.offset).toBe(3);
    expect(result.limit).toBe(15);
  });

  it("should use default skip (0) when skip is not provided", () => {
    const queryOptions: QueryOptions = {
      orderBy: "updatedAt",
      orderDirection: "asc",
      limit: 10,
    };

    const result = applyQueryOptions(queryOptions);

    expect(result.order).toEqual([["updatedAt", "ASC"]]);
    expect(result.offset).toBe(0);
    expect(result.limit).toBe(10);
  });

  it("should not apply limit when limit is not provided", () => {
    const queryOptions: QueryOptions = {
      orderBy: "role",
      orderDirection: "desc",
      skip: 2,
    };

    const result = applyQueryOptions(queryOptions);

    expect(result.order).toEqual([["role", "DESC"]]);
    expect(result.offset).toBe(2);
    expect(result.limit).toBeUndefined();
  });

  it("should handle an empty queryOptions object", () => {
    const queryOptions: QueryOptions = {};

    const result = applyQueryOptions(queryOptions);

    expect(result.order).toBeUndefined();
    expect(result.offset).toBe(0); // Default skip
    expect(result.limit).toBeUndefined();
  });
});
