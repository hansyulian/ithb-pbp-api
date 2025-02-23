import dayjs from "dayjs";
import { formatTime } from "./formatTime";

describe("formatTime", () => {
  it("should format a valid date object to HH:mm format", () => {
    const date = new Date("2024-12-30T14:45:00");
    const result = formatTime(date);

    expect(result).toBe("14:45");
  });

  it("should handle midnight correctly", () => {
    const date = new Date("2024-12-30T00:00:00");
    const result = formatTime(date);

    expect(result).toBe("00:00");
  });

  it("should handle single-digit hours and minutes correctly", () => {
    const date = new Date("2024-12-30T05:09:00");
    const result = formatTime(date);

    expect(result).toBe("05:09");
  });

  it("should work with dayjs mocked to a fixed time", () => {
    const mockDate = new Date("2024-12-30T23:15:00");
    jest.spyOn(dayjs.prototype, "format").mockReturnValue("23:15");

    const result = formatTime(mockDate);

    expect(result).toBe("23:15");

    jest.restoreAllMocks();
  });
});
