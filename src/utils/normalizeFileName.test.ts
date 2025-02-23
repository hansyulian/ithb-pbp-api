import { normalizeFileName } from "~/utils/normalizeFileName";

describe("normalizeFileName", () => {
  it("should normalize the filename by removing special characters and replacing spaces with underscores", () => {
    const result = normalizeFileName("Hello! World_2024 @test#File");
    expect(result).toEqual("hello_world_2024_testfile");
  });

  it("should handle filenames with spaces", () => {
    const result = normalizeFileName("My File Name");
    expect(result).toEqual("my_file_name");
  });

  it("should remove all special characters except dot, dash, and underscore", () => {
    const result = normalizeFileName("My#File@Name$With%Special^Chars");
    expect(result).toEqual("myfilenamewithspecialchars");
  });

  it("should convert the filename to lowercase", () => {
    const result = normalizeFileName("MyFileName");
    expect(result).toEqual("myfilename");
  });

  it("should handle empty strings", () => {
    const result = normalizeFileName("");
    expect(result).toEqual("");
  });

  it("should handle strings that already conform to the expected format", () => {
    const result = normalizeFileName("valid_filename-2024");
    expect(result).toEqual("valid_filename-2024");
  });

  it("should handle filenames with only spaces", () => {
    const result = normalizeFileName("     ");
    expect(result).toEqual("_");
  });
});
