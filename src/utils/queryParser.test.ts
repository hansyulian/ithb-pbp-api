import { queryParser } from "~/utils/queryParser";

describe("utils: queryParser", () => {
  describe("stringLike", () => {
    it("should return undefined when the value is undefined", () => {
      const result = queryParser.stringLike(undefined);
      expect(result).toBeUndefined();
    });

    it("should return a case-insensitive regex object for a string value", () => {
      const value = "test";
      const result = queryParser.stringLike(value);
      expect(result).toEqual({ $regex: value, $options: "i" });
    });

    it("should return a case-insensitive regex object for a numeric value", () => {
      const value = 12345;
      const result = queryParser.stringLike(value);
      expect(result).toEqual({ $regex: value, $options: "i" });
    });

    it("should handle empty strings correctly", () => {
      const value = "";
      const result = queryParser.stringLike(value);
      expect(result).toEqual({ $regex: value, $options: "i" });
    });

    it("should handle special characters in the value", () => {
      const value = ".*?[](){}";
      const result = queryParser.stringLike(value);
      expect(result).toEqual({ $regex: value, $options: "i" });
    });
  });
});
