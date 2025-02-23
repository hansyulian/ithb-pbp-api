// Import dependencies
import dayjs from "dayjs";
import { formatDate } from "~/utils/formatDate";

describe("formatDate", () => {
  it("should format the date correctly", () => {
    // Arrange
    const inputDate = new Date("2023-12-19T00:00:00Z");
    const expectedOutput = dayjs(inputDate).format("DD/MMM YYYY"); // "19/Dec 2023"

    // Act
    const formattedDate = formatDate(inputDate);

    // Assert
    expect(formattedDate).toBe(expectedOutput);
  });

  it("should handle invalid dates gracefully", () => {
    // Arrange
    const inputDate = new Date("invalid-date");

    // Act & Assert
    expect(formatDate(inputDate)).toEqual("Invalid Date");
  });

  it("should handle edge cases like Unix epoch", () => {
    // Arrange
    const inputDate = new Date(0); // Unix epoch time
    const expectedOutput = dayjs(inputDate).format("DD/MMM YYYY"); // "01/Jan 1970"

    // Act
    const formattedDate = formatDate(inputDate);

    // Assert
    expect(formattedDate).toBe(expectedOutput);
  });
});
