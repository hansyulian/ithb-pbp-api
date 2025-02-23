import { urlJoin } from "~/utils/urlJoin";

describe("utils: urlJoin", () => {
  it("should join multiple URL segments with a single slash", () => {
    const result = urlJoin("https://example.com", "path", "to", "resource");
    expect(result).toBe("https://example.com/path/to/resource");
  });

  it("should not duplicate slashes when joining paths", () => {
    const result = urlJoin(
      "https://example.com/",
      "/path/",
      "/to/",
      "resource"
    );
    expect(result).toBe("https://example.com/path/to/resource");
  });

  it("should handle protocol with no change", () => {
    const result = urlJoin("smtp://mailserver.com", "/path", "/to", "resource");
    expect(result).toBe("smtp://mailserver.com/path/to/resource");
  });

  it("should join paths with missing slashes in between", () => {
    const result = urlJoin("https://example.com", "path", "to", "resource");
    expect(result).toBe("https://example.com/path/to/resource");
  });

  it("should preserve protocols like http:// and https://", () => {
    const result = urlJoin("http://example.com", "path", "to", "resource");
    expect(result).toBe("http://example.com/path/to/resource");
  });

  it("should correctly handle URLs with no slashes", () => {
    const result = urlJoin("https://example.com", "path/to/resource");
    expect(result).toBe("https://example.com/path/to/resource");
  });

  it("should handle an empty input gracefully", () => {
    const result = urlJoin();
    expect(result).toBe("");
  });

  it("should return the correct output for an already well-formed URL", () => {
    const result = urlJoin("https://example.com/");
    expect(result).toBe("https://example.com/");
  });

  it("should not modify single path URLs", () => {
    const result = urlJoin("http://example.com");
    expect(result).toBe("http://example.com");
  });
});
