import { searchQueryOptions } from "~/config/constants";
import { options, optional } from "~/lib/blueprint";
import { serializeApiBlueprint } from "~/lib/extractApiSummary";

describe("lib: extractApiSummary", () => {
  describe("serializeApiBlueprint", () => {
    it("should create correct extraction 1", () => {
      const expectedResult = {
        body: {},
        method: "get",
        params: {},
        path: "/task",
        query: {
          description: "string",
          name: "string",
          userId: "string",
          limit: "number",
          skip: "number",
          orderDirection: ["asc", "desc"],
          orderBy: "string",
        },
        response: {
          info: {
            count: "number",
          },
          records: [
            {
              attachments: [
                {
                  name: "string",
                  id: "string",
                },
              ],
              createdAt: "date",
              description: "string | null",
              dueDate: "date | null",
              id: "string",
              name: "string",
              updatedAt: "date",
              userId: "string",
            },
          ],
        },
      };
      expect(
        serializeApiBlueprint({
          path: "task",
          method: "get",
          params: {},
          query: {
            name: String,
            description: String,
            userId: String,
            ...searchQueryOptions,
          },
          responseType: "paginatedArray",
          body: {},
          model: {
            id: String,
            name: String,
            description: optional(String),
            dueDate: optional(Date),
            userId: String,
            attachments: [
              {
                name: String,
                id: String,
              },
            ],
            createdAt: Date,
            updatedAt: Date,
          },
        })
      ).toEqual(expectedResult);
    });
    it("should create correct extraction 2", () => {
      const expectedResult = {
        body: {},
        method: "get",
        params: {
          id: "string",
        },
        path: "/job-type",
        query: {},
        response: {
          createdAt: "date",
          defaultRemotePayRate: "number",
          description: "string | null",
          id: "string",
          name: "string",
          tags: ["string"],
          updatedAt: "date",
        },
      };
      expect(
        serializeApiBlueprint({
          method: "get",
          path: "job-type",
          params: {
            id: String,
          },
          query: {},
          responseType: "object",
          body: {},
          model: {
            id: String,
            name: String,
            description: optional(String),
            tags: [String],
            defaultRemotePayRate: Number,
            createdAt: Date,
            updatedAt: Date,
          },
        })
      ).toEqual(expectedResult);
    });
  });
});
