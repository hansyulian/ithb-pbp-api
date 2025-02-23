import { appConfig } from "~/config";
import { serializeQueryOptions } from "~/utils/serializeQueryOptions";

jest.mock("~/config");

describe("serializeQueryOptions", () => {
  beforeEach(() => {
    appConfig.api.maximumRetrieve = 100; // Mock the appConfig value
  });

  it("should return the original query options when limit is within the maximum retrieve", () => {
    const query: QueryOptions = {
      limit: 50,
      skip: 0,
      orderBy: "name",
      orderDirection: "asc",
    };

    const result = serializeQueryOptions(query);

    expect(result).toEqual(query); // Ensure the result is the same as input
  });

  it("should adjust limit to the maximum retrieve when it exceeds the maximum", () => {
    const query: QueryOptions = {
      limit: 150,
      skip: 0,
      orderBy: "name",
      orderDirection: "asc",
    };

    const result = serializeQueryOptions(query);

    expect(result.limit).toBe(appConfig.api.maximumRetrieve); // Should cap the limit at 100
    expect(result.skip).toBe(query.skip);
    expect(result.orderBy).toBe(query.orderBy);
    expect(result.orderDirection).toBe(query.orderDirection);
  });

  it("should return default values when no limit, skip, orderBy, or orderDirection are provided", () => {
    const query: QueryOptions = {};

    const result = serializeQueryOptions(query);

    expect(result).toEqual({
      limit: 100,
      skip: undefined,
      orderBy: undefined,
      orderDirection: undefined,
    });
  });

  it("should return query with the capped limit when limit is greater than maximum retrieve", () => {
    const query: QueryOptions = {
      limit: 200,
      skip: 10,
      orderBy: "createdAt",
      orderDirection: "desc",
    };

    const result = serializeQueryOptions(query);

    expect(result.limit).toBe(appConfig.api.maximumRetrieve);
    expect(result.skip).toBe(10);
    expect(result.orderBy).toBe("createdAt");
    expect(result.orderDirection).toBe("desc");
  });
});
